// Community pulse: what each game's players are discussing most.
// SAMPLE DATA for the layout preview: names are real, but every count and
// percentage below is a placeholder. Replace with figures from your own tracking
// (e.g. Reddit, HoYoLAB, YouTube comments) before publishing.

export type PulseSentiment = { loved: number; mixed: number; critical: number }
export type PulseCharacter = {
  name: string
  tag: string
  comments: number
  sentiment: PulseSentiment
  /** official HD character art, e.g. /images/characters/hsr/firefly.webp */
  art?: string
  artPosition?: string
}
export type PulseItem = { name: string; type: string; comments: number }
export type PulseFeedback = { topic: string; tone: 'praised' | 'mixed' | 'criticised'; summary: string }
export type PulseGame = {
  id: string
  name: string
  short: string
  art: string
  artPosition?: string
  characters: PulseCharacter[]
  items: PulseItem[]
  feedback: PulseFeedback[]
  verdict: PulseSentiment & { praise: string; complaint: string }
}

export const pulsePeriod = 'Sample data for preview'

export const pulseGames: PulseGame[] = [
  {
    id: 'hsr', name: 'Honkai: Star Rail', short: 'Star Rail', art: '/images/games/card-hsr.webp', artPosition: 'center 22%',
    characters: [
      { name: 'Firefly', tag: 'Destruction', art: '/images/games/card-hsr.webp', artPosition: 'center 22%', comments: 48200, sentiment: { loved: 71, mixed: 20, critical: 9 } },
      { name: 'Acheron', tag: 'Nihility', comments: 39600, sentiment: { loved: 64, mixed: 26, critical: 10 } },
      { name: 'Castorice', tag: 'Remembrance', comments: 31100, sentiment: { loved: 60, mixed: 28, critical: 12 } },
      { name: 'Kafka', tag: 'Nihility', comments: 24800, sentiment: { loved: 66, mixed: 24, critical: 10 } },
      { name: 'Sparkle', tag: 'Harmony', comments: 19300, sentiment: { loved: 58, mixed: 30, critical: 12 } },
    ],
    items: [
      { name: 'Genius of Brilliant Stars', type: 'Relic set', comments: 12400 },
      { name: 'Messenger Traversing Hackerspace', type: 'Relic set', comments: 9800 },
      { name: 'Earthly Escapade', type: 'Light Cone', comments: 7600 },
      { name: 'Time Waits for No One', type: 'Light Cone', comments: 5200 },
    ],
    feedback: [
      { topic: 'Story pacing', tone: 'praised', summary: 'Recent chapters land well with long-time players.' },
      { topic: 'Relic farming', tone: 'criticised', summary: 'Sub-stat luck still feels punishing.' },
      { topic: 'Endgame modes', tone: 'mixed', summary: 'Fun, but the power creep is noticeable.' },
    ],
    verdict: { loved: 62, mixed: 26, critical: 12, praise: 'Story and characters', complaint: 'Relic grind' },
  },
  {
    id: 'genshin', name: 'Genshin Impact', short: 'Genshin', art: '/images/games/card-genshin.webp',
    characters: [
      { name: 'Furina', tag: 'Hydro', comments: 52700, sentiment: { loved: 74, mixed: 18, critical: 8 } },
      { name: 'Mavuika', tag: 'Pyro', comments: 41900, sentiment: { loved: 63, mixed: 25, critical: 12 } },
      { name: 'Neuvillette', tag: 'Hydro', comments: 33500, sentiment: { loved: 61, mixed: 27, critical: 12 } },
      { name: 'Nahida', tag: 'Dendro', comments: 27400, sentiment: { loved: 72, mixed: 21, critical: 7 } },
      { name: 'Raiden Shogun', tag: 'Electro', comments: 21600, sentiment: { loved: 65, mixed: 25, critical: 10 } },
    ],
    items: [
      { name: 'Emblem of Severed Fate', type: 'Artifact set', comments: 11200 },
      { name: 'Staff of Homa', type: 'Polearm', comments: 8900 },
      { name: 'Mistsplitter Reforged', type: 'Sword', comments: 7100 },
      { name: 'Favonius Sword', type: 'Sword', comments: 5400 },
    ],
    feedback: [
      { topic: 'Exploration', tone: 'praised', summary: 'New regions keep setting the bar.' },
      { topic: 'Co-op rewards', tone: 'mixed', summary: 'Fun with friends, light on loot.' },
      { topic: 'Artifact RNG', tone: 'criticised', summary: 'Still the most common complaint.' },
    ],
    verdict: { loved: 64, mixed: 24, critical: 12, praise: 'World and exploration', complaint: 'Artifact RNG' },
  },
  {
    id: 'hi3', name: 'Honkai Impact 3rd', short: 'Honkai Impact', art: '/images/games/card-hi3.webp',
    characters: [
      { name: 'Elysia', tag: 'Fan favourite', comments: 14800, sentiment: { loved: 78, mixed: 16, critical: 6 } },
      { name: 'Kiana Kaslana', tag: 'Main cast', comments: 12100, sentiment: { loved: 69, mixed: 22, critical: 9 } },
      { name: 'Raiden Mei', tag: 'Main cast', comments: 9600, sentiment: { loved: 70, mixed: 21, critical: 9 } },
      { name: 'Bronya Zaychik', tag: 'Main cast', comments: 8200, sentiment: { loved: 67, mixed: 23, critical: 10 } },
      { name: 'Fu Hua', tag: 'Main cast', comments: 6900, sentiment: { loved: 72, mixed: 20, critical: 8 } },
    ],
    items: [
      { name: 'Stigmata sets', type: 'Gear', comments: 4100 },
      { name: 'Signature weapons', type: 'Weapon', comments: 3600 },
      { name: 'Elf companions', type: 'Support', comments: 2400 },
      { name: 'Divine Keys', type: 'Weapon', comments: 1900 },
    ],
    feedback: [
      { topic: 'Combat feel', tone: 'praised', summary: 'Still the sharpest action in the lineup.' },
      { topic: 'New player onboarding', tone: 'criticised', summary: 'Years of systems are hard to learn.' },
      { topic: 'Event cadence', tone: 'mixed', summary: 'Steady, but fewer big story beats.' },
    ],
    verdict: { loved: 58, mixed: 27, critical: 15, praise: 'Combat', complaint: 'Onboarding' },
  },
  {
    id: 'wuwa', name: 'Wuthering Waves', short: 'Wuthering Waves', art: '/images/games/card-wuwa.webp',
    characters: [
      { name: 'Camellya', tag: 'Havoc', comments: 36400, sentiment: { loved: 68, mixed: 22, critical: 10 } },
      { name: 'Changli', tag: 'Fusion', comments: 29800, sentiment: { loved: 70, mixed: 21, critical: 9 } },
      { name: 'Jinhsi', tag: 'Spectro', comments: 25100, sentiment: { loved: 66, mixed: 23, critical: 11 } },
      { name: 'Carlotta', tag: 'Glacio', comments: 21700, sentiment: { loved: 62, mixed: 27, critical: 11 } },
      { name: 'Phoebe', tag: 'Spectro', comments: 16200, sentiment: { loved: 64, mixed: 26, critical: 10 } },
    ],
    items: [
      { name: 'Inferno Rider', type: 'Echo', comments: 9400 },
      { name: 'Crownless', type: 'Echo', comments: 7300 },
      { name: 'Stringmaster', type: 'Rectifier', comments: 6100 },
      { name: 'Emerald of Genesis', type: 'Sword', comments: 4800 },
    ],
    feedback: [
      { topic: 'Combat depth', tone: 'praised', summary: 'Parries and swaps feel great.' },
      { topic: 'PC performance', tone: 'mixed', summary: 'Better each patch, still uneven.' },
      { topic: 'Echo farming', tone: 'criticised', summary: 'Main-stat luck slows builds down.' },
    ],
    verdict: { loved: 61, mixed: 27, critical: 12, praise: 'Combat', complaint: 'Echo grind' },
  },
  {
    id: 'nte', name: 'Neverness to Everness', short: 'NTE', art: '/images/games/card-nte.webp',
    characters: [
      { name: 'Nanally', tag: 'Esper', comments: 18900, sentiment: { loved: 69, mixed: 22, critical: 9 } },
      { name: 'Main cast', tag: 'Story', comments: 14300, sentiment: { loved: 60, mixed: 29, critical: 11 } },
      { name: 'Anomaly bosses', tag: 'Encounters', comments: 11200, sentiment: { loved: 57, mixed: 30, critical: 13 } },
      { name: 'City residents', tag: 'Hethereau', comments: 8800, sentiment: { loved: 63, mixed: 27, critical: 10 } },
      { name: 'Rival espers', tag: 'Story', comments: 6100, sentiment: { loved: 55, mixed: 31, critical: 14 } },
    ],
    items: [
      { name: 'Vehicles', type: 'Driving', comments: 7800 },
      { name: 'Apartment décor', type: 'Housing', comments: 6400 },
      { name: 'Arcs', type: 'Gear', comments: 4900 },
      { name: 'Outfits', type: 'Cosmetic', comments: 3700 },
    ],
    feedback: [
      { topic: 'City life', tone: 'praised', summary: 'Driving and side activities stand out.' },
      { topic: 'Performance', tone: 'mixed', summary: 'Smooth on PC, heavier on phones.' },
      { topic: 'Map clutter', tone: 'criticised', summary: 'Too many icons in busy districts.' },
    ],
    verdict: { loved: 59, mixed: 29, critical: 12, praise: 'Open city', complaint: 'Mobile performance' },
  },
  {
    id: 'mlbb', name: 'Mobile Legends: Bang Bang', short: 'Mobile Legends', art: '/images/games/card-mlbb.webp',
    characters: [
      { name: 'Ling', tag: 'Assassin', comments: 44100, sentiment: { loved: 52, mixed: 28, critical: 20 } },
      { name: 'Fanny', tag: 'Assassin', comments: 39800, sentiment: { loved: 50, mixed: 27, critical: 23 } },
      { name: 'Gusion', tag: 'Assassin', comments: 31500, sentiment: { loved: 56, mixed: 27, critical: 17 } },
      { name: 'Vexana', tag: 'Mage', comments: 22300, sentiment: { loved: 61, mixed: 26, critical: 13 } },
      { name: 'Lancelot', tag: 'Assassin', comments: 20900, sentiment: { loved: 54, mixed: 29, critical: 17 } },
    ],
    items: [
      { name: 'Blade of Despair', type: 'Attack', comments: 10600 },
      { name: 'Winter Crown', type: 'Defense', comments: 8200 },
      { name: 'Immortality', type: 'Defense', comments: 6700 },
      { name: 'Wind of Nature', type: 'Attack', comments: 5100 },
    ],
    feedback: [
      { topic: 'Matchmaking', tone: 'criticised', summary: 'Rank gaps in solo queue frustrate players.' },
      { topic: 'Hero revamps', tone: 'praised', summary: 'Older heroes feel fresh again.' },
      { topic: 'Balance patches', tone: 'mixed', summary: 'Quick fixes, frequent meta swings.' },
    ],
    verdict: { loved: 49, mixed: 29, critical: 22, praise: 'Hero revamps', complaint: 'Matchmaking' },
  },
]
