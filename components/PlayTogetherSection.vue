<script setup lang="ts">
import { compatibilityGames, playTogetherArt } from '~/data/playTogether'

const artFor = (id: string) => playTogetherArt[id] ?? { src: `/images/games/card-${id}.webp`, pos: 'center 30%' }

// one game on stage at a time, picked from the poster rail (an ARIA tab list)
const active = ref(0)
const game = computed(() => compatibilityGames[active.value]!)
const tabs: HTMLButtonElement[] = []

function select(i: number, focus = false) {
  const count = compatibilityGames.length
  active.value = (i + count) % count
  const tab = tabs[active.value]
  // keep the picked poster in view when the rail scrolls sideways on phones
  tab?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  if (focus) tab?.focus({ preventScroll: true })
}
// phones: swipe the panel sideways to change game
let touchX = 0
let touchY = 0
function onTouchStart(e: TouchEvent) {
  touchX = e.touches[0]!.clientX
  touchY = e.touches[0]!.clientY
}
function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0]!.clientX - touchX
  const dy = e.changedTouches[0]!.clientY - touchY
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) select(active.value + (dx < 0 ? 1 : -1))
}
function onKey(e: KeyboardEvent) {
  const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
  if (e.key in step) select(active.value + step[e.key]!, true)
  else if (e.key === 'Home') select(0, true)
  else if (e.key === 'End') select(compatibilityGames.length - 1, true)
  else return
  e.preventDefault()
}

const section = ref<HTMLElement>()
const armed = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('is-visible')
      observer?.unobserve(entry.target)
    }
  }, { threshold: 0.08 })
  section.value?.querySelectorAll('[data-together-reveal]').forEach(element => observer?.observe(element))
  armed.value = true
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <section id="play-together" ref="section" class="together" :class="{ 'is-armed': armed }" aria-labelledby="together-title">
    <div class="together__wrap">
      <header class="together__head" data-together-reveal>
        <div>
          <p class="together__eyebrow">Before you invite</p>
          <h2 id="together-title">Can you play<br /><em>together?</em></h2>
        </div>
        <div class="together__intro">
          <p>Cross-play, co-op and cross-save for every game at a glance. See who can join you and where your progress can go.</p>
        </div>
      </header>

      <!-- ===== poster rail ===== -->
      <div class="pt-rail" role="tablist" aria-label="Choose a game" @keydown="onKey">
        <button v-for="(g, i) in compatibilityGames" :id="`pt-tab-${g.id}`" :key="g.id" :ref="el => { if (el) tabs[i] = el as HTMLButtonElement }"
          type="button" role="tab" class="pt-tab" :class="{ 'is-active': i === active }" :aria-label="g.name"
          :aria-selected="i === active" aria-controls="pt-panel" :tabindex="i === active ? 0 : -1" @click="select(i)">
          <AppImage class="pt-tab__art" :src="artFor(g.id).src" :style="{ objectPosition: artFor(g.id).pos }" alt="" sizes="220px" width="220" height="110" loading="lazy" />
          <AppImage class="pt-tab__logo" :class="`pt-tab__logo--${g.id}`" :src="`/images/games/${g.id}-logo.webp`" alt="" width="110" height="44" loading="lazy" />
        </button>
      </div>

      <!-- ===== stage: big art + the selected game's breakdown ===== -->
      <div id="pt-panel" class="pt-stage" role="tabpanel" :aria-labelledby="`pt-tab-${game.id}`"
        @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
        <div class="pt-stage__art">
          <!-- every poster is stacked here so switching games is an instant crossfade -->
          <AppImage v-for="(g, i) in compatibilityGames" :key="g.id" :class="{ 'is-active': i === active }" :src="artFor(g.id).src"
            :style="{ objectPosition: artFor(g.id).stagePos ?? artFor(g.id).pos }" alt="" sizes="(max-width: 1100px) 100vw, 440px" width="480" height="600" loading="lazy" />
        </div>
        <!-- every breakdown sits in the same cell, so the panel is always as tall as the
             longest one and never jumps when switching games -->
        <div class="pt-stage__body">
          <PlayTogetherDetail v-for="(g, i) in compatibilityGames" :key="g.id" :game="g" :class="{ 'is-active': i === active }" />
        </div>
      </div>

      <!-- phones swap the poster rail for thin indicator bars -->
      <div class="pt-indicators" role="group" aria-label="Choose a game">
        <button v-for="(g, i) in compatibilityGames" :key="g.id" type="button" :class="{ 'is-active': i === active }"
          :aria-label="`Show ${g.name}`" :aria-pressed="i === active" aria-controls="pt-panel" @click="select(i)"><span aria-hidden="true" /></button>
      </div>

      <div class="together__foot" data-together-reveal>
        <span class="together__foot-label">A quick heads-up</span>
        <p>A shared save doesn’t always mean a shared adventure. Match your server, link your account and unlock the mode before inviting friends.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.together {
  --together-pink: #ff4d5e;
  --together-purple: #ff4d5e;
  --together-red: #ff3859;
  --together-line: #303032;
  --together-muted: #c1c1c3;
  padding: 0 0 clamp(80px, 10vw, 136px);
  background: transparent;
  scroll-margin-top: 32px;
}
.together__wrap { width: min(1240px, 100% - 2 * clamp(16px, 4vw, 40px)); margin: 0 auto; }

