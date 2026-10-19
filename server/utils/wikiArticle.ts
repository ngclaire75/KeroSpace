import sanitizeHtml from 'sanitize-html'
import { parseDocument } from 'htmlparser2'
import { textContent, findAll, findOne, removeElement, replaceElement } from 'domutils'
import render from 'dom-serializer'
import { Element, Text, type AnyNode } from 'domhandler'

export type Infobox = { images: { src: string; caption: string }[]; facts: { label: string; value: string }[] }

const classOf = (node: AnyNode) => (node as Element).attribs?.class || ''
// Wiki chrome that should never reach the page. sanitize-html drops `class` before its own
// filters run, so this has to happen on the parsed tree first.
const NOISE = /(?:^|\s)(?:toc|toctogglecheckbox|navbox|mw-editsection|noprint|custom-tabs|wds-tabs__wrapper|portable-infobox__advertisement|article-interlang|wds-dropdown|sister-wiki|catlinks|mw-empty-elt)(?:\s|$)/
// Sections that are wiki housekeeping rather than game information.
const DROPPED_SECTIONS = /^(?:other languages|change history|navigation|references|notes|external links|see also)$/i

function imageSource(img: Element, host: string, width: number) {
  const raw = img.attribs['data-src'] || img.attribs.src || ''
  try {
    const url = new URL(raw, `https://${host}`)
    if (url.protocol !== 'https:' || !/(?:^|\.)(?:wikia\.nocookie\.net|wikia\.com)$/.test(url.hostname) || /\.svg(?:\/|$)/i.test(url.pathname)) return ''
    return url.href.replace(/\/scale-to-width-down\/\d+/, `/scale-to-width-down/${width}`)
  } catch { return '' }
}
// strips reference markers, soft hyphens and "2 years, 4 months ago" date tooltips
const tidy = (text: string) => text
  .replace(/\[(?:\d+|Note \d+)\]/g, '')
  .replace(/\u00ad/g, '')
  .replace(/\s*\d+ (?:years?|months?|weeks?|days?)(?:, \d+ (?:years?|months?|weeks?|days?))* ago/g, '')
  .replace(/\s+/g, ' ')
  .trim()

// Pull the infobox out as structured facts and artwork, drop wiki chrome and housekeeping
// sections, and hand back HTML that is ready for sanitising.
export function prepareArticle(html: string, host: string) {
  const document = parseDocument(html)
  const all = findAll(() => true, document.children)
  const infobox: Infobox = { images: [], facts: [] }
  // The first populated infobox describes the entry itself. A later story infobox may
  // have more fields, but its childhood/comic artwork must not replace the hero portrait.
  const boxes = all.filter(el => el.name === 'aside' && /portable-infobox/.test(classOf(el)))
  const richness = (el: Element) => findAll(item => /pi-data-value|pi-image-thumbnail/.test(classOf(item)), [el]).length
  const box = boxes.find(el => findAll(item => /pi-image-thumbnail/.test(classOf(item)), [el]).length > 0 && findAll(item => /pi-data-value/.test(classOf(item)), [el]).length > 0)
    || boxes.find(el => richness(el) > 0)
  if (box) {
    for (const img of findAll(el => el.name === 'img' && /pi-image-thumbnail/.test(classOf(el)), [box])) {
      const src = imageSource(img, host, 900)
      if (src && !infobox.images.some(image => image.src === src)) infobox.images.push({ src, caption: tidy(img.attribs.alt || '') })
    }
    const addFact = (labelEl?: Element | null, valueEl?: Element | null) => {
      if (!labelEl || !valueEl) return
      // both carry hidden mobile-only tooltip copies; values also carry reference markers
      for (const junk of findAll(el => /custom-tt|mobile-only/.test(classOf(el)) || el.name === 'sup', [labelEl, valueEl])) removeElement(junk)
      // a <br> separates words visually; keep that gap in the text
      for (const br of findAll(el => el.name === 'br', [labelEl, valueEl])) replaceElement(br, new Text(' '))
      const label = tidy(textContent(labelEl))
      const items = findAll(el => el.name === 'li', [valueEl]).map(li => tidy(textContent(li))).filter(Boolean)
      let value = items.length ? items.join(' · ') : tidy(textContent(valueEl))
      if (!value) value = [...new Set(findAll(el => el.name === 'img', [valueEl]).map(img => tidy(img.attribs.alt || '')).filter(Boolean))].join(' · ')
      if (label && value && label.length <= 40 && !infobox.facts.some(fact => fact.label === label)) infobox.facts.push({ label, value: value.length > 160 ? `${value.slice(0, 157)}…` : value })
    }
    for (const item of findAll(el => /(?:^|\s)pi-data(?:\s|$)/.test(classOf(el)), [box])) {
      addFact(findOne(el => /pi-data-label/.test(classOf(el)), [item]), findOne(el => /pi-data-value/.test(classOf(el)), [item]))
    }
    for (const table of findAll(el => el.name === 'table' && /pi-horizontal-group/.test(classOf(el)), [box])) {
      const labels = findAll(el => el.name === 'th' && /pi-data-label/.test(classOf(el)), [table])
      const values = findAll(el => el.name === 'td' && /pi-data-value/.test(classOf(el)), [table])
      if (labels.length) labels.forEach((label, i) => addFact(label, values[i]))
      else {
        // label-less groups put the label in bold inside the cell, e.g. <td><b>Start</b>13 May…</td>
        for (const cell of values) {
          const inner = findOne(el => el.name === 'b' || el.name === 'center', [cell])
          if (!inner) continue
          const label = new Element('span', {}, [new Text(tidy(textContent(inner)))])
          removeElement(inner)
          addFact(label, cell)
        }
      }
    }
    infobox.facts = infobox.facts.slice(0, 24)
  }
  for (const el of all) {
    if ((el.name === 'aside' && /portable-infobox/.test(classOf(el))) || NOISE.test(classOf(el)) || el.attribs?.id === 'toc') removeElement(el)
  }
  // Drop housekeeping sections: everything from a matching <h2> up to the next <h2>.
  const dropped = new Set<string>()
  const body = all.find(el => /mw-parser-output/.test(classOf(el)))
  if (body) {
    let dropping = false
    for (const node of [...body.children]) {
      if ((node as Element).name === 'h2') {
        const heading = tidy(textContent(node))
        dropping = DROPPED_SECTIONS.test(heading)
        if (dropping) dropped.add(heading)
      }
      if (dropping) removeElement(node)
    }
  }
  return { html: render(document), infobox, dropped }
}

