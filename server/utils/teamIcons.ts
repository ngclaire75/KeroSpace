import { parseDocument } from 'htmlparser2'
import { findAll, findOne } from 'domutils'
import { catalogImageCandidates } from '~/utils/catalogImages'

export type TeamTypeIcon = { label: string; image: string }
const fields: Record<string, string> = { genshin: 'element', hsr: 'combatType', wuwa: 'attribute', nte: 'espertype', mlbb: 'role' }

export function parseTeamTypeIcons(game: string, html: string): TeamTypeIcon[] {
  const doc = parseDocument(html)
  const roots = fields[game] ? findAll(el => el.attribs['data-source'] === fields[game], doc.children) : []
  const images = game === 'hi3'
    ? findAll(el => el.name === 'img' && /^(?:Physical|Fire|Ice|Lightning) DMG \(Icon\)$/i.test(el.attribs.alt || ''), doc.children)
    : roots.flatMap(root => {
      const value = findOne(el => (el.attribs.class || '').split(/\s+/).includes('pi-data-value'), [root])
      return value ? findAll(el => el.name === 'img', [value]) : []
    })
  const icons: TeamTypeIcon[] = []
  for (const image of images) {
    const source = image.attribs['data-src'] || image.attribs.src
    const candidates = catalogImageCandidates(source)
    if (!candidates.length) continue
    const label = (image.attribs.alt || '').replace(/^(?:Element|Type)\s+|\s+(?:Icon|\(Icon\))$/g, '').trim()
    if (!label || icons.some(icon => icon.label === label)) continue
    icons.push({ label, image: candidates[candidates.length - 1] })
  }
  // A hero may have two roles. Element infoboxes can also list alternate forms;
  // use the current form's first element instead of mixing them on one card.
  return game === 'mlbb' ? icons.slice(0, 2) : icons.slice(0, 1)
}
