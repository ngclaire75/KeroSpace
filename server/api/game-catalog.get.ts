import { hasUnreleasedMarker, isReleasedCatalogEntry } from '~/utils/catalogRelease'
import { hasCatalogArtwork } from '~/utils/catalogImages'
import { gameCatalogs, catalogKinds, type CatalogKind, type CatalogEntry } from '~/data/gameCatalogs'

type WikiPage = { index?: number; pageid: number; ns: number; title: string; thumbnail?: { source: string }; original?: { source: string }; categories?: { title: string }[]; revisions?: { slots?: { main?: { '*': string } } }[]; images?: { title: string }[]; imageinfo?: { url?: string; thumburl?: string }[] }
type WikiResponse = { batchcomplete?: string; error?: { info?: string }; continue?: Record<string, string | number>; query?: { pages?: Record<string, WikiPage>; normalized?: { from: string; to: string }[]; redirects?: { from: string; to: string }[] } }
type Cursor = { queue: string[]; seen: string[]; continuation?: Record<string, string | number> }
const headers = { 'User-Agent': 'KeroSpace/1.0 (game reference index)', Accept: 'application/json' }

// Cache individual source pages, not a fabricated snapshot. Pagination follows the
// source's continuation token; subcategories are traversed with cycle detection.
const loadWiki = defineCachedFunction(async (host: string, query: Record<string, string | number>) => {
  const result = await $fetch<WikiResponse>(`https://${host}/api.php`, { query: { action: 'query', format: 'json', ...query }, headers, timeout: 12000, retry: 1 })
  if (result.error) throw new Error('Source response unavailable')
  // A valid empty search/file lookup has batchcomplete but no query object.
  if (!result.query) {
    if (!Object.hasOwn(result, 'batchcomplete')) throw new Error('Source response unavailable')
    result.query = {}
  }
  return result
}, { name: 'game-wiki-page-v4', maxAge: 1800, swr: true, getKey: (host, query) => `${host}:${JSON.stringify(query)}` })

function readCursor(value: string, roots: string[]): Cursor {
  if (!value) return { queue: roots.map(name => `Category:${name}`), seen: [] }
  try {
    if (value.length > 24000) throw new Error()
    const cursor = JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as Cursor
    if (!Array.isArray(cursor.queue) || !Array.isArray(cursor.seen) || cursor.queue.length > 300 || cursor.seen.length > 300 || [...cursor.queue, ...cursor.seen].some(name => typeof name !== 'string' || !/^Category:[^|<>\x00-\x1f]{1,180}$/.test(name))) throw new Error()
    if (cursor.continuation && (typeof cursor.continuation !== 'object' || Object.entries(cursor.continuation).some(([key, value]) => !['gcmcontinue', 'continue'].includes(key) || typeof value !== 'string' || value.length > 2000))) throw new Error()
    return cursor
  } catch { throw createError({ statusCode: 400, statusMessage: 'Invalid catalogue cursor' }) }
}
function safeImage(value?: string) {
  try { const url = new URL(value || ''); return url.protocol === 'https:' && (url.hostname.endsWith('.wikia.nocookie.net') || url.hostname.endsWith('.fandom.com') || url.hostname.endsWith('.wikia.com')) ? url.href : undefined } catch { return undefined }
}

// Card artwork is requested at this width; cards render up to ~300 CSS px, so this covers 2x screens.
const THUMB = 640
const RASTER = /\.(?:png|jpe?g|webp|gif)$/i
const squash = (text: string) => text.toLowerCase().replace(/^file:/, '').replace(RASTER, '').replace(/[^a-z0-9]/g, '')

// File names and pages can be aliases; retain their original request names when the
// wiki normalises a title or follows a redirect to the actual artwork.
function pagesWithAliases(result: WikiResponse) {
  const pages = new Map(Object.values(result.query?.pages || {}).map(page => [page.title.replaceAll('_', ' '), page]))
  const aliases = [...(result.query?.normalized || []), ...(result.query?.redirects || [])]
  for (let pass = 0; pass <= aliases.length; pass++) {
    for (const alias of aliases) {
      const page = pages.get(alias.to.replaceAll('_', ' '))
      if (page) pages.set(alias.from.replaceAll('_', ' '), page)
    }
  }
  return pages
}

