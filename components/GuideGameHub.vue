<script setup lang="ts">
import { guideGames } from '~/data/guides'
import { imageSources } from '~/utils/responsiveImages'

const props = defineProps<{ gameId: string }>()
const game = computed(() => guideGames.find(item => item.id === props.gameId)!)

useSeoMeta({
  title: () => `${game.value.name} characters & best builds | KeroSpace`,
  description: () => `${game.value.name} released characters and heroes with database-backed equipment recommendations and build priorities.`,
})

// A per-game tint for the hero light; the rest of the page stays on the KeroSpace pink/purple.
const accents: Record<string, string> = {
  hsr: '185, 140, 255', genshin: '111, 211, 255', hi3: '255, 95, 143',
  wuwa: '95, 224, 200', nte: '255, 159, 90', mlbb: '255, 207, 90',
}
const accent = computed(() => accents[props.gameId] || '255, 84, 187')

// The banner is the largest thing on screen: start downloading the right size before the CSS
// and scripts are parsed.
const bannerSources = computed(() => imageSources(game.value.banner))
useHead(() => ({
  link: [{ rel: 'preload', as: 'image', href: bannerSources.value.src, imagesrcset: bannerSources.value.srcset, imagesizes: '100vw', fetchpriority: 'high', key: 'guide-hub-banner' }],
}))

// The marquee under the banner continues the banner's own colours: stops sampled left to right
// from the banner's bottom edge (deepened where needed so the white words stay readable), with
// stars in the banner's brightest tint.
const marqueeTones: Record<string, { stops: string[]; star: string }> = {
  hsr: { stops: ['#3c3857', '#37355a', '#38355a', '#4c4346', '#533c4e', '#423c53', '#413b54'], star: '#b0adeb' },
  genshin: { stops: ['#394656', '#334b5c', '#2b4359', '#4f2635', '#542b38', '#5c2028', '#29283b'], star: '#ebadb6' },
  hi3: { stops: ['#63302b', '#682730', '#683c27', '#5f3056', '#5e3059', '#5f304a', '#5a3554'], star: '#f4a4b0' },
  wuwa: { stops: ['#223150', '#232b46', '#30375a', '#222b50', '#202b50', '#32455d', '#2a4e65'], star: '#adbbeb' },
  nte: { stops: ['#38612e', '#27684e', '#2c625a', '#543e3b', '#574337', '#685c27', '#345b37'], star: '#ede1ab' },
  mlbb: { stops: ['#1a1423', '#422c3c', '#592e3b', '#612e39', '#66282e', '#682739', '#60213a'], star: '#ebadb3' },
}
const marqueeStyle = computed(() => {
  const tone = marqueeTones[props.gameId]
  if (!tone) return {}
  return { background: `linear-gradient(90deg, ${tone.stops.join(', ')})`, '--gx-star': tone.star }
})



/* ---------- motion: progressive; without JS or with reduced motion the page is complete ---------- */
const root = ref<HTMLElement>()
const animate = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  if (!root.value || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  animate.value = true
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('is-in')
      observer?.unobserve(entry.target)
    }
  }, { rootMargin: '0px 0px -10% 0px' })
  root.value.querySelectorAll('[data-reveal]').forEach(node => observer?.observe(node))
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div ref="root" class="gd-page gd-page--wall gx" :class="{ 'gx-anim': animate }" :style="{ '--gx-accent': accent }">
    <GuideWall />
    <SiteNav />

    <main>
      <!-- ===== hero: the game's banner at full strength, text on a solid panel ===== -->
      <header class="gx-hero">
        <AppImage class="gx-hero__bg" :src="game.banner" :alt="`${game.name} artwork`" width="2400" height="1350" sizes="100vw" fetchpriority="high" loading="eager" />
        <div class="gx-shell gx-hero__inner">
          <!-- the page title stays for screen readers and search engines; the banner shows art only -->
          <h1 class="sr-only">{{ game.name }}</h1>
          <a href="#database" class="gx-badge" aria-label="Scroll to the characters">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <defs><path id="gx-badge-ring" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" /></defs>
                <text><textPath href="#gx-badge-ring" startOffset="2%" textLength="278" lengthAdjust="spacingAndGlyphs">Scroll to explore ✦ Scroll to explore ✦ </textPath></text>
              </svg>
              <span aria-hidden="true">↓</span>
          </a>
        </div>
      </header>

      <!-- ===== marquee ===== -->
      <div class="gx-marquee" :style="marqueeStyle" aria-hidden="true">
        <div class="gx-marquee__track">
          <template v-for="n in 2" :key="n">
            <span>{{ game.short }}</span><i>✦</i><span>Best builds</span><i>✦</i><span>Characters</span><i>✦</i><span>Equipment &amp; stats</span><i>✦</i>
          </template>
        </div>
      </div>

      <div class="gx-shell gx-body">
        <GuideCategoryExplorer :key="`categories-${game.id}`" :game-id="game.id" />
        <GuideWorldGallery :game-id="game.id" />

      </div>
    </main>


    <SiteFooter />
  </div>
