import { gameCatalogs } from '~/data/gameCatalogs'
import { hasUnreleasedMarker, isReleasedCatalogEntry } from '~/utils/catalogRelease'
import type { CharacterBuildResponse } from '~/data/characterBuilds'
import buildSnapshots from '~/data/guideBuildSnapshots.json'
import { liveProblem } from '../utils/buildQuality'
import { withCurrentMlbbItems } from '../utils/mlbbItems'
import { honkaiBuild, kqmBuild, mlbbBuild, prydwenBuild } from '../utils/buildSources'

const loadBuild = defineCachedFunction(async (game: string, title: string) => {
  const config = gameCatalogs[game]
  const metadata = await $fetch<any>(`https://${config.host}/api.php`, {
    query: { action: 'query', format: 'json', titles: title, redirects: 1, prop: 'pageimages|categories|revisions', piprop: 'thumbnail|original', pithumbsize: 900, pilicense: 'any', cllimit: 'max', rvprop: 'content', rvslots: 'main', rvsection: 0 },
    headers: { 'User-Agent': 'KeroSpace/1.0 (character build reference)' }, timeout: 15000, retry: 1,
  })
  const page = Object.values(metadata.query?.pages || {})[0] as any
  const categories = (page?.categories || []).map((category: { title: string }) => category.title)
  const valid = page?.pageid > 0 && categories.some((category: string) => config.categories.characters.some(root => category.toLowerCase() === `category:${root}`.toLowerCase()))
    && isReleasedCatalogEntry({ title, categories, lead: page.revisions?.[0]?.slots?.main?.['*'] || '' }, 'characters')
  if (!valid) return { game, title, builds: [], status: 'missing', source: { name: config.name, url: `https://${config.host}` }, checkedAt: new Date().toISOString() } satisfies CharacterBuildResponse
  const result = game === 'genshin' ? await kqmBuild(title) : game === 'mlbb' ? await mlbbBuild(title) : game === 'hi3' ? await honkaiBuild(title) : await prydwenBuild(game, title)
  const image = page.thumbnail?.source || page.original?.source
  if (typeof image === 'string' && image.startsWith('https://static.wikia.nocookie.net/')) result.image = image
  return result
}, {
  name: 'character-best-build-v11', maxAge: 3600, swr: true, getKey: (game, title) => `${game}:${title}`,
  // A fallback answer is never stored, so the next request tries the preferred source again.
  validate: entry => entry.value !== undefined && !(entry.value as CharacterBuildResponse).provisional,
})

// Live builds come first. KeroSpace's saved builds (scripts/sync-guide-builds.py) are the
// safety net: when a guide site is down, slow, or its new layout parses into something wrong,
// the visitor gets the last verified build instead of junk or an error.
const snapshots = buildSnapshots as Record<string, Record<string, CharacterBuildResponse>>
const LIVE_WAIT = 2500
const DAILY_REFRESHED = new Set(['hsr', 'wuwa', 'nte'])

export default defineEventHandler(async event => {
  const query = getQuery(event)
  const game = String(query.game || ''), title = String(query.title || '').trim()
  if (!Object.hasOwn(gameCatalogs, game) || !title || title.length > 120 || /[<>|\x00-\x1f]/.test(title) || /^(?:Special|File|Category|User|Template|Talk):/i.test(title) || hasUnreleasedMarker(title)) throw createError({ statusCode: 400, statusMessage: 'Invalid character' })
  const saved = snapshots[game]?.[title]
  // Prydwen (HSR, WuWa, NTE) blocks servers, so a live read here only reaches an outdated mirror.
  // Those builds are refreshed daily in a real browser (scripts/sync-prydwen-builds.ts), which
  // makes the saved build the current one.
  if (saved && DAILY_REFRESHED.has(game) && query.fresh !== '1') {
    setHeader(event, 'cache-control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400')
    return saved
  }
  const fallback = () => {
    setHeader(event, 'cache-control', 'public, max-age=0, s-maxage=60')
    return withCurrentMlbbItems({ ...saved!, provisional: true })
  }
  const live = loadBuild(game, title)
  try {
    // With a saved build to fall back on, a slow guide site never holds the page up; the live
    // request keeps running and is cached for the next visitor.
    const result = saved && query.fresh !== '1' ? await Promise.race([live, new Promise<undefined>(resolve => setTimeout(resolve, LIVE_WAIT))]) : await live
    if (!result) {
      event.waitUntil(live.catch(() => {}))
      return fallback()
    }
    const problem = liveProblem(game, result, saved)
    if (problem) console.error('[character-build] Rejected live build', { game, title, problem })
    if (saved && (problem || result.status !== 'available' || result.provisional)) return fallback()
    if (problem) {
      setHeader(event, 'cache-control', 'no-store')
      return { ...result, builds: [], status: 'missing', rejected: problem } satisfies CharacterBuildResponse
    }
    if (result.status === 'available' && !result.provisional) setHeader(event, 'cache-control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=604800')
    else if (result.status === 'available') setHeader(event, 'cache-control', 'public, max-age=0, s-maxage=60')
    else setHeader(event, 'cache-control', 'no-store')
    return await withCurrentMlbbItems(result)
  }
  catch (error) {
    console.error('[character-build] Upstream request failed', { game, title, message: error instanceof Error ? error.message : String(error) })
    if (saved) return fallback()
    // 503 lets the page retry by itself instead of asking the visitor to refresh.
    setResponseStatus(event, 503)
    setHeader(event, 'cache-control', 'no-store')
    return { game, title, builds: [], status: 'unavailable', source: { name: '', url: '' }, checkedAt: null } satisfies CharacterBuildResponse
  }
})
