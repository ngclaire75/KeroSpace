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
    // "Static Mist (R1)": the refinement is a detail, not part of the weapon's name
    const name = names.join(' + ')
    const refinement = name.match(/\s*\((R[1-5])\)$/)
    return { name: refinement ? name.slice(0, refinement.index) : name, detail: text(first(row, 'cone-super')) || refinement?.[1] || undefined, image: imageOf(row, base) }
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
  // A heading ends the section above it only at the same or a higher level: full guides follow
  // Weapons with Combos and Teams (whose tables are not equipment), while quick guides nest
  // their weapon tables under sub-headings inside Weapons.
  const levelOf = (el?: AnyNode | null) => Number(/^h([1-6])$/.exec((el as Element | undefined)?.name || '')?.[1] || 0)
  const headings = elements.map((el, index) => ({ id: el.attribs.id || '', index, level: levelOf(el) || levelOf(el.parent) })).filter(heading => heading.id && heading.level)
  // Section ids can carry a build role and a repeat number: "Support_Artifact_Sets",
  // "Pyro_DPS_Weapons", "Weapons-2" (the same section for the guide's second build).
  const SECTION = /^(.*?_)?(Weapons|Weapon_Options|Artifact_Sets|Artifacts|Artifact_Stats|ER_Requirements|Teams|Team_Compositions|Teambuilding|Credits)(-\d+)?$/
  const known = SECTION
  const sectionAt = (index: number) => {
    // the headings enclosing this point, outermost first
    const open: typeof headings = []
    for (const heading of headings) {
      if (heading.index > index) break
      while (open.length && open.at(-1)!.level >= heading.level) open.pop()
      open.push(heading)
    }
    return [...open].reverse().find(heading => known.test(heading.id))?.id || ''
  }
  let role: string | undefined // only the guide's first build, so builds are never mixed
  for (const table of findAll(el => el.name === 'table', document.children)) {
    const match = SECTION.exec(sectionAt(elements.indexOf(table)))
    if (!match || !/^(?:Weapons|Weapon_Options|Artifact_Sets|Artifacts|Artifact_Stats)$/.test(match[2])) continue
    const tableRole = (match[1] || '') + (match[3] || '')
    if (role !== undefined && tableRole !== role) continue
    const section = match[2]
    // Some guides list the sets inside their stats section; only "4pc …" rows count there.
    const statsSection = section === 'Artifact_Stats'
    const rows = findAll(el => el.name === 'tr', [table])
    const cells = (row: Element) => row.children.filter(node => ['td', 'th'].includes((node as Element).name || '')) as Element[]
    // Damage comparison tables ("4Husk | 100%") list abbreviations, not equipment; real set and
    // weapon tables picture their items, even when they also carry % columns.
    const comparison = rows.some(row => cells(row)[0]?.name === 'th' && cells(row).slice(1).some(cell => /%/.test(text(cell))))
    if (comparison && !rows.some(row => cells(row)[0] && imageOf(cells(row)[0], base))) continue
    const weapon = /Weapon/.test(section)
    const items = rows.flatMap(row => {
      const cell = cells(row)[0]
      // column headings ("Set", "Weapon", "Notes"), whether written as <th> or as a plain row
      if (!cell || cell.name === 'th' || /^(?:Sets?|Artifacts?(?: Sets?)?|Weapons?)$/i.test(text(cell))) return []
      let name = text(cell).replace(/^(?:[345]★|[345]\*)\s*/, '')
      let detail: string | undefined
      if (weapon) {
        // "Redhorn Stonethresher (5*) (R1: 136.50% | 136.35%)" and "R5 Festering Desire":
        // keep the weapon's name; a stated refinement becomes the detail, damage figures go.
        const refinement = name.match(/^R([1-5])\s+/)
        if (refinement) { detail = `R${refinement[1]}`; name = name.slice(refinement[0].length) }
        name = name.replace(/\s*\((?:[345]\s*[*★]|R[1-5][^)]*|[^)]*%[^)]*)\).*$/, '').trim()
      }
      if (statsSection && !/^\d\s*pc\b/i.test(name)) return []
      return name && name.length < 140 && !/^(?:Sands|Goblet|Circlet|Solo Pyro|Double Pyro|Triple Pyro)$/.test(name) ? [{ name, detail, image: imageOf(cell, base) }] : []
    })
    if (items.length && role === undefined) role = tableRole
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
