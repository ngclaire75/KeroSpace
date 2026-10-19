export const catalogKinds = [
  { id: 'characters', label: 'Characters & heroes' },
  { id: 'skins', label: 'Skins & outfits' },
  { id: 'weapons', label: 'Weapons & equipment' },
  { id: 'bosses', label: 'Bosses & enemies' },
  { id: 'events', label: 'Events' },
  { id: 'banners', label: 'Banner events' },
  { id: 'skin-events', label: 'Skin events' },
  { id: 'story', label: 'Story & quests' },
  { id: 'items', label: 'Items & materials' },
] as const
export type CatalogKind = typeof catalogKinds[number]['id']
// Guide navigation is intentionally limited to characters and their builds.
export const catalogKindsFor = (_game: string) => [catalogKinds[0]]
export const catalogKindDescriptions: Record<CatalogKind, string> = {
  characters: 'Released characters and heroes, with recommended equipment and build priorities.',
  skins: 'Outfits and cosmetic looks, and how to get them.',
  weapons: 'Weapons and equipment: what completes a build.',
  bosses: 'Bosses and enemies, their mechanics and weak points.',
  events: 'Current and past events, with rewards and rules.',
  banners: 'Limited banners and featured pulls by version.',
  'skin-events': 'Limited skin events and what each one offers.',
  story: 'Story chapters and quests, in order.',
  items: 'Items and materials: where they come from and what they are for.',
}
type CatalogSource = { host: string; name: string; categories: Record<CatalogKind, string[]> }
export const gameCatalogs: Record<string, CatalogSource> = {
  hsr: { host: 'honkai-star-rail.fandom.com', name: 'Honkai: Star Rail Wiki', categories: { characters: ['Playable Characters'], skins: ['Outfits'], weapons: ['Light Cones', 'Relics'], bosses: ['Enemies'], events: ['Events'], banners: ['Character Event Warps', 'Light Cone Event Warps'], 'skin-events': ['Outfits'], story: ['Missions'], items: ['Items'] } },
  genshin: { host: 'genshin-impact.fandom.com', name: 'Genshin Impact Wiki', categories: { characters: ['Playable Characters'], skins: ['Outfits'], weapons: ['Weapons', 'Artifacts'], bosses: ['Enemies'], events: ['Events'], banners: ['Character Event Wishes', 'Weapon Event Wishes'], 'skin-events': ['Outfits'], story: ['Quests'], items: ['Items'] } },
  hi3: { host: 'honkaiimpact3.fandom.com', name: 'Honkai Impact 3 Wiki', categories: { characters: ['Battlesuits'], skins: ['Outfits'], weapons: ['Weapons', 'Stigmata'], bosses: ['Enemies'], events: ['Events'], banners: ['Supplies'], 'skin-events': ['Outfits'], story: ['Story Chapters'], items: ['Items'] } },
  wuwa: { host: 'wutheringwaves.fandom.com', name: 'Wuthering Waves Wiki', categories: { characters: ['Resonators'], skins: ['Outfits'], weapons: ['Weapons', 'Echoes'], bosses: ['Enemies'], events: ['Events'], banners: ['Featured Resonator Convenes', 'Featured Weapon Convenes'], 'skin-events': ['Outfits'], story: ['Quests'], items: ['Items'] } },
  nte: { host: 'neverness-to-everness.fandom.com', name: 'Neverness to Everness Wiki', categories: { characters: ['Playable Characters'], skins: ['Outfits'], weapons: ['Arcs', 'Cartridges'], bosses: ['Boss'], events: ['Event'], banners: ['Limited Boards'], 'skin-events': ['Outfits'], story: ['Quest'], items: ['Items'] } },
  mlbb: { host: 'mobile-legends.fandom.com', name: 'Mobile Legends Wiki', categories: { characters: ['Heroes'], skins: ['Hero skin', 'Skins', 'Skin series'], weapons: ['Equipment'], bosses: ['Common Creeps', 'Elite Creeps', 'Legend Creeps'], events: ['Events'], banners: ['Events'], 'skin-events': ['Events'], story: ['Lore Characters'], items: ['Equipment'] } },
}
export type CatalogEntry = { id: number; title: string; url: string; image?: string; imageLabel?: string }
