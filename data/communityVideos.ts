export type CommunityVideo = {
  id: string
  category: 'guide' | 'gameplay' | 'trailer'
  title: string
  description: string
  context: string
  creator: string
  channel: string
}
export type VideoGame = { id: string; name: string; videos: CommunityVideo[] }

// Public videos and creators verified via YouTube oEmbed on 16 October 2026.
// Five slides per game; each slide contains a guide, gameplay and an official trailer.
export const communityVideoGames: VideoGame[] = [
  {
    "id": "hsr",
    "name": "Honkai: Star Rail",
    "videos": [
      {
        "id": "DEm3mSr9gRE",
        "category": "guide",
        "title": "Acheron: build and team guide",
        "description": "Sevy explains her kit, relics, Light Cones and team options.",
        "context": "v2.1 guide",
        "creator": "Sevy",
        "channel": "https://www.youtube.com/@SevyPlays"
      },
      {
        "id": "9MqGrrbbXdo",
        "category": "gameplay",
        "title": "Acheron in action",
        "description": "A close look at Acheron’s skill and Ultimate animations.",
        "context": "Combat showcase",
        "creator": "shizukuuu",
        "channel": "https://www.youtube.com/@shizukuisme"
      },
      {
        "id": "IQQPDPAvxTg",
        "category": "trailer",
        "title": "Acheron — Your Color",
        "description": "Meet the wandering Galaxy Ranger in her official character trailer.",
        "context": "Official trailer",
        "creator": "Honkai: Star Rail",
        "channel": "https://www.youtube.com/@HonkaiStarRail"
      },
      {
        "id": "H7Yh-zZo4F8",
        "category": "guide",
        "title": "Misha: build and combat guide",
        "description": "Sevy explains Misha’s playstyle and build options.",
        "context": "v2.0 guide",
        "creator": "Sevy",
        "channel": "https://www.youtube.com/@SevyPlays"
      },
      {
        "id": "HrRM-O3yiRo",
        "category": "gameplay",
        "title": "Castorice & Hysilens: Memory of Chaos",
        "description": "A Memory of Chaos floor-12 clear featuring Castorice and Hysilens.",
        "context": "Gameplay showcase",
        "creator": "Zetto Genshin",
        "channel": "https://www.youtube.com/@ZettoGenshin"
      },
      {
        "id": "RC6wQ-75uQU",
        "category": "trailer",
        "title": "Sparkle — Monodrama",
        "description": "Watch Sparkle’s official character trailer from Honkai: Star Rail.",
        "context": "Official trailer",
        "creator": "Honkai: Star Rail",
        "channel": "https://www.youtube.com/@HonkaiStarRail"
      },
      {
        "id": "Vas7xa21SS4",
        "category": "guide",
        "title": "Yukong: build and team guide",
        "description": "Sevy explains Yukong’s playstyle and build options.",
        "context": "v1.1 guide",
        "creator": "Sevy",
        "channel": "https://www.youtube.com/@SevyPlays"
      },
      {
        "id": "_47XCK34Of4",
        "category": "gameplay",
        "title": "Phainon: combat animations",
        "description": "See Phainon’s idle, skill and Ultimate animations up close.",
        "context": "Gameplay showcase",
        "creator": "Andryh The Weeb",
        "channel": "https://www.youtube.com/@AndryhTheWeeb"
      },
      {
        "id": "GaT1GftoqV0",
        "category": "trailer",
        "title": "Phainon — Coronal Radiance",
        "description": "Watch Phainon’s official character trailer from Honkai: Star Rail.",
        "context": "Official trailer",
        "creator": "Honkai: Star Rail",
        "channel": "https://www.youtube.com/@HonkaiStarRail"
      },
      {
        "id": "DT-SjgmkMrw",
        "category": "guide",
        "title": "Gallagher: build and team guide",
        "description": "Sevy explains Gallagher’s playstyle and build options.",
        "context": "v2.1 guide",
        "creator": "Sevy",
        "channel": "https://www.youtube.com/@SevyPlays"
      },
      {
        "id": "sEheUxvfGDM",
        "category": "gameplay",
        "title": "Star Rail: combat gameplay",
        "description": "GameSpot takes a closer look at Star Rail’s turn-based combat.",
        "context": "Gameplay showcase",
        "creator": "GameSpot",
        "channel": "https://www.youtube.com/@gamespot"
      },
      {
        "id": "AEUffI4nAIM",
        "category": "trailer",
        "title": "Kafka — A Dramatic Irony",
        "description": "Watch Kafka’s official character trailer from Honkai: Star Rail.",
        "context": "Official trailer",
        "creator": "Honkai: Star Rail",
        "channel": "https://www.youtube.com/@HonkaiStarRail"
      },
      {
        "id": "M_KByfXnlUg",
        "category": "guide",
        "title": "Aventurine: build and team guide",
        "description": "Sevy explains Aventurine’s playstyle and build options.",
        "context": "v2.1 guide",
        "creator": "Sevy",
        "channel": "https://www.youtube.com/@SevyPlays"
      },
      {
        "id": "IA48W_j9iUE",
        "category": "gameplay",
        "title": "Star Rail: Ultimate collection",
        "description": "A collection of character Ultimates from versions 1.0 to 3.5.",
        "context": "Gameplay showcase",
        "creator": "HDRsaputra",
        "channel": "https://www.youtube.com/@HDRsaputra"
      },
      {
        "id": "CRAuK8T6Xis",
        "category": "trailer",
        "title": "Cyrene — With You Once More",
        "description": "Watch Cyrene’s official character trailer from Honkai: Star Rail.",
        "context": "Official trailer",
        "creator": "Honkai: Star Rail",
        "channel": "https://www.youtube.com/@HonkaiStarRail"
      }
    ]
  },
  {
    "id": "genshin",
    "name": "Genshin Impact",
    "videos": [
      {
        "id": "AacHyAmWndk",
        "category": "guide",
        "title": "Furina: build and team guide",
        "description": "Learn her playstyle, artifacts, weapons and team synergies with Sevy.",
        "context": "v4.2 guide",
        "creator": "Sevy",
        "channel": "https://www.youtube.com/@SevyPlays"
      },
      {
        "id": "Yx2pRt-KWGM",
        "category": "gameplay",
        "title": "Furina: C0 gameplay showcase",
        "description": "See Furina in combat with four-star weapons and different teams.",
        "context": "C0 showcase",
        "creator": "IWinToLose Gaming",
        "channel": "https://www.youtube.com/@IWinToLose"
      },
      {
        "id": "EN79SfbcvIE",
        "category": "trailer",
        "title": "Furina — All the World’s a Stage",
        "description": "Fontaine’s star takes the spotlight in her official character demo.",
        "context": "Official trailer",
        "creator": "Genshin Impact",
        "channel": "https://www.youtube.com/@GenshinImpact"
      },
      {
        "id": "H7B8B372XRo",
        "category": "guide",
        "title": "Nilou: Bloom and team guide",
        "description": "Sevy explains Nilou’s playstyle and build options.",
        "context": "v3.1 guide",
        "creator": "Sevy",
        "channel": "https://www.youtube.com/@SevyPlays"
      },
      {
        "id": "yNCfWVZ7FCY",
        "category": "gameplay",
        "title": "Mizuki: C0 gameplay showcase",
        "description": "See Mizuki’s teams and playstyle in IWinToLose’s character showcase.",
        "context": "Gameplay showcase",
        "creator": "IWinToLose Gaming",
        "channel": "https://www.youtube.com/@IWinToLose"
      },
      {
        "id": "4oBpaBEMBIM",
        "category": "trailer",
        "title": "Zhongli — The Listener",
        "description": "Watch Zhongli’s official character trailer from Genshin Impact.",
        "context": "Official trailer",
        "creator": "Genshin Impact",
        "channel": "https://www.youtube.com/@GenshinImpact"
      },
      {
        "id": "D8xP2FXY3CQ",
        "category": "guide",
        "title": "Arlecchino: build and team guide",
        "description": "Sevy explains Arlecchino’s playstyle and build options.",
        "context": "v4.6 guide",
        "creator": "Sevy",
        "channel": "https://www.youtube.com/@SevyPlays"
      },
      {
        "id": "9E7b2AQSZ9Y",
        "category": "gameplay",
        "title": "Mualani: four-star weapon showcase",
        "description": "Watch Mualani in combat with a four-star weapon.",
        "context": "Gameplay showcase",
        "creator": "IWinToLose Gaming",
        "channel": "https://www.youtube.com/@IWinToLose"
      },
      {
        "id": "dpZhGzZ3hNc",
        "category": "trailer",
        "title": "Nahida — Boundless Bliss",
        "description": "Watch Nahida’s official character trailer from Genshin Impact.",
        "context": "Official trailer",
        "creator": "Genshin Impact",
        "channel": "https://www.youtube.com/@GenshinImpact"
      },
      {
        "id": "9otOom3V2HI",
        "category": "guide",
        "title": "Lynette: build and team guide",
        "description": "Sevy explains Lynette’s playstyle and build options.",
        "context": "v4.0 guide",
        "creator": "Sevy",
        "channel": "https://www.youtube.com/@SevyPlays"
      },
      {
        "id": "dj3fd-wQ0vM",
        "category": "gameplay",
        "title": "Chiori: three-star weapon showcase",
        "description": "A look at Chiori’s combat performance with a three-star weapon.",
        "context": "Gameplay showcase",
        "creator": "IWinToLose Gaming",
        "channel": "https://www.youtube.com/@IWinToLose"
      },
      {
        "id": "6XbHqN8Cs60",
        "category": "trailer",
        "title": "Alhaitham — Think Before You Act",
        "description": "Watch Alhaitham’s official character trailer from Genshin Impact.",
        "context": "Official trailer",
        "creator": "Genshin Impact",
        "channel": "https://www.youtube.com/@GenshinImpact"
      },
      {
        "id": "2TppCceBx6I",
        "category": "guide",
        "title": "Charlotte: build and team guide",
        "description": "Sevy explains Charlotte’s playstyle and build options.",
        "context": "v4.2 guide",
        "creator": "Sevy",
        "channel": "https://www.youtube.com/@SevyPlays"
      },
      {
        "id": "GSvY-7tlxL0",
        "category": "gameplay",
        "title": "Clorinde: four-star weapon showcase",
        "description": "See Clorinde in action with a four-star weapon.",
        "context": "Gameplay showcase",
        "creator": "IWinToLose Gaming",
        "channel": "https://www.youtube.com/@IWinToLose"
      },
      {
        "id": "mvrW4aKwAXw",
        "category": "trailer",
        "title": "Raiden Shogun — Judgment of Euthymia",
        "description": "Watch Raiden Shogun’s official character trailer from Genshin Impact.",
        "context": "Official trailer",
        "creator": "Genshin Impact",
        "channel": "https://www.youtube.com/@GenshinImpact"
      }
    ]
  },
  {
    "id": "hi3",
    "name": "Honkai Impact 3rd",
    "videos": [
      {
        "id": "hwDgn8J1dkc",
        "category": "guide",
        "title": "Elysia: Hi♪ Love Elf♥ guide",
        "description": "Marisa Honkai breaks down Elysia’s Hi♪ Love Elf♥ battlesuit.",
        "context": "Battlesuit guide",
        "creator": "Marisa Honkai",
        "channel": "https://www.youtube.com/@MarisaHonkai"
      },
      {
        "id": "Ha21bcu4zhA",
        "category": "gameplay",
        "title": "Elysia: Miss Pink Elf♪ gameplay",
        "description": "Watch Elysia’s original bow battlesuit in action.",
        "context": "v5.1 showcase",
        "creator": "Nocte Vertunum",
        "channel": "https://www.youtube.com/@NocteVertunumGaming"
      },
      {
        "id": "9QvbmPkqv8I",
        "category": "trailer",
        "title": "Elysia — Herrscher of Human: Ego",
        "description": "Discover this Elysia battlesuit in its official reveal trailer.",
        "context": "Official trailer",
        "creator": "Honkai Impact 3rd",
        "channel": "https://www.youtube.com/@HonkaiImpact3rd"
      },
      {
        "id": "8REtB59fgdA",
        "category": "guide",
        "title": "Haxxor Bunny: support guide",
        "description": "Marisa Honkai explains Haxxor Bunny’s playstyle and build options.",
        "context": "Battlesuit guide",
        "creator": "Marisa Honkai",
        "channel": "https://www.youtube.com/@MarisaHonkai"
      },
      {
        "id": "fMULM_3gKKg",
        "category": "gameplay",
        "title": "Rita: gameplay showcase",
        "description": "A look at Rita in combat in Honkai Impact version 8.6.",
        "context": "Gameplay showcase",
        "creator": "Mint Chan",
        "channel": "https://www.youtube.com/@mintchandayo"
      },
      {
        "id": "n7V5pE0IcKU",
        "category": "trailer",
        "title": "Haxxor Bunny — Battlesuit trailer",
        "description": "Watch Haxxor Bunny’s official character trailer from Honkai Impact 3rd.",
        "context": "Official trailer",
        "creator": "Honkai Impact 3rd",
        "channel": "https://www.youtube.com/@HonkaiImpact3rd"
      },
      {
        "id": "bbK084OrajQ",
        "category": "guide",
        "title": "Herrscher of Origin: battlesuit guide",
        "description": "Marisa Honkai explains Herrscher of Origin’s playstyle and build options.",
        "context": "Battlesuit guide",
        "creator": "Marisa Honkai",
        "channel": "https://www.youtube.com/@MarisaHonkai"
      },
      {
        "id": "86IQDETStiY",
        "category": "gameplay",
        "title": "Seele: Wings of Panacea gameplay",
        "description": "Watch Wings of Panacea Seele in Marisa Honkai’s combat showcase.",
        "context": "Gameplay showcase",
        "creator": "Marisa Honkai",
        "channel": "https://www.youtube.com/@MarisaHonkai"
      },
      {
        "id": "XJaGQr8OX48",
        "category": "trailer",
        "title": "Fallen Rosemary — Battlesuit trailer",
        "description": "Watch Fallen Rosemary’s official character trailer from Honkai Impact 3rd.",
        "context": "Official trailer",
        "creator": "Honkai Impact 3rd",
        "channel": "https://www.youtube.com/@HonkaiImpact3rd"
      },
      {
        "id": "xBoYcLBsnZ0",
        "category": "guide",
        "title": "Fenghuang of Vicissitude: combat guide",
        "description": "Marisa Honkai explains Fenghuang of Vicissitude’s playstyle and build options.",
        "context": "Battlesuit guide",
        "creator": "Marisa Honkai",
        "channel": "https://www.youtube.com/@MarisaHonkai"
      },
      {
        "id": "st9GQRAOOtU",
        "category": "gameplay",
        "title": "Vita: Lone Planetfarer gameplay",
        "description": "See Vita’s Lone Planetfarer battlesuit in action.",
        "context": "Gameplay showcase",
        "creator": "Marisa Honkai",
        "channel": "https://www.youtube.com/@MarisaHonkai"
      },
      {
        "id": "0nWX71GKzVE",
        "category": "trailer",
        "title": "Infinite Ouroboros — Battlesuit trailer",
        "description": "Watch Infinite Ouroboros’s official character trailer from Honkai Impact 3rd.",
        "context": "Official trailer",
        "creator": "Honkai Impact 3rd",
        "channel": "https://www.youtube.com/@HonkaiImpact3rd"
      },
      {
        "id": "qjXM6P-FJjc",
        "category": "guide",
        "title": "Palatinus Equinox: combat guide",
        "description": "Marisa Honkai explains Palatinus Equinox’s playstyle and build options.",
        "context": "Battlesuit guide",
        "creator": "Marisa Honkai",
        "channel": "https://www.youtube.com/@MarisaHonkai"
      },
      {
        "id": "sg0Be9v9uts",
        "category": "gameplay",
        "title": "Bronya: Herrscher of Reason gameplay",
        "description": "A combat showcase of Bronya’s Herrscher of Reason battlesuit.",
        "context": "Gameplay showcase",
        "creator": "ErrorMacro",
        "channel": "https://www.youtube.com/@ErrorMacro713"
      },
      {
        "id": "7KQtGeNpGoA",
        "category": "trailer",
        "title": "Starchasm Nyx — Battlesuit trailer",
        "description": "Watch Starchasm Nyx’s official character trailer from Honkai Impact 3rd.",
        "context": "Official trailer",
        "creator": "Honkai Impact 3rd",
        "channel": "https://www.youtube.com/@HonkaiImpact3rd"
      }
    ]
  },
  {
    "id": "wuwa",
    "name": "Wuthering Waves",
    "videos": [
      {
        "id": "dxVvX5aYDBg",
        "category": "guide",
        "title": "Changli: build and combat guide",
        "description": "Zy0x covers her playstyle, weapons, Echoes and team options.",
        "context": "Resonator guide",
        "creator": "Zy0x",
        "channel": "https://www.youtube.com/@Zy0x"
      },
      {
        "id": "nWFQO-dMTwc",
        "category": "gameplay",
        "title": "Changli vs. Crownless",
        "description": "Rexlent takes on difficulty-six Crownless with Changli.",
        "context": "Boss gameplay",
        "creator": "Rexlent",
        "channel": "https://www.youtube.com/@Rexlent"
      },
      {
        "id": "jYjxjy1l6Co",
        "category": "trailer",
        "title": "Changli — Seize the Initiative",
        "description": "Watch Changli’s official Resonator showcase from Kuro Games.",
        "context": "Official trailer",
        "creator": "Wuthering Waves",
        "channel": "https://www.youtube.com/@WutheringWaves"
      },
      {
        "id": "MOIGpoSHnuQ",
        "category": "guide",
        "title": "Jinhsi: build and team guide",
        "description": "Zy0x explains Jinhsi’s playstyle and build options.",
        "context": "Resonator guide",
        "creator": "Zy0x",
        "channel": "https://www.youtube.com/@Zy0x"
      },
      {
        "id": "4xQIBRoxM2E",
        "category": "gameplay",
        "title": "Jinhsi vs. Fleurdelys",
        "description": "Rexlent faces Fleurdelys in a cinematic Jinhsi boss fight.",
        "context": "Gameplay showcase",
        "creator": "Rexlent",
        "channel": "https://www.youtube.com/@Rexlent"
      },
      {
        "id": "wnxtQsHOy1k",
        "category": "trailer",
        "title": "Jiyan — Through the Darkest of Nights",
        "description": "Watch Jiyan’s official character trailer from Wuthering Waves.",
        "context": "Official trailer",
        "creator": "Wuthering Waves",
        "channel": "https://www.youtube.com/@WutheringWaves"
      },
      {
        "id": "5y0V5t-HYSo",
        "category": "guide",
        "title": "Hsin: build and team guide",
        "description": "IWinToLose Gaming explains Hsin’s playstyle and build options.",
        "context": "Resonator guide",
        "creator": "IWinToLose Gaming",
        "channel": "https://www.youtube.com/@IWinToLose"
      },
      {
        "id": "GKHBB-Y81GQ",
        "category": "gameplay",
        "title": "Phrolova vs. Fleurdelys",
        "description": "Watch Phrolova take on Fleurdelys in a solo boss battle.",
        "context": "Gameplay showcase",
        "creator": "Rexlent",
        "channel": "https://www.youtube.com/@Rexlent"
      },
      {
        "id": "FQEyNpQnK60",
        "category": "trailer",
        "title": "The Shorekeeper — The Beginning of Our Story",
        "description": "Watch The Shorekeeper’s official character trailer from Wuthering Waves.",
        "context": "Official trailer",
        "creator": "Wuthering Waves",
        "channel": "https://www.youtube.com/@WutheringWaves"
      },
      {
        "id": "2oxhbOqbtnw",
        "category": "guide",
        "title": "Chisa: build and combat guide",
        "description": "IWinToLose Gaming explains Chisa’s playstyle and build options.",
        "context": "Resonator guide",
        "creator": "IWinToLose Gaming",
        "channel": "https://www.youtube.com/@IWinToLose"
      },
      {
        "id": "nhlh60-XJCQ",
        "category": "gameplay",
        "title": "Danjin vs. Kelpie Hologram",
        "description": "Rexlent takes Danjin into a solo Kelpie Hologram encounter.",
        "context": "Gameplay showcase",
        "creator": "Rexlent",
        "channel": "https://www.youtube.com/@Rexlent"
      },
      {
        "id": "optr9r9VkoQ",
        "category": "trailer",
        "title": "Cartethyia — Come to Light",
        "description": "Watch Cartethyia’s official character trailer from Wuthering Waves.",
        "context": "Official trailer",
        "creator": "Wuthering Waves",
        "channel": "https://www.youtube.com/@WutheringWaves"
      },
      {
        "id": "JygB1TcL4uI",
        "category": "guide",
        "title": "Hiyuki: build and combat guide",
        "description": "IWinToLose Gaming explains Hiyuki’s playstyle and build options.",
        "context": "Resonator guide",
        "creator": "IWinToLose Gaming",
        "channel": "https://www.youtube.com/@IWinToLose"
      },
      {
        "id": "pQOE44-BwSo",
        "category": "gameplay",
        "title": "Carlotta vs. Hecate",
        "description": "A no-hit Carlotta boss fight with the interface hidden.",
        "context": "Gameplay showcase",
        "creator": "Rexlent",
        "channel": "https://www.youtube.com/@Rexlent"
      },
      {
        "id": "w0CQyx13-EI",
        "category": "trailer",
        "title": "Augusta — Sharp Blade",
        "description": "Watch Augusta’s official character trailer from Wuthering Waves.",
        "context": "Official trailer",
        "creator": "Wuthering Waves",
        "channel": "https://www.youtube.com/@WutheringWaves"
      }
    ]
  },
  {
    "id": "nte",
    "name": "Neverness to Everness",
    "videos": [
      {
        "id": "udYVrU7AEE0",
        "category": "guide",
        "title": "Nanally: build and rotation guide",
        "description": "Nonpon walks through Nanally’s rotations, gear and team choices.",
        "context": "Character guide",
        "creator": "Nonpon",
        "channel": "https://www.youtube.com/@Nonpon"
      },
      {
        "id": "Ac5qy5YsQ8I",
        "category": "gameplay",
        "title": "A first look at Hethereau",
        "description": "Explore the city and its combat in IGN’s gameplay preview.",
        "context": "Gameplay preview",
        "creator": "IGN",
        "channel": "https://www.youtube.com/@IGN"
      },
      {
        "id": "M-ebS4zFMpU",
        "category": "trailer",
        "title": "Nanally — In Me, The Tiger",
        "description": "Meet Nanally in her official Neverness to Everness character PV.",
        "context": "Official trailer",
        "creator": "NTE Global",
        "channel": "https://www.youtube.com/@NTE_Official"
      },
      {
        "id": "XOpyhYrON_M",
        "category": "guide",
        "title": "Blackbird: build and team guide",
        "description": "IWinToLose Gaming explains Blackbird’s playstyle and build options.",
        "context": "Character guide",
        "creator": "IWinToLose Gaming",
        "channel": "https://www.youtube.com/@IWinToLose"
      },
      {
        "id": "zh_sfTZN5XI",
        "category": "gameplay",
        "title": "Hethereau: PS5 Pro walkthrough",
        "description": "GameRiot starts a PS5 Pro playthrough in Hethereau.",
        "context": "Gameplay showcase",
        "creator": "GameRiot",
        "channel": "https://www.youtube.com/@GameRiot"
      },
      {
        "id": "YrnBbpyQikM",
        "category": "trailer",
        "title": "Zankou — Alluring Shadows",
        "description": "Watch Zankou’s official character trailer from NTE Global.",
        "context": "Official trailer",
        "creator": "NTE Global",
        "channel": "https://www.youtube.com/@NTE_Official"
      },
      {
        "id": "uEJQzFzlVRo",
        "category": "guide",
        "title": "Iroi: build and weapon guide",
        "description": "IWinToLose Gaming explains Iroi’s playstyle and build options.",
        "context": "Character guide",
        "creator": "IWinToLose Gaming",
        "channel": "https://www.youtube.com/@IWinToLose"
      },
      {
        "id": "Tbuu2k9LFyg",
        "category": "gameplay",
        "title": "Hethereau: no-commentary walkthrough",
        "description": "Follow the opening of NTE with no commentary.",
        "context": "Gameplay showcase",
        "creator": "Rubhen925",
        "channel": "https://www.youtube.com/@Rubhen925"
      },
      {
        "id": "Kb5fBm2PQX8",
        "category": "trailer",
        "title": "Chaos — The Choice Unmade",
        "description": "Watch Chaos’s official character trailer from NTE Global.",
        "context": "Official trailer",
        "creator": "NTE Global",
        "channel": "https://www.youtube.com/@NTE_Official"
      },
      {
        "id": "xvoN92S0Kmw",
        "category": "guide",
        "title": "Shinku: build and team guide",
        "description": "IWinToLose Gaming explains Shinku’s playstyle and build options.",
        "context": "Character guide",
        "creator": "IWinToLose Gaming",
        "channel": "https://www.youtube.com/@IWinToLose"
      },
      {
        "id": "bkghuBMXF98",
        "category": "gameplay",
        "title": "A new Appraiser: story walkthrough",
        "description": "A story playthrough featuring the male main character.",
        "context": "Gameplay showcase",
        "creator": "Rubhen925",
        "channel": "https://www.youtube.com/@Rubhen925"
      },
      {
        "id": "DrLalNRXZaM",
        "category": "trailer",
        "title": "Linko — Universal Frequencies",
        "description": "Watch Linko’s official character trailer from NTE Global.",
        "context": "Official trailer",
        "creator": "NTE Global",
        "channel": "https://www.youtube.com/@NTE_Official"
      },
      {
        "id": "DQa5p4_QbPs",
        "category": "guide",
        "title": "Hotori: build and team guide",
        "description": "IWinToLose Gaming explains Hotori’s playstyle and build options.",
        "context": "Character guide",
        "creator": "IWinToLose Gaming",
        "channel": "https://www.youtube.com/@IWinToLose"
      },
      {
        "id": "CU1cLgm0O-k",
        "category": "gameplay",
        "title": "Akane Rin: gameplay showcase",
        "description": "See Akane Rin in action in GameGaki’s gameplay video.",
        "context": "Gameplay showcase",
        "creator": "GameGaki",
        "channel": "https://www.youtube.com/@GameGaki"
      },
      {
        "id": "G-nOhVYhahA",
        "category": "trailer",
        "title": "Lacrimosa — Lights, Camera, Catnap!",
        "description": "Watch Lacrimosa’s official character trailer from NTE Global.",
        "context": "Official trailer",
        "creator": "NTE Global",
        "channel": "https://www.youtube.com/@NTE_Official"
      }
    ]
  },
  {
    "id": "mlbb",
    "name": "Mobile Legends: Bang Bang",
    "videos": [
      {
        "id": "Dh4KSGV8t0E",
        "category": "guide",
        "title": "Nolan: Cosmic Wayfinder spotlight",
        "description": "Learn Nolan’s abilities through MLBB’s official hero spotlight.",
        "context": "Official hero guide",
        "creator": "Mobile Legends: Bang Bang",
        "channel": "https://www.youtube.com/@MobileLegends5v5MOBA"
      },
      {
        "id": "g8_v6taIHkA",
        "category": "gameplay",
        "title": "Kairi’s Fanny: match breakdown",
        "description": "Watch MobaZane’s commentary on BLK vs. ONIC ID, game four.",
        "context": "Match commentary",
        "creator": "MobaZane",
        "channel": "https://www.youtube.com/@MobaZane1"
      },
      {
        "id": "rTCO7JuzHzY",
        "category": "trailer",
        "title": "Nolan — Promise",
        "description": "Follow Nolan’s story in his official animated character trailer.",
        "context": "Official trailer",
        "creator": "Mobile Legends: Bang Bang",
        "channel": "https://www.youtube.com/@MobileLegends5v5MOBA"
      },
      {
        "id": "f886VQnx_Tc",
        "category": "guide",
        "title": "Marcel: Soul Photographer spotlight",
        "description": "An official introduction to Marcel’s abilities and playstyle.",
        "context": "Official hero guide",
        "creator": "Mobile Legends: Bang Bang",
        "channel": "https://www.youtube.com/@MobileLegends5v5MOBA"
      },
      {
        "id": "5FgTLiviRjA",
        "category": "gameplay",
        "title": "Two NA marksmen, one team",
        "description": "MobaZane plays alongside two North American marksman players.",
        "context": "Gameplay showcase",
        "creator": "MobaZane",
        "channel": "https://www.youtube.com/@MobaZane1"
      },
      {
        "id": "WKZNtIrYM-o",
        "category": "trailer",
        "title": "Obsidia — The Abyss: Sovereign’s Will",
        "description": "Watch Obsidia’s official character trailer from Mobile Legends: Bang Bang.",
        "context": "Official trailer",
        "creator": "Mobile Legends: Bang Bang",
        "channel": "https://www.youtube.com/@MobileLegends5v5MOBA"
      },
      {
        "id": "svu4XenVxPs",
        "category": "guide",
        "title": "Phoveus: Chains of Sin spotlight",
        "description": "An official introduction to Phoveus’s abilities and playstyle.",
        "context": "Official hero guide",
        "creator": "Mobile Legends: Bang Bang",
        "channel": "https://www.youtube.com/@MobileLegends5v5MOBA"
      },
      {
        "id": "O9l7Th76dtQ",
        "category": "gameplay",
        "title": "Saber: jungle gameplay",
        "description": "Watch MobaZane take Saber into the jungle.",
        "context": "Gameplay showcase",
        "creator": "MobaZane",
        "channel": "https://www.youtube.com/@MobaZane1"
      },
      {
        "id": "39D5TqACTn0",
        "category": "trailer",
        "title": "Homeward Bound — Lost and Found",
        "description": "Watch Homeward Bound’s official character trailer from Mobile Legends: Bang Bang.",
        "context": "Official trailer",
        "creator": "Mobile Legends: Bang Bang",
        "channel": "https://www.youtube.com/@MobileLegends5v5MOBA"
      },
      {
        "id": "S5mG0dGpYqU",
        "category": "guide",
        "title": "Obsidia: hero spotlight",
        "description": "An official introduction to Obsidia’s abilities and playstyle.",
        "context": "Official hero guide",
        "creator": "Mobile Legends: Bang Bang",
        "channel": "https://www.youtube.com/@MobileLegends5v5MOBA"
      },
      {
        "id": "9zt6AX_ot2U",
        "category": "gameplay",
        "title": "ECHO vs. ONIC ID: game three",
        "description": "MobaZane breaks down a close ECHO vs. ONIC ID match.",
        "context": "Gameplay showcase",
        "creator": "MobaZane",
        "channel": "https://www.youtube.com/@MobaZane1"
      },
      {
        "id": "xJrLX4Zhnyo",
        "category": "trailer",
        "title": "Marcel — Freeze the Moment",
        "description": "Watch Marcel’s official character trailer from Mobile Legends: Bang Bang.",
        "context": "Official trailer",
        "creator": "Mobile Legends: Bang Bang",
        "channel": "https://www.youtube.com/@MobileLegends5v5MOBA"
      },
      {
        "id": "8a2bSCuEdmM",
        "category": "guide",
        "title": "Kaja: revamped hero spotlight",
        "description": "An official introduction to Kaja’s abilities and playstyle.",
        "context": "Official hero guide",
        "creator": "Mobile Legends: Bang Bang",
        "channel": "https://www.youtube.com/@MobileLegends5v5MOBA"
      },
      {
        "id": "ENt3Oab67yw",
        "category": "gameplay",
        "title": "Granger: five bullets, five kills",
        "description": "A Granger gameplay video from MobaZane.",
        "context": "Gameplay showcase",
        "creator": "MobaZane",
        "channel": "https://www.youtube.com/@MobaZane1"
      },
      {
        "id": "Vy05-CePnoU",
        "category": "trailer",
        "title": "Sora — The Cloud Among Us",
        "description": "Watch Sora’s official character trailer from Mobile Legends: Bang Bang.",
        "context": "Official trailer",
        "creator": "Mobile Legends: Bang Bang",
        "channel": "https://www.youtube.com/@MobileLegends5v5MOBA"
      }
    ]
  }
]
