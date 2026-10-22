<script setup lang="ts">
import { compatibilityGames } from '~/data/playTogether'

const track = ref<HTMLElement>()
const activeIndex = ref(0)
// while a bar click is scrolling the track, hold the highlight on the target
// so the bars don't flash through every card in between
let target: number | null = null
let settle: ReturnType<typeof setTimeout> | undefined

function stepOf(el: HTMLElement) {
  const first = el.firstElementChild as HTMLElement | null
  if (!first) return 0
  return first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0')
}
function release() {
  target = null
  clearTimeout(settle)
}
function onScroll() {
  const el = track.value
  if (!el) return
  const step = stepOf(el)
  if (!step) return
  const index = Math.min(compatibilityGames.length - 1, Math.max(0, Math.round(el.scrollLeft / step)))
  if (target !== null) {
    // keep waiting until the smooth scroll lands (or stalls)
    clearTimeout(settle)
    settle = setTimeout(release, 150)
    if (index !== target) return
    release()
  }
  if (index !== activeIndex.value) activeIndex.value = index
}
function goTo(i: number) {
  const el = track.value
  if (!el) return
  const step = stepOf(el)
  if (!step) return
  const index = Math.max(0, Math.min(compatibilityGames.length - 1, i))
  activeIndex.value = index
  target = index
  clearTimeout(settle)
  settle = setTimeout(release, 900)
  el.scrollTo({ left: index * step, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
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
onBeforeUnmount(() => {
  observer?.disconnect()
  clearTimeout(settle)
})
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

      <div class="party-cards" :aria-label="`${compatibilityGames.length} games`" @scroll.passive="onScroll"
        @pointerdown="release" @touchstart.passive="release" ref="track">
        <article v-for="game in compatibilityGames" :key="game.id" class="party-card neon-hover-outline"
:aria-labelledby="`card-${game.id}-crossplay`">
          <PlayTogetherDetail :game="game" id-prefix="card" />
        </article>
      </div>
      <div class="party-indicators" role="group" aria-label="Choose a game">
        <button v-for="(game, i) in compatibilityGames" :key="game.id" type="button" :class="{ 'is-active': i === activeIndex }"
          :aria-label="`Show ${game.name}`" :aria-pressed="i === activeIndex" @click="goTo(i)"><span aria-hidden="true" /></button>
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
  --together-pink: #ff83cf;
  --together-purple: #bd91ff;
  --together-red: #ff3859;
  --together-line: #302a37;
  --together-muted: #c1b9c9;
  padding: 0 0 clamp(80px, 10vw, 136px);
  background: transparent;
  scroll-margin-top: 32px;
}
.together__wrap { width: min(1240px, 100% - 2 * clamp(16px, 4vw, 40px)); margin: 0 auto; }

/* heading */
.together__head { display: grid; grid-template-columns: 1.2fr 1fr; align-items: end; gap: 48px; }
.together__eyebrow { display: flex; align-items: center; gap: 10px; margin: 0 0 18px; font-size: 11px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; }
.together h2 { margin: 0; font: 800 clamp(28px, 3.4vw, 46px)/1.25 var(--display); letter-spacing: -.01em; text-transform: uppercase; }
.together h2 em { font-style: normal; color: var(--together-pink); background: linear-gradient(100deg, var(--together-pink), var(--together-red) 50%, var(--together-purple)); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.together__intro { max-width: 480px; }
.together__head { margin-bottom: 32px; }
.together__intro p { margin: 0; color: var(--together-muted); font-size: 16px; font-weight: 600; line-height: 1.8; }


/* cards */
.party-cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: stretch; gap: 20px; }
.party-card { display: flex; flex-direction: column; min-width: 0; border: 0; border-radius: 0; background: #000; overflow: hidden; }
.party-card :deep(.party-detail__art) { border-radius: 0; }
.party-card::after { opacity: 1; background: conic-gradient(from var(--card-outline-angle), #d8b4ff, #ffb3df, #d8b4ff); animation: card-outline-turn 3s linear infinite; }
.party-indicators { display: none; }

/* footer */
.together__foot { display: flex; align-items: baseline; gap: 30px; margin-top: 30px; padding: 0; }
.together__foot-label { flex-shrink: 0; color: var(--together-pink); font: 700 14px/1.8 var(--display); text-transform: uppercase; }
.together__foot p { margin: 0; color: var(--together-muted); font-size: 14px; line-height: 1.8; }

[data-together-reveal] { transition: opacity .65s ease; }
.is-armed [data-together-reveal]:not(.is-visible) { opacity: 0; }

@media (max-width: 1100px) {
  .party-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 960px) {
  .together__head { grid-template-columns: 1fr; gap: 20px; }
  .together__intro p { font-size: 15px; line-height: 1.75; }
}

/* phone: swipeable cards */
@media (max-width: 700px) {
  .together__head { margin-bottom: 24px; }
  .party-cards { display: flex; gap: 16px; overflow-x: auto; overflow-y: hidden; touch-action: pan-x pan-y; overscroll-behavior-y: auto; scroll-snap-type: x mandatory; scrollbar-width: none; overscroll-behavior-x: contain; }
  .party-cards::-webkit-scrollbar { display: none; }
  .party-card { flex: 0 0 100%; scroll-snap-align: center; scroll-snap-stop: always; }
  .party-indicators { display: flex; justify-content: center; gap: 6px; margin-top: 10px; }
  .party-indicators button { display: grid; place-items: center; width: 48px; height: 36px; padding: 0; border: 0; border-radius: 4px; background: transparent; cursor: pointer; }
  .party-indicators span { width: 40px; height: 3px; border-radius: 2px; background: rgba(255, 255, 255, 0.55); box-shadow: 0 1px 5px rgba(0, 0, 0, 0.8); }
  .together__foot { flex-direction: column; gap: 9px; }
  .party-indicators button.is-active span { background: linear-gradient(90deg, #ff9bdd, #c69aff); box-shadow: 0 0 7px rgba(221, 154, 255, 0.65); }
}

@media (prefers-reduced-motion: reduce) {
  [data-together-reveal] { transition: none; }
  .is-armed [data-together-reveal]:not(.is-visible) { opacity: 1; }
  .party-card::after { animation: none; }
}
</style>
