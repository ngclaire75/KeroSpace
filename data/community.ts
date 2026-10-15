// Community page content.
// Links checked 2026-10-15: official game sites, HoYoLAB (HoYoverse's official
// community app) and the official Wuthering Waves Discord.

export type CommunityHub = {
  id: string
  developer: string
  banner: string
  site: string
  community?: { label: string; href: string }
}

const hoyolab = { label: 'HoYoLAB', href: 'https://www.hoyolab.com/' }

export const communityHubs: CommunityHub[] = [
  { id: 'hsr', developer: 'HoYoverse', banner: '/images/streamers/banner-hsr.webp', site: 'https://hsr.hoyoverse.com/', community: hoyolab },
  { id: 'genshin', developer: 'HoYoverse', banner: '/images/streamers/banner-genshin.webp', site: 'https://genshin.hoyoverse.com/', community: hoyolab },
  { id: 'hi3', developer: 'HoYoverse', banner: '/images/streamers/banner-hi3.webp', site: 'https://honkaiimpact3.hoyoverse.com/', community: hoyolab },
  {
    id: 'wuwa', developer: 'Kuro Games', banner: '/images/streamers/banner-wuwa.webp', site: 'https://wutheringwaves.kurogames.com/',
    community: { label: 'Official Discord', href: 'https://discord.com/servers/wuthering-waves-official-963760374543450182' },
  },
  { id: 'nte', developer: 'Hotta Studio', banner: '/images/streamers/banner-nte.webp', site: 'https://nte.perfectworld.com/en/' },
  { id: 'mlbb', developer: 'MOONTON Games', banner: '/images/streamers/banner-mlbb.webp', site: 'https://www.mobilelegends.com/' },
]

export type CommunityCreator = {
  game: string
  name: string
  handle: string
  photo: string
  banner: string
  /** artwork for the featured streamer card on the community page */
  card: string
  /** optional object-position override for that card artwork */
  cardPosition?: string
  /** artwork for the hero mosaic tile on the community page */
  tile: string
  role: string
  bio: string
}

// same creators as the home page spotlight; channels verified on Twitch
export const communityCreators: CommunityCreator[] = [
  { game: 'hsr', name: 'Tectone', handle: 'tectone', photo: '/images/streamers/tectone.webp', banner: '/images/streamers/banner-hsr.webp', card: '/images/r-hsr.jpg', cardPosition: 'center 58%', tile: '/images/starrailcom.JPG', role: 'Gacha streamer', bio: 'Star Rail updates, reactions and lively discussion, all in one place.' },
  { game: 'genshin', name: 'Tuonto', handle: 'tuonto', photo: '/images/streamers/tuonto.webp', banner: '/images/streamers/banner-genshin.webp', card: '/images/k-genshin.jpg', tile: '/images/genshincom.JPG', role: 'Gaming creator', bio: 'Character builds, challenges and pulls, with a famous soft spot for Jean.' },
  { game: 'hi3', name: 'Fenrysk', handle: 'fenrysk', photo: '/images/streamers/fenrysk.webp', banner: '/images/streamers/banner-hi3.webp', card: '/images/r-hsr3.jpg', tile: '/images/hsr3com.JPG', role: 'Streamer & artist', bio: 'Competitive Honkai combat, gameplay and theorycrafting.' },
  { game: 'wuwa', name: 'Rubee', handle: 'rubee', photo: '/images/streamers/rubee.webp', banner: '/images/streamers/banner-wuwa.webp', card: '/images/c-wuwa.jpg', tile: '/images/wuwacom.JPG', role: 'VTuber', bio: 'Exploration and finds worth sharing with chat across Solaris-3.' },
  { game: 'nte', name: 'Bnuy', handle: 'bnuy', photo: '/images/streamers/bnuy.webp', banner: '/images/streamers/banner-nte.webp', card: '/images/s-nte.JPG', tile: '/images/ntecom.JPG', role: 'Streamer & cosplayer', bio: 'A Sweden-based gamer mixing play with creativity in Neverness to Everness.' },
  { game: 'mlbb', name: 'smetanduck', handle: 'smetanduck', photo: '/images/streamers/smetanduck.webp', banner: '/images/streamers/banner-mlbb.webp', card: '/images/c-mlbb.jpg', tile: '/images/mlbbcom.jpg', role: 'Russian-language creator', bio: 'Ranked-climb strategy, live matches and answers to chat’s questions.' },
]

