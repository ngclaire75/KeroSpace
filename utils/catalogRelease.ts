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