</template>

<style src="../assets/css/guides.css"></style>

<style scoped>
.gx {
  --gx-line: rgba(255, 255, 255, 0.12);
  /* same content width and side gutters as the other guides pages */
  --gx-shell: min(1240px, 100% - 2 * clamp(16px, 4vw, 40px));
}
.gx-shell {
  width: var(--gx-shell);
  margin: 0 auto;
}
.gx-body {
  padding-bottom: clamp(80px, 9vw, 120px);
}

/* ============ hero ============ */
.gx-hero {
  position: relative;
  isolation: isolate;
  display: flex;
  min-height: clamp(540px, 74svh, 780px);
  /* same top gap as the game introduction banner (pages/games/[id].vue) */
  margin-top: clamp(24px, 3vw, 40px);
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
}
/* full-strength art: no fades, overlays or blur */
.gx-hero__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.gx-hero__inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding: clamp(28px, 3.6vw, 48px) 0;
}
.gx-badge {
  position: relative;
  display: grid;
  flex-shrink: 0;
  /* the badge is now the only item in the banner row: keep it on the right */
  margin-left: auto;
  place-items: center;
  width: 104px;
  height: 104px;
  border-radius: 50%;
  background: #000;
  animation: gx-fade 1s 0.8s var(--ease) both;
}
.gx-badge svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  animation: gx-spin 16s linear infinite;
}
.gx-badge text {
  fill: #fff;
  font: 800 9.5px var(--ui);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.gx-badge > span {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gd-grad);
  font-size: 17px;
  font-weight: 800;
  transition: scale 0.3s var(--ease);
}

@media (min-width: 1024px) {
  .gx-hero {
    margin-top: clamp(16px, 2vw, 28px);
  }
}

/* ============ marquee ============ */
.gx-marquee {
  /* sits flush under the hero without divider lines */
  overflow: hidden;
  /* solid band (overridden per game by marqueeStyle); the poster wall doesn't show through */
  background: #000;
  padding: clamp(14px, 1.8vw, 22px) 0;
}
.gx-marquee__track {
  display: flex;
  width: max-content;
  align-items: center;
  gap: clamp(16px, 2vw, 28px);
  animation: gx-marquee 40s linear infinite;
}
.gx-marquee span {
  font: 900 clamp(22px, 3.4vw, 48px) / 1 var(--display);
  letter-spacing: -0.03em;
  text-transform: uppercase;
  white-space: nowrap;
}
.gx-marquee i {
  color: var(--gx-star, var(--gd-pink));
  font-size: clamp(20px, 2.6vw, 34px);
  font-style: normal;
  line-height: 1;
}

/* ============ section scaffolding ============ */
.gx-section {
  margin-top: clamp(72px, 9vw, 128px);
  scroll-margin-top: 24px;
}
/* ============ scroll reveal (only once JS confirms motion is welcome) ============ */
.gx-anim [data-reveal] {
  opacity: 0;
  translate: 0 40px;
  transition: opacity 1s var(--ease), translate 1s var(--ease);
}
.gx-anim [data-reveal].is-in {
  opacity: 1;
  translate: 0 0;
}

/* ============ hover (mouse only) ============ */
@media (hover: hover) {
  .gx-badge:hover > span {
    scale: 1.15;
  }
}

/* ============ keyframes ============ */
@keyframes gx-fade {
  from { opacity: 0; translate: 0 16px; }
  to { opacity: 1; translate: 0 0; }
}
@keyframes gx-spin {
  to { transform: rotate(360deg); }
}
@keyframes gx-marquee {
  to { translate: -50% 0; }
}

/* ============ responsive ============ */

@media (max-width: 760px) {
  /* phones: banner on top at its own shape, the text panel below it */
  .gx-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    min-height: 0;
    background: #000;
  }
  .gx-hero__bg {
    position: relative;
    grid-area: 1 / 1;
    height: auto;
  }
  .gx-hero__inner {
    display: contents;
  }
  .gx-badge {
    grid-area: 1 / 1;
    z-index: 1;
    width: 84px;
    height: 84px;
    margin: 16px;
    justify-self: end;
    align-self: end;
  }
  .gx-badge > span {
    font-size: 20px;
  }
}


@media (prefers-reduced-motion: reduce) {
  .gx-badge,
  .gx-badge svg,
  .gx-marquee__track {
    animation: none;
  }
}
</style>
