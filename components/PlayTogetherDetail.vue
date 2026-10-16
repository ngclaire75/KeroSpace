<script setup lang="ts">
import { compatibilityModes, type CompatibilityGame } from '~/data/playTogether'
import { platformMarks } from '~/data/platforms'

const props = defineProps<{ game: CompatibilityGame; idPrefix: string }>()

// card artwork + focus point so faces stay in frame
const art: Record<string, { src: string; pos: string }> = {
  hsr: { src: '/images/games/hsr-mod-esrgan.webp', pos: 'center 22%' },
  genshin: { src: '/images/games/genshin-mod-esrgan.webp', pos: 'center 18%' },
  hi3: { src: '/images/games/hi3-mod-esrgan.webp', pos: 'center 20%' },
  wuwa: { src: '/images/games/wuwa-mod-esrgan.webp', pos: 'center 100%' },
  nte: { src: '/images/games/nte-mod-esrgan.webp', pos: 'center 64%' },
  mlbb: { src: '/images/games/mlbb-mod-esrgan.webp', pos: 'center 34%' },
}
const cardArt = computed(() => art[props.game.id] ?? { src: `/images/games/card-${props.game.id}.webp`, pos: 'center 30%' })
// one icon per logo: Mac + iOS share the Apple mark
const icons = computed(() => props.game.platforms.filter((platform, i, all) =>
  all.findIndex(other => platformMarks[other].asset === platformMarks[platform].asset) === i))
const platformNames = computed(() => props.game.platforms.map(platform => platformMarks[platform].name).join(', '))
</script>

<template>
  <div class="party-detail">
    <div class="party-detail__art">
      <img :src="cardArt.src" :style="{ objectPosition: cardArt.pos }" alt="" loading="lazy" width="480" height="300" />
      <div class="party-detail__art-copy">
        <img class="party-detail__logo" :src="`/images/games/${game.id}-logo.webp`" :alt="game.name" width="140" height="64" loading="lazy" />
      </div>
    </div>

    <div class="party-detail__platforms">
      <span class="party-detail__label">Plays on</span>
      <ul :aria-label="`${game.name} platforms: ${platformNames}`" :title="platformNames">
        <li v-for="platform in icons" :key="platform" aria-hidden="true"><PlatformMark :platform="platform" /></li>
      </ul>
      <p v-if="game.platformNote" class="party-detail__platform-note">{{ game.platformNote.replace(/^¹\s*/, '') }}</p>
    </div>

    <ol class="party-detail__modes">
      <li v-for="mode in compatibilityModes" :key="mode.id" class="party-mode" :class="`party-mode--${game.details[mode.id].tone}`">
        <span class="party-mode__name">{{ mode.name }}</span>
        <h4 :id="`${idPrefix}-${game.id}-${mode.id}`">{{ game.details[mode.id].headline }}</h4>
        <p>{{ game.details[mode.id].description }}</p>
        <p class="party-mode__note"><span>Good to know</span>{{ game.details[mode.id].note }}</p>
        <a :href="game.details[mode.id].source" target="_blank" rel="noopener noreferrer"
          :aria-label="`Official ${mode.name} information for ${game.name} (opens in a new tab)`">Official details <span aria-hidden="true">↗</span></a>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.party-detail { display: flex; flex: 1; flex-direction: column; min-width: 0; }
.party-detail__art { position: relative; height: 210px; overflow: hidden; border-radius: 12px 12px 0 0; background: #000; }
.party-detail__art > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 35%; }
.party-detail__art::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0, 0, 0, .05) 0%, rgba(0, 0, 0, .3) 60%, #000 100%); }
.party-detail__art-copy { position: absolute; z-index: 1; left: 22px; right: 22px; bottom: 16px; display: flex; align-items: center; justify-content: center; gap: 16px; }
.party-detail__logo { width: 140px; max-width: 100%; height: 64px; object-fit: contain; object-position: center; filter: drop-shadow(0 4px 14px rgba(0, 0, 0, .7)); }

.party-detail__platforms { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; padding: 16px 22px; }
.party-detail__label, .party-mode__note > span { color: var(--together-purple, #bd91ff); font-size: 10px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
.party-detail__platforms ul { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; margin: 0; padding: 0; list-style: none; }
.party-detail__platforms :deep(.platform-mark__icon) { width: 26px; height: 26px; }
.party-detail__platforms :deep(.platform-mark__label) { display: none; }
.party-detail__platforms :deep(.platform-mark[title="PlayStation 5"] .platform-mark__icon) { width: 36px; height: 36px; }
.party-detail__platforms :deep(.platform-mark[title^="Mac"] .platform-mark__icon),
.party-detail__platforms :deep(.platform-mark[title^="iOS"] .platform-mark__icon) { width: 31px; height: 31px; }
.party-detail__platforms :deep(.platform-mark[title="Android"] .platform-mark__icon) { width: 34px; height: 34px; }
.party-detail__platform-note { flex-basis: 100%; margin: 0; color: var(--together-muted, #c1b9c9); font-size: 11px; }

.party-detail__modes { margin: 0; padding: 0; list-style: none; }
.party-mode { position: relative; padding: 18px 22px 12px; }
.party-mode__name { display: block; font: 800 12px/1.4 var(--display); letter-spacing: .06em; text-transform: uppercase; }
.party-mode h4 { margin: 12px 0 6px; font-size: 19px; font-weight: 800; line-height: 1.3; letter-spacing: -.02em; }
.party-mode p { margin: 0; color: #f3edf7; font-size: 14px; line-height: 1.65; }
.party-mode .party-mode__note { display: grid; gap: 3px; margin-top: 10px; color: var(--together-muted, #c1b9c9); font-size: 13px; line-height: 1.6; }
.party-mode a { display: inline-flex; align-items: center; gap: 10px; min-height: 40px; margin-top: 4px; font-size: 12px; font-weight: 800; text-underline-offset: 4px; }
.party-mode a:hover { text-decoration: underline; }
.party-mode a > span { color: #ff83cf; font-size: 16px; }

@media (max-width: 860px) {
  .party-detail__art { height: 190px; }
  .party-detail__logo { width: 120px; height: 52px; }
  .party-detail__platforms, .party-mode { padding-inline: 18px; }
}
</style>
