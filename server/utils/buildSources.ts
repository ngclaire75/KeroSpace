import { parsePrydwenTeams, parseKqmTeams, parseHonkaiTeams, parseMobileLegendsTeams } from './teamParsers'
import type { CharacterBuildResponse } from '~/data/characterBuilds'
import { normalizedName, parseHonkaiEquipment, parseKqmBuild, parsePrydwenBuild, richStatLines } from './buildParsers'

// Public static data and HTML used by Prydwen's Gatsby site; no private APIs or credentials.
const PRYDWEN = 'https://www.prydwen.gg'
const PRYDWEN_CDN = 'https://d2ankz0m1a0dsp.cloudfront.net'
const headers = { 'User-Agent': 'KeroSpace/1.0 (character build reference)' }
const paths: Record<string, string> = { hsr: 'star-rail', wuwa: 'wuthering-waves', nte: 'neverness-to-everness' }
const anchors: Record<string, string> = { hsr: 'acheron', wuwa: 'jiyan', nte: 'nanally' }
type ProviderRecord = Record<string, any>

async function prydwenFetch<T>(path: string, html = false): Promise<T> {
  try { return await $fetch<T>(PRYDWEN + path, { headers, timeout: 12000, retry: 0, ...(html ? { responseType: 'text' as const } : {}) }) }
  catch { return await $fetch<T>(PRYDWEN_CDN + path, { headers, timeout: 15000, retry: 0, ...(html ? { responseType: 'text' as const } : {}) }) }
}
const prydwenRoster = defineCachedFunction(async (game: string) => {
  const page = await prydwenFetch<ProviderRecord>(`/page-data/${paths[game]}/characters/${anchors[game]}/page-data.json`)
  const queries = await Promise.allSettled((page.staticQueryHashes as string[]).map(hash => prydwenFetch<ProviderRecord>(`/page-data/sq/d/${hash}.json`)))
  const key = { hsr: 'allContentfulHsrCharacter', wuwa: 'allContentfulWwCharacter', nte: 'allContentfulNteCharacter' }[game]
  for (const result of queries) {
    if (result.status === 'fulfilled' && key && Array.isArray(result.value.data?.[key]?.nodes)) return result.value.data[key].nodes as ProviderRecord[]
  }
  throw new Error('Character build index unavailable')
}, { name: 'build-provider-roster-v1', maxAge: 3600, swr: true, getKey: game => game })

function gatsbyImage(record?: ProviderRecord): string | undefined {
  const path = record?.localFile?.childImageSharp?.gatsbyImageData?.images?.fallback?.src
  return typeof path === 'string' && path.startsWith('/static/') ? PRYDWEN_CDN + path : undefined
}
export async function prydwenBuild(game: string, title: string): Promise<CharacterBuildResponse> {
  const roster = await prydwenRoster(game)
  const aliases: Record<string, string> = { daffodill: 'daffodil', esperzero: 'zero' }
  const name = aliases[normalizedName(title)] || normalizedName(title)
  const character = roster.find(item => normalizedName(item.name) === name || normalizedName(item.slug) === name)
  const source = { name: 'Prydwen', url: `${PRYDWEN}/${paths[game]}/characters/` }
  if (!character || character.isReleased === false || character.upcoming === true || character.isUpcoming === true) return { game, title, builds: [], status: 'missing', source, checkedAt: new Date().toISOString() }
  const path = `/${paths[game]}/characters/${character.slug}`
  source.url = PRYDWEN + path
  const [page, html] = await Promise.all([
    prydwenFetch<ProviderRecord>(`/page-data${path}/page-data.json`),
    prydwenFetch<string>(path + '/', true),
  ])
  const record = page.result?.data?.currentUnit?.nodes?.[0]
  if (!record || normalizedName(record.name) !== normalizedName(character.name)) throw new Error('Character build mismatch')
  if (record.isReleased === false || record.upcoming === true || record.isUpcoming === true || (record.releaseDate && Date.parse(record.releaseDate) > Date.now())) return { game, title, builds: [], status: 'missing', source, checkedAt: new Date().toISOString() }
  const build = parsePrydwenBuild(game, html, PRYDWEN_CDN)
  const targets = richStatLines(record.endgameStats?.raw)
  build.stats.push(...targets.map(stat => ({ label: `Target ${stat.label}`, value: stat.value })))
  return {
    game, title, teams: parsePrydwenTeams(html, record.name), image: gatsbyImage(record.fullImage) || gatsbyImage(character.cardImage), builds: build.groups.length ? [build] : [],
    status: build.groups.length ? 'available' : 'missing',
    source: { ...source, updated: record.updatedAt || undefined }, checkedAt: new Date().toISOString(),
  }
}

