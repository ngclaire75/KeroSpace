import snapshot from '~/data/communityRankings.json'

type GameId = keyof typeof snapshot
const PER_GAME = 15

/** One game's 15 most-watched channels, or the saved snapshot when twitchmetrics is unavailable. */
async function rankGame(id: GameId) {
  const saved = snapshot[id]
  try {
    const html = await $fetch<string>(saved.source, {
      responseType: 'text',
      timeout: 8000,
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; KeroSpace/1.0; +https://kerospace.vercel.app)' },
    })
    const streamers = parseTwitchMetrics(html).slice(0, PER_GAME)
    if (streamers.length < PER_GAME) return saved
    const sourceUpdated = html.match(/Last updated <time[^>]*datetime="([^"]+)"/)?.[1] ?? saved.sourceUpdated
    return { source: saved.source, sourceUpdated, checked: new Date().toISOString().slice(0, 10), streamers }
  } catch {
    return saved
  }
}

// twitchmetrics refreshes its rolling 30-day rankings daily; re-check every few hours so the
// list follows it, and keep serving the last good result while a refresh runs.
const loadRankings = defineCachedFunction(async () => {
  const ids = Object.keys(snapshot) as GameId[]
  const games = await Promise.all(ids.map(rankGame))
  return Object.fromEntries(ids.map((id, i) => [id, games[i]!])) as typeof snapshot
}, { name: 'community-rankings', maxAge: 6 * 60 * 60, swr: true })

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, max-age=1800, s-maxage=21600, stale-while-revalidate=86400')
  return loadRankings()
})
