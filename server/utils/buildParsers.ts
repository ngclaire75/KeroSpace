import { parseDocument } from 'htmlparser2'
import { findAll, findOne, textContent, removeElement } from 'domutils'
import type { AnyNode, Element } from 'domhandler'
import type { BuildItem, BuildGroup, BuildStat, CharacterBuild } from '~/data/characterBuilds'

export const normalizedName = (value: string) => value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g, '')
const cls = (node: AnyNode, name: string) => ((node as Element).attribs?.class || '').split(/\s+/).includes(name)
const text = (node?: AnyNode | null) => node ? textContent(node).replace(/\s+/g, ' ').trim() : ''
const all = (node: AnyNode, name: string) => findAll(el => cls(el, name), [node])
const first = (node: AnyNode, name: string) => findOne(el => cls(el, name), [node])
const uniqueItems = (items: BuildItem[]) => items.filter((item, index) => item.name && items.findIndex(other => other.name === item.name && other.detail === item.detail) === index)

function imageOf(node: AnyNode, base: string) {
  const image = findOne(el => el.name === 'img' && !!(el.attribs['data-src'] || el.attribs.src) && !/^(?:data:|about:)/.test(el.attribs['data-src'] || el.attribs.src), [node])
  if (!image) return undefined
  try {
    const url = new URL(image.attribs['data-src'] || image.attribs.src, base)
    return url.protocol === 'https:' ? url.href : undefined
  } catch { return undefined }
}
function cleanDocument(html: string) {
  const document = parseDocument(html)
  for (const el of findAll(el => ['script', 'style', 'noscript', 'svg'].includes(el.name), document.children)) removeElement(el)
  return document
}
function rankedItems(node: AnyNode, rowClass: string, nameClass: string, base: string) {
  return uniqueItems(all(node, rowClass).map(row => {
    const names = [...new Set(all(row, nameClass).map(text))]
    if (!names.length) names.push(...all(row, 'accordion-header').map(text))
    return { name: names.join(' + '), detail: text(first(row, 'cone-super')) || undefined, image: imageOf(row, base) }
  }))
}
function statBoxes(node: AnyNode): BuildStat[] {
  const root = first(node, 'main-stats')
  if (!root) return []
  return all(root, 'box').map(box => {
    const label = text(first(box, 'stats-inside')) || text(first(box, 'stats-header'))
    const value = text(first(box, 'list-stats')) || text(box).slice(label.length).trim()
    return { label, value }
  }).filter(stat => stat.label && stat.value)
}
export function richStatLines(raw?: string): BuildStat[] {
  if (!raw) return []
  try {
    type RichNode = { value?: string; content?: RichNode[]; nodeType?: string }
    const plain = (node: RichNode): string => node.value || (node.content || []).map(plain).join('')
    const document = JSON.parse(raw) as RichNode
    const items = document.content?.find(node => node.nodeType === 'unordered-list')?.content || []
    return items.map(node => plain(node.content?.find(child => child.nodeType === 'paragraph') || node)).map(value => {
      const colon = value.indexOf(':')
      return { label: value.slice(0, colon).trim(), value: value.slice(colon + 1).trim() }
    }).filter(stat => stat.label && stat.value)
  } catch { return [] }
}

export function parsePrydwenBuild(game: string, html: string, base: string): CharacterBuild {
  const document = cleanDocument(html)
  const groups: BuildGroup[] = []
  let stats: BuildStat[] = []
  let priorities: BuildStat[] = []
  if (game === 'hsr') {
    const root = all(document, 'section-build').find(node => !cls(node, 'perf'))
    if (!root) return { name: 'Recommended build', groups, stats, priorities }
    const cones = first(root, 'build-cones')
    if (cones) groups.push({ label: 'Light cones', items: rankedItems(cones, 'single-cone', 'hsr-set-name', base) })
    const relics = first(root, 'build-relics')
    if (relics) {
      for (const heading of findAll(el => el.name === 'h6', [relics])) {
        let content = heading.next
        while (content && !(content as Element).name) content = content.next
        if (content) groups.push({ label: /planet|planar/i.test(text(heading)) ? 'Planar ornaments' : 'Relic sets', items: rankedItems(content, 'single-cone', 'hsr-name', base) })
      }
    }
    stats = statBoxes(root)
    priorities = all(root, 'sub-stats').map(node => text(node)).map(value => {
      const colon = value.indexOf(':')
      return { label: value.slice(0, colon), value: value.slice(colon + 1).trim() }
    }).filter(stat => stat.label && stat.value)
  } else if (game === 'wuwa') {
    const tips = all(document, 'build-tips')
    const weapons = tips.find(node => first(node, 'ww-weapon-accordion'))
    if (weapons) groups.push({ label: 'Weapons', items: rankedItems(weapons, 'single-item', 'ww-weapon-name', base) })
    const echoes = tips.find(node => first(node, 'ww-set-accordion'))
    if (echoes) {
      groups.push({ label: 'Echo sets', items: uniqueItems(all(echoes, 'ww-set-accordion').map(row => ({ name: text(first(row, 'accordion-header')), image: imageOf(row, base) }))) })
      // Echo names only; the provider's narrative explanations are not republished.
      groups.push({ label: 'Main Echo options', items: uniqueItems(all(echoes, 'ww-echo-list').flatMap(list => findAll(el => el.name === 'li', [list]).map(li => ({ name: text(li).split(/\s[–-]\s/)[0], image: imageOf(li, base) })))) })
    }
    const main = tips.find(node => first(node, 'main-stats') && !cls(node, 'damage'))
    if (main) {
      stats = statBoxes(main)
      priorities = all(main, 'sub-stats').map(node => ({ label: 'Substats', value: text(node).replace(/^Substats:\s*/i, '') }))
    }
  } else if (game === 'nte') {
    const arcs = all(document, 'nte-weapon-accordion')
    groups.push({ label: 'Arcs', items: uniqueItems(arcs.map(row => ({ name: text(first(row, 'nte-weapon-name')), detail: text(first(row, 'cone-super')) || undefined, image: imageOf(row, base) }))) })
    groups.push({ label: 'Cartridge sets', items: uniqueItems(all(document, 'nte-set-accordion').map(row => ({ name: text(first(row, 'nte-set-name')), image: imageOf(row, base) }))) })
    const root = first(document, 'main-stats')
    if (root) {
      const columns = (root as Element).children.filter(node => (node as Element).name === 'div')
      for (const column of columns) {
        const value = text(column)
        if (/^Main Stats/.test(value)) stats.push({ label: 'Main stats', value: value.replace(/^Main Stats\s*/, '') })
        if (/^Sub Stats/.test(value)) priorities.push({ label: 'Substats', value: value.replace(/^Sub Stats\s*/, '') })
      }
    }
  }
  return { name: 'Recommended build', groups: groups.filter(group => group.items.length), stats, priorities }
}