const KQM_ALIASES: Record<string, string> = {
  aratakiitto: 'itto', sangonomiyakokomi: 'kokomi', kaedeharakazuha: 'kazuha', kamisatoayaka: 'ayaka', kamisatoayato: 'ayato',
  shikanoinheizou: 'heizou', kujousara: 'sara', raidenshogun: 'raiden', yumemizukimizuki: 'mizuki',
}
// KeqingMains' weapon images are tightly cropped icons that cut the weapon off at the edge.
// The Genshin wiki keeps the complete icon as "File:Weapon <Name>.png", so prefer that.
// The artifact tables also carry their own header and stat rows ("On-Field", "Situation",
// "EM / ATK% / ER"…). Every real set row reads "4pc …" or "2pc …", so keep only those.
function keepRealArtifactSets(build: CharacterBuildResponse['builds'][number]) {
  const group = build.groups.find(item => item.label === 'Artifact sets')
  if (!group) return
  const sets = group.items.filter(item => /^\d+\s*pc\b/i.test(item.name))
  if (sets.length) group.items = sets
}

async function useWikiWeaponIcons(build: CharacterBuildResponse['builds'][number]) {
  const group = build.groups.find(item => item.label === 'Weapons')
  const weapons = group?.items || []
  // "Astral Vulture’s Crimson Plumage, Polar Star, …" lists alternatives; the first is pictured.
  const fileFor = (name: string) => `File:Weapon ${name.split(/,\s*/)[0].replace(/[’‘]/g, "'").replace(/\s*\(.*?\)\s*$/, '').trim()}.png`
  if (!group || !weapons.length) return
  try {
    const titles = [...new Set(weapons.map(item => fileFor(item.name)))]
    const pages = new Map<string, any>()
    for (let start = 0; start < titles.length; start += 50) {
      const result = await $fetch<any>('https://genshin-impact.fandom.com/api.php', {
        query: { action: 'query', format: 'json', prop: 'imageinfo', iiprop: 'url', iiurlwidth: 256, redirects: 1, titles: titles.slice(start, start + 50).join('|') },
        headers, timeout: 12000, retry: 1,
      })
      for (const page of Object.values(result.query?.pages || {}) as any[]) pages.set(page.title, page)
      for (const alias of [...(result.query?.normalized || []), ...(result.query?.redirects || [])]) {
        const page = pages.get(alias.to)
        if (page) pages.set(alias.from, page)
      }
    }
    // The guide's weapon section can run on into teammates, other builds' artifact sets and
    // stat notes ("CRIT Swords", "Bennett", "4pc Gilded Dreams"…). A row is a weapon only if
    // the wiki has an icon for it; artifact rows move to Artifact sets, anything else is dropped.
    const kept: typeof weapons = []
    const strayArtifacts: typeof weapons = []
    for (const item of weapons) {
      const url = pages.get(fileFor(item.name))?.imageinfo?.[0]?.thumburl
      if (typeof url === 'string' && url.startsWith('https://static.wikia.nocookie.net/')) kept.push({ ...item, image: url })
      else if (/^\d+\s*pc\b/i.test(item.name)) strayArtifacts.push(item)
    }
    if (!kept.length) return // the lookup found nothing at all: leave the source list untouched
    group.items = kept
    if (strayArtifacts.length) {
      const artifacts = build.groups.find(item => item.label === 'Artifact sets')
      if (artifacts) {
        const seen = new Set(artifacts.items.map(item => item.name))
        artifacts.items.push(...strayArtifacts.filter(item => !seen.has(item.name)))
      } else build.groups.push({ label: 'Artifact sets', items: strayArtifacts })
    }
  } catch { /* wiki unreachable: keep the source's own list and images */ }
}

