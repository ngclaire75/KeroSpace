import { catalogImageCandidates } from '~/utils/catalogImages'

const MAX_BYTES = 12 * 1024 * 1024
const loadArtwork = defineCachedFunction(async (source: string) => {
  for (const url of catalogImageCandidates(source)) {
    try {
      const response = await fetch(url, {
        redirect: 'error',
        signal: AbortSignal.timeout(10000),
        headers: { 'User-Agent': 'KeroSpace/1.0 (game artwork)', Accept: 'image/webp,image/png,image/jpeg,image/gif' },
      })
      const type = (response.headers.get('content-type') || '').split(';')[0].trim()
      if (!response.ok || !['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'].includes(type)) {
        await response.body?.cancel()
        continue
      }
      if (Number(response.headers.get('content-length')) > MAX_BYTES) {
        await response.body?.cancel()
        continue
      }
      const reader = response.body?.getReader()
      if (!reader) continue
      const chunks: Uint8Array[] = []
      let length = 0
      while (true) {
        const result = await reader.read()
        if (result.done) break
        length += result.value.byteLength
        if (length > MAX_BYTES) {
          await reader.cancel()
          throw new Error('Artwork is too large')
        }
        chunks.push(result.value)
      }
      if (!length) continue
      return { type, data: Buffer.concat(chunks).toString('base64') }
    } catch { /* Try the original file if thumbnail delivery failed. */ }
  }
  throw createError({ statusCode: 502, statusMessage: 'Artwork unavailable from source' })
}, { name: 'game-artwork-v1', maxAge: 86400, swr: true, getKey: source => source })

export default defineEventHandler(async event => {
  const source = String(getQuery(event).src || '')
  // Only the image CDN is allowed. Never fetch wiki pages, arbitrary hosts or redirects.
  if (source.length > 2000 || !catalogImageCandidates(source).length || new URL(source).hostname !== 'static.wikia.nocookie.net') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid artwork URL' })
  }
  const image = await loadArtwork(source)
  setHeader(event, 'content-type', image.type)
  setHeader(event, 'cache-control', 'public, max-age=86400')
  setHeader(event, 'x-content-type-options', 'nosniff')
  return Buffer.from(image.data, 'base64')
})
