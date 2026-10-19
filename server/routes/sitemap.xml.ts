import { games } from '~/data/games'
import { gameStories } from '~/data/gameStories'

const xml = (value: string) => value.replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]!)

export default defineEventHandler(event => {
  const origin = new URL(useRuntimeConfig(event).public.siteUrl || getRequestURL(event).origin).origin
  const routes = [
    { path: '/' }, { path: '/community' }, { path: '/top-up' }, { path: '/guides' },
    ...games.map(game => ({ path: `/guides/${game.id}/characters`, updated: '2026-10-19' })),
    ...games.map(game => ({ path: `/guides/${game.id}`, updated: '2026-10-19' })),
    ...games.map(game => ({ path: `/games/${game.id}`, updated: gameStories[game.id].updated })),
  ]
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + routes.map(route =>
    `<url><loc>${xml(new URL(route.path, origin).href)}</loc>${'updated' in route ? `<lastmod>${route.updated}</lastmod>` : ''}</url>`,
  ).join('') + '</urlset>'
})