export async function kqmBuild(title: string): Promise<CharacterBuildResponse> {
  const slug = KQM_ALIASES[normalizedName(title)] || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const source = { name: 'KeqingMains', url: `https://keqingmains.com/q/${slug}-quickguide/` }
  let unavailable = false
  for (const url of [source.url, `https://keqingmains.com/${slug}/`]) {
    try {
      const html = await $fetch<string>(url, { responseType: 'text', headers, timeout: 15000, retry: 0 })
      const build = parseKqmBuild(html, 'https://keqingmains.com')
      if (!build.groups.some(group => group.label === 'Weapons') || !build.groups.some(group => group.label === 'Artifact sets')) continue
      await useWikiWeaponIcons(build)
      keepRealArtifactSets(build)
      // Source item names and stat choices only; no copied reviews, rotations or guide prose.
      return { game: 'genshin', title, teams: parseKqmTeams(html, title), builds: [build], status: 'available', source: { ...source, url, updated: html.match(/article:modified_time[\"']\s+content=[\"']([^\"']+)/i)?.[1] }, checkedAt: new Date().toISOString() }
    } catch (error) {
      const status = (error as { statusCode?: number; status?: number }).statusCode || (error as { status?: number }).status
      if (status !== 404 && status !== 410) unavailable = true
    }
  }
  if (unavailable) throw new Error('Character guide source unavailable')
  return { game: 'genshin', title, builds: [], status: 'missing', source, checkedAt: new Date().toISOString() }
}

const mlbbRoster = defineCachedFunction(async () => {
  const result = await $fetch<ProviderRecord>('https://mapi.mobilelegends.com/hero/list', { query: { language: 'en' }, headers, timeout: 12000, retry: 1 })
  if (result.code !== 2000 || !Array.isArray(result.data)) throw new Error('Official hero index unavailable')
  return result.data as ProviderRecord[]
}, { name: 'build-mlbb-roster-v1', maxAge: 3600, swr: true })

export async function mlbbBuild(title: string): Promise<CharacterBuildResponse> {
  const roster = await mlbbRoster()
  let hero = roster.find(item => normalizedName(item.name) === normalizedName(title))
  // The official index can lag the hero detail service. Resolve its ID from the wiki's
  // standard portrait filename, then verify the official response's hero name below.
  if (!hero) {
    const page = await $fetch<ProviderRecord>('https://mobile-legends.fandom.com/api.php', { query: { action: 'query', format: 'json', titles: title, prop: 'pageimages', piprop: 'original', pilicense: 'any' }, headers, timeout: 12000 })
    const record = Object.values(page.query?.pages || {})[0] as ProviderRecord | undefined
    const id = record?.original?.source?.match(/Hero(\d+)1-portrait/i)?.[1]
    if (id) hero = { heroid: id }
  }
  const source = { name: 'Mobile Legends · official hero recommendations', url: 'https://www.mobilelegends.com/hero/list' }
  if (!hero) return { game: 'mlbb', title, builds: [], status: 'missing', source, checkedAt: new Date().toISOString() }
  const result = await $fetch<ProviderRecord>('https://mapi.mobilelegends.com/hero/detail', { query: { id: hero.heroid, language: 'en' }, headers, timeout: 12000, retry: 1 })
  const data = result.data
  if (result.code !== 2000 || normalizedName(data?.name || '') !== normalizedName(title)) return { game: 'mlbb', title, builds: [], status: 'missing', source, checkedAt: new Date().toISOString() }
  const items = (data.gear?.out_pack || []).map((item: ProviderRecord) => ({ name: String(item.equip?.name || ''), image: item.equip?.icon })).filter((item: ProviderRecord) => item.name)
  const main = data.skill?.item?.main?.icon
  const second = data.skill?.item?.secondary?.icon
  const skills = data.skill?.skill || []
  const priorities = []
  const mainSkill = skills.find((skill: ProviderRecord) => skill.icon === main)?.name
  const secondSkill = skills.find((skill: ProviderRecord) => skill.icon === second)?.name
  if (mainSkill) priorities.push({ label: 'Skill priority', value: [mainSkill, secondSkill].filter(Boolean).join(' → ') })
  return {
    game: 'mlbb', title, image: data.cover_picture,
    teams: parseMobileLegendsTeams(data, title),
    builds: items.length ? [{ name: 'Official recommended equipment', groups: [{ label: 'Equipment · purchase order', items }], stats: [], priorities }] : [],
    status: items.length ? 'available' : 'missing', source: { ...source, url: `https://www.mobilelegends.com/hero/detail?heroid=${hero.heroid}` }, checkedAt: new Date().toISOString(),
  }
}

export async function honkaiBuild(title: string): Promise<CharacterBuildResponse> {
  const response = await $fetch<ProviderRecord>('https://honkaiimpact3.fandom.com/api.php', { query: { action: 'parse', page: title, prop: 'text|revid', redirects: 1, format: 'json' }, headers, timeout: 15000, retry: 1 })
  if (!response.parse) throw new Error('Battlesuit recommendations unavailable')
  const builds = parseHonkaiEquipment(response.parse.text['*'], 'https://honkaiimpact3.fandom.com')
  return {
    game: 'hi3', title, teams: parseHonkaiTeams(response.parse.text['*'], title), builds, status: builds.length ? 'available' : 'missing',
    source: { name: 'Honkai Impact 3 Wiki · BBS equipment database', url: `https://honkaiimpact3.fandom.com/wiki/${encodeURIComponent(title.replaceAll(' ', '_'))}#BBS_Equipment_Builds`, updated: `Revision ${response.parse.revid}` },
    checkedAt: new Date().toISOString(),
  }
}
