import type { GamePlatform } from './platforms'

export type CompatibilityMode = 'crossplay' | 'coop' | 'crosssave'

export type CompatibilityDetail = {
  status: string
  tone: 'yes' | 'limited' | 'solo'
  headline: string
  description: string
  note: string
  source: string
}

export type CompatibilityGame = {
  id: string
  name: string
  category: string
  platforms: GamePlatform[]
  details: Record<CompatibilityMode, CompatibilityDetail>
}

// Reviewed against publisher FAQs and official storefronts on 2026-10-15.
// Social features and limited events are not equivalent to a shared campaign.
const hoyoSync = 'https://support.hoyoverse.com/hc/en-us/articles/49686152994457-How-to-synchronize-game-data-across-platforms'
const hsrPs5 = 'https://hsr.hoyoverse.com/en-us/news/113017?type=news_all'
const hsrStore = 'https://www.playstation.com/en-us/games/honkai-star-rail/'
const genshinCoop = 'https://genshin.hoyoverse.com/en/news/detail/5314'
const hi3Store = 'https://store.steampowered.com/app/1671200/Honkai_Impact_3rd/'
const wuwaPs5 = 'https://wutheringwaves.kurogames.com/en/main/news/detail/1858'
const nteLaunch = 'https://nte.perfectworld.com/en/article/news/gamenews/20260226/261061.html'
const nteAccount = 'https://nte.perfectworld.com/en/article/news/gamebroad/20260428/261969.html'
const mlbbStore = 'https://apps.apple.com/id/app/mobile-legends-bang-bang/id1160056295'
const mlbbAccount = 'https://www.mobilelegends.com/news/articleldetail?newsid=2728920'

export const compatibilityModes: { id: CompatibilityMode; name: string; question: string; explanation: string }[] = [
  { id: 'crossplay', name: 'Cross-play', question: 'Different devices. Same game?', explanation: 'Join players on other supported platforms.' },
  { id: 'coop', name: 'Co-op', question: 'Room for your friends?', explanation: 'See how you can share a session.' },
  { id: 'crosssave', name: 'Cross-save', question: 'Taking your progress with you?', explanation: 'Continue your account on another device.' },
]

