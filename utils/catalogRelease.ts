const UNRELEASED = /\b(?:unreleased|upcoming|unimplemented|unannounced|unused|cancelled|canceled|cut content|leaked|in development|future content|advanced server|test server|beta[- ]only|alpha[- ]only)\b/i

export function hasUnreleasedMarker(value: string) {
  return UNRELEASED.test(value.replaceAll('_', ' '))
}

function datesIn(value: string) {
  const dates: number[] = []
  for (const match of value.matchAll(/\b(20\d{2})[-/](\d{1,2})[-/](\d{1,2})\b|\b(20\d{2})\s*\|\s*(\d{1,2})\s*\|\s*(\d{1,2})\b/g)) {
    const year = Number(match[1] || match[4]), month = Number(match[2] || match[5]), day = Number(match[3] || match[6])
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) dates.push(Date.UTC(year, month - 1, day))
  }
  for (const match of value.matchAll(/\b(?:\d{1,2}\s+)?(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}?,?\s+20\d{2}\b|\b\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+20\d{2}\b/gi)) {
    const date = Date.parse(match[0] + ' UTC')
    if (Number.isFinite(date)) dates.push(date)
  }
  return dates
}

export function isReleasedCatalogEntry(metadata: { title: string; categories: string[]; lead: string }, kind: string, now = Date.now()) {
  if (hasUnreleasedMarker(metadata.title) || metadata.categories.some(hasUnreleasedMarker)) return false
  if (/\{\{\s*(?:upcoming|unreleased|unimplemented|leak(?:ed)?)(?:[\s|}])/i.test(metadata.lead)) return false
  const edition = metadata.title.match(/\/(20\d{2}-\d{2}-\d{2})(?:$|\/)/)
  if (edition && Date.parse(edition[1] + 'T00:00:00Z') > now) return false
  const scheduled = ['events', 'banners', 'skin-events'].includes(kind)
  const fields = [...metadata.lead.matchAll(/^\s*\|\s*([a-z_ ]+)\s*=\s*([^\n]*)/gim)]
  for (const [, rawName, value] of fields) {
    const name = rawName.replace(/[ _]/g, '').toLowerCase()
    const release = /^(?:release|released|releasedate|launch|launchdate|status|releasestatus)$/.test(name)
    const start = scheduled && /^(?:start|startdate|starttime)$/.test(name)
    if (!release && !start) continue
    if (hasUnreleasedMarker(value) || /\b(?:TBA|TBD|not yet released|coming soon)\b/i.test(value)) return false
    const dates = datesIn(value)
    if (dates.length && Math.min(...dates) > now) return false
  }
  return true
}

// Leaks, cut and test content never show. Officially announced characters do, marked upcoming.
const NOT_ANNOUNCED = /\b(?:unimplemented|unannounced|unused|cancelled|canceled|cut content|leaked|in development|future content|advanced server|test server|beta[- ]only|alpha[- ]only)\b/i

export function isAnnouncedCatalogEntry(metadata: { title: string; categories: string[]; lead: string }) {
  if (NOT_ANNOUNCED.test(metadata.title.replaceAll('_', ' ')) || metadata.categories.some(category => NOT_ANNOUNCED.test(category.replaceAll('_', ' ')))) return false
  return !/\{\{\s*(?:unimplemented|leak(?:ed)?)(?:[\s|}])/i.test(metadata.lead)
}

/**
 * When a character came out (or comes out), from the infobox: "|release_date = 2026-11-04 11:00:00 GMT+8"
 * gives `time` (ms) and `date` (YYYY-MM-DD); Honkai Impact 3rd only gives "|version = 6.4".
 */
export function releaseOf(lead: string): { time?: number; date?: string; version?: number } {
  for (const [, value] of lead.matchAll(/^\s*\|\s*release[ _]?date\s*=\s*([^\n]*)/gim)) {
    const match = value.match(/\b(20\d{2})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::\d{2})?\s*(?:GMT|UTC)?\s*([+-]\d{1,2})?)?/i)
    if (match) {
      const [, year, month, day, hour = '0', minute = '0', offset = '0'] = match
      const time = Date.UTC(+year, +month - 1, +day, +hour - +offset, +minute)
      if (Number.isFinite(time)) return { time, date: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` }
    }
    const time = datesIn(value)[0]
    if (time !== undefined) return { time, date: new Date(time).toISOString().slice(0, 10) }
  }
  const version = lead.match(/^\s*\|\s*version\s*=\s*(\d+)\.(\d+)/im)
  return version ? { version: +version[1] * 1000 + +version[2] } : {}
}
