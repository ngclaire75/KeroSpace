import { gameCatalogs } from '~/data/gameCatalogs'
import { cleanWikiArticle, extractGameFacts, prepareArticle } from '../utils/wikiArticle'

type ParsedArticle = { error?: { code?: string }; parse?: { title: string; pageid: number; revid: number; text: { '*': string }; sections: { anchor: string; line: string; level: string }[] } }
const loadEntry = defineCachedFunction(async (game: string, title: string) => {
  const config = gameCatalogs[game]
  const rights = await $fetch<{ query?: { rightsinfo?: { text: string; url: string } } }>(`https://${config.host}/api.php`, { query: { action: 'query', meta: 'siteinfo', siprop: 'rightsinfo', format: 'json' }, headers: { 'User-Agent': 'KeroSpace/1.0' }, timeout: 12000, retry: 1 })
  const canReuseArticle = /^CC[ -]BY[ -]SA(?:[ -]|$)/i.test(rights.query?.rightsinfo?.text || '')
  const response = await $fetch<ParsedArticle>(`https://${config.host}/api.php`, { query: { action: 'parse', page: title, prop: 'text|sections|revid', redirects: 1, disableeditsection: 1, format: 'json' }, headers: { 'User-Agent': 'KeroSpace/1.0' }, timeout: 15000, retry: 1 })
  if (!response.parse) throw createError({ statusCode: response.error?.code === 'missingtitle' ? 404 : 502, statusMessage: 'Entry not available from source' })
  const entry = response.parse
  const prepared = prepareArticle(entry.text['*'], config.host)
  const html = canReuseArticle ? cleanWikiArticle(prepared.html, game, config.host) : extractGameFacts(entry.text['*'], entry.title)
  const sections = (canReuseArticle ? entry.sections : [])
    .filter(section => Number(section.level) === 2)
    .map(section => ({ anchor: section.anchor, title: section.line.replace(/<[^>]*>/g, '').trim() }))
    .filter(section => !prepared.dropped.has(section.title))
  return { title: entry.title, html, infobox: prepared.infobox, mode: canReuseArticle ? 'reference' : 'facts', sections, checkedAt: new Date().toISOString(), source: { name: config.name, url: `https://${config.host}/wiki/${encodeURIComponent(entry.title.replaceAll(' ', '_'))}`, history: `https://${config.host}/index.php?title=${encodeURIComponent(entry.title)}&action=history`, revision: entry.revid, license: rights.query?.rightsinfo?.text || 'Source rights reserved', licenseUrl: rights.query?.rightsinfo?.url || `https://${config.host}` } }
}, { name: 'game-reference-article-v6', maxAge: 1800, swr: true, getKey: (game, title) => `${game}:${title}` })

export default defineEventHandler(async event => {
  const query = getQuery(event), game = String(query.game || ''), title = String(query.title || '').trim()
  if (!Object.hasOwn(gameCatalogs, game) || !gameCatalogs[game] || !title || title.length > 240 || /[<>|\x00-\x1f]/.test(title) || /^(Special|User|Talk|Template|File|MediaWiki|Category):/i.test(title)) throw createError({ statusCode: 400, statusMessage: 'Invalid game entry' })
  try { return await loadEntry(game, title) } catch (error) {
    if ((error as { statusCode?: number }).statusCode === 404) throw error
    throw createError({ statusCode: 502, statusMessage: 'This reference is temporarily unavailable. Please try again.' })
  }
})
