import imageManifest from '~/data/image-manifest.json'

type ImageEntry = { src: string; width: number; height: number; variants: { src: string; width: number }[] }
const images = imageManifest as Record<string, ImageEntry>

export function imageSources(source?: string) {
  if (!source) return { src: source, srcset: undefined }
  let key = source
  try { key = decodeURIComponent(source) } catch { /* Unrecognised URLs keep their original source. */ }
  const entry = images[key]
  return entry
    ? { src: entry.src, srcset: entry.variants.map(v => `${v.src} ${v.width}w`).join(', ') }
    : { src: source, srcset: undefined }
}

const decodedImages = new Map<string, Promise<void>>()
export function prepareImage(source: string, sizes = '100vw') {
  const key = `${source}|${sizes}`
  if (!decodedImages.has(key)) {
    const image = new Image()
    const sources = imageSources(source)
    image.decoding = 'async'
    image.fetchPriority = 'low'
    image.sizes = sizes
    if (sources.srcset) image.srcset = sources.srcset
    image.src = sources.src!
    decodedImages.set(key, image.decode().catch(() => { decodedImages.delete(key) }))
  }
  return decodedImages.get(key)!
}
