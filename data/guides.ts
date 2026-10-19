import { games } from './games'

export const guideGames = games.map(game => ({
  ...game,
  short: ({ hsr: 'Star Rail', genshin: 'Genshin', hi3: 'Honkai 3rd', wuwa: 'WuWa', nte: 'NTE', mlbb: 'MLBB' } as Record<string, string>)[game.id],
  image: `/images/community/discord/${game.id}-banner.webp`,
  banner: game.id === 'nte' ? '/images/guide-hubs/nte-esrgan-2x.webp' : `/images/guide-hubs/${game.id}.webp`,
  artSource: `https://discord.com/invite/${({ hsr: 'honkaistarrail', genshin: 'genshinimpact', hi3: 'hi3', wuwa: 'wutheringwaves', nte: 'nte', mlbb: 'mobilelegendsbangbang' } as Record<string, string>)[game.id]}`,
}))
export type Guide = {
  slug: string; game: string; title: string; category: 'Getting started' | 'Combat & teams' | 'Equipment'
  description: string; takeaway: string; sections: { title: string; text: string }[]
  sources: { label: string; url: string }[]
}
const source = (label: string, url: string) => ({ label, url })
const section = (title: string, text: string) => ({ title, text })
export const guides: Guide[] = [
  {
    slug: 'star-rail-first-steps', game: 'hsr', category: 'Getting started', title: 'Your first stops on the Astral Express',
    description: 'Story unlocks, side missions and a focused route through the early game.',
    takeaway: 'Follow Trailblaze Missions first, then use side activities when progression pauses.',
    sections: [section('Start with the story', 'Trailblaze Missions advance the main story and unlock important systems. Keep following them after the opening tutorial instead of trying to clear every chest immediately.'), section('When your level blocks a mission', 'Use Adventure and Companion Missions to earn experience while exploring. Return to the main quest when you meet its requirements.'), section('Build a manageable routine', 'Check the systems unlocked by your current story progress. Spend your available Trailblaze Power on upgrades you can use, and develop a small core team before spreading resources across the roster.')],
    sources: [source('Prydwen · Early progression', 'https://www.prydwen.gg/star-rail/guides/early-progression')],
  },
  {
    slug: 'star-rail-combat', game: 'hsr', category: 'Combat & teams', title: 'Take control of the turn order',
    description: 'Understand Speed, shared Skill Points and when to use an Ultimate.',
    takeaway: 'Think about the whole team’s next turn before spending a Skill Point.',
    sections: [section('Read the action queue', 'Speed helps determine how often units act. Watch the turn order so you can respond before an enemy attack or prepare a damage window.'), section('Share your resources', 'Basic Attacks generally restore Skill Points and Skills generally spend them; individual kits can change these rules. Plan support actions around the resources your damage dealer needs.'), section('Use Ultimates deliberately', 'An Ultimate can be activated once its Energy requirement is met, outside the character’s normal turn. Use that timing for healing, buffs or damage when the effect matters most.')],
    sources: [source('Prydwen · Combat and exploration', 'https://www.prydwen.gg/star-rail/guides/combat-and-exploration')],
  },
  {
    slug: 'star-rail-relic-stats', game: 'hsr', category: 'Equipment', title: 'Read a relic before you level it',
    description: 'Main stats, substats and what actually changes when you enhance a relic.',
    takeaway: 'Choose stats for the character’s kit before chasing a set bonus.',
    sections: [section('Know the slots', 'Each relic has one main stat. Head and Hands have fixed main-stat types; Body, Feet, Planar Sphere and Link Rope have variable options.'), section('Inspect the substats', 'A relic can have up to four substats. A substat cannot duplicate the main stat or another substat on the same piece. Flat ATK and ATK percentage are different stats.'), section('Upgrade with a purpose', 'Enhancement can reveal a new substat or increase an existing one, depending on how many the piece already has. Check a character-specific guide before committing resources to a particular stat combination.')],
    sources: [source('Prydwen · Relic stats', 'https://www.prydwen.gg/star-rail/guides/relic-stats')],
  },
  {
    slug: 'genshin-first-steps', game: 'genshin', category: 'Getting started', title: 'A better start in Teyvat',
    description: 'Build an early team without getting lost in endgame optimization.',
    takeaway: 'Useful main stats and character upgrades matter more than an early perfect build.',
    sections: [section('Learn a small team', 'Use early exploration and quests to learn how your characters’ abilities interact. Concentrate upgrades on the characters you actually play.'), section('Use what you find', 'Boss rewards and exploration provide usable early artifacts. Level pieces with relevant main stats; you do not need an optimized five-star set to progress through the early game.'), section('Save detailed optimization for later', 'Reliable five-star artifact farming becomes available at Adventure Rank 45. Before then, focus on character, weapon and useful Talent upgrades alongside story progress.')],
    sources: [source('KQM · Newbie guide', 'https://keqingmains.com/misc/newbie-guide/')],
  },
  {
    slug: 'genshin-energy', game: 'genshin', category: 'Combat & teams', title: 'Keep your Elemental Bursts ready',
    description: 'Particles, Energy Recharge and why one ER target does not fit every team.',
    takeaway: 'Test Energy needs in your real team and rotation.',
    sections: [section('Understand Energy sources', 'Elemental Particles and Orbs restore Energy. Characters receive more from particles matching their own element, and an on-field character receives more than an off-field one.'), section('Know what ER affects', 'Energy Recharge increases Energy gained from particles and orbs. It does not multiply every source of direct, flat Energy restoration.'), section('Build around the rotation', 'A character’s needs depend on teammates, particle generation and how often their Burst is used. Follow a team-specific recommendation and test it against the encounters you play.')],
    sources: [source('KQM Theorycrafting Library · Energy', 'https://library.keqingmains.com/combat-mechanics/energy')],
  },
  {
    slug: 'genshin-artifacts', game: 'genshin', category: 'Equipment', title: 'Artifacts that serve your team',
    description: 'Match scaling, meet Energy requirements and spend Resin more deliberately.',
    takeaway: 'Meet necessary Energy Recharge before optimizing damage substats.',
    sections: [section('Read the character’s scaling', 'The right stats depend on the abilities you use. ATK, HP, DEF and Elemental Mastery can all matter for different characters; CRIT is not a universal first priority.'), section('Make the rotation work', 'For a character whose Burst is central to the team, enough Energy Recharge to cast it consistently comes before extra damage stats.'), section('Choose an efficient farm', 'Start serious artifact farming after Adventure Rank 45. Evaluate useful main stats, substats and team set effects together, using a character guide for exact recommendations.')],
    sources: [source('KQM · Artifacts guide', 'https://keqingmains.com/misc/artifacts/')],
  },
  {
    slug: 'honkai-battlesuit-basics', game: 'hi3', category: 'Getting started', title: 'Learn the battlesuit, then the rotation',
    description: 'A practical way to approach Honkai’s character-specific combat.',
    takeaway: 'Two battlesuits belonging to the same character can play very differently.',
    sections: [section('Start with the moveset', 'Read the selected battlesuit’s Skill descriptions and practice its attacks, evasions and weapon actions. A character name alone does not describe a battlesuit’s mechanics.'), section('Check the entry conditions', 'Some battlesuits gain special effects when entering through a QTE. Learn the actual trigger and follow-up instead of treating every swap as interchangeable.'), section('Use a matching demonstration', 'The official Lone Planetfarer introduction, for example, explains a QTE that automatically casts a Special Weapon Skill. Use demonstrations for your chosen battlesuit to learn its own sequence.')],
    sources: [source('HoYoverse · Lone Planetfarer introduction', 'https://honkaiimpact3.hoyoverse.com/global/en-us/news/126166')],
  },
  {
    slug: 'honkai-team-synergy', game: 'hi3', category: 'Combat & teams', title: 'Build around shared combat effects',
    description: 'Read team buffs and Astral Ring conditions before combining battlesuits.',
    takeaway: 'Check who receives a buff and what activates it.',
    sections: [section('Read the conditions', 'Team effects can require a particular battlesuit, a particular Astral Ring specialization, or an action such as a QTE or weapon hit. Treat those conditions as part of the build.'), section('Align the damage window', 'Practice activating support effects before the attacks they are meant to strengthen. A strong effect does little if its conditions are not met during the main damage sequence.'), section('Keep recommendations specific', 'The official Peregrine Sword equipment introduction illustrates how bonuses can depend on the wielder, damage type and Astral Ring. Compare those conditions with your actual team before investing.')],
    sources: [source('HoYoverse · Peregrine Sword equipment', 'https://honkaiimpact3.hoyoverse.com/m/global/en-us/news/155439?cate=515')],
  },
  {
    slug: 'honkai-equipment', game: 'hi3', category: 'Equipment', title: 'Weapons, stigmata and set conditions',
    description: 'Separate a weapon’s effect from a stigma set’s character-specific bonuses.',
    takeaway: 'Read individual effects and set bonuses before treating equipment as interchangeable.',
    sections: [section('Check the weapon interaction', 'Recommended weapons can change how a battlesuit’s actions work, rather than only increasing a stat. Compare the weapon description with the battlesuit’s rotation.'), section('Read the set bonuses', 'Stigma sets can add two-piece and three-piece effects with different activation conditions. Some bonuses apply only to a named battlesuit or Astral Ring specialization.'), section('Check acquisition in the current version', 'The official Mad Pleasure: Shadowbringer introduction documents both equipment and crafting routes for its version. Use the current in-game Supply details for present availability; old event dates are not current offers.')],
    sources: [source('HoYoverse · Shadowbringer equipment introduction', 'https://honkaiimpact3.hoyoverse.com/global/en-us/news/123173')],
  },
  {
    slug: 'wuwa-first-steps', game: 'wuwa', category: 'Getting started', title: 'Find your rhythm as the Rover',
    description: 'Get comfortable with movement, defensive timing and a core team.',
    takeaway: 'Learn the combat fundamentals before chasing a perfect Echo inventory.',
    sections: [section('Follow the opening progression', 'Use the main quests and introductory systems to learn the world, then develop a small group of Resonators you enjoy playing.'), section('Practice defensive timing', 'Dodging and parrying are important combat tools. Learn enemy telegraphs in manageable fights before taking the same team into harder encounters.'), section('Upgrade deliberately', 'Balance Resonator, weapon and skill upgrades with your available resources. Treat early equipment as a way to progress, then refine your build as more farming options become available.')],
    sources: [source('Prydwen · Beginner guide', 'https://www.prydwen.gg/wuthering-waves/guides/beginner-guide')],
  },
  {
    slug: 'wuwa-resonator-kit', game: 'wuwa', category: 'Combat & teams', title: 'Understand a Resonator’s kit',
    description: 'Skills, Energy and the actions that make each character work.',
    takeaway: 'Read the Forte Circuit and swap effects before deciding how to play a Resonator.',
    sections: [section('Separate your attacks', 'Basic and Heavy Attacks, Resonance Skill and Resonance Liberation are distinct parts of a kit. Their damage bonuses and functions are not interchangeable.'), section('Learn the unique mechanic', 'The Forte Circuit defines character-specific mechanics. Learn what fills its resource and which actions spend it.'), section('Plan the swap', 'Intro and Outro Skills add effects when switching with sufficient Concerto Energy. Read those effects to understand what the outgoing character provides and what the next character should do.')],
    sources: [source('Prydwen · Resonators explained', 'https://www.prydwen.gg/wuthering-waves/guides/resonators')],
  },
  {
    slug: 'wuwa-echoes', game: 'wuwa', category: 'Equipment', title: 'Make every Echo slot count',
    description: 'Active Echo skills, cost limits and tuning without the confusion.',
    takeaway: 'Your first Echo supplies the active ability; all five contribute equipment stats.',
    sections: [section('Choose the active slot', 'A Resonator can equip five Echoes. The first slot determines the active Echo ability, while the remaining slots still provide their equipment effects.'), section('Respect the cost limit', 'Echoes have different costs. The starting total capacity is 10 and can increase to 12 through Data Dock upgrades; choose a combination that fits your unlocked capacity.'), section('Level and tune separately', 'Leveling improves main stats, while tuning reveals substats. Match the Echo’s stats and set to the Resonator rather than investing in every high-rarity drop.')],
    sources: [source('Prydwen · Echoes explained', 'https://www.prydwen.gg/wuthering-waves/guides/echoes-explained')],
  },
  {
    slug: 'nte-city-basics', game: 'nte', category: 'Getting started', title: 'Get your bearings in Hethereau',
    description: 'Anomaly work, city activities and two different resource systems.',
    takeaway: 'City Stamina and Character Pixels serve different activities.',
    sections: [section('Explore the city', 'Hethereau combines anomaly-related encounters with urban activities. The setting includes enterable buildings and activities beyond combat.'), section('Separate the resources', 'Hethereau Hobbies include activities such as racing, fishing and shop management. They use City Stamina, while material farming uses Character Pixels.'), section('Start with a coherent team', 'Teams can contain up to four characters. Learn how their attributes interact through Esper Cycles before investing in several unrelated characters.')],
    sources: [source('Prydwen · NTE beginner guide', 'https://www.prydwen.gg/neverness-to-everness/guides/beginner-guide')],
  },
  {
    slug: 'nte-team-building', game: 'nte', category: 'Combat & teams', title: 'Connect your team’s Esper Cycles',
    description: 'Balance damage, buffs and survival with compatible attributes.',
    takeaway: 'Choose compatible attributes and effects, then practice the swap sequence.',
    sections: [section('Assign combat jobs', 'Build around damage and buff roles, with healing or shielding if you need more survivability. The balance depends on your characters and the encounter.'), section('Check adjacent attributes', 'Esper Cycles use adjacent attributes on the cycle wheel. Make sure your planned switches can activate the effects your team is built around.'), section('Check overlapping bonuses', 'Some Arc and Cartridge effects do not stack with another copy. Read their conditions so two support builds do not waste the same bonus.')],
    sources: [source('Prydwen · Team building', 'https://www.prydwen.gg/neverness-to-everness/guides/team-building')],
  },
  {
    slug: 'nte-cartridges-modules', game: 'nte', category: 'Equipment', title: 'Cartridges, Modules and your Console',
    description: 'How the three parts of NTE’s equipment system fit together.',
    takeaway: 'Match the Cartridge effect and Module layout to the character’s role.',
    sections: [section('Start with the Cartridge', 'Cartridges provide equipment stats and interact with Module combinations for set effects. Select an effect that helps the character’s damage or support role.'), section('Inspect the Modules', 'Module stats are visible before all of them unlock through leveling. Different Module types occupy different numbers of blocks, making layout part of the build.'), section('Use the Console’s rules', 'The Console is the board that holds Modules. Its layout and character-specific effects matter; check the preferred Module type before filling the available space.')],
    sources: [source('Prydwen · Modules system', 'https://www.prydwen.gg/neverness-to-everness/guides/modules-generic')],
  },
  {
    slug: 'mlbb-lanes', game: 'mlbb', category: 'Getting started', title: 'Pick a lane. Learn its job.',
    description: 'Understand the map assignment before trying to master every hero.',
    takeaway: 'A hero’s role describes their tools; a lane describes their assignment.',
    sections: [section('Use lane recommendations', 'Gold Lane commonly suits Marksmen, EXP Lane often suits Fighters or Tanks, and Mid Lane commonly suits Mages. These are starting points, not rules for every composition.'), section('Learn one assignment first', 'Choose a hero suited to the position you want to learn. Practice that lane’s rhythm before repeatedly switching to unfamiliar jobs.'), section('Adapt with your team', 'The official lane guide emphasizes that hero assignments can change. Use the lineup and your team’s plan to decide where your hero will contribute.')],
    sources: [source('MOONTON · Lanes and positioning', 'https://www.youtube.com/watch?v=--CVx5jhxnc')],
  },
  {
    slug: 'mlbb-team-roles', game: 'mlbb', category: 'Combat & teams', title: 'Know your job in a teamfight',
    description: 'A role-by-role introduction to positioning and team utility.',
    takeaway: 'Play to your hero’s strengths instead of taking every fight the same way.',
    sections: [section('Create and use space', 'Tanks and Fighters can help hold the front of a fight. Assassins look for opportunities to reach vulnerable opponents instead of absorbing the first wave of damage.'), section('Protect your damage window', 'Mages use abilities and control from safer positions. Marksmen rely heavily on ranged attacks and benefit from space to keep attacking.'), section('Support the team', 'Support abilities can heal, shield or strengthen allies. Learn your hero’s actual kit: some heroes combine roles, so the role label is only the starting point.')],
    sources: [source('Google Play · Hero roles', 'https://play.google.com/store/apps/editorial?hl=en-GB&id=mc_editorialevergreen_post_install_mobile_legends_roles_fcp')],
  },
  {
    slug: 'mlbb-equipment', game: 'mlbb', category: 'Equipment', title: 'Turn your gold into useful equipment',
    description: 'Keep purchases moving and learn a hero before heading into ranked.',
    takeaway: 'Equipment is part of your match progression, not something to ignore until later.',
    sections: [section('Buy as the match progresses', 'Equipment purchases strengthen your hero during a match. Pay attention to available purchases as you earn gold.'), section('Learn the recommendation', 'Start with your hero’s suggested equipment and read the effects. Learn what the items contribute before relying on a memorized sequence.'), section('Practice before ranked', 'Use Classic matches to become comfortable with your hero, position and purchases. Unlocking Ranked does not require you to enter it immediately.')],
    sources: [source('Google Play · Essential strategies', 'https://play.google.com/store/apps/editorial?hl=en_US&id=mc_editorialevergreen_post_install_mobile_legends_basic_strategies_fcp')],
  },
]

