import { gameCatalogs } from '~/data/gameCatalogs'
import { hasUnreleasedMarker, isReleasedCatalogEntry } from '~/utils/catalogRelease'
import type { CharacterBuildResponse } from '~/data/characterBuilds'
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
}, { name: 'character-best-build-v10', maxAge: 3600, swr: true, getKey: (game, title) => `${game}:${title}` })

export default defineEventHandler(async event => {
  const query = getQuery(event)
  const game = String(query.game || ''), title = String(query.title || '').trim()
  if (!Object.hasOwn(gameCatalogs, game) || !title || title.length > 120 || /[<>|\x00-\x1f]/.test(title) || /^(?:Special|File|Category|User|Template|Talk):/i.test(title) || hasUnreleasedMarker(title)) throw createError({ statusCode: 400, statusMessage: 'Invalid character' })
  try {
    const result = await loadBuild(game, title)
    if (result.status === 'available') setHeader(event, 'cache-control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=604800')
    else setHeader(event, 'cache-control', 'no-store')
    return result
  }
  catch (error) {
    console.error('[character-build] Upstream request failed', { game, title, message: error instanceof Error ? error.message : String(error) })
    setHeader(event, 'cache-control', 'no-store')
    return { game, title, builds: [], status: 'unavailable', source: { name: '', url: '' }, checkedAt: null } satisfies CharacterBuildResponse
  }
})