export const compatibilityGames: CompatibilityGame[] = [
  {
    id: 'hsr', name: 'Honkai: Star Rail', category: 'Turn-based RPG',
    platforms: ['windows', 'ps5', 'ios', 'android'],
    details: {
      crossplay: { status: 'Limited', tone: 'limited', headline: 'A solo-first journey', description: 'The Trailblaze story is single-player. Social features and special events do not make it a shared campaign.', note: 'Playing on different devices is mainly about continuing your own save.', source: hsrStore },
      coop: { status: 'Solo campaign', tone: 'solo', headline: 'Your own adventure', description: 'Build and command your own team through the main story. Multiplayer features are separate from campaign progression.', note: 'A four-character team is controlled by one player.', source: hsrStore },
      crosssave: { status: 'Supported', tone: 'yes', headline: 'One Trailblaze, many screens', description: 'Continue on PC, iOS, Android or PS5 with your linked HoYoverse account.', note: 'Use the same server. Progress does not transfer between regions.', source: hsrPs5 },
    },
  },
  {
    id: 'genshin', name: 'Genshin Impact', category: 'Open-world RPG',
    platforms: ['windows', 'ps5', 'xbox', 'ios', 'android'],
    details: {
      crossplay: { status: 'Supported', tone: 'yes', headline: 'Meet across devices', description: 'Explore together across supported PC, console and mobile versions of the game.', note: 'Choose the same server as your friends before you begin.', source: genshinCoop },
      coop: { status: 'Up to 4 players', tone: 'yes', headline: 'Bring a party to Teyvat', description: 'Join friends for exploration, bosses and eligible Domains after unlocking Co-Op at Adventure Rank 16.', note: 'Required quests and World Level can affect who can join.', source: genshinCoop },
      crosssave: { status: 'Supported', tone: 'yes', headline: 'Take Teyvat with you', description: 'Your linked HoYoverse account carries progress across PC, mobile, PlayStation and Xbox.', note: 'Sign in to the same account and server on each device.', source: hoyoSync },
    },
  },
  {
    id: 'hi3', name: 'Honkai Impact 3rd', category: 'Action RPG',
    platforms: ['windows', 'mac', 'ios', 'android'],
    details: {
      crossplay: { status: 'With conditions', tone: 'limited', headline: 'Match your server', description: 'PC and mobile players need compatible regional versions and an available multiplayer mode.', note: 'Shared account progress does not make every activity multiplayer.', source: hi3Store },
      coop: { status: 'Mode-dependent', tone: 'limited', headline: 'Team up in select modes', description: 'Co-op is listed on the official store, but the available activities depend on the current mode and events.', note: 'The main story follows your own progress; older co-op modes may change.', source: hi3Store },
      crosssave: { status: 'With conditions', tone: 'limited', headline: 'HoYoPlay + mobile', description: 'Use the HoYoPlay PC client and the same HoYoverse account to continue your mobile progress.', note: 'Your account and regional server must both match on each device.', source: hoyoSync },
    },
  },
  {
    id: 'wuwa', name: 'Wuthering Waves', category: 'Open-world RPG',
    platforms: ['windows', 'mac', 'ps5', 'xbox', 'ios', 'android'],
    details: {
      crossplay: { status: 'Supported', tone: 'yes', headline: 'Roam across platforms', description: 'Meet other Rovers across supported platforms on the same regional server.', note: 'World progression and activity rules still apply to joining a friend.', source: wuwaPs5 },
      coop: { status: 'Up to 3 players', tone: 'yes', headline: 'Make room for two more', description: 'Bring friends into supported co-op activities and explore the world together.', note: 'Story quests and some challenges remain single-player.', source: 'https://www.playstation.com/en-us/games/wuthering-waves/' },
      crosssave: { status: 'Supported', tone: 'yes', headline: 'Your Rover, wherever you play', description: 'Carry your progress between supported devices through your linked Kuro Games account.', note: 'Link your existing account when starting on console and keep the same server.', source: wuwaPs5 },
    },
  },
  {
    id: 'nte', name: 'Neverness to Everness', category: 'Urban open-world RPG',
    platforms: ['windows', 'mac', 'ps5', 'ios', 'android'],
    details: {
      crossplay: { status: 'Supported', tone: 'yes', headline: 'One city, different screens', description: 'Cross-platform support connects players across PC, Mac, PS5, iOS and Android.', note: 'Use the same regional server to connect with your friends.', source: nteLaunch },
      coop: { status: 'Selected activities', tone: 'limited', headline: 'Share a little city life', description: 'Online co-op is supported. Join friends in the activities that allow a shared session.', note: 'Co-op support does not mean all story quests can be completed together.', source: 'https://store.steampowered.com/app/4508340/NTE_Neverness_to_Everness/' },
      crosssave: { status: 'Supported', tone: 'yes', headline: 'Keep your life in Hethereau', description: 'Continue with the same account across devices. Link PWG Email before bringing an existing save to PS5.', note: 'Different servers and different login accounts keep separate progress.', source: nteAccount },
    },
  },
  {
    id: 'mlbb', name: 'Mobile Legends: Bang Bang', category: '5v5 MOBA',
    platforms: ['googleplay', 'ios', 'android'],
    details: {
      crossplay: { status: 'Supported', tone: 'yes', headline: 'iOS + Android', description: 'Mobile players can squad up and compete together across iOS and Android.', note: 'App editions and matchmaking availability can vary by region.', source: mlbbStore },
      coop: { status: 'Team-based PvP', tone: 'limited', headline: 'Five on your side', description: 'Coordinate heroes, roles and builds with teammates in 5v5 battles against another team.', note: 'This is competitive team play, rather than a co-op story campaign.', source: mlbbStore },
      crosssave: { status: 'Linked account', tone: 'yes', headline: 'New phone, same heroes', description: 'Bind your game account before changing devices, then sign in with the same linked login.', note: 'Keep access to your linked account; a guest profile can be lost.', source: mlbbAccount },
    },
  },
]

// card artwork + focus point so faces stay in frame (stagePos: framing in the big panel, if different)
export const playTogetherArt: Record<string, { src: string; pos: string; stagePos?: string }> = {
  hsr: { src: '/images/games/hsr-mod-esrgan.webp', pos: 'center 22%' },
  genshin: { src: '/images/games/genshin-hutao-4x-esrgan.webp', pos: 'center 17%' },
  hi3: { src: '/images/games/hi3-mod-esrgan.webp', pos: 'center 20%' },
  wuwa: { src: '/images/games/wuwa-mod-esrgan.webp', pos: 'center 100%' },
  nte: { src: '/images/games/nte-mod-esrgan.webp', pos: 'center 64%' },
  mlbb: { src: '/images/games/mlbb-mod-esrgan.webp', pos: 'center 34%' },
}
