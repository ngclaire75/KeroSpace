// Refresh the saved character builds the build API falls back on while a guide site is slow.
//
// Run: node scripts/sync-guide-builds.mjs https://kerospace.vercel.app
// Only complete, live answers are saved; a character whose build cannot be loaded keeps its
// previous snapshot. This is an explicit maintenance command, never part of production builds.
import { readFileSync, writeFileSync } from 'node:fs'

const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')
const GAMES = ['hsr', 'genshin', 'hi3', 'wuwa', 'nte', 'mlbb']
const FILE = new URL('../data/guideBuildSnapshots.json', import.meta.url)

async function get(path) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(BASE + path, { signal: AbortSignal.timeout(90000) })
      if (response.ok) return await response.json()
    } catch { /* retried below */ }
  }
  return null
}

const previous = JSON.parse(readFileSync(FILE, 'utf8'))
const snapshots = {}
for (const game of GAMES) {
  const titles = []
  let cursor = ''
  for (let page = 0; page < 40; page++) {
    const result = await get(`/api/game-catalog?game=${game}&kind=characters${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`)
    if (result?.status !== 'available') throw new Error(`${game}: catalogue unavailable; snapshots left untouched`)
    titles.push(...result.items.map(item => item.title))
    if (!result.next) break
    cursor = result.next
  }
  snapshots[game] = {}
  const queue = [...new Set(titles)]
  let kept = 0
  await Promise.all(Array.from({ length: 5 }, async () => {
    while (queue.length) {
      const title = queue.shift()
      const build = await get(`/api/character-build?game=${game}&title=${encodeURIComponent(title)}`)
      if (build?.status === 'available' && !build.provisional && build.builds?.length) snapshots[game][title] = build
      else if (previous[game]?.[title]) { snapshots[game][title] = previous[game][title]; kept++ }
    }
  }))
  console.log(`${game}: ${Object.keys(snapshots[game]).length} builds saved${kept ? ` (${kept} kept from the previous snapshot)` : ''}`)
}
writeFileSync(FILE, JSON.stringify(snapshots) + '\n')
