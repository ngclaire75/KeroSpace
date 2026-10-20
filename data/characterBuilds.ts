export type BuildItem = { name: string; detail?: string; image?: string }
export type BuildGroup = { label: string; items: BuildItem[] }
export type BuildStat = { label: string; value: string }
export type CharacterBuild = { name: string; groups: BuildGroup[]; stats: BuildStat[]; priorities: BuildStat[] }
export type TeamSlot = { options: BuildItem[] }
export type TeamSynergy = { name: string; slots: TeamSlot[]; kind: 'team' | 'partner' | 'observed' }
export type CharacterBuildResponse = {
  teams?: TeamSynergy[]
  game: string
  title: string
  image?: string
  builds: CharacterBuild[]
  status: 'available' | 'missing' | 'unavailable'
  source: { name: string; url: string; updated?: string }
  checkedAt: string | null
  /** Served from a fallback source after the preferred one failed; cache only briefly. */
  provisional?: boolean
  /** Why a freshly parsed build was refused (see server/utils/buildQuality.ts). */
  rejected?: string
}
