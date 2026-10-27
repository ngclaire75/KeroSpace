<script setup lang="ts">
import { compatibilityModes, type CompatibilityGame } from '~/data/playTogether'
import { platformMarks } from '~/data/platforms'

const props = defineProps<{ game: CompatibilityGame }>()

// one icon per logo: Mac + iOS share the Apple mark
const icons = computed(() => props.game.platforms.filter((platform, i, all) =>
  all.findIndex(other => platformMarks[other].asset === platformMarks[platform].asset) === i))
const platformNames = computed(() => props.game.platforms.map(platform => platformMarks[platform].name).join(', '))
// shorter titles so "Plays on" fits on the same row
const shortNames: Record<string, string> = { mlbb: 'Mobile Legends' }
// three-bar strength meter: full support, with limits, solo
const strength = { yes: 3, limited: 2, solo: 1 } as const
</script>

<template>
  <div class="pt-detail">
    <div class="pt-detail__top">
      <div>
        <p class="pt-detail__genre">{{ game.category }}</p>
        <h3 class="pt-detail__name">{{ shortNames[game.id] ?? game.name }}</h3>
      </div>
      <div class="pt-detail__platforms">
        <span class="pt-detail__label">Plays on</span>
        <ul :aria-label="`${game.name} platforms: ${platformNames}`" :title="platformNames">
          <li v-for="platform in icons" :key="platform" aria-hidden="true"><PlatformMark :platform="platform" /></li>
        </ul>
      </div>
    </div>

    <ol class="pt-modes">
      <li v-for="mode in compatibilityModes" :key="mode.id" class="pt-mode" :class="`pt-mode--${game.details[mode.id].tone}`">
        <div class="pt-mode__head">
          <span class="pt-mode__name">{{ mode.name }}</span>
          <span class="pt-mode__meter" aria-hidden="true">
            <i v-for="n in 3" :key="n" :class="{ 'is-on': n <= strength[game.details[mode.id].tone] }" />
          </span>
        </div>
        <p class="pt-mode__status">{{ game.details[mode.id].status }}</p>
        <h4>{{ game.details[mode.id].headline }}</h4>
        <p class="pt-mode__desc">{{ game.details[mode.id].description }}</p>
        <p class="pt-mode__note"><span>Good to know</span>{{ game.details[mode.id].note }}</p>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.pt-detail { display: flex; flex-direction: column; height: 100%; }

/* ---------- top bar: name + platforms ---------- */
.pt-detail__top { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 16px 32px; padding: 40px 28px 6px; }
.pt-detail__genre { margin: 0 0 8px; color: var(--together-pink, #ff4d5e); font-size: 10px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; }
.pt-detail__name { margin: 0; font: 800 clamp(20px, 2vw, 26px)/1.15 var(--display); letter-spacing: -.01em; text-transform: uppercase; }
.pt-detail__platforms { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; max-width: 320px; }
.pt-detail__label, .pt-mode__note > span { color: var(--together-muted, #c1c1c3); font-size: 10px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
.pt-detail__platforms ul { display: flex; align-items: center; gap: 12px; margin: 0; padding: 0; list-style: none; }
.pt-detail__platforms :deep(.platform-mark__icon) { width: 22px; height: 22px; }
.pt-detail__platforms :deep(.platform-mark[title^="Windows PC"] .platform-mark__icon) { width: 20px; height: 20px; }
.pt-detail__platforms :deep(.platform-mark__label) { display: none; }
.pt-detail__platforms :deep(.platform-mark[title="PlayStation 5"] .platform-mark__icon) { width: 30px; height: 30px; }
.pt-detail__platforms :deep(.platform-mark[title^="Mac"] .platform-mark__icon),
.pt-detail__platforms :deep(.platform-mark[title^="iOS"] .platform-mark__icon) { width: 26px; height: 26px; }
.pt-detail__platforms :deep(.platform-mark[title="Android"] .platform-mark__icon) { width: 31px; height: 31px; }

/* ---------- three mode tiles ---------- */
.pt-modes { display: grid; flex: 1; grid-template-columns: repeat(3, minmax(0, 1fr)); margin: 0; padding: 0; list-style: none; }
.pt-mode { display: flex; flex-direction: column; padding: 24px 24px 20px; transition: background-color .25s; }
.pt-mode__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.pt-mode__name { font: 800 11px/1.4 var(--display); letter-spacing: .1em; text-transform: uppercase; }
.pt-mode__meter { display: flex; gap: 3px; }
.pt-mode__meter i { width: 14px; height: 4px; background: #2a2a2f; }
.pt-mode__meter i.is-on { background: #ff183b; box-shadow: 0 0 8px rgba(255, 24, 59, .6); }
.pt-mode--solo .pt-mode__meter i.is-on { background: #8d8d93; box-shadow: none; }

.pt-mode__status { margin: 18px 0 0; font: 800 clamp(17px, 1.6vw, 21px)/1.2 var(--display); letter-spacing: -.01em; text-transform: uppercase; }
.pt-mode--yes .pt-mode__status { background: linear-gradient(100deg, #ff183b, #ff183b 55%, #dcdce0); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.pt-mode--solo .pt-mode__status { color: #8d8d93; }
.pt-mode h4 { margin: 10px 0 0; font-size: 15px; font-weight: 800; line-height: 1.35; }
.pt-mode__desc { margin: 8px 0 0; color: #e6e6e9; font-size: 13.5px; line-height: 1.6; }
.pt-mode__note { display: grid; gap: 3px; margin: 16px 0 0; color: var(--together-muted, #c1c1c3); font-size: 12.5px; line-height: 1.55; }
/* link sits at the foot of every tile so they line up across the row */
@media (hover: hover) {
  .pt-mode:hover { background-color: rgba(255, 255, 255, .025); }
}

@media (max-width: 760px) {
  .pt-detail__top { align-items: flex-start; flex-direction: column; padding: 32px 20px 4px; }
  .pt-modes { grid-template-columns: minmax(0, 1fr); }
  .pt-mode { padding: 20px; }
}
</style>
