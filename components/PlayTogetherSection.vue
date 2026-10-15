<script setup lang="ts">
import { compatibilityGames } from '~/data/playTogether'

const track = ref<HTMLElement>()
const activeIndex = ref(0)
function onScroll() {
  const el = track.value
  if (!el || !el.firstElementChild) return
  const step = (el.firstElementChild as HTMLElement).offsetWidth + 12
  activeIndex.value = Math.min(compatibilityGames.length - 1, Math.round(el.scrollLeft / step))
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
          <p class="together__eyebrow"><span aria-hidden="true" />Before you invite</p>
          <h2 id="together-title">Can you play<br /><em>together?</em></h2>
        </div>
        <div class="together__intro">
          <p>Cross-play, co-op and cross-save for every game at a glance. See who can join you and where your progress can go.</p>
        </div>
      </header>

      <figure class="together__banner neon-hover-outline" data-together-reveal>
        <img src="/images/vexana-esrgan.webp" alt="Vexana character banner from Mobile Legends: Bang Bang" width="3200" height="1067" loading="lazy" decoding="async" />
      </figure>

      <div class="party-cards" :aria-label="`${compatibilityGames.length} games`" @scroll.passive="onScroll" ref="track">
        <article v-for="game in compatibilityGames" :key="game.id" class="party-card neon-hover-outline"
:aria-labelledby="`card-${game.id}-crossplay`" data-together-reveal>
          <PlayTogetherDetail :game="game" id-prefix="card" />
        </article>
      </div>
      <div class="party-dots" aria-hidden="true">
        <span v-for="(game, i) in compatibilityGames" :key="game.id" :class="{ 'is-on': i === activeIndex }" />
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
  background: #000;
  scroll-margin-top: 32px;
}
.together__wrap { width: min(1240px, 100% - 2 * clamp(16px, 4vw, 40px)); margin: 0 auto; }

/* heading */
.together__head { display: grid; grid-template-columns: 1.2fr 1fr; align-items: end; gap: 48px; }
.together__eyebrow { display: flex; align-items: center; gap: 10px; margin: 0 0 18px; font-size: 11px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; }
.together__eyebrow > span { width: 26px; height: 2px; background: linear-gradient(90deg, var(--together-red), var(--together-pink), var(--together-purple)); }
.together h2 { margin: 0; font: 800 clamp(28px, 3.4vw, 46px)/1.25 var(--display); letter-spacing: -.01em; text-transform: uppercase; }
.together h2 em { font-style: normal; color: var(--together-pink); background: linear-gradient(100deg, var(--together-pink), var(--together-red) 50%, var(--together-purple)); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.together__intro { max-width: 480px; }
.together__intro p { margin: 0; color: var(--together-muted); font-size: 16px; font-weight: 600; line-height: 1.8; }

/* banner */
.together__banner { margin: 32px 0 28px; border: 2px solid transparent; border-radius: 12px; overflow: hidden; background: #09080c; }
.together__banner::after { opacity: 1; animation: card-outline-turn 3s linear infinite; }
.together__banner img { width: 100%; height: auto; aspect-ratio: 2172 / 724; object-fit: cover; }

/* cards */
.party-cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: stretch; gap: 20px; }
.party-card { display: flex; flex-direction: column; min-width: 0; border: 2px solid transparent; border-radius: 12px; background: #09080c; overflow: hidden; }
.party-card::after { opacity: 1; animation: card-outline-turn 3s linear infinite; }
.party-dots { display: none; }

/* footer */
.together__foot { display: flex; align-items: baseline; gap: 30px; margin-top: 30px; padding: 22px 0 0; border-top: 1px solid var(--together-line); }
.together__foot-label { flex-shrink: 0; color: var(--together-pink); font: 700 14px/1.8 var(--display); text-transform: uppercase; }
.together__foot p { margin: 0; color: var(--together-muted); font-size: 14px; line-height: 1.8; }

[data-together-reveal] { transition: opacity .65s ease, transform .65s var(--ease); }
.is-armed [data-together-reveal]:not(.is-visible) { opacity: 0; transform: translateY(18px); }

@media (max-width: 1100px) {
  .party-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 960px) {
  .together__head { grid-template-columns: 1fr; gap: 20px; }
  .together__intro p { font-size: 15px; line-height: 1.75; }
}

/* phone: swipeable cards */
@media (max-width: 700px) {
  .together__banner { margin: 22px 0 20px; border-radius: 10px; }
  .party-cards { display: flex; gap: 12px; margin: 0 calc(-1 * clamp(16px, 4vw, 40px)); padding: 2px clamp(16px, 4vw, 40px) 6px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-inline: clamp(16px, 4vw, 40px); scrollbar-width: none; overscroll-behavior-x: contain; }
  .party-cards::-webkit-scrollbar { display: none; }
  .party-card { flex: 0 0 86%; scroll-snap-align: start; }
  .party-dots { display: flex; justify-content: center; gap: 6px; margin-top: 14px; }
  .party-dots span { width: 6px; height: 6px; border-radius: 999px; background: #3a3241; transition: width .3s var(--ease), background .3s ease; }
  .party-dots span.is-on { width: 22px; background: linear-gradient(90deg, #ff3859, #ff83cf, #bd91ff); }
  .together__foot { flex-direction: column; gap: 9px; }
}

@media (prefers-reduced-motion: reduce) {
  [data-together-reveal], .party-dots span { transition: none; }
  .is-armed [data-together-reveal]:not(.is-visible) { opacity: 1; transform: none; }
  .party-card::after, .together__banner::after { animation: none; }
}
</style>
