export type ArticlePhoto = {
  src: string; small: string; smallWidth: number; width: number; height: number
  alt: string; caption: string; credit: string; source: string; license?: string
}
export type GameStory = {
  headline: string; summary: string; developer: string; company: string
  development: string; release: string; location: string; map: { label: string; query: string }; updated: string
  hero: ArticlePhoto; teamPhoto: ArticlePhoto
  chapters: { id: string; label: string; title: string; paragraphs: { text: string; source: string }[] }[]
  timeline: [string, string, string][]; sources: [string, string][]
}

export const gameStories: Record<string, GameStory> = {
  "hsr": {
    "headline": "The story behind the Astral Express",
    "summary": "How a new direction for Honkai became a journey between worlds.",
    "developer": "miHoYo",
    "company": "miHoYo · HoYoverse",
    "development": "Project began in 2019",
    "release": "26 April 2023",
    "location": "Shanghai, China · international headquarters in Singapore",
    "updated": "2026-10-17",
    "hero": {
      "src": "/images/studios/mihoyo-headquarters.webp",
      "small": "/images/studios/mihoyo-headquarters-640.webp",
      "width": 1600,
      "height": 743,
      "alt": "miHoYo headquarters buildings in Shanghai, photographed in November 2023",
      "caption": "miHoYo’s Shanghai headquarters, photographed in 2023. HoYoverse’s international headquarters is in Singapore.",
      "credit": "李汉宗 (Lhzss8) / Wikimedia Commons",
      "source": "https://commons.wikimedia.org/wiki/File:米哈游现总部.jpg",
      "license": "https://creativecommons.org/licenses/by-sa/4.0/",
      "smallWidth": 640
    },
    "teamPhoto": {
      "src": "/images/studios/david-jiang.webp",
      "small": "/images/studios/david-jiang-640.webp",
      "width": 1600,
      "height": 900,
      "alt": "Honkai: Star Rail producer David Jiang in a portrait published by Google Play",
      "caption": "Producer David Jiang, pictured in Google Play’s interview about Honkai: Star Rail’s development.",
      "credit": "HoYoverse / Google Play",
      "source": "https://play.google.com/store/apps/editorial?id=mc_bestof2023_best_game_interview_fcp",
      "smallWidth": 640
    },
    "chapters": [
      {
        "id": "origins",
        "label": "Why it began",
        "title": "Why Honkai took a new direction",
        "paragraphs": [
          {
            "text": "Star Rail began as a new direction for the Honkai series: a space-fantasy journey with an independent story and a turn-based structure. The studio had previously focused on action games. This project gave it a different way to build characters, encounters and a universe of distinct civilizations.",
            "source": "https://apps.apple.com/sg/iphone/story/id1671993588"
          },
          {
            "text": "In an interview with Apple, Jiang explained that the team wanted something more interesting than a spaceship. Their fondness for scenic railway journeys helped shape the Astral Express. Train travel offered the sense of romance and discovery they wanted for the game’s cosmic adventure.",
            "source": "https://apps.apple.com/sg/iphone/story/id1671993588"
          }
        ]
      },
      {
        "id": "development",
        "label": "Development",
        "title": "From a 2019 project to a 2023 launch",
        "paragraphs": [
          {
            "text": "The project began in 2019 and launched on 26 April 2023. Its development gave the team a chance to explore a different direction from the action games it had previously made. A turn-based structure became part of that new identity.",
            "source": "https://www.4gamer.net/games/599/G059992/20230417034/"
          }
        ]
      },
      {
        "id": "process",
        "label": "The process",
        "title": "Building the universe and the experience",
        "paragraphs": [
          {
            "text": "In Google Play’s interview, producer David Jiang describes developing factions, character histories and a timeline together. The team aimed to make the game’s systems reinforce its fictional universe. Supporting different devices required work on controls, interface layouts and technical performance, rather than simply putting an identical screen on every platform.",
            "source": "https://play.google.com/store/apps/editorial?id=mc_bestof2023_best_game_interview_fcp"
          }
        ]
      },
      {
        "id": "team",
        "label": "The team",
        "title": "David Jiang and a multidisciplinary team",
        "paragraphs": [
          {
            "text": "David Jiang is a publicly identified producer of Honkai: Star Rail. His Google Play interview describes collaboration across worldbuilding, technical adaptation and ongoing updates. In Apple’s interview, he also explains the thinking behind the Astral Express. These accounts represent a producer’s perspective on a project made by many specialists.",
            "source": "https://play.google.com/store/apps/editorial?id=mc_bestof2023_best_game_interview_fcp"
          }
        ]
      },
      {
        "id": "company",
        "label": "Company & headquarters",
        "title": "miHoYo, HoYoverse and two headquarters stories",
        "paragraphs": [
          {
            "text": "miHoYo’s development history is rooted in Shanghai, China. The company’s early student-team background is documented by Shanghai Jiao Tong University. HoYoverse, its later international brand, announced the opening of a headquarters in Singapore in July 2022.",
            "source": "https://www.hoyoverse.com/en-us/news/102498"
          }
        ]
      }
    ],
    "timeline": [
      [
        "2019",
        "The Star Rail project begins.",
        "https://www.4gamer.net/games/599/G059992/20230417034/"
      ],
      [
        "2022",
        "HoYoverse introduces its international brand.",
        "https://www.hoyoverse.com/en-us/news/101566"
      ],
      [
        "26 April 2023",
        "Honkai: Star Rail launches.",
        "https://www.4gamer.net/games/599/G059992/20230417034/"
      ]
    ],
    "sources": [
      [
        "Producer David Jiang on the game’s origins",
        "https://apps.apple.com/sg/iphone/story/id1671993588"
      ],
      [
        "Development-team interview and project timeline",
        "https://www.4gamer.net/games/599/G059992/20230417034/"
      ],
      [
        "Developer and team background",
        "https://play.google.com/store/apps/editorial?id=mc_bestof2023_best_game_interview_fcp"
      ],
      [
        "Company and headquarters background",
        "https://www.hoyoverse.com/en-us/news/102498"
      ],
      [
        "HoYoverse brand announcement",
        "https://www.hoyoverse.com/en-us/news/101566"
      ],
      [
        "Headquarters / workplace photograph",
        "https://commons.wikimedia.org/wiki/File:米哈游现总部.jpg"
      ]
    ],
    "map": {
      "label": "miHoYo · Shanghai, China",
      "query": "miHoYo Shanghai China"
    }
  },
  "genshin": {
    "headline": "How miHoYo imagined Teyvat",
    "summary": "The origins, influences and studio behind a world built for discovery.",
    "developer": "miHoYo",
    "company": "miHoYo · HoYoverse",
    "development": "Development began in 2017",
    "release": "28 September 2020",
    "location": "Shanghai, China · international headquarters in Singapore",
    "updated": "2026-10-17",
    "hero": {
      "src": "/images/studios/mihoyo-headquarters.webp",
      "small": "/images/studios/mihoyo-headquarters-640.webp",
      "width": 1600,
      "height": 743,
      "alt": "miHoYo headquarters buildings in Shanghai, photographed in November 2023",
      "caption": "miHoYo’s Shanghai headquarters, photographed in 2023. HoYoverse’s international headquarters is in Singapore.",
      "credit": "李汉宗 (Lhzss8) / Wikimedia Commons",
      "source": "https://commons.wikimedia.org/wiki/File:米哈游现总部.jpg",
      "license": "https://creativecommons.org/licenses/by-sa/4.0/",
      "smallWidth": 640
    },
    "teamPhoto": {
      "src": "/images/studios/mihoyo-founding-team.webp",
      "small": "/images/studios/mihoyo-founding-team-640.webp",
      "width": 1500,
      "height": 958,
      "alt": "An early miHoYo team photographed together in a small office",
      "caption": "An early miHoYo team photograph reproduced in reporting on co-founder Cai Haoyu’s university alumni talk. This is a historical company photo, not the current game development team.",
      "credit": "miHoYo / via MMO Culture",
      "source": "https://mmoculture.com/2021/02/mihoyo-rare-speech-given-by-co-founder-of-genshin-impact-studio/",
      "smallWidth": 640
    },
    "chapters": [
      {
        "id": "origins",
        "label": "Why it began",
        "title": "The idea that became Teyvat",
        "paragraphs": [
          {
            "text": "Genshin Impact grew from miHoYo’s ambition to create an original open-world adventure. In its developer interview, the studio traced the project to 2017 and a wish to make an experience that players on different kinds of devices could enjoy together. It was a larger kind of world than the company had built before.",
            "source": "https://comicbook.com/gaming/news/genshin-impact-interview-mihoyo-ps4-playstation-nintendo-switch/"
          },
          {
            "text": "In a 2020 interview, miHoYo explicitly named The Legend of Zelda: Breath of the Wild as one inspiration for its open-world approach. The same interview emphasized Genshin’s original story, characters and elemental party concept. The influence helps explain its interest in exploration, without accounting for every part of Teyvat’s identity.",
            "source": "https://comicbook.com/gaming/news/genshin-impact-interview-mihoyo-ps4-playstation-nintendo-switch/"
          }
        ]
      },
      {
        "id": "development",
        "label": "Development",
        "title": "Building toward a 2020 release",
        "paragraphs": [
          {
            "text": "Development began in 2017. In a developer interview, miHoYo described wanting to create a game people on different types of devices could enjoy together. Genshin Impact launched on 28 September 2020, bringing that ambition to PC, mobile and PlayStation.",
            "source": "https://comicbook.com/gaming/news/genshin-impact-interview-mihoyo-ps4-playstation-nintendo-switch/"
          }
        ]
      },
      {
        "id": "process",
        "label": "The process",
        "title": "A world built for several kinds of screen",
        "paragraphs": [
          {
            "text": "The development team’s interview connects Genshin’s origins to the goal of bringing players on different devices into a shared experience. The project combined an original story and cast with its own elemental identity. Its accompanying manga was another way to introduce that world beyond the main game.",
            "source": "https://comicbook.com/gaming/news/genshin-impact-interview-mihoyo-ps4-playstation-nintendo-switch/"
          }
        ]
      },
      {
        "id": "team",
        "label": "The team",
        "title": "A studio that existed before Genshin",
        "paragraphs": [
          {
            "text": "miHoYo was established before the development of Genshin Impact. A contemporary Shanghai Jiao Tong University profile documents Liu Wei’s student development work with miHoYo. Genshin later brought that company’s ambitions into a larger project involving world design, writing, character art, music and engineering.",
            "source": "https://hr.seiee.sjtu.edu.cn/english/info/3286.htm"
          }
        ]
      },
      {
        "id": "company",
        "label": "Company & headquarters",
        "title": "The company behind Genshin Impact",
        "paragraphs": [
          {
            "text": "miHoYo developed Genshin Impact before introducing the HoYoverse international brand in 2022. Its Shanghai company history and the later Singapore headquarters announcement describe different parts of the organization.",
            "source": "https://www.hoyoverse.com/en-us/news/102498"
          }
        ]
      }
    ],
    "timeline": [
      [
        "2017",
        "Development begins on the new open-world project.",
        "https://comicbook.com/gaming/news/genshin-impact-interview-mihoyo-ps4-playstation-nintendo-switch/"
      ],
      [
        "August 2019",
        "miHoYo introduces Genshin to PlayStation audiences.",
        "https://blog.playstation.com/archive/2019/08/01/get-your-first-look-at-genshin-impact-a-new-open-world-adventure-coming-to-playstation-next-year"
      ],
      [
        "28 September 2020",
        "The initial global release brings Teyvat to players.",
        "https://www.playstation.com/en-us/games/genshin-impact/"
      ]
    ],
    "sources": [
      [
        "miHoYo interview: development and Zelda influence",
        "https://comicbook.com/gaming/news/genshin-impact-interview-mihoyo-ps4-playstation-nintendo-switch/"
      ],
      [
        "Developer and team background",
        "https://hr.seiee.sjtu.edu.cn/english/info/3286.htm"
      ],
      [
        "Company and headquarters background",
        "https://www.hoyoverse.com/en-us/news/102498"
      ],
      [
        "Development milestone: August 2019",
        "https://blog.playstation.com/archive/2019/08/01/get-your-first-look-at-genshin-impact-a-new-open-world-adventure-coming-to-playstation-next-year"
      ],
      [
        "Official Genshin Impact overview",
        "https://www.playstation.com/en-us/games/genshin-impact/"
      ],
      [
        "Headquarters / workplace photograph",
        "https://commons.wikimedia.org/wiki/File:米哈游现总部.jpg"
      ],
      [
        "Developer / studio photograph",
        "https://mmoculture.com/2021/02/mihoyo-rare-speech-given-by-co-founder-of-genshin-impact-studio/"
      ]
    ],
    "map": {
      "label": "miHoYo · Shanghai, China",
      "query": "miHoYo Shanghai China"
    }
  },
  "hi3": {
    "headline": "The leap that shaped Honkai",
    "summary": "How miHoYo brought its anime-inspired world into full 3D.",
    "developer": "miHoYo",
    "company": "miHoYo · HoYoverse",
    "development": "Development began in 2014",
    "release": "2016 · Initial China release",
    "location": "Shanghai, China · international headquarters in Singapore",
    "updated": "2026-10-17",
    "hero": {
      "src": "/images/studios/mihoyo-headquarters.webp",
      "small": "/images/studios/mihoyo-headquarters-640.webp",
      "width": 1600,
      "height": 743,
      "alt": "miHoYo headquarters buildings in Shanghai, photographed in November 2023",
      "caption": "miHoYo’s Shanghai headquarters, photographed in 2023. HoYoverse’s international headquarters is in Singapore.",
      "credit": "李汉宗 (Lhzss8) / Wikimedia Commons",
      "source": "https://commons.wikimedia.org/wiki/File:米哈游现总部.jpg",
      "license": "https://creativecommons.org/licenses/by-sa/4.0/",
      "smallWidth": 640
    },
    "teamPhoto": {
      "src": "/images/studios/mihoyo-founding-team.webp",
      "small": "/images/studios/mihoyo-founding-team-640.webp",
      "width": 1500,
      "height": 958,
      "alt": "An early miHoYo team photographed together in a small office",
      "caption": "An early miHoYo team photograph reproduced in reporting on co-founder Cai Haoyu’s university alumni talk. This is a historical company photo, not the current game development team.",
      "credit": "miHoYo / via MMO Culture",
      "source": "https://mmoculture.com/2021/02/mihoyo-rare-speech-given-by-co-founder-of-genshin-impact-studio/",
      "smallWidth": 640
    },
    "chapters": [
      {
        "id": "origins",
        "label": "Why it began",
        "title": "Bringing console ambition to mobile",
        "paragraphs": [
          {
            "text": "miHoYo wanted Honkai Impact 3rd to bring a more ambitious, anime-inspired action experience to phones. The project grew from the studio’s earlier Honkai work, with manga and animated scenes helping develop the same fictional identity. Its making-of interview connects that ambition directly to the company’s enthusiasm for anime, comics and games.",
            "source": "https://www.pocketgamer.biz/the-making-of-mihoyos-honkai-impact-3rd/"
          },
          {
            "text": "The developers named Bayonetta and Devil May Cry as inspirations in their making-of interview. The aim was to bring the feel of console action to a mobile game, while the studio’s enthusiasm for anime, comics and games shaped its visual identity. Manga and animated scenes helped extend the same fictional world beyond the main game.",
            "source": "https://www.pocketgamer.biz/the-making-of-mihoyos-honkai-impact-3rd/"
          }
        ]
      },
      {
        "id": "development",
        "label": "Development",
        "title": "Two years to the first release",
        "paragraphs": [
          {
            "text": "In a making-of interview, miHoYo said the project started in 2014 and first launched at the end of 2016. Those dates describe its initial development and release, rather than a single worldwide launch: regional editions arrived at different times. The team continued developing new content after release.",
            "source": "https://www.pocketgamer.biz/the-making-of-mihoyos-honkai-impact-3rd/"
          }
        ]
      },
      {
        "id": "process",
        "label": "The process",
        "title": "From a 3D project to a regional rollout",
        "paragraphs": [
          {
            "text": "The making-of interview describes a project developed over roughly two years, with the team continuing to improve it after launch. Its international growth happened through regional releases. By the May 2018 interview, the Western version had recently arrived, while players in Asia had known the game since 2016.",
            "source": "https://www.pocketgamer.biz/the-making-of-mihoyos-honkai-impact-3rd/"
          }
        ]
      },
      {
        "id": "team",
        "label": "The team",
        "title": "The team’s early roots",
        "paragraphs": [
          {
            "text": "Honkai Impact 3rd grew from miHoYo’s earlier development work. In the 2018 making-of interview, miHoYo president Forrest Wei Liu explains the project’s direction and the console-action influences behind it.",
            "source": "https://www.pocketgamer.biz/the-making-of-mihoyos-honkai-impact-3rd/"
          }
        ]
      },
      {
        "id": "company",
        "label": "Company & headquarters",
        "title": "A Shanghai studio with an international future",
        "paragraphs": [
          {
            "text": "Honkai Impact 3rd was developed by miHoYo in the period before its HoYoverse international branding. The studio’s roots include a student development team at Shanghai Jiao Tong University. HoYoverse later opened a headquarters in Singapore in 2022.",
            "source": "https://www.hoyoverse.com/en-us/news/102498"
          }
        ]
      }
    ],
    "timeline": [
      [
        "2014",
        "Development starts, according to miHoYo’s making-of interview.",
        "https://www.pocketgamer.biz/the-making-of-mihoyos-honkai-impact-3rd/"
      ],
      [
        "2016",
        "The game first launches in China.",
        "https://www.pocketgamer.biz/the-making-of-mihoyos-honkai-impact-3rd/"
      ],
      [
        "2018",
        "The Western release expands the game’s international audience.",
        "https://www.pocketgamer.biz/the-making-of-mihoyos-honkai-impact-3rd/"
      ]
    ],
    "sources": [
      [
        "Developer and team background",
        "https://www.pocketgamer.biz/the-making-of-mihoyos-honkai-impact-3rd/"
      ],
      [
        "Company and headquarters background",
        "https://www.hoyoverse.com/en-us/news/102498"
      ],
      [
        "Headquarters / workplace photograph",
        "https://commons.wikimedia.org/wiki/File:米哈游现总部.jpg"
      ],
      [
        "Developer / studio photograph",
        "https://mmoculture.com/2021/02/mihoyo-rare-speech-given-by-co-founder-of-genshin-impact-studio/"
      ]
    ],
    "map": {
      "label": "miHoYo · Shanghai, China",
      "query": "miHoYo Shanghai China"
    }
  },
  "wuwa": {
    "headline": "The world Kuro built after Gray Raven",
    "summary": "A look at the development and creative roots of Wuthering Waves.",
    "developer": "Kuro Games",
    "company": "Kuro Games",
    "development": "In development before its 2022 reveal",
    "release": "May 2024 · Initial global release",
    "location": "Guangzhou, China",
    "updated": "2026-10-17",
    "hero": {
      "src": "/images/studios/kuro-headquarters.webp",
      "small": "/images/studios/kuro-headquarters-640.webp",
      "width": 1547,
      "height": 1049,
      "alt": "KURO GAMES signage on the exterior of its Guangzhou office building",
      "caption": "Kuro Games’ Guangzhou office building, as presented on the studio’s official recruitment website.",
      "credit": "Kuro Games",
      "source": "https://www.kurogames.com/join",
      "smallWidth": 640
    },
    "teamPhoto": {
      "src": "/images/studios/kuro-workplace.webp",
      "small": "/images/studios/kuro-workplace-640.webp",
      "width": 1346,
      "height": 1080,
      "alt": "Kuro Games office reception area with illuminated studio branding",
      "caption": "Inside a Kuro Games reception area. The photograph is published by the studio as part of its workplace presentation.",
      "credit": "Kuro Games",
      "source": "https://www.kurogames.com/join",
      "smallWidth": 640
    },
    "chapters": [
      {
        "id": "origins",
        "label": "Why it began",
        "title": "An original world after Gray Raven",
        "paragraphs": [
          {
            "text": "Wuthering Waves followed Kuro Games’ work on Punishing: Gray Raven. It gave the studio an opportunity to develop a new setting and an original story while drawing on its existing experience with character action. In its Epic Games Store interview, Kuro described the long development work and the revisions that shaped the finished project.",
            "source": "https://store.epicgames.com/en-US/news/wuthering-waves-interview-kuro-games-launch-struggles-future-plans"
          }
        ]
      },
      {
        "id": "development",
        "label": "Development",
        "title": "The road to May 2024",
        "paragraphs": [
          {
            "text": "The game was publicly revealed in 2022 and first released globally in May 2024. In an August 2024 Epic Games Store interview, Kuro described two to three years of work on the game and its original story. That account gives development context without establishing an exact project start date.",
            "source": "https://store.epicgames.com/en-US/news/wuthering-waves-interview-kuro-games-launch-struggles-future-plans"
          }
        ]
      },
      {
        "id": "process",
        "label": "The process",
        "title": "Iteration, localization and a changing story",
        "paragraphs": [
          {
            "text": "Kuro’s Epic Games Store interview describes revising story material after player feedback and expanding the teams responsible for global distribution and localization. That work shaped both the story players encountered and how it reached different audiences. The development process included substantial revision, alongside the work of building the original world.",
            "source": "https://store.epicgames.com/en-US/news/wuthering-waves-interview-kuro-games-launch-struggles-future-plans"
          }
        ]
      },
      {
        "id": "team",
        "label": "The team",
        "title": "The people and disciplines behind the world",
        "paragraphs": [
          {
            "text": "The studio’s development interview describes a team working on both an original story and its international release. It highlights the growth of publishing and localization alongside development. Kuro’s previous work on Punishing: Gray Raven forms part of that background.",
            "source": "https://store.epicgames.com/en-US/news/wuthering-waves-interview-kuro-games-launch-struggles-future-plans"
          }
        ]
      },
      {
        "id": "company",
        "label": "Company & headquarters",
        "title": "Kuro Games, based in Guangzhou",
        "paragraphs": [
          {
            "text": "Kuro Games’ official introduction dates its founding to 2014 and places its headquarters in Guangzhou, China. The studio develops and publishes its games and had already released Punishing: Gray Raven before Wuthering Waves.",
            "source": "https://www.kurogames.com/introduction"
          }
        ]
      }
    ],
    "timeline": [
      [
        "2014",
        "Kuro Games is founded.",
        "https://www.kurogames.com/introduction"
      ],
      [
        "2022",
        "Wuthering Waves is publicly revealed.",
        "https://store.epicgames.com/en-US/news/wuthering-waves-interview-kuro-games-launch-struggles-future-plans"
      ],
      [
        "May 2024",
        "The initial global release arrives.",
        "https://store.epicgames.com/en-US/news/wuthering-waves-interview-kuro-games-launch-struggles-future-plans"
      ]
    ],
    "sources": [
      [
        "Developer and team background",
        "https://store.epicgames.com/en-US/news/wuthering-waves-interview-kuro-games-launch-struggles-future-plans"
      ],
      [
        "Company and headquarters background",
        "https://www.kurogames.com/introduction"
      ],
      [
        "Developer / studio photograph",
        "https://www.kurogames.com/join"
      ]
    ],
    "map": {
      "label": "Kuro Games · Guangzhou, China",
      "query": "KURO GAMES Guangzhou China"
    }
  },
  "nte": {
    "headline": "The strange beginnings of Hethereau",
    "summary": "Hotta Studio’s idea for a city where everyday life meets the supernatural.",
    "developer": "Hotta Studio",
    "company": "Hotta Studio · Perfect World Games",
    "development": "Publicly announced in July 2024",
    "release": "29 April 2026 · Global release",
    "location": "Publisher: Beijing, China · Hotta office location not independently verified here",
    "updated": "2026-10-17",
    "hero": {
      "src": "/images/studios/perfect-world-building.webp",
      "small": "/images/studios/perfect-world-building-640.webp",
      "width": 1495,
      "height": 1600,
      "alt": "Perfect World office tower at Wangjing East Road in Beijing, photographed in August 2023",
      "caption": "Perfect World’s building in Wangjing, Beijing, photographed in 2023. This shows NTE’s publisher, not a verified Hotta Studio development office.",
      "credit": "N509FZ / Wikimedia Commons",
      "source": "https://commons.wikimedia.org/wiki/File:Perfect_World_building,_Wangjing_(20230821162801).jpg",
      "license": "https://creativecommons.org/licenses/by-sa/4.0/",
      "smallWidth": 598
    },
    "teamPhoto": {
      "src": "/images/studios/hotta-city-development.webp",
      "small": "/images/studios/hotta-city-development-640.webp",
      "width": 1200,
      "height": 675,
      "alt": "Hethereau city buildings from Hotta Studio’s Unreal Engine developer interview",
      "caption": "Hotta Studio’s city environment, supplied for its Unreal Engine interview. This is an in-game development image, not a headquarters photograph.",
      "credit": "Hotta Studio / Unreal Engine",
      "source": "https://www2.unrealengine.com/developer-interviews/crafting-the-urban-open-world-of-nte-neverness-to-everness-with-ue5-across-pc-playstation-5-and-mobile",
      "smallWidth": 640
    },
    "chapters": [
      {
        "id": "origins",
        "label": "Why it began",
        "title": "The city that inspired a new project",
        "paragraphs": [
          {
            "text": "Hotta Studio’s urban experiments in Tower of Fantasy helped lead to Neverness to Everness. In an Unreal Engine interview, producer Kee Zhang specifically identified Mirroria, the city developed for Tower of Fantasy 2.0, as an inspiration. NTE expanded that experience into a new modern-city project where the everyday and supernatural coexist.",
            "source": "https://www2.unrealengine.com/developer-interviews/crafting-the-urban-open-world-of-nte-neverness-to-everness-with-ue5-across-pc-playstation-5-and-mobile"
          }
        ]
      },
      {
        "id": "development",
        "label": "Development",
        "title": "From its reveal to release",
        "paragraphs": [
          {
            "text": "Hotta Studio introduced the project publicly in July 2024. Producer Kee Zhang presented its supernatural urban concept on PlayStation Blog. A later official announcement set the global release for 29 April 2026. The public reveal is a confirmed milestone, not a confirmed date for the start of internal development.",
            "source": "https://blog.playstation.com/?p=417661"
          }
        ]
      },
      {
        "id": "process",
        "label": "The process",
        "title": "From Unreal Engine 4 experience to Unreal Engine 5",
        "paragraphs": [
          {
            "text": "Hotta moved from the Unreal Engine 4 experience it gained on Tower of Fantasy to Unreal Engine 5 for NTE. Kee Zhang describes city-building tools, lighting and world streaming as ways to support the project’s urban ambitions. The team also adapted its presentation across PC, PlayStation 5 and mobile, while retaining a shared underlying world.",
            "source": "https://www2.unrealengine.com/developer-interviews/crafting-the-urban-open-world-of-nte-neverness-to-everness-with-ue5-across-pc-playstation-5-and-mobile"
          }
        ]
      },
      {
        "id": "team",
        "label": "The team",
        "title": "Kee Zhang and Hotta Studio",
        "paragraphs": [
          {
            "text": "Unreal Engine’s April 2026 interview identifies Kee Zhang as producer and head of Hotta Studio. He describes building on the team’s experience with Tower of Fantasy and its familiarity with Unreal Engine.",
            "source": "https://www2.unrealengine.com/developer-interviews/crafting-the-urban-open-world-of-nte-neverness-to-everness-with-ue5-across-pc-playstation-5-and-mobile"
          }
        ]
      },
      {
        "id": "company",
        "label": "Company & headquarters",
        "title": "Hotta Studio and publisher Perfect World Games",
        "paragraphs": [
          {
            "text": "Hotta Studio develops NTE, while Perfect World Games publishes it. Hotta previously created Tower of Fantasy. Perfect World’s company premises are in Beijing; a separate Hotta development-office location has not been verified for this article.",
            "source": "https://www.gematsu.com/2024/07/supernatural-urban-open-world-rpg-neverness-to-everness-announced-for-ps5-pc-ios-and-android"
          }
        ]
      }
    ],
    "timeline": [
      [
        "July 2024",
        "Hotta publicly introduces Neverness to Everness.",
        "https://blog.playstation.com/?p=394143"
      ],
      [
        "27 April 2026",
        "Kee Zhang discusses the project’s creative and technical background.",
        "https://www2.unrealengine.com/developer-interviews/crafting-the-urban-open-world-of-nte-neverness-to-everness-with-ue5-across-pc-playstation-5-and-mobile"
      ],
      [
        "29 April 2026",
        "The announced global release date arrives.",
        "https://blog.playstation.com/?p=417661"
      ]
    ],
    "sources": [
      [
        "Developer and team background",
        "https://www2.unrealengine.com/developer-interviews/crafting-the-urban-open-world-of-nte-neverness-to-everness-with-ue5-across-pc-playstation-5-and-mobile"
      ],
      [
        "Producer Kee Zhang’s release announcement",
        "https://blog.playstation.com/?p=417661"
      ],
      [
        "Company and headquarters background",
        "https://www.gematsu.com/2024/07/supernatural-urban-open-world-rpg-neverness-to-everness-announced-for-ps5-pc-ios-and-android"
      ],
      [
        "Hotta Studio’s original project introduction",
        "https://blog.playstation.com/?p=394143"
      ],
      [
        "Headquarters / workplace photograph",
        "https://commons.wikimedia.org/wiki/File:Perfect_World_building,_Wangjing_(20230821162801).jpg"
      ]
    ],
    "map": {
      "label": "Publisher: Perfect World · Beijing, China",
      "query": "Perfect World 1 Wangjing East Road Beijing China"
    }
  },
  "mlbb": {
    "headline": "The origins of a mobile arena",
    "summary": "The company and early history behind Mobile Legends: Bang Bang.",
    "developer": "MOONTON Games",
    "company": "MOONTON Games",
    "development": "Created before its 2016 launch",
    "release": "November 2016 · Worldwide launch",
    "location": "Shanghai, China · offices and teams in multiple markets",
    "updated": "2026-10-17",
    "hero": {
      "src": "/images/studios/moonton-headquarters.webp",
      "small": "/images/studios/moonton-headquarters-640.webp",
      "smallWidth": 640,
      "width": 1600,
      "height": 646,
      "alt": "MOONTON Games headquarters exterior with its logo in Shanghai",
      "caption": "MOONTON Games’ Shanghai headquarters, shown in the company’s official website photography.",
      "credit": "MOONTON Games",
      "source": "https://en.moonton.com/"
    },
    "teamPhoto": {
      "src": "/images/studios/moonton-team.webp",
      "small": "/images/studios/moonton-team-640.webp",
      "width": 800,
      "height": 570,
      "alt": "MOONTON Games employees celebrating the company’s eleventh anniversary in an office",
      "caption": "MOONTON employees celebrating the company’s eleventh anniversary in 2025, from its official company post.",
      "credit": "MOONTON Games",
      "source": "https://www.linkedin.com/posts/moontongames_lifeatmoonton-community-teamappreciation-activity-7349286325415550981-eh4y",
      "smallWidth": 640
    },
    "chapters": [
      {
        "id": "origins",
        "label": "Why it began",
        "title": "Building a competitive game for phones",
        "paragraphs": [
          {
            "text": "Mobile Legends: Bang Bang brought the multiplayer online battle arena format to mobile players. MOONTON’s company history places its worldwide launch in November 2016, followed by its first offline esports event in Indonesia in May 2017. Those documented milestones explain its early direction more reliably than an unverified claim about a single creative inspiration.",
            "source": "https://www.mobilelegends.com/"
          }
        ]
      },
      {
        "id": "development",
        "label": "Development",
        "title": "A 2016 beginning",
        "paragraphs": [
          {
            "text": "MOONTON’s company history places the worldwide launch of Mobile Legends: Bang Bang in November 2016. That is its release year, not a verified date for when development started. The company’s public overview does not provide a precise internal production timeline, so an exact development start date would be speculative.",
            "source": "https://en.moonton.com/about/index.html"
          }
        ]
      },
      {
        "id": "process",
        "label": "The process",
        "title": "Growing a game into an international operation",
        "paragraphs": [
          {
            "text": "MOONTON’s history documents the competitive infrastructure that followed MLBB’s launch: an offline event in Indonesia in May 2017, the first MSC later that year, and the introduction of MPL in November 2017. These milestones show the project expanding into organized competition, alongside the company’s game development and publishing work.",
            "source": "https://en.moonton.com/about/index.html"
          }
        ]
      },
      {
        "id": "team",
        "label": "The team",
        "title": "A company with several kinds of team",
        "paragraphs": [
          {
            "text": "MOONTON’s official material describes its work across game development, publishing and esports. Its company history dates its establishment to July 2014 and the worldwide launch of Mobile Legends: Bang Bang to November 2016.",
            "source": "https://en.moonton.com/join/index.html"
          }
        ]
      },
      {
        "id": "company",
        "label": "Company & headquarters",
        "title": "MOONTON Games, based in Shanghai",
        "paragraphs": [
          {
            "text": "MOONTON Games develops and publishes Mobile Legends: Bang Bang. Its corporate history records its establishment in July 2014, and its official privacy policy identifies Shanghai Moonton Technology Co., Ltd. at its Shanghai address. The company works across development, publishing and esports.",
            "source": "https://en.moonton.com/news/53.html"
          }
        ]
      }
    ],
    "timeline": [
      [
        "July 2014",
        "MOONTON Games is established.",
        "https://en.moonton.com/about/index.html"
      ],
      [
        "November 2016",
        "MLBB launches worldwide, according to the company timeline.",
        "https://en.moonton.com/about/index.html"
      ],
      [
        "2017",
        "Offline events, MSC and MPL begin building the competitive scene.",
        "https://en.moonton.com/about/index.html"
      ]
    ],
    "sources": [
      [
        "Official Mobile Legends: Bang Bang site",
        "https://www.mobilelegends.com/"
      ],
      [
        "MOONTON Games: company history and milestones",
        "https://en.moonton.com/about/index.html"
      ],
      [
        "Developer and team background",
        "https://en.moonton.com/join/index.html"
      ],
      [
        "Company and headquarters background",
        "https://en.moonton.com/news/53.html"
      ],
      [
        "Developer / studio photograph",
        "https://www.linkedin.com/posts/moontongames_lifeatmoonton-community-teamappreciation-activity-7349286325415550981-eh4y"
      ],
      [
        "MOONTON headquarters photograph",
        "https://en.moonton.com/"
      ]
    ],
    "map": {
      "label": "MOONTON Games · Shanghai, China",
      "query": "MOONTON Games Shanghai China"
    }
  }
}