// Keep readable game data, tables and artwork; discard scripts, forms, tracking,
// wiki navigation, external embeds and styling from the source document.
export function cleanWikiArticle(html: string, game: string, host: string) {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'div', 'span', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'b', 'strong', 'i', 'em', 'small', 'sup', 'sub', 'br', 'hr', 'blockquote', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'a', 'img', 'figure', 'figcaption', 'details', 'summary'],
    allowedAttributes: { '*': ['id'], a: ['href', 'title'], img: ['src', 'alt', 'width', 'height', 'loading', 'decoding', 'referrerpolicy'], td: ['colspan', 'rowspan'], th: ['colspan', 'rowspan', 'scope'], details: ['open'] },
    allowedSchemes: ['https'], allowProtocolRelative: false,
    transformTags: {
      a: (_tag, attrs) => {
        try {
          if (attrs.href?.startsWith('#')) return { tagName: 'a', attribs: { href: attrs.href } }
          const url = new URL(attrs.href || '', `https://${host}`)
          if (url.hostname === host && url.pathname.startsWith('/wiki/')) {
            const title = decodeURIComponent(url.pathname.slice(6)).replaceAll('_', ' ')
            if (!/^(File|Category|Special|Template|User|Talk|Help|Forum|MediaWiki):/i.test(title)) return { tagName: 'a', attribs: { href: `/guides/database?game=${encodeURIComponent(game)}&title=${encodeURIComponent(title)}${url.hash}`, title } }
          }
        } catch { /* An invalid source URL becomes plain text. */ }
        return { tagName: 'span', attribs: {} }
      },
      img: (_tag, attrs) => {
        const src = attrs['data-src'] || attrs.src
        try {
          const url = new URL(src || '', `https://${host}`)
          if (url.protocol !== 'https:' || !['static.wikia.nocookie.net', 'images.wikia.com', host].some(domain => url.hostname === domain) || /\.svg(?:\/|$)/i.test(url.pathname)) return { tagName: 'span', attribs: {} }
          // Request the source CDN's thumbnail rather than full-resolution artwork.
          const thumbnail = url.href.replace(/\/scale-to-width-down\/\d+/, '/scale-to-width-down/720')
          return { tagName: 'img', attribs: { src: thumbnail, alt: attrs.alt || '', loading: 'lazy', decoding: 'async', referrerpolicy: 'no-referrer', ...(Number(attrs.width) > 0 ? { width: String(Math.min(Number(attrs.width), 720)) } : {}) } }
        } catch { return { tagName: 'span', attribs: {} } }
      },
    },
    exclusiveFilter: frame => /(?:^|\s)(?:navbox|mw-editsection|toc|noprint|portable-infobox__advertisement|article-interlang|wds-dropdown|sister-wiki|catlinks)(?:\s|$)/.test(frame.attribs.class || ''),
    // Excluded containers are removed with their children, not unwrapped.
    nonTextTags: ['script', 'style', 'textarea', 'option', 'noscript', 'iframe', 'form', 'svg'],
  })
}

