import { gameCatalogs } from '~/data/gameCatalogs'
import { parseTeamTypeIcons, type TeamTypeIcon } from '../utils/teamIcons'

const loadIcons = defineCachedFunction(async (game: string, title: string) => {
  const response = await $fetch<{ parse?: { text?: { '*': string } } }>(`https://${gameCatalogs[game].host}/api.php`, {
    query: { action: 'parse', format: 'json', page: title, prop: 'text', section: 0, redirects: 1 },
    headers: { 'User-Agent': 'KeroSpace/1.0 (team character types)' }, timeout: 12000, retry: 0,
  })
  if (!response.parse?.text?.['*']) throw new Error('Character type unavailable')
  return parseTeamTypeIcons(game, response.parse.text['*'])
}, { name: 'team-type-icons-v2', maxAge: 86400, swr: true, getKey: (game, title) => `${game}:${title}` })

export default defineEventHandler(async event => {
  const query = getQuery(event)
  const game = String(query.game || '')
  const titles = [...new Set(String(query.titles || '').split('|').filter(Boolean))]
  if (!Object.hasOwn(gameCatalogs, game) || titles.length > 40 || titles.some(title => title.length > 120 || /[<>|\x00-\x1f]/.test(title) || /^(?:Special|File|Category|User|Template|Talk):/i.test(title))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid team characters' })
  }
  const icons: Record<string, TeamTypeIcon[]> = {}
  let failed = false
  for (let start = 0; start < titles.length; start += 6) {
    await Promise.all(titles.slice(start, start + 6).map(async title => {
      // Constellation/eidolon recommendations are not part of wiki page names.
      const name = title.replace(/^(?:[CE]\d+|S\d+)\s+/i, '').trim()
      const page = game === 'nte' && /^daffodill?$/i.test(name) ? 'Daffodill' : name
      try { icons[title] = await loadIcons(game, page) }
      catch { icons[title] = []; failed = true }
    }))
  }
  // Only share complete answers through the CDN; a lookup that failed should be retried.
  setHeader(event, 'cache-control', !failed ? 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800' : 'no-store')
  return icons
})