// Resolve current release metadata before showing artwork, including search and pagination.
async function filterReleasedItems(host: string, items: CatalogEntry[], kind: CatalogKind) {
  const released = new Set<string>()
  const characterRoots = Object.values(gameCatalogs).find(config => config.host === host)?.categories.characters || []
  for (let start = 0; start < items.length; start += 20) {
    const batch = items.slice(start, start + 20)
    const titles = batch.map(item => item.title).join('|')
    const result = await loadWiki(host, { prop: 'categories|revisions', titles, redirects: 1, cllimit: 'max', rvprop: 'content', rvslots: 'main', rvsection: 0 })
    const metadata = new Map<string, { title: string; categories: string[]; lead: string }>()
    for (const [title, page] of pagesWithAliases(result)) {
      if (page.pageid > 0) metadata.set(title, { title, categories: (page.categories || []).map(category => category.title), lead: page.revisions?.[0]?.slots?.main?.['*'] || '' })
    }
    let next = result.continue?.clcontinue ? result.continue : undefined
    for (let call = 0; next && call < 10; call++) {
      const extra = await loadWiki(host, { prop: 'categories', titles, redirects: 1, cllimit: 'max', ...next })
      for (const [title, page] of pagesWithAliases(extra)) {
        const record = metadata.get(title)
        if (record) record.categories.push(...(page.categories || []).map(category => category.title))
      }
      next = extra.continue?.clcontinue ? extra.continue : undefined
    }
    if (next) throw new Error('Release metadata incomplete')
    for (const item of batch) {
      const record = metadata.get(item.title.replaceAll('_', ' '))
      const isCharacter = kind !== 'characters' || record?.categories.some(category => characterRoots.some(root => category.toLowerCase() === `category:${root}`.toLowerCase()))
      if (record && isCharacter && isReleasedCatalogEntry(record, kind)) released.add(item.title)
    }
  }
  items.splice(0, items.length, ...items.filter(item => released.has(item.title)))
}

// The Mobile Legends wiki gives unfinished heroes a blank silhouette ("Hero000"); that is
// not artwork, so treat it as missing.
const PLACEHOLDER = /\/Hero000-(?:portrait|icon)\.png/i
function dropPlaceholders(items: CatalogEntry[]) {
  for (const item of items) if (item.image && PLACEHOLDER.test(item.image)) item.image = undefined
}

// Honkai Impact 3rd pages lead with a skill icon. Every battlesuit has its own portrait,
// "File:<Name> (Thumbnail).png" (a ":" in the name becomes " -"), so use that instead.
async function useBattlesuitPortraits(host: string, items: CatalogEntry[]) {
  const fileFor = (title: string) => `File:${title.replace(/:\s*/g, ' - ')} (Thumbnail).png`
  try {
    for (let start = 0; start < items.length; start += 50) {
      const batch = items.slice(start, start + 50)
      const info = await loadWiki(host, { prop: 'imageinfo', iiprop: 'url', iiurlwidth: THUMB, redirects: 1, titles: batch.map(item => fileFor(item.title)).join('|') })
      const pages = pagesWithAliases(info)
      for (const item of batch) {
        const page = pages.get(fileFor(item.title))
        const url = safeImage(page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url)
        if (url) { item.image = url; item.imageLabel = undefined }
      }
    }
  } catch { /* keep whatever artwork the page itself offered */ }
}