export const teamUpSteps = [
  { title: 'Match your server', text: 'Most of these games split players by region. Pick the same server as your friends before you start.' },
  { title: 'Unlock the mode', text: 'Co-op often opens later in the story. In Genshin Impact, for example, it unlocks at Adventure Rank 16.' },
  { title: 'Swap your IDs', text: 'Share your in-game UID or friend code, never your login details.' },
  { title: 'Agree on the plan', text: 'Farming, bosses or just exploring? Decide up front so nobody waits around.' },
  { title: 'Keep chat friendly', text: 'Be patient with newer players and use the report tools instead of arguing.' },
]

export const safetyTips = [
  { title: 'Keep your login to yourself', text: 'Real support staff will never ask for your password or a verification code.' },
  { title: 'Top up through trusted channels', text: 'Use the in-game shop, the official store or a top-up service you trust.' },
  { title: 'Skip “free currency” offers', text: 'Giveaways that ask you to sign in somewhere else are a common way accounts get stolen.' },
  { title: 'Turn on extra security', text: 'Link an email or phone and switch on any extra verification your game offers.' },
]

export const communityFaq = [
  {
    q: 'Can I play with friends on a different platform?',
    a: 'It depends on the game. Genshin Impact and Wuthering Waves support cross-play, while Honkai: Star Rail is a solo campaign. Each game card under Official hubs shows its cross-play, co-op and cross-save status.',
  },
  {
    q: 'Why can’t my friend join my world?',
    a: 'The usual causes are different servers, a co-op mode that has not been unlocked yet, or an unfinished quest. Run through the team-up checklist together.',
  },
  {
    q: 'Will my progress follow me to a new device?',
    a: 'Most of these games save progress to your linked account. Sign in to the same account and server on the new device. Guest profiles can be lost, so link one first.',
  },
  {
    q: 'Who are the featured creators?',
    a: 'Fifteen Twitch streamers for each game we cover, picked because that game is a regular part of their streams. Every link goes straight to their channel.',
  },
  {
    q: 'Where do I find official news and events?',
    a: 'Use the official hubs on this page. They link to each game’s own website and community channels, so you always read it from the source.',
  },
]

export type Streamer = { name: string; handle: string; lang: string; note: string; avatar: string }

// official Twitch profile pictures (file names on static-cdn.jtvnw.net/jtv_user_pictures/),
// looked up per channel on 2026-10-15
export const twitchAvatar = (file: string) => `https://static-cdn.jtvnw.net/jtv_user_pictures/${file}`