export function parseHonkaiEquipment(html: string, base: string): CharacterBuild[] {
  const document = cleanDocument(html)
  const tables = findAll(el => el.name === 'table' && /Recommended Equipment/.test(text(el)), document.children)
  const table = tables.sort((a, b) => text(a).length - text(b).length)[0]
  if (!table) return []
  const builds: CharacterBuild[] = []
  let build: CharacterBuild | undefined
  for (const row of findAll(el => el.name === 'tr', [table])) {
    const label = text(row)
    if (/^(?:Recommended|Auxiliary|Universal|Transitional) Equipment$/.test(label)) {
      build = { name: label, groups: [], stats: [], priorities: [] }
      builds.push(build)
      continue
    }
    if (!build) continue
    const images = findAll(el => el.name === 'img' && !/Frame |^Stigmata (?:Top|Middle|Bottom)/.test(el.attribs.alt || ''), [row])
    const items = uniqueItems(images.map(image => ({ name: (image.attribs.alt || '').replace(/\s*\(Icon\)/g, '').replace(/\s*\(\d\)/g, '').trim(), image: imageOf(image, base) }))).filter(item => item.name)
    const weapons = items.filter(item => !/\([TMB]\)/.test(item.name))
    const stigmata = items.filter(item => /\([TMB]\)/.test(item.name))
    if (weapons.length) build.groups.push({ label: 'Weapon', items: weapons })
    if (stigmata.length) build.groups.push({ label: 'Stigmata', items: stigmata })
  }
  return builds.filter(build => build.groups.length)
}

// KQM tables provide equipment names and stat choices; do not import guide prose.
export function parseKqmBuild(html: string, base: string): CharacterBuild {
  const document = cleanDocument(html)
  const groups: BuildGroup[] = []
  const stats: BuildStat[] = []
  const priorities: BuildStat[] = []
  const elements = findAll(() => true, document.children)
  const markers = elements.map((el, index) => ({ id: el.attribs.id || '', index })).filter(marker => marker.id && /^(?:Weapons|Weapon_Options|Artifact_Sets|Artifacts|Artifact_Stats|ER_Requirements|Teams|Team_Compositions|Teambuilding|Credits)$/.test(marker.id))
  for (const table of findAll(el => el.name === 'table', document.children)) {
    const index = elements.indexOf(table)
    const section = markers.filter(marker => marker.index < index).at(-1)?.id || ''
    if (!/^(?:Weapons|Weapon_Options|Artifact_Sets|Artifacts)$/.test(section)) continue
    const weapon = /Weapon/.test(section)
    const items = findAll(el => el.name === 'tr', [table]).flatMap(row => {
      const cell = row.children.find(node => ['td', 'th'].includes((node as Element).name || ''))
      const name = text(cell).replace(/^(?:[345]★|[345]\*)\s*/, '')
      return name && name.length < 140 && !/^(?:Sands|Goblet|Circlet|Solo Pyro|Double Pyro|Triple Pyro)$/.test(name) ? [{ name, image: cell ? imageOf(cell, base) : undefined }] : []
    })
    const label = weapon ? 'Weapons' : 'Artifact sets'
    const group = groups.find(group => group.label === label)
    if (group) group.items = uniqueItems([...group.items, ...items])
    else if (items.length) groups.push({ label, items: uniqueItems(items) })
  }
  for (const table of findAll(el => el.name === 'table', document.children)) {
    const rows = findAll(el => el.name === 'tr', [table])
    const cells = rows.map(row => row.children.filter(node => ['td', 'th'].includes((node as Element).name || '')).map(text))
    if (cells[0]?.some(value => /^(Sands|Goblet|Circlet)$/.test(value)) && cells[1]) {
      cells[0].forEach((label, index) => { if (cells[1][index]) stats.push({ label, value: cells[1][index] }) })
    }
  }
  const artifactStats = findOne(el => el.attribs?.id === 'Artifact_Stats', document.children)
  let node = artifactStats?.parent?.next
  for (let count = 0; node && count < 15; count++, node = node.next) {
    if (/^h[12]$/.test((node as Element).name || '')) break
    const value = text(node)
    if (/^Substat Priority/i.test(value) && value.length < 400) priorities.push({ label: 'Substats', value: value.replace(/^Substat Priority\s*:?\s*/i, '') })
  }
  return { name: 'Recommended build', groups, stats, priorities }
}
