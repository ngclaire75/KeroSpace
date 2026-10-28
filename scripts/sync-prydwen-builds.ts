// Daily refresh of the Honkai: Star Rail, Wuthering Waves and Neverness to Everness builds.
//
// Run: npx jiti scripts/sync-prydwen-builds.ts https://kerospace.vercel.app
//
// Prydwen keeps these builds current, but prydwen.gg answers servers with a bot check, so the
// site itself can't read it. This opens each character page in a real browser, parses it with
// the same parser the site uses, and saves the result to data/guideBuildSnapshots.json, which the
// build API serves for these games. A page that parses badly (missing a section, shrinking
// sharply, junk names) keeps its previous saved build. Runs daily from
// .github/workflows/refresh-prydwen-builds.yml.
import { readFileSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright'
import { normalizedName, parsePrydwenBuild } from '../server/utils/buildParsers'
import { parsePrydwenTeams } from '../server/utils/teamParsers'
import { liveProblem } from '../server/utils/buildQuality'
import type { CharacterBuildResponse } from '../data/characterBuilds'

const BASE = (process.argv[2] || 'https://kerospace.vercel.app').replace(/\/$/, '')
const PRYDWEN = 'https://www.prydwen.gg'
const GAMES = { hsr: 'star-rail', wuwa: 'wuthering-waves', nte: 'neverness-to-everness' } as const
const FILE = new URL('../data/guideBuildSnapshots.json', import.meta.url)
// Prydwen writes "The Shorekeeper"; the wiki roster writes "Shorekeeper".
const key = (name: string) => normalizedName(name.replace(/^the\s+/i, ''))
// The wiki's names for characters Prydwen files under another one.
const WIKI_ALIASES: Record<string, string> = { aeonaha: 'aha' }

async function catalogue(game: string) {
  const titles: string[] = []
  let cursor = ''
  for (let page = 0; page < 40; page++) {
    const query = new URLSearchParams({ game, kind: 'characters', ...(cursor ? { cursor } : {}) })
    const result = await (await fetch(`${BASE}/api/game-catalog?${query}`, { signal: AbortSignal.timeout(90000) })).json()
    if (result.status !== 'available') throw new Error(`${game}: catalogue unavailable`)
    titles.push(...result.items.map((item: { title: string }) => item.title))
    if (!result.next) break
    cursor = result.next
  }
  return [...new Set(titles)]
}

const snapshots = JSON.parse(readFileSync(FILE, 'utf8')) as Record<string, Record<string, CharacterBuildResponse>>
const browser = await chromium.launch()
const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  viewport: { width: 1400, height: 900 },
  // Prydwen prints "Last updated" in the visitor's time zone; fix it so runs anywhere agree.
  timezoneId: 'UTC',
})
const report: string[] = []
let changed = 0

for (const [game, path] of Object.entries(GAMES)) {
  const titles = await catalogue(game)
  const page = await context.newPage()
  await page.goto(`${PRYDWEN}/${path}/characters`, { waitUntil: 'domcontentloaded', timeout: 90000 })
  await page.waitForSelector(`a[href^="/${path}/characters/"]`, { timeout: 60000 })
  const links = await page.$$eval(`a[href^="/${path}/characters/"]`, anchors => anchors.map(anchor => [
    anchor.getAttribute('href') || '',
    (anchor.textContent || anchor.querySelector('img')?.getAttribute('alt') || '').split('\n')[0].trim(),
  ]))
  // The newest characters carry a badge in their link text ("PearlNew", "Aha4.7"), so each link
  // is also found by its address ("/pearl"). "March 7th • Evernight" and "Tingyun • Fugue" are
  // "Evernight" and "Fugue" on the wiki, so the part after "•" is a last resort.
  const hrefs = new Map<string, string>()
  const names = links.filter(([href]) => href.split('/').filter(Boolean).length === 3).map(([href, text]) => {
    const name = text.replace(/(?:New|\d+\.\d+)$/, '').trim()
    return { href, keys: [key(name), key(href.split('/').filter(Boolean).pop()!), ...(name.includes('•') ? [key(name.split('•').pop()!)] : [])] }
  })
  for (const rank of [0, 1, 2]) for (const { href, keys } of names) if (keys[rank] && !hrefs.has(keys[rank])) hrefs.set(keys[rank], href)
  const hrefFor = (title: string) => hrefs.get(WIKI_ALIASES[key(title)] || key(title))
  await page.close()

  const saved = snapshots[game] ||= {}
  let refreshed = 0
  const queue = titles.filter(title => hrefFor(title))
  await Promise.all(Array.from({ length: 3 }, async () => {
    const tab = await context.newPage()
    for (let title = queue.shift(); title; title = queue.shift()) {
      const url = PRYDWEN + hrefFor(title)
      try {
        await tab.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 })
        await tab.waitForSelector('.section-build, .build-tips, .nte-weapon-accordion', { timeout: 30000 }).catch(() => {})
        const html = await tab.content()
        const build = parsePrydwenBuild(game, html, PRYDWEN)
        const updated = html.replace(/<[^>]+>/g, ' ').match(/Last updated:?\s*([A-Za-z0-9/,. ]{6,30}?\d{4})/)?.[1]
        const result: CharacterBuildResponse = {
          game, title, teams: parsePrydwenTeams(html, title),
          builds: build.groups.length ? [build] : [], status: build.groups.length ? 'available' : 'missing',
          source: { name: 'Prydwen', url, updated }, checkedAt: new Date().toISOString(),
        }
        const problem = result.status === 'available' ? liveProblem(game, result, saved[title]) : 'no build on the page'
        const content = (build: CharacterBuildResponse) => JSON.stringify([build.builds, build.teams, build.source])
        if (problem) report.push(`${game} / ${title}: kept saved build (${problem})`)
        // Unchanged content keeps its saved entry, so a quiet day makes no commit or deploy.
        else if (!saved[title] || content(saved[title]) !== content(result)) { saved[title] = result; refreshed++ }
        else refreshed++
      } catch (error) {
        report.push(`${game} / ${title}: kept saved build (${error instanceof Error ? error.message.split('\n')[0] : error})`)
      }
    }
    await tab.close()
  }))
  changed += refreshed
  console.log(`${game}: ${refreshed} builds refreshed from Prydwen, ${Object.keys(saved).length} saved in total`)
}
await browser.close()

writeFileSync(FILE, JSON.stringify(snapshots) + '\n')
for (const line of report) console.log(line)
if (!changed) {
  console.error('No build could be refreshed from Prydwen; saved builds left as they were.')
  process.exitCode = 1
}
