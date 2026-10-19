// Run with: node --experimental-strip-types scripts/check-team-synergy.mjs
import assert from 'node:assert/strict'
import { parsePrydwenTeams, parseKqmTeams, parseHonkaiTeams, parseMobileLegendsTeams } from '../server/utils/teamParsers.ts'
import { teamSynergy } from '../data/teamSynergy.ts'
const character = (game, name) => `<a href="/${game}/characters/${name.toLowerCase()}"><img data-src="/static/${name}.webp" alt="${name}"></a>`
for (const [game, path, members] of [['nte', 'neverness-to-everness', ['Nanally', 'Zero', 'Jiuyuan', 'Hotori']], ['wuwa', 'wuthering-waves', ['Jiyan', 'Mortefi', 'Verina']]]) {
  const html = `<div class="team-header">Example</div><div class="team-row">${members.map(name => `<div class="column">${character(path, name)}</div>`).join('')}</div>`
  const [team] = parsePrydwenTeams(html, members[0])
  assert.equal(team.slots.length, members.length, game)
  assert.equal(team.kind, 'team')
  assert.deepEqual(parsePrydwenTeams(html, 'Unrelated'), [])
}
const observed = `<div class="team-container-moc"><div class="team-row"><div class="column info">Rank</div><div class="column characters">${['Acheron', 'Pela', 'Jiaoqiu', 'Gallagher'].map(name => character('star-rail', name)).join('')}</div></div></div>`
assert.equal(parsePrydwenTeams(observed, 'Acheron')[0].kind, 'observed')
assert.equal(parsePrydwenTeams(observed, 'Acheron')[0].slots.length, 4)
const genshin = '<h2>Reverse Vaporize</h2><h3>Example Teams</h3><figure><figcaption>Arlecchino — Yelan / Xingqiu — Bennett — C6 Candace</figcaption></figure><p>Unrelated weapons and review</p>'
assert.equal(parseKqmTeams(genshin, 'Arlecchino')[0].slots[1].options.length, 2)
assert.equal(parseKqmTeams(genshin, 'Arlecchino')[0].slots[3].options[0].name, 'C6 Candace')
assert.deepEqual(parseKqmTeams(genshin, 'Albedo'), [])
assert.equal(parseKqmTeams(genshin, 'Arlecchino')[0].name, 'Arlecchino · Reverse Vaporize')
const placeholder = '<h2>Team Compositions</h2><figure><figcaption>Albedo — On-Field DPS / Flex — Hexerei / Flex — Geo / Flex</figcaption></figure>'
assert.deepEqual(parseKqmTeams(placeholder, 'Albedo'), [])
const roleHeading = '<h2>Off-Field Flex</h2><h3>Example Teams</h3><figure><figcaption>Albedo — Navia — Fischl — Bennett</figcaption></figure>'
assert.equal(parseKqmTeams(roleHeading, 'Albedo')[0].name, 'Albedo / Navia / Fischl / Bennett')
const honkai = '<p>With Herrscher of Finality and Herrscher of Origin on the same team, Ultimate changes.</p><a title="Herrscher of Finality"></a><a title="Herrscher of Origin"></a>'
assert.equal(parseHonkaiTeams(honkai, 'Herrscher of Truth')[0].slots.length, 3)
assert.deepEqual(parseHonkaiTeams('<nav><a title="Herrscher of Finality">Herrscher of Finality</a></nav>', 'White Comet'), [])
assert.equal(parseMobileLegendsTeams({ name: 'Zilong', counters: { best: { name: 'Eudora' } } }, 'Zilong')[0].kind, 'partner')
assert.deepEqual(parseMobileLegendsTeams({ name: 'Zilong', counters: { best: { name: 'Eudora' } } }, 'Layla'), [])
assert.deepEqual(Object.keys(teamSynergy).sort(), ['genshin', 'hi3', 'hsr', 'mlbb', 'nte', 'wuwa'])
console.log('Team synergy checks passed for all six games.')
