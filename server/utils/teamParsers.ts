import { parseDocument } from 'htmlparser2'
import { findAll, findOne, textContent, removeElement } from 'domutils'
import type { AnyNode, Element } from 'domhandler'
import type { BuildItem, TeamSynergy, TeamSlot } from '~/data/characterBuilds'

const hasClass = (node: AnyNode, name: string) => ((node as Element).attribs?.class || '').split(/\s+/).includes(name)
const text = (node: AnyNode) => textContent(node).replace(/\s+/g, ' ').trim()
function documentFor(html: string) {
  const doc = parseDocument(html)
  for (const node of findAll(el => ['script', 'style', 'noscript'].includes(el.name), doc.children)) removeElement(node)
  return doc
}
function characterLinks(root: AnyNode): BuildItem[] {
  const members = findAll(el => el.name === 'a' && /^\/(?:star-rail|wuthering-waves|neverness-to-everness)\/characters\/[^/]+\/?$/.test(el.attribs.href || ''), [root]).map(link => {
    const image = findOne(el => el.name === 'img' && !!el.attribs.alt && !!(el.attribs['data-src'] || el.attribs.src) && !/^(data:|about:)/.test(el.attribs['data-src'] || el.attribs.src), link.children)
    const name = image?.attribs.alt || text(link)
    const src = image?.attribs['data-src'] || image?.attribs.src
    return { name, image: src ? new URL(src, 'https://d2ankz0m1a0dsp.cloudfront.net').href : undefined }
  })
  return members.filter((member, index) => member.name && members.findIndex(other => other.name === member.name) === index)
}
export function parsePrydwenTeams(html: string, title: string): TeamSynergy[] {
  const doc = documentFor(html)
  const teams: TeamSynergy[] = []
  for (const row of findAll(el => hasClass(el, 'team-row'), doc.children)) {
    const columns = row.children.filter(node => hasClass(node, 'column') && !hasClass(node, 'info'))
    const slots: TeamSlot[] = columns.flatMap(column => hasClass(column, 'characters')
      ? characterLinks(column).map(member => ({ options: [member] }))
      : [{ options: characterLinks(column) }]).filter(slot => slot.options.length)
    if (slots.length < 3 || slots.length > 4 || !slots.some(slot => slot.options.some(member => member.name.toLowerCase() === title.toLowerCase()))) continue
    let previous = row.prev
    while (previous && !hasClass(previous, 'team-header')) previous = previous.prev
    const observed = hasClass(row.parent!, 'team-container-moc')
    const heading = previous ? text(previous) : ''
    const name = heading && !/^(?:example|sample|best) teams?$/i.test(heading) ? heading : slots.map(slot => slot.options[0].name).join(' / ')
    teams.push({ name, slots, kind: observed ? 'observed' : 'team' })
  }
  // Pairings listed separately from complete teams, without copying the guide's review prose.
  if (!teams.length) for (const root of findAll(el => hasClass(el, 'synergy-info'), doc.children)) {
    for (const member of characterLinks(root)) teams.push({ name: 'Teammate option', slots: [{ options: [{ name: title }] }, { options: [member] }], kind: 'partner' })
  }
  return teams.filter((team, index) => teams.findIndex(other => JSON.stringify(other.slots) === JSON.stringify(team.slots)) === index).slice(0, 8)
}
export function parseKqmTeams(html: string, title: string): TeamSynergy[] {
  const doc = documentFor(html)
  const nodes = findAll(el => /^h[23]$/.test(el.name) || el.name === 'figcaption', doc.children)
  const teams: TeamSynergy[] = []
  let composition = ''
  const genericHeading = /example|sample|teambuilding|team compositions?|notable|teammates|limited roster/i
  const roleOnly = (name: string) => /^(?:flex|pyro|hydro|cryo|electro|anemo|geo|dendro|hexerei)$/i.test(name.trim()) || /(?:dps|support|buffer|debuffer|sustain|healer|shielder|on[ -]?field|off[ -]?field)/i.test(name)
  for (const node of nodes) {
    const value = text(node)
    if (node.type === 'tag' && node.name !== 'figcaption') {
      if (roleOnly(value) || (node.name === 'h2' && genericHeading.test(value))) composition = ''
      else if (!genericHeading.test(value)) composition = value.replace(/^Other Teams?\s*[（(][“"']?(.+?)[”"']?[）)]$/i, '$1')
      continue
    }
    const names = value.split(/\s*[—–]\s*/)
    if (names.length !== 4 || !names.some(name => name.toLowerCase().includes(title.toLowerCase()))) continue
    const slots = names.map(name => ({ options: name.split(/\s*\/\s*/).map(name => ({ name: name.trim() })).filter(member => member.name) }))
    if (slots.some(slot => slot.options.some(member => roleOnly(member.name)))) continue
    const name = composition ? `${title} · ${composition}` : slots.map(slot => slot.options[0].name).join(' / ')
    teams.push({ name, slots, kind: 'team' })
  }
  return teams.filter((team, index) => teams.findIndex(other => JSON.stringify(other.slots) === JSON.stringify(team.slots)) === index).slice(0, 8)
}
export function parseHonkaiTeams(html: string, title: string): TeamSynergy[] {
  const doc = documentFor(html)
  // Only named, explicit joint-skill requirements; navigation links aren't recommendations.
  const plain = text(doc)
  const teams: TeamSynergy[] = []
  for (const match of plain.matchAll(/With ([^.]{1,180}?) on the same team/gi)) {
    const names = match[1].split(/,\s*| and /).map(name => name.trim()).filter(Boolean)
    if (names.length !== 2) continue
    const links = findAll(el => el.name === 'a' && names.includes(el.attribs.title), doc.children)
    if (!names.every(name => links.some(link => link.attribs.title === name))) continue
    teams.push({ name: 'Joint skill team', slots: [title, ...names].map(name => ({ options: [{ name }] })), kind: 'team' })
  }
  return teams.slice(0, 4)
}

export function parseMobileLegendsTeams(data: { name?: string; counters?: { best?: { name?: string; icon?: string } } }, title: string): TeamSynergy[] {
  const partner = data.counters?.best?.name?.trim()
  if (!partner || data.name?.toLowerCase() !== title.toLowerCase() || partner.toLowerCase() === title.toLowerCase()) return []
  return [{ name: 'Recommended partner', kind: 'partner', slots: [{ options: [{ name: title }] }, { options: [{ name: partner, image: data.counters?.best?.icon?.replace(/^\/\//, 'https://') }] }] }]
}