// 14 more channels per game (15 with the featured creator above).
// Researched 2026-10-15 via TwitchMetrics / StreamsCharts game pages.
export const moreStreamers: Record<string, Streamer[]> = {
  hsr: [
    { name: 'MrPokke', handle: 'mrpokke', lang: 'EN', note: 'Star Rail is his main game', avatar: '1fc749e9-c96f-4e8e-8c3c-875d8ad8d542-profile_image-300x300.png' },
    { name: 'Enviosity', handle: 'enviosity', lang: 'EN', note: 'Gacha VTuber, Star Rail and Genshin guides', avatar: '0b0567b5-ee59-4336-9f71-80c7a6e32d91-profile_image-300x300.jpeg' },
    { name: 'CamdenVA', handle: 'camdenva', lang: 'EN', note: 'Mostly Star Rail, some Fortnite', avatar: '66a23021-7807-4e1c-9b2a-475f579a23c8-profile_image-300x300.png' },
    { name: 'nixirl', handle: 'nixirl', lang: 'EN', note: 'Star Rail is the main stream', avatar: 'b01d7b02-dff5-465e-8c9b-7fc2b5b81ee2-profile_image-300x300.png' },
    { name: 'StarlitFox', handle: 'starlitfox', lang: 'EN', note: 'Star Rail is the most-streamed game', avatar: '99a3aa92-92e5-4f71-a0eb-16743486023b-profile_image-300x300.png' },
    { name: 'Chewy_Bar', handle: 'chewy_bar', lang: 'EN', note: 'Star Rail is the most-streamed game', avatar: '0ee3d503-2ffc-4e2d-bc7e-9c4424fd8a48-profile_image-300x300.png' },
    { name: 'emilysunnyville', handle: 'emilysunnyville', lang: 'EN', note: 'Mostly Star Rail, some Pokémon', avatar: '44b16dfd-f683-4431-a02b-810f8909758a-profile_image-300x300.png' },
    { name: 'xer0slash', handle: 'xer0slash', lang: 'EN', note: 'Mainly streams Star Rail', avatar: '29cd389c-cc8e-45b9-b9aa-e956e671c1ae-profile_image-300x300.png' },
    { name: 'SyllaAria', handle: 'syllaaria', lang: 'EN', note: 'Usually streams Star Rail', avatar: '2480caf1-5700-49e7-a0ec-6e8af8a39370-profile_image-300x300.png' },
    { name: 'iwasbag', handle: 'iwasbag', lang: 'EN', note: 'Star Rail is the top game', avatar: '64945341-35a7-4a76-a631-0b4549402af4-profile_image-300x300.png' },
    { name: 'Singollo', handle: 'singollo', lang: 'RU', note: 'Mainly Star Rail', avatar: 'bc69f15e-1749-4f78-9849-5270727d6fd5-profile_image-300x300.png' },
    { name: 'NormandyRen', handle: 'normandyren', lang: 'RU', note: 'Mainly Star Rail', avatar: '301aa371-9f58-49cc-9503-2d6565de3386-profile_image-300x300.png' },
    { name: 'ELPGP1', handle: 'elpgp1', lang: 'ES', note: 'Mostly Star Rail, also Epic Seven', avatar: 'b74f311e-6e04-4685-a553-9155adba6809-profile_image-300x300.png' },
    { name: 'Elythee', handle: 'elythee', lang: 'FR', note: 'Star Rail plus Zenless Zone Zero', avatar: 'fd1c01fa-9aad-464f-b9b9-001462a0ea3d-profile_image-300x300.jpeg' },
  ],
  genshin: [
    { name: 'fobm4ster', handle: 'fobm4ster', lang: 'EN', note: 'One of the biggest Genshin channels on Twitch', avatar: '621a58a8-a9c6-4b6a-8bf0-9fbb29b57a36-profile_image-300x300.png' },
    { name: 'Zy0xxx', handle: 'zy0xxx', lang: 'EN', note: 'Builds and guides, big Xiao fan', avatar: 'd86f9f1f-e346-47b9-8290-a2d980daf7e5-profile_image-300x300.png' },
    { name: 'Zajef77', handle: 'zajef77', lang: 'EN', note: 'Genshin is the most-streamed game', avatar: '8cb6ba5d-ad82-4b41-a0e2-f62df4e208ad-profile_image-300x300.png' },
    { name: 'chawndo', handle: 'chawndo', lang: 'EN', note: 'Mainly Genshin, some Wuthering Waves', avatar: 'c69b793b-b0db-4497-a450-123130119789-profile_image-300x300.png' },
    { name: 'MurderofBirds', handle: 'murderofbirds', lang: 'EN', note: 'Mainly Genshin, also Star Rail', avatar: 'murderofbirds-profile_image-9d6fe5a907b45dbe-300x300.jpeg' },
    { name: 'Sekapoko', handle: 'sekapoko', lang: 'EN', note: 'Genshin is the most-streamed game', avatar: '27097d5d-728d-4595-8dea-3b94cbaf7b10-profile_image-300x300.png' },
    { name: 'BranOnline', handle: 'branonline', lang: 'EN', note: 'Mainly Genshin, some Dark Souls', avatar: '8027e76d-8f39-431a-8035-9490772f6cde-profile_image-300x300.png' },
    { name: 'Komemos', handle: 'komemos', lang: 'EN', note: 'Mostly Genshin, also ZZZ and WuWa', avatar: '8c268a1e-129c-413a-a87f-bd346b992cfb-profile_image-300x300.png' },
    { name: 'thejonathon', handle: 'thejonathon', lang: 'EN', note: 'Mainly Genshin Impact', avatar: 'f9ba453c-595a-4c2d-a835-ed0a0f1b8d53-profile_image-300x300.png' },
    { name: 'LimboSauce', handle: 'limbosauce', lang: 'EN', note: 'Genshin is the main game', avatar: '53509bab-3c56-4375-a730-1e605425cf48-profile_image-300x300.jpeg' },
    { name: 'dish', handle: 'dish', lang: 'EN', note: 'Mainly Genshin, some variety', avatar: '78f3038a-3c7e-4f75-b562-da55db37bab6-profile_image-300x300.png' },
    { name: 'jadealy', handle: 'jadealy', lang: 'EN', note: 'Mainly Genshin, some WuWa and PGR', avatar: '8ad2a40d-917d-4bab-a8c8-c9a9c3aa86e7-profile_image-300x300.png' },
    { name: 'Nokapt', handle: 'nokapt', lang: 'FR', note: 'VTuber, Genshin is the top game', avatar: 'f0c39f36-2fff-4642-a1bb-8ab838b9ed3e-profile_image-300x300.png' },
    { name: 'AlexYukiii', handle: 'alexyukiii', lang: 'FR', note: 'Mainly Genshin Impact', avatar: '70066a45-404c-4faf-874e-fcc13f161496-profile_image-300x300.png' },
  ],
  hi3: [
    { name: 'nohr_and_tea', handle: 'nohr_and_tea', lang: 'EN', note: 'Regular Honkai Impact 3rd streams', avatar: '15973945-5ff5-4153-b8f5-bda7089dbe29-profile_image-300x300.png' },
    { name: 'NekoNikaa', handle: 'nekonikaa', lang: 'EN', note: 'Streams HI3 almost exclusively', avatar: 'ffaff310-7c0c-4ab2-bf91-1aeaf59605c7-profile_image-300x300.png' },
    { name: 'slodolo', handle: 'slodolo', lang: 'EN', note: 'HI3 is the usual game', avatar: '03eb7b09-1cbc-41e8-bad0-c2a2addbe79d-profile_image-300x300.png' },
    { name: 'kzfik', handle: 'kzfik', lang: 'EN', note: 'Mainly HI3, some Punishing: Gray Raven', avatar: 'eee09891-0913-4045-8cd0-44c51a2cdf9e-profile_image-300x300.png' },
    { name: 'Twentynine_mi', handle: 'twentynine_mi', lang: 'EN', note: 'HI3 and Genshin streams', avatar: '2c5abcee-d63c-442b-8349-7df6f69e5793-profile_image-300x300.png' },
    { name: 'hikaril0v3', handle: 'hikaril0v3', lang: 'EN', note: 'HoYoverse games including HI3', avatar: '5438212b-b938-4294-b781-a4f98e68d0da-profile_image-300x300.png' },
    { name: 'エム田師匠', handle: 'mdamaster', lang: 'JP', note: 'Long HI3 sessions', avatar: '37f4e98f-2a1d-4090-bcb2-c6e1fa0d28ca-profile_image-300x300.png' },
    { name: '龍先生龍桑', handle: 'dimdrizzles', lang: 'ZH', note: 'Marathon HI3 streams', avatar: 'a42d0ced-1561-4a57-9887-542850af7eee-profile_image-300x300.png' },
    { name: '奈瀨東城', handle: 'shine1140', lang: 'ZH', note: 'One of the top HI3 channels lately', avatar: 'bd7948ca-9d4c-4044-86ab-0ec4565dcdce-profile_image-300x300.png' },
    { name: 'V_RisaLab', handle: 'v_risalab', lang: 'ES', note: 'Spanish-language HI3 streams', avatar: '0e8939c3-20a9-4a73-b1d1-17bfdbb4ee02-profile_image-300x300.png' },
    { name: 'AyashaStrife', handle: 'ayashastrife', lang: 'ES', note: 'Spanish-language HI3 streams', avatar: '2ab4debc-ec61-46b6-a162-f6a55f415cea-profile_image-300x300.png' },
    { name: 'Iotamu', handle: 'iotamu', lang: 'ES', note: 'HI3 is the usual game', avatar: '0d7dd460-7be4-443f-b769-889416507fe3-profile_image-300x300.png' },
    { name: 'AztroKryz', handle: 'aztrokryz', lang: 'ES', note: 'Gacha variety including HI3', avatar: '3714dc2b-9b85-4f32-a5d3-46561fcbbfb4-profile_image-300x300.png' },
    { name: 'Crystalhynn', handle: 'crystalhynn', lang: 'FR', note: 'HoYoverse games including HI3', avatar: '7acb3f9c-fde2-438d-be90-c5a43ec3ca39-profile_image-300x300.png' },
  ],
  wuwa: [
    { name: 'saintontas', handle: 'saintontas', lang: 'EN', note: 'Wuthering Waves is the main game', avatar: 'e559aaac-d54e-4fe3-b493-ce0263c951c6-profile_image-300x300.png' },
    { name: 'Kisuumi', handle: 'kisuumi', lang: 'EN', note: 'Frequent long WuWa streams', avatar: '6ffca211-9c29-4f66-aaad-c6b32374ae89-profile_image-300x300.png' },
    { name: 'Cherimu', handle: 'cherimu', lang: 'EN', note: 'A top English WuWa channel', avatar: 'a883cd67-356f-4ecd-9227-8fab753e8012-profile_image-300x300.png' },
    { name: 'Aznvasions', handle: 'aznvasions', lang: 'EN', note: 'WuWa is the usual game', avatar: 'd2b83bc4-038a-4548-9b52-dbcfcfdb50dd-profile_image-300x300.png' },
    { name: 'tigerish', handle: 'tigerish', lang: 'EN', note: 'WuWa is the usual game', avatar: '5d4f3e75-82b6-4954-93ec-b5355c1449c6-profile_image-300x300.png' },
    { name: 'Enna821', handle: 'enna821', lang: 'EN', note: 'WuWa is the usual game', avatar: '4ac4fa8e-595c-472e-9435-83d0a2a3fc80-profile_image-300x300.png' },
    { name: 'Yupina_Ch', handle: 'yupina_ch', lang: 'EN', note: 'VTuber, mostly WuWa', avatar: '140371b4-5738-4f5b-8c74-26b37469e4bc-profile_image-300x300.png' },
    { name: '小烈', handle: 'hyper2374', lang: 'ZH', note: 'Top WuWa channel by hours streamed', avatar: '71391d1c-2a25-4f14-ac7f-3ca03a8033ac-profile_image-300x300.png' },
    { name: 'Faello1', handle: 'faello1', lang: 'ES', note: 'Leading Spanish-language WuWa streamer', avatar: 'bed6d1d7-044f-487a-bad8-22cd440c9cb2-profile_image-300x300.png' },
    { name: 'OdinzadaYT', handle: 'odinzadayt', lang: 'PT', note: 'Long Portuguese WuWa streams', avatar: 'fd206aa7-2088-4326-bff3-2014711d90e2-profile_image-300x300.png' },
    { name: 'ShaozTV', handle: 'shaoztv', lang: 'FR', note: 'French WuWa streams', avatar: '7d9ee1f7-adba-448c-bf12-78477198e8d2-profile_image-300x300.jpeg' },
    { name: 'Dangar', handle: 'dangar', lang: 'RU', note: 'Large Russian channel playing WuWa', avatar: '4c9996de-8115-498a-bd83-8c3e92ca35f0-profile_image-300x300.png' },
    { name: 'Maliwan', handle: 'maliwan', lang: 'RU', note: 'Russian WuWa streams', avatar: '481f4f71-df78-4362-938c-9c3bfe6471ed-profile_image-300x300.png' },
    { name: 'miroichii', handle: 'miroichii', lang: 'RU', note: 'Long Russian WuWa streams', avatar: 'bd45949c-5c71-4917-a70f-76c72d1e05e1-profile_image-300x300.png' },
  ],
  nte: [
    { name: 'gateoo', handle: 'gateoo', lang: 'EN', note: 'Gacha RPG streamer, a top NTE channel', avatar: 'd97ba07e-c5bf-4917-98da-4a20e5f01f0e-profile_image-300x300.png' },
    { name: 'kariithow', handle: 'kariithow', lang: 'EN', note: 'Bilingual EN/ES variety, streams NTE', avatar: 'ff461cbe-60dc-4f17-ac02-559196555673-profile_image-300x300.jpeg' },
    { name: 'KotokiRou', handle: 'kotokirou', lang: 'EN', note: 'NTE and Genshin Impact', avatar: '94e651d6-7964-403e-af62-7e3ae280d5e0-profile_image-300x300.png' },
    { name: 'Zoeiittv', handle: 'zoeiittv', lang: 'EN', note: 'Variety streamer playing NTE', avatar: 'deb7cbf4-4b70-4623-b275-95c67bf258ff-profile_image-300x300.png' },
    { name: 'ke110x', handle: 'ke110x', lang: 'EN', note: 'RPG streamer, usually NTE', avatar: '6452bf00-382c-4ab6-a114-912c36e9b933-profile_image-300x300.png' },
    { name: 'DeathlyArrows', handle: 'deathlyarrows', lang: 'EN', note: 'Usually streams NTE', avatar: '2621d36d-e590-4c8b-86f3-f68c372093a7-profile_image-300x300.png' },
    { name: 'KoiNoStream', handle: 'koinostream', lang: 'ES', note: 'Recent NTE streams', avatar: '97d0f7fa-7741-4fa4-bd55-b3d28240ae61-profile_image-300x300.png' },
    { name: 'idolxCharmie', handle: 'idolxcharmie', lang: 'ES', note: 'NTE and Resident Evil', avatar: '4e8a0618-c277-48c3-ab78-09770948cf1f-profile_image-300x300.png' },
    { name: 'Sakura_Ayane', handle: 'sakura_ayane', lang: 'ES', note: 'Usually streams NTE', avatar: '57f00733-ada7-4831-b171-c68a58224019-profile_image-300x300.png' },
    { name: 'ChikiSenpai', handle: 'chikisenpai', lang: 'ES', note: 'Gacha streamer, NTE is the main game', avatar: 'd3d54526-3884-4dd4-989e-c66103a20d31-profile_image-300x300.png' },
    { name: 'CrazyTELEpuzik', handle: 'crazytelepuzik', lang: 'RU', note: 'NTE is the main game', avatar: '7e704365-c6e5-4ed2-8aef-788b7721bb66-profile_image-300x300.png' },
    { name: 'ibrahimoDlegend', handle: 'ibrahimodlegend', lang: 'AR', note: 'Gacha streamer, NTE is the main game', avatar: '79e23939-8e0d-42ae-a19a-766a38631faa-profile_image-300x300.png' },
    { name: '天神_甘猫', handle: 'amagami_channel', lang: 'JP', note: 'Gacha RPG streamer, usually NTE', avatar: 'f107e8fe-dc9b-4108-8694-a412aa966030-profile_image-300x300.png' },
    { name: 'ゆるいカメ', handle: 'yuruikame', lang: 'JP', note: 'Recent streams are all NTE', avatar: 'a08c924d-a21a-4ad6-b13b-58bf51fb4310-profile_image-300x300.png' },
  ],
  mlbb: [
    { name: 'MLBB_CIS', handle: 'mlbb_cis', lang: 'RU', note: 'Official MLBB CIS channel, tournaments', avatar: 'cd375ae6-083d-4469-b421-77f6c7ae2312-profile_image-300x300.png' },
    { name: 'titamin1', handle: 'titamin1', lang: 'RU', note: 'Usually streams MLBB', avatar: 'c7d33e88-0749-4eb5-92a3-4292e578bd57-profile_image-300x300.png' },
    { name: 'geass81', handle: 'geass81', lang: 'RU', note: 'MLBB-focused channel', avatar: 'bc0ac3b5-e79d-47a9-8c0e-522e61b2faae-profile_image-300x300.png' },
    { name: 'wizer02', handle: 'wizer02', lang: 'RU', note: 'MLBB-focused channel', avatar: '0ad772cb-4bb1-4da7-82d5-30eda4ae30f9-profile_image-300x300.png' },
    { name: 'oneshotmlbb', handle: 'oneshotmlbb', lang: 'RU', note: 'MLBB-focused channel', avatar: 'd8262c37-52e5-4cc2-9923-e1cc9bc7e15f-profile_image-300x300.png' },
    { name: 'LegoML', handle: 'legoml', lang: 'RU', note: 'MLBB-focused channel', avatar: 'b565eb46-f096-4243-848b-d4c28ebe4680-profile_image-300x300.jpeg' },
    { name: 'ScottyKil', handle: 'scottykil', lang: 'RU', note: 'MLBB-focused channel', avatar: 'efff270c-bce9-48b1-83ce-1bfd0729359e-profile_image-300x300.png' },
    { name: 'troublemakermlbb', handle: 'troublemakermlbb', lang: 'RU', note: 'MLBB-focused channel', avatar: 'a30b2345-f471-4cbf-83e3-cebbdd2ef363-profile_image-300x300.png' },
    { name: 'evilkingmlbb', handle: 'evilkingmlbb', lang: 'RU', note: 'MLBB-focused channel', avatar: 'd99df916-85a0-4fa2-bc57-58448be38d48-profile_image-300x300.png' },
    { name: 'Tasher3000s', handle: 'tasher3000s', lang: 'RU', note: 'MLBB-focused channel', avatar: '327cf653-3ec4-4e69-b7bb-c4e0a269a553-profile_image-300x300.png' },
    { name: 'lilcandymlbb', handle: 'lilcandymlbb', lang: 'RU', note: 'MLBB-focused channel', avatar: 'f4a3e399-d63d-4757-a939-c93d219f3230-profile_image-300x300.png' },
    { name: 'VickiGaming', handle: 'vickigaming', lang: 'ES', note: 'Usually streams MLBB', avatar: 'f35a606b-dcf8-44b8-a1ee-13ee682042a9-profile_image-300x300.png' },
    { name: 'CobraRRQ', handle: 'cobrarrq', lang: 'ES', note: 'MLBB, GTA V and Minecraft', avatar: 'a8e9349c-9284-41d8-8969-ae5c68595fad-profile_image-300x300.png' },
    { name: 'Zikzira', handle: 'zikzira', lang: 'PT', note: 'Usually streams MLBB', avatar: '1eb292da-e87d-4adf-a2b0-f994e9ca18c5-profile_image-300x300.png' },
  ],
}