// Where a source does not grant compatible article reuse, expose game facts in
// an original reference layout instead of republishing its narrative prose.
export function extractGameFacts(html: string, title: string) {
  const escape = (text: string) => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)
  const plain = (text: string) => sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, ' ').trim()
  const rows: { label: string; value: string }[] = []
  for (const match of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...match[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map(cell => plain(cell[1]))
    if (cells.length >= 2 && cells[0].length <= 50 && /^(?:rank|type|rarity|weapon|damage|element|hp|atk|attack|def|defense|sp|crit|level|version|release|birthday|height|weight|obtained|obtain|cost|duration|start|end|name|attribute|affiliation)/i.test(cells[0])) {
      const value = cells.slice(1).filter(value => value && value.length <= 90).join(' · ')
      if (value && value.length <= 180) rows.push({ label: cells[0], value })
    }
    if (rows.length >= 35) break
  }
  const skills: { name: string; slot: string; values: string[]; effects: string[] }[] = []
  const document = parseDocument(html)
  const slots = new Set(['leader', 'passive', 'evasion', 'basic', 'ultimate', 'special', 'weapon'])
  const effectTerms = ['Physical DMG', 'Fire DMG', 'Ice DMG', 'Lightning DMG', 'Stun', 'Paralyze', 'Freeze', 'Bleed', 'Ignite', 'Time Fracture', 'Burst mode', 'Shield', 'Crit DMG', 'Attack Speed', 'SP recovery', 'QTE']
  function visit(node: AnyNode) {
    const element = node as Element
    const slot = element.attribs?.['data-source']
    if (slot && slots.has(slot)) {
      const text = textContent(node).replace(/\s+/g, ' ').trim()
      let name = ''
      function firstBold(child: AnyNode) { const el = child as Element; if (!name && el.name === 'b') name = textContent(child).trim(); if ('children' in child) child.children.forEach(firstBold) }
      firstBold(node)
      const values = [...new Set(text.match(/\b\d+(?:\.\d+)?\s*(?:%\s*(?:ATK|Physical DMG|Fire DMG|Ice DMG|Lightning DMG|Crit DMG|Max HP)|SP|seconds?|s)\b/gi) || [])].slice(0, 18)
      skills.push({ name: name.slice(0, 100) || slot, slot, values, effects: effectTerms.filter(term => text.toLowerCase().includes(term.toLowerCase())) })
      return
    }
    if ('children' in node) node.children.forEach(visit)
  }
  visit(document)
  let result = `<h2 id="overview">Gameplay reference</h2><p>This reference collects structured information for ${escape(title)}. Combat values can change with skill level, battlesuit rank and active effects; they should be read within those conditions.</p>`
  const portrait = html.match(/<img[^>]+(?:data-src|src)="(https:\/\/static\.wikia\.nocookie\.net\/[^"<>]+)"[^>]*>/i)?.[1]
  if (portrait) result += `<figure><img src="${escape(portrait)}" alt="${escape(title)} game artwork" loading="lazy" referrerpolicy="no-referrer" /></figure>`
  if (rows.length) result += '<h2 id="facts">Stats &amp; properties</h2><table><tbody>' + rows.map(row => `<tr><th>${escape(row.label)}</th><td>${escape(row.value)}</td></tr>`).join('') + '</tbody></table>'
  if (skills.length) {
    result += '<h2 id="skills">Skill reference</h2><p>Use each action’s role to plan a rotation: basic attacks form its repeatable sequence, evasion handles incoming attacks, and the Ultimate provides a separate combat action. Passive and leader effects depend on their activation conditions.</p>'
    for (const skill of skills) result += `<h3>${escape(skill.name)}</h3><p><strong>Action:</strong> ${escape(skill.slot)}</p>${skill.effects.length ? `<p><strong>Mechanics recorded:</strong> ${skill.effects.map(escape).join(' · ')}</p>` : ''}${skill.values.length ? `<p><strong>Values in this skill record:</strong> ${skill.values.map(escape).join(' · ')}</p><p>Multiple values may describe different upgrades or components of the skill, rather than one baseline level.</p>` : ''}`
  }
  if (!rows.length && !skills.length) result += '<p>This entry does not yet have a detailed KeroSpace gameplay write-up. Search related equipment or character entries for additional structured information.</p>'
  return result
}
