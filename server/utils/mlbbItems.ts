import type { CharacterBuildResponse } from '~/data/characterBuilds'
import saved from '~/data/mlbbCurrentItems.json'
import { normalizedName } from './buildParsers'

// Moonton's official hero recommendations predate later item reworks: roaming and jungle
// enchants moved off boots into Blessings, and several items were removed or renamed. Builds are
// checked against the current shop list (Liquipedia, CC BY-SA; refreshed daily, with the saved
// list as a fallback) so a page never recommends an item that can't be bought.
const RENAMED: Record<string, string> = { haasclaws: "Haas's Claws" }

const currentItems = defineCachedFunction(async () => {
  const result = await $fetch<{ parse?: { text?: { '*': string } } }>('https://liquipedia.net/mobilelegends/api.php', {
    query: { action: 'parse', page: 'Portal:Equipment', prop: 'text', format: 'json' },
    headers: { 'User-Agent': 'KeroSpace/1.0 (https://kerospace.vercel.app; game guide site)', 'Accept-Encoding': 'gzip' }, timeout: 12000, retry: 1,
  })
  const html = (result.parse?.text?.['*'] || '').replace(/&#39;/g, "'")
  const names = [...new Set([...html.matchAll(/<a href="\/mobilelegends\/[^"]+" title="([^"]+)"/g)].map(match => match[1]).filter(name => !name.includes(':') && !/^Patch /.test(name)))]
  // A short or empty list means the page changed shape: keep the saved one.
  if (names.length < saved.items.length * 0.8) throw new Error('Equipment list incomplete')
  return names
}, { name: 'mlbb-current-items-v1', maxAge: 86400, swr: true })

export async function withCurrentMlbbItems(result: CharacterBuildResponse): Promise<CharacterBuildResponse> {
  if (result.game !== 'mlbb' || !result.builds.length) return result
  const names = await currentItems().catch(() => saved.items)
  const current = new Map(names.map(name => [normalizedName(name), name]))
  const resolve = (name: string) => {
    const plain = normalizedName(name)
    if (current.has(plain)) return current.get(plain)
    if (RENAMED[plain]) return RENAMED[plain]
    // "Ice Hunter's Magic Boots", "Warrior Boots - Conceal": the boots, with a removed enchant
    const boots = name.replace(/^(?:Ice|Flame|Bloody) Hunter['’]s\s+/i, '').replace(/\s*-\s*(?:Conceal|Encourage|Favor|Dire Hit|Blessing)$/i, '')
    return current.get(normalizedName(boots))
  }
  let removed = 0
  const builds = result.builds.map(build => ({
    ...build,
    groups: build.groups.map(group => ({
      ...group,
      items: group.items.flatMap(item => {
        const name = resolve(item.name)
        if (!name) { removed++; return [] }
        return [{ ...item, name }]
      }),
    })).filter(group => group.items.length),
    note: `Moonton's official recommendation for this hero. It may not reflect the current season's meta${removed ? `; ${removed} item${removed === 1 ? ' no longer in the game was' : 's no longer in the game were'} left out` : ''}.`,
  }))
  return { ...result, builds }
}
