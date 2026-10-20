import type { CharacterBuildResponse } from '~/data/characterBuilds'

// KeroSpace keeps its own verified builds; a guide site's redesign must never reach the page.
// A freshly parsed build is accepted only if it has the shape KeroSpace's pages expect.
const REQUIRED_GROUPS: Record<string, string[]> = {
  hsr: ['Light cones', 'Relic sets'],
  genshin: ['Weapons', 'Artifact sets'],
  hi3: ['Weapon'],
  wuwa: ['Weapons', 'Echo sets'],
  nte: ['Arcs', 'Cartridge sets'],
  mlbb: ['Equipment · purchase order'],
}
// Table headings, damage figures, rotation notes and teammate prose are not equipment.
const JUNK_NAME = /^(?:Sets?|Artifacts?(?: Sets?)?|Weapons?|Notes?|Light Cones?|Relics?|Echo(?:es)?|Items?|Name|Situation|Character|Role)$|\((?:R[1-5]:|[345]\s*[*★]\))|\b(?:Sample Rotation|Role:|Ranking:|Explanation)\b/i

/** Why a parsed build can't be used, or undefined when it is sound. */
export function buildProblem(game: string, result: CharacterBuildResponse): string | undefined {
  if (result.status !== 'available') return undefined // nothing to show either way
  const build = result.builds[0]
  if (!build) return 'no build'
  for (const label of REQUIRED_GROUPS[game] || []) {
    if (!build.groups.some(group => group.label === label && group.items.length)) return `missing ${label}`
  }
  for (const group of build.groups) {
    if (group.items.length > 30) return `${group.label}: ${group.items.length} items`
    const junk = group.items.find(item => !item.name || item.name.length > 110 || JUNK_NAME.test(item.name) || (group.label !== 'Artifact sets' && /%/.test(item.name)))
    if (junk) return `${group.label}: "${junk.name.slice(0, 60)}"`
  }
  return undefined
}

/** A live build that is sound on its own can still be a partial parse: compare it with the saved one. */
export function liveProblem(game: string, live: CharacterBuildResponse, saved?: CharacterBuildResponse): string | undefined {
  const problem = buildProblem(game, live)
  if (problem || !saved?.builds[0] || live.status !== 'available') return problem
  const labels = new Set(live.builds[0].groups.map(group => group.label))
  const lost = saved.builds[0].groups.find(group => !labels.has(group.label))
  if (lost) return `lost ${lost.label}`
  const count = (build: CharacterBuildResponse) => build.builds[0].groups.reduce((total, group) => total + group.items.length, 0)
  if (count(live) < count(saved) * 0.6) return `shrank from ${count(saved)} to ${count(live)} items`
  return undefined
}
