// If a CDN-generated thumbnail fails, retry the original artwork before showing a fallback.
export function catalogImageCandidates(source?: string): string[] {
  if (!source) return []
  try {
    const url = new URL(source)
    if (url.protocol !== 'https:' || !/(?:^|\.)(?:wikia\.nocookie\.net|wikia\.com|fandom\.com)$/.test(url.hostname)) return []
    if (/\.svg(?:\/|$)/i.test(url.pathname)) return []
    const original = new URL(url)
    original.pathname = original.pathname.replace(/\/(?:scale-to-width-down|scale-to-height-down|thumbnail)\/[^/]+(?:\/[^/]+)?$/, '')
    const fresh = new URL(original)
    fresh.search = ''
    return [...new Set([url.href, original.href, fresh.href])]
  } catch { return [] }
}

// Only show entries with their own artwork, excluding overview pages and fallback icons.
export function hasCatalogArtwork(entry: { title: string; image?: string; imageLabel?: string }) {
  return !entry.imageLabel && entry.title.trim().toLowerCase() !== 'outfits' && (catalogImageCandidates(entry.image).length > 0 || /^\/images\/mlbb-cutouts\/hero-\d+\.webp$/.test(entry.image || ''))
}