/* heading */
.together__head { display: grid; grid-template-columns: 1.2fr 1fr; align-items: end; gap: 48px; }
.together__eyebrow { display: flex; align-items: center; gap: 10px; margin: 0 0 18px; font-size: 11px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; }
.together h2 { margin: 0; font: 800 clamp(28px, 3.4vw, 46px)/1.25 var(--display); letter-spacing: -.01em; text-transform: uppercase; }
.together h2 em { font-style: normal; color: var(--together-pink); background: linear-gradient(100deg, #ff183b, #ff183b 55%, #dcdce0); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.together__intro { max-width: 480px; }
.together__head { margin-bottom: 32px; }
.together__intro p { margin: 0; color: var(--together-muted); font-size: 16px; font-weight: 600; line-height: 1.8; }

/* ---------- poster rail: black and white until picked ---------- */
.pt-rail { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 12px; margin-bottom: 16px; }
.pt-tab { position: relative; height: 92px; padding: 0; overflow: hidden; border: 0; background: #000; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.pt-tab::before { content: ''; position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(0, 0, 0, .1), rgba(0, 0, 0, .75)); }
/* masked to a frame: 1px sides, 3px underline */
.pt-tab::after { content: ''; position: absolute; inset: 0; z-index: 2; padding: 1px; background: #2a2a2f; -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude; }
.pt-tab__art { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) brightness(.6); transition: filter .4s var(--ease), scale .5s var(--ease); }
.pt-tab__logo { position: absolute; z-index: 1; left: 50%; bottom: 10px; translate: -50% 0; width: 72%; max-width: 110px; height: 36px; object-fit: contain; opacity: .75; filter: drop-shadow(0 2px 8px rgba(0, 0, 0, .8)); transition: opacity .3s; }
.pt-tab.is-active .pt-tab__art { filter: none; }
.pt-tab.is-active .pt-tab__logo { opacity: 1; }
/* these marks have lots of empty space in their artwork, so they read small */
.pt-tab__logo--hsr, .pt-tab__logo--nte, .pt-tab__logo--hi3 { width: 86%; max-width: 140px; height: 48px; bottom: 6px; }
.pt-tab.is-active::after { padding: 1px 1px 3px; background: #dcdce0; }
.pt-tab:focus-visible { outline: 2px solid #ff4d5e; outline-offset: 3px; }
@media (hover: hover) {
  .pt-tab:hover .pt-tab__art { filter: grayscale(.2) brightness(.85); scale: 1.06; }
  .pt-tab.is-active:hover .pt-tab__art { filter: none; }
  .pt-tab:hover .pt-tab__logo { opacity: 1; }
}

/* ---------- stage ---------- */
.pt-stage { position: relative; display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); min-height: 400px; background: #000; }
/* permanent outline: a dark red gradient that slowly turns */
.pt-stage::after { content: ''; position: absolute; inset: 0; z-index: 3; padding: 2px; background: conic-gradient(from var(--card-outline-angle), #ff183b, #a30d22 25%, #4a050e 50%, #a30d22 75%, #ff183b); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude; animation: card-outline-turn 8s linear infinite; pointer-events: none; }
.pt-stage__art { position: relative; overflow: hidden; background: #050507; }
/* black-and-white art with the red holographic sheen (the rail keeps its own look) */
.pt-stage__art > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: var(--bw-art); opacity: 0; scale: 1.06; transition: opacity .6s var(--ease), scale 1.2s var(--ease); }
.pt-stage__art > img.is-active { opacity: 1; scale: 1; }
.pt-stage__art::before { content: ''; position: absolute; inset: 0; z-index: 1; mix-blend-mode: screen; background: var(--red-holo); animation: red-holo-sweep 7s ease-in-out infinite alternate; pointer-events: none; }
.pt-stage__art::after { content: ''; position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(0, 0, 0, 0) 45%, rgba(0, 0, 0, .85) 100%), linear-gradient(90deg, rgba(0, 0, 0, 0) 70%, #000 100%); pointer-events: none; }
.pt-stage__body { display: grid; min-width: 0; }
/* the breakdown swaps with a quick fade-up */
.pt-stage__body > * { grid-area: 1 / 1; visibility: hidden; opacity: 0; translate: 0 10px; transition: opacity .22s ease, translate .22s ease, visibility 0s .22s; }
.pt-stage__body > .is-active { visibility: visible; opacity: 1; translate: 0 0; transition: opacity .3s ease .12s, translate .3s ease .12s, visibility 0s; }

.pt-indicators { display: none; }

/* footer */
.together__foot { display: flex; align-items: baseline; gap: 30px; margin-top: 30px; padding: 0; }
.together__foot-label { flex-shrink: 0; color: var(--together-pink); font: 700 14px/1.8 var(--display); text-transform: uppercase; }
.together__foot p { margin: 0; color: var(--together-muted); font-size: 14px; line-height: 1.8; }

[data-together-reveal] { transition: opacity .65s ease; }
.is-armed [data-together-reveal]:not(.is-visible) { opacity: 0; }

/* tablet: art becomes a banner above the breakdown */
@media (max-width: 1100px) {
  .pt-stage { grid-template-columns: minmax(0, 1fr); }
  .pt-stage__art { height: 260px; }
  .pt-stage__art::after { background: linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, #000 100%); }
}

@media (max-width: 960px) {
  .together__head { grid-template-columns: 1fr; gap: 20px; }
  .together__intro p { font-size: 15px; line-height: 1.75; }
}

/* phone: indicator bars + swipe instead of the poster rail */
@media (max-width: 760px) {
  .together__head { margin-bottom: 24px; }
  .pt-rail { display: none; }
  .pt-indicators { display: flex; justify-content: center; gap: 6px; margin-top: 10px; }
  .pt-indicators button { display: grid; place-items: center; width: 48px; height: 36px; padding: 0; border: 0; border-radius: 4px; background: transparent; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .pt-indicators span { width: 40px; height: 3px; border-radius: 2px; background: rgba(255, 255, 255, .55); box-shadow: 0 1px 5px rgba(0, 0, 0, .8); transition: background .3s; }
  .pt-indicators button.is-active span { background: linear-gradient(90deg, #ff183b, #ff183b 55%, #dcdce0); box-shadow: 0 0 7px rgba(255, 77, 94, .65); }
  .pt-stage__art { height: 210px; }
  .together__foot { flex-direction: column; gap: 9px; }
}

@media (prefers-reduced-motion: reduce) {
  [data-together-reveal] { transition: none; }
  .is-armed [data-together-reveal]:not(.is-visible) { opacity: 1; }
  .pt-stage::after, .pt-stage__art::before { animation: none; }
  .pt-stage__art > img, .pt-tab__art, .pt-stage__body > * { transition: none; }
}
</style>
