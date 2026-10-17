export type Game = {
  id: string
  name: string
  dev: string
  year: number | string
  genre: string
  desc: string
  items: string
  platforms: string
}

export const games: Game[] = [
  {
    id: 'hsr',
    name: 'Honkai: Star Rail',
    dev: 'HoYoverse',
    year: 2023,
    genre: 'Turn-based RPG',
    desc: 'Ride the Astral Express across the stars in a story-rich, turn-based space fantasy.',
    items: 'Light Cones · Relics',
    platforms: 'PC · PS5 · Mobile',
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    dev: 'HoYoverse',
    year: 2020,
    genre: 'Open-world RPG',
    desc: 'Explore Teyvat, master seven elements and team up four heroes in real-time combat.',
    items: 'Weapons · Artifacts',
    platforms: 'PC · PS5 · Xbox · Mobile',
  },
  {
    id: 'hi3',
    name: 'Honkai Impact 3rd',
    dev: 'HoYoverse',
    year: 2016,
    genre: 'Action RPG',
    desc: 'Fast, stylish 3D combat as Valkyries battle the Honkai to protect the world.',
    items: 'Weapons · Stigmata',
    platforms: 'PC · Mobile',
  },
  {
    id: 'wuwa',
    name: 'Wuthering Waves',
    dev: 'Kuro Games',
    year: 2024,
    genre: 'Open-world RPG',
    desc: 'Wake as the Rover in a post-apocalyptic world built on fluid, parry-driven combat.',
    items: 'Weapons · Echoes',
    platforms: 'PC · PS5 · Mobile',
  },
  {
    id: 'nte',
    name: 'Neverness to Everness',
    dev: 'Hotta Studio',
    year: 2026,
    genre: 'Urban open-world RPG',
    desc: 'Explore Hethereau as an Anomaly Hunter, uncover supernatural mysteries and shape your own life in the city.',
    items: 'Arcs · Cartridges',
    platforms: 'PC · Mac · PS5 · Mobile',
  },
  {
    id: 'mlbb',
    name: 'Mobile Legends: Bang Bang',
    dev: 'MOONTON Games',
    year: 2016,
    genre: '5v5 MOBA',
    desc: 'Choose your hero, team up in fast-paced 5v5 battles and turn smart builds into match-winning plays.',
    items: 'Equipment · Emblems',
    platforms: 'iOS · Android',
  },
]
