export interface RankedStreamer {
  name: string
  handle: string
  language: string
  hours: number
  avatar: string
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'" }
const decode = (text: string) => text.replace(/&(amp|lt|gt|quot|#39|apos);/g, (_, e: string) => ENTITIES[e]!)

/**
 * Reads the ranked channels from a twitchmetrics.net "Most Watched" page. Each channel is one
 * `list-group-item`; anything that doesn't have every field is skipped rather than guessed.
 */
export function parseTwitchMetrics(html: string): RankedStreamer[] {
  const streamers: RankedStreamer[] = []
  for (const item of html.split('<li class="list-group-item').slice(1)) {
    const handle = item.match(/href="\/c\/\d+-([\w]+)"/)?.[1]?.toLowerCase()
    const name = item.match(/<h5[^>]*>([^<]+)<\/h5>/)?.[1]?.trim()
    const avatar = item.match(/src="(https:\/\/static-cdn\.jtvnw\.net\/[^"]+)"/)?.[1] ?? ''
    const language = item.match(/<div class="mr-3">\s*([A-Z]{2})\s*<\/div>/)?.[1]
    const hours = Number(item.match(/<samp[^>]*>([\d,]+)<\/samp>/)?.[1]?.replace(/,/g, ''))
    if (!handle || !name || !language || !Number.isFinite(hours) || hours <= 0) continue
    streamers.push({ name: decode(name), handle, language, hours, avatar })
  }
  return streamers
}
