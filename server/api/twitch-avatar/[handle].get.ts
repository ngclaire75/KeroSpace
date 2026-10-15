import { moreStreamers, twitchAvatar } from '~/data/community'

// Known streamer handle -> verified profile picture file (checked 2026-10-15).
const verified = new Map(
  Object.values(moreStreamers).flat().map(s => [s.handle, twitchAvatar(s.avatar)]),
)
const TWITCH_PICTURE = /^https:\/\/static-cdn\.jtvnw\.net\/jtv_user_pictures\/[\w.-]+$/

/**
 * Redirects to a streamer's *current* Twitch profile picture, so the page keeps
 * working when someone changes their avatar. Looks the picture up via decapi.me
 * (a public Twitch API proxy); if that is slow or down, falls back to the
 * verified picture we stored. Only handles listed on the page are served.
 */
export default defineEventHandler(async (event) => {
  const handle = (getRouterParam(event, 'handle') ?? '').toLowerCase()
  const fallback = verified.get(handle)
  if (!fallback) throw createError({ statusCode: 404, statusMessage: 'Unknown streamer' })

  let picture = fallback
  try {
    const current = (await $fetch<string>(`https://decapi.me/twitch/avatar/${encodeURIComponent(handle)}`, {
      responseType: 'text',
      timeout: 2500,
    })).trim()
    if (TWITCH_PICTURE.test(current)) picture = current
  } catch {
    // keep the verified picture
  }

  // cache at the edge for a day, serve stale for a week while refreshing
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800')
  return sendRedirect(event, picture, 302)
})