async function fillMissingImages(host: string, items: CatalogEntry[]) {
  const missing = items.filter(item => !item.image).slice(0, 50)
  if (!missing.length) return
  try {
    const filesFor = new Map<string, string[]>()
    let next: Record<string, string | number> | undefined
    for (let call = 0; call < 4; call++) {
      const onPage = await loadWiki(host, { prop: 'images', titles: missing.map(item => item.title).join('|'), redirects: 1, imlimit: 'max', ...next })
      for (const [title, page] of pagesWithAliases(onPage)) {
        filesFor.set(title, [...(filesFor.get(title) || []), ...(page.images || []).map(image => image.title).filter(title => RASTER.test(title))])
      }
      next = onPage.continue?.imcontinue ? onPage.continue : undefined
      if (!next) break
    }
    const choice = new Map<string, string[]>()
    const labels = new Map<string, string>()
    for (const item of missing) {
      const key = squash(item.title.replace(/\/(?:\d{4}-\d{2}-\d{2}).*$/, '').replace(/\s*\(Quest\)$/i, ''))
      const files = [...new Set(filesFor.get(item.title.replaceAll('_', ' ')) || [])]
      const related = files.filter(file => key.length > 3 && squash(file).includes(key))
        .sort((a, b) => Number(/icon|avatar|preview/i.test(a)) - Number(/icon|avatar|preview/i.test(b)) || Number(squash(b) === key) - Number(squash(a) === key))
      // Quest pages often have no illustration at all, but do provide their own quest-type icon.
      const subject = squash(item.title.split(/[:(]/)[0])
      const subjectArtwork = files.filter(file => subject.length > 3 && squash(file).includes(subject) && !/preview|damage|core |emoji|flag/i.test(file)).slice(0, 3)
      for (const file of subjectArtwork) if (!related.includes(file)) labels.set(file, 'Related artwork')
      const questIcon = files.find(file => /^File:UI (?:.*Mission|Quest)\.png$/i.test(file))
      if (questIcon) labels.set(questIcon, 'Quest icon')
      const exact = related.find(file => squash(file) === key)
      choice.set(item.title, [...new Set([exact, ...related.slice(0, 3), `File:${item.title}.png`, `File:${item.title}.jpg`, ...subjectArtwork, questIcon].filter((file): file is string => !!file))])
    }
    const candidates = [...choice.values()]
    const wanted = [...new Set(Array.from({ length: Math.max(...candidates.map(files => files.length), 0) }, (_, rank) => candidates.map(files => files[rank]).filter((file): file is string => !!file)).flat())]
    const urls = new Map<string, string>()
    for (let start = 0; start < wanted.length; start += 50) {
      const info = await loadWiki(host, { prop: 'imageinfo', iiprop: 'url', iiurlwidth: THUMB, redirects: 1, titles: wanted.slice(start, start + 50).join('|') })
      for (const [title, page] of pagesWithAliases(info)) {
        const url = safeImage(page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url)
        if (url) urls.set(title, url)
      }
    }
    for (const item of missing) {
      for (const file of choice.get(item.title) || []) {
        const url = urls.get(file.replaceAll('_', ' '))
        if (url) {
          item.image = url
          if (labels.has(file)) item.imageLabel = labels.get(file)
          break
        }
      }
    }
  } catch { /* Keep the entry accessible when the source has no artwork. */ }
}

// Prefer each game’s character artwork over page thumbnails. Genshin uses transparent
// wish artwork; Mobile Legends keeps its original hero portraits.
const STYLE: Record<string, (title: string) => string[]> = {
  genshin: title => [`File:Character ${title} Full Wish.png`, `File:Character ${title} Portrait.png`],
  wuwa: title => [`File:${title} Card.png`, `File:${title} Card.jpg`],
  nte: title => [`File:${title} Portrait.png`],
}
// Characters whose card art is filed under another name on the wiki.
const ART_ALIASES: Record<string, [RegExp, string][]> = {
  genshin: [
    [/^Aether$/, 'File:Character Traveler Male Full Wish.png'],
    [/^Lumine$/, 'File:Character Traveler Female Full Wish.png'],
    [/^Traveler(?: \(.+\))?$/, 'File:Character Traveler Female Full Wish.png'],
  ],
}
async function useHouseStyle(game: string, host: string, items: CatalogEntry[]) {
  const style = STYLE[game]
  const aliases = ART_ALIASES[game] || []
  if (!style && !aliases.length) return
  const candidates = new Map(items.map(item => {
    const alias = aliases.find(([pattern]) => pattern.test(item.title))?.[1]
    return [item, [...(alias ? [alias] : []), ...(style ? style(item.title) : [])]] as const
  }))
  const wanted = [...new Set([...candidates.values()].flat())]
  try {
    const urls = new Map<string, string>()
    for (let start = 0; start < wanted.length; start += 50) {
      const info = await loadWiki(host, { prop: 'imageinfo', iiprop: 'url', iiurlwidth: THUMB, redirects: 1, titles: wanted.slice(start, start + 50).join('|') })
      for (const [title, page] of pagesWithAliases(info)) {
        const url = safeImage(page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url)
        if (url) urls.set(title, url)
      }
    }
    for (const [item, files] of candidates) {
      const url = files.map(file => urls.get(file)).find(Boolean)
      if (url || game === 'genshin') { item.image = url; item.imageLabel = undefined }
    }
  } catch (error) {
    if (game === 'genshin') throw error
    // Other games can still use the page's own artwork.
  }
}

async function prepareArtwork(game: string, kind: CatalogKind, host: string, items: CatalogEntry[]) {
  // Every Mobile Legends hero page leads with its "Hero###-portrait" art. Faction, lane and
  // series pages (Oriental Fighters, Side Laner, Lightborn…) don't, so they aren't heroes.
  if (game === 'mlbb' && kind === 'characters') {
    items.splice(0, items.length, ...items.filter(item => /\/Hero\d+-portrait\.png/i.test(item.image || '') && !PLACEHOLDER.test(item.image || '')))
  }
  dropPlaceholders(items)
  if (game === 'hi3' && kind === 'characters') await useBattlesuitPortraits(host, items)
  await fillMissingImages(host, items)
  if (kind === 'characters') await useHouseStyle(game, host, items)
  dropPlaceholders(items)
}

export default defineEventHandler(async event => {
  const query = getQuery(event), game = String(query.game || 'hsr'), kind = String(query.kind || 'characters') as CatalogKind
  const config = gameCatalogs[game]
  if (!Object.hasOwn(gameCatalogs, game) || !config || !catalogKinds.some(item => item.id === kind)) throw createError({ statusCode: 400, statusMessage: 'Unknown game or catalogue' })
  const search = String(query.search || '').trim().slice(0, 120)
  const root = `https://${config.host}`
  const sourceUrl = `${root}/wiki/Category:${encodeURIComponent(config.categories[kind][0].replaceAll(' ', '_'))}`
  const items: CatalogEntry[] = []
  let next: string | null = null
  try {
    if (search) {
      const offset = Number(query.offset || 0)
      if (!Number.isSafeInteger(offset) || offset < 0 || offset > 10000) throw createError({ statusCode: 400, statusMessage: 'Invalid search offset' })
      // Search the entire game's wiki, including pages outside a root category.
      const result = await loadWiki(config.host, { generator: 'search', gsrsearch: search, gsrnamespace: 0, gsrlimit: 24, gsroffset: offset, prop: 'pageimages', piprop: 'thumbnail|original', pilicense: 'any', pithumbsize: THUMB })
      const titleMatch = (title: string) => title.normalize('NFKD').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '').includes(search.normalize('NFKD').toLowerCase().replace(/[^\p{L}\p{N}]/gu, ''))
      for (const page of Object.values(result.query?.pages || {}).sort((a, b) => Number(b.title.toLowerCase() === search.toLowerCase()) - Number(a.title.toLowerCase() === search.toLowerCase()) || (a.index || 0) - (b.index || 0))) if (page.ns === 0 && (kind !== 'characters' || titleMatch(page.title))) items.push({ id: page.pageid, title: page.title, url: `${root}/wiki/${encodeURIComponent(page.title.replaceAll(' ', '_'))}`, image: safeImage(page.thumbnail?.source || page.original?.source) })
      await filterReleasedItems(config.host, items, kind)
      await prepareArtwork(game, kind, config.host, items)
      const nextOffset = result.continue?.gsroffset
      return { game, kind, items: items.filter(hasCatalogArtwork), next: nextOffset !== undefined ? String(nextOffset) : null, search: true, source: { name: config.name, url: `${root}/wiki/Special:Search?query=${encodeURIComponent(search)}` }, checkedAt: new Date().toISOString(), status: 'available', traversalLimited: false }
    }
    const cursor = readCursor(String(query.cursor || ''), config.categories[kind])
    // Each round makes at most three upstream calls; the next cursor resumes exactly. If a
    // round ends up with nothing to show (all unreleased or without art), read on, so the
    // page never offers "Load more" for a page that would add nothing.
    const visible: CatalogEntry[] = []
    for (let round = 0; round < 6 && !visible.length && cursor.queue.length; round++) {
      items.length = 0
      for (let batch = 0; batch < 3 && cursor.queue.length && items.length < 24; batch++) {
        const category = cursor.queue[0]
        if (hasUnreleasedMarker(category)) {
          cursor.seen.push(cursor.queue.shift()!)
          delete cursor.continuation
          continue
        }
        const result = await loadWiki(config.host, { generator: 'categorymembers', gcmtitle: category, gcmtype: 'page|subcat', gcmlimit: 40, prop: 'pageimages', piprop: 'thumbnail|original', pilicense: 'any', pithumbsize: THUMB, ...cursor.continuation })
        for (const page of Object.values(result.query?.pages || {}).sort((a, b) => a.title.localeCompare(b.title))) {
          if (page.ns === 14) {
            if (!hasUnreleasedMarker(page.title) && !cursor.seen.includes(page.title) && !cursor.queue.includes(page.title)) cursor.queue.push(page.title)
          } else if (page.ns === 0 && !items.some(item => item.id === page.pageid)) {
            // Keep community/esports archive subjects off this gameplay page.
            if (kind === 'characters' && /^(?:Characters?|Playable Characters|Resonators?|Battlesuits|Heroes|Cancelled heroes|Assassin|Fighter|Mage|Marksman|Support|Tank)$/i.test(page.title)) continue
            // Mobile Legends skin squads (S.A.B.E.R., V.E.N.O.M.) and their subpages
          // ("The Exorcists/Member Introduction") reuse hero art but are not heroes.
          if (game === 'mlbb' && kind === 'characters' && (page.title.includes('/') || /^(?:[A-Z]\.){2,}$/.test(page.title))) continue
          if (game === 'mlbb' && /^(Esports|Mobile Legends: Bang Bang Professional League|Mobile Legends: Bang Bang Southeast Asia Cup|MPL Indonesia Season)/i.test(page.title)) continue
            items.push({ id: page.pageid, title: page.title, url: `${root}/wiki/${encodeURIComponent(page.title.replaceAll(' ', '_'))}`, image: safeImage(page.thumbnail?.source || page.original?.source) })
          }
        }
        if (result.continue?.gcmcontinue) cursor.continuation = result.continue
        else { cursor.seen.push(cursor.queue.shift()!); delete cursor.continuation }
      }
      await filterReleasedItems(config.host, items, kind)
      await prepareArtwork(game, kind, config.host, items)
      visible.push(...items.filter(hasCatalogArtwork))
    }
    const traversalLimited = cursor.seen.length > 280 || cursor.queue.length > 280
    if (cursor.queue.length && !traversalLimited) next = Buffer.from(JSON.stringify(cursor)).toString('base64url')
    return { game, kind, items: visible, next, search: false, source: { name: config.name, url: sourceUrl }, checkedAt: new Date().toISOString(), status: 'available', traversalLimited }
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode === 400) throw error
    setHeader(event, 'cache-control', 'no-store')
    return { game, kind, items: [], next: null, search: !!search, source: { name: config.name, url: sourceUrl }, checkedAt: null, status: 'unavailable', traversalLimited: false }
  }
})
