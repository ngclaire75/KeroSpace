<script setup lang="ts">
type Item = {
  img: string
  name: string
  tag: string
  type: string
  rarity: string
}

const items: Item[] = [
  { img: '/images/egg-1.webp', name: 'Lazy Yolk', tag: 'Spot rare loot', type: 'Food', rarity: 'Common' },
  { img: '/images/egg-2.webp', name: 'Side Eye Yolk', tag: 'Know every stat', type: 'Food', rarity: 'Rare' },
  { img: '/images/egg-3.webp', name: 'Sunny Side', tag: 'Master your gear', type: 'Food', rarity: 'Legendary' },
  { img: '/images/egg-4.webp', name: 'Nap Yolk', tag: 'Track drop rates', type: 'Food', rarity: 'Epic' },
  { img: '/images/egg-5.webp', name: 'Lounge Yolk', tag: 'Tips from players', type: 'Food', rarity: 'Uncommon' },
]

const n = items.length
const active = ref(2)

// signed distance from the centre card, wrapped to -2..2 (5 cards, all on stage)
function pos(i: number) {
  return ((i - active.value + n + 2) % n) - 2
}
// On mobile the outer slots are off-screen, so a card that wraps from one end
// to the other (moves 3+ slots) would streak across the view — jump it instead.
const jumping = ref<number[]>([])
async function go(i: number) {
  const before = items.map((_, k) => pos(k))
  active.value = (i + n) % n
  if (!window.matchMedia('(max-width: 720px)').matches) return
  jumping.value = items.map((_, k) => k).filter((k) => Math.abs(pos(k) - before[k]) >= 3)
  if (!jumping.value.length) return
  await nextTick()
  requestAnimationFrame(() => requestAnimationFrame(() => (jumping.value = [])))
}
const next = () => go(active.value + 1)
const prev = () => go(active.value - 1)

/* ---------- starfield (seeded so SSR + client agree) ---------- */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}
const r = rng(7)
const stars = Array.from({ length: 80 }, () => ({
  left: `${(r() * 100).toFixed(2)}%`,
  top: `${(r() * 70).toFixed(2)}%`,
  size: `${(r() * 1.6 + 0.6).toFixed(2)}px`,
  delay: `${(r() * 6).toFixed(2)}s`,
  dur: `${(r() * 4 + 3).toFixed(2)}s`,
  o: (r() * 0.5 + 0.2).toFixed(2),
}))

/* ---------- pointer tracking on the centre card ----------
   The whole hero is tracked, not just the card: the card leans gently toward
   the cursor from anywhere, then tilts fully and lifts while hovered. tanh keeps
   the angle continuous across the card edge. Values are eased every frame
   (rAF + lerp) instead of being set raw, so motion stays smooth. */
const cardEls: (HTMLElement | null)[] = []
const target = { rx: 0, ry: 0, mx: 50, my: 50, lift: 0 }
const cur = { ...target }
let live: HTMLElement | null = null
let raf = 0
let last = 0

function apply(el: HTMLElement) {
  el.style.setProperty('--tx', `${cur.rx.toFixed(3)}deg`)
  el.style.setProperty('--ty', `${cur.ry.toFixed(3)}deg`)
  el.style.setProperty('--mx', `${cur.mx.toFixed(2)}%`)
  el.style.setProperty('--my', `${cur.my.toFixed(2)}%`)
  el.style.setProperty('--lift', cur.lift.toFixed(3))
}
// frame-rate independent exponential easing (same feel at 60Hz and 120Hz)
function loop(t: number) {
  const dt = Math.min(0.05, (t - last) / 1000 || 0.016)
  last = t
  const a = 1 - Math.exp(-dt * 6)
  let delta = 0
  for (const k of Object.keys(target) as (keyof typeof target)[]) {
    const d = target[k] - cur[k]
    cur[k] += d * a
    delta += Math.abs(d)
  }
  if (live) apply(live)
  raf = delta > 0.01 ? requestAnimationFrame(loop) : 0
}
function run() {
  if (!raf) {
    last = performance.now()
    raf = requestAnimationFrame(loop)
  }
}
// hand a card back to its CSS transition so it settles smoothly
function release(el: HTMLElement) {
  el.classList.remove('is-live', 'is-over')
  for (const p of ['--tx', '--ty', '--mx', '--my', '--lift']) el.style.removeProperty(p)
}

// Touch gets the same tilt as the mouse: pointermove only fires for touch while
// a finger is down, and pointerdown starts it on the first tap.
function track(e: PointerEvent) {
  const el = cardEls[active.value]
  if (!el) return
  if (live !== el) {
    if (live) release(live)
    Object.assign(cur, { rx: 0, ry: 0, mx: 50, my: 50, lift: 0 })
    live = el
    el.classList.add('is-live')
  }
  const b = el.getBoundingClientRect()
  const x = (e.clientX - b.left) / b.width
  const y = (e.clientY - b.top) / b.height
  const over = x >= 0 && x <= 1 && y >= 0 && y <= 1
  target.ry = Math.tanh((x - 0.5) * 1.6) * 14
  target.rx = Math.tanh((0.5 - y) * 1.6) * 11
  target.mx = Math.min(1, Math.max(0, x)) * 100
  target.my = Math.min(1, Math.max(0, y)) * 100
  target.lift = over ? 1 : 0
  el.classList.toggle('is-over', over)
  run()
}
// a lifted finger has no hover — settle the card back to rest
function endTouch(e: PointerEvent) {
  if (e.pointerType !== 'mouse') untrack()
}
function untrack() {
  Object.assign(target, { rx: 0, ry: 0, mx: 50, my: 50, lift: 0 })
  live?.classList.remove('is-over')
  run()
}
watch(active, () => {
  if (live) release(live)
  live = null
  Object.assign(target, { rx: 0, ry: 0, mx: 50, my: 50, lift: 0 })
})

/* ---------- swipe ---------- */
let downX: number | null = null
function onDown(e: PointerEvent) {
  downX = e.clientX
}
function onUp(e: PointerEvent) {
  if (downX === null) return
  const dx = e.clientX - downX
  downX = null
  if (Math.abs(dx) > 45) (dx < 0 ? next : prev)()
}

/* ---------- autoplay: a new 4s countdown after every slide, hover or tap ----
   A self-scheduling timeout rather than setInterval: pausing cancels the
   pending slide, so resuming always waits a full 4s instead of firing the
   tick that elapsed while hovered. */
const DELAY = 4000
const paused = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
let still = false

function schedule() {
  clearTimeout(timer)
  if (still || paused.value || document.hidden) return
  timer = setTimeout(() => {
    next()
    schedule()
  }, DELAY)
}
const onVisibility = () => schedule()

// hover/focus in or out, and any manual change, restart the countdown
watch([paused, active], schedule)

onMounted(() => {
  still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.addEventListener('visibilitychange', onVisibility)
  schedule()
})
onBeforeUnmount(() => {
  clearTimeout(timer)
  document.removeEventListener('visibilitychange', onVisibility)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <section
    class="hero"
    @pointerdown="track"
    @pointermove="track"
    @pointerup="endTouch"
    @pointercancel="endTouch"
    @pointerleave="untrack"
  >
    <div class="hero__stars" aria-hidden="true">
      <i
        v-for="(s, k) in stars"
        :key="k"
        :style="{
          left: s.left,
          top: s.top,
          width: s.size,
          height: s.size,
          opacity: s.o,
          animationDelay: s.delay,
          animationDuration: s.dur,
        }"
      />
    </div>

    <SiteNav />

    <div class="hero__copy">
      <h1 class="hero__title">
        <span class="hero__line">Explore Every Item</span>
        <span class="hero__line">In <em>Your Games</em></span>
      </h1>
      <p class="hero__sub">
        Browse a growing library of games, identify any item in seconds and
        learn exactly what it does and how it works.
      </p>
    </div>

    <div
      class="stage"
      tabindex="0"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured game items"
      @keydown.left.prevent="prev"
      @keydown.right.prevent="next"
      @pointerdown="onDown"
      @pointerup="onUp"
      @pointerenter="paused = true"
      @pointerleave="paused = false"
      @focusin="paused = true"
      @focusout="paused = false"
    >

      <article
        v-for="(it, i) in items"
        :key="it.name"
        :ref="(el) => (cardEls[i] = el as HTMLElement | null)"
        class="card"
        :class="{ 'is-jump': jumping.includes(i) }"
        :data-pos="pos(i)"
        :style="{ '--i': i }"
      >
        <div class="card__body">
          <div class="card__media">
            <img
              class="card__img"
              :src="it.img"
              :alt="it.name"
              width="900"
              height="900"
              draggable="false"
              :loading="i === 2 ? 'eager' : 'lazy'"
            />
            <div class="card__holo" aria-hidden="true" />
            <div class="card__shine" aria-hidden="true" />
          </div>

          <div class="card__chip">
            <span class="card__avatar">
              <img :src="it.img" alt="" width="34" height="34" />
            </span>
            <span>
              <small>Kero</small>
              {{ it.tag }}
            </span>
          </div>
        </div>

        <button
          v-if="pos(i) !== 0"
          type="button"
          class="card__hit"
          :aria-label="`Show ${it.name}`"
          @click="go(i)"
        />
      </article>

      <p class="sr-only" aria-live="polite">
        {{ items[active].name }} — {{ items[active].rarity }} {{ items[active].type }}
      </p>
    </div>
  </section>
</template>

<style scoped>
/* ============ full-screen section ============ */
.hero {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  min-height: 600px;
  overflow: hidden;
  background: #000;
}

/* ============ stars ============ */
.hero__stars {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}
.hero__stars i {
  position: absolute;
  border-radius: 50%;
  background: #fff;
  animation: twinkle ease-in-out infinite;
}
@keyframes twinkle {
  50% {
    opacity: 0.05;
  }
}

/* ============ copy ============ */
.hero__copy {
  position: relative;
  z-index: 2;
  padding: calc(clamp(40px, min(6vw, 7vh), 80px) + 16px) 20px 0;
  text-align: center;
}
.hero__title {
  margin: 0;
  font-family: var(--display);
  font-weight: 800;
  font-size: clamp(30px, min(5.4vw, 8.4vh), 78px);
  line-height: 1.08;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: #fff;
  text-shadow:
    0 0 22px rgba(255, 255, 255, 0.35),
    0 0 60px rgba(255, 255, 255, 0.12);
}
.hero__line {
  display: block;
  animation: rise 1s var(--ease) both;
}
.hero__line + .hero__line {
  animation-delay: 0.12s;
}
.hero__title em {
  font-style: normal;
  /* Matching endpoints keep the pink → red → purple cycle seamless. */
  background: linear-gradient(
      90deg,
      #ff54bb 0%,
      #ff183b 33.333%,
      #b26bff 66.667%,
      #ff54bb 100%
    )
    0 50% / 200% 100% repeat-x;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: none;
  filter: drop-shadow(0 0 18px rgba(255, 84, 187, 0.3)) drop-shadow(0 0 10px rgba(178, 107, 255, 0.2));
  animation: shimmer 10s linear infinite;
}
@keyframes shimmer {
  to {
    background-position: -200% 50%;
  }
}
.hero__sub {
  max-width: 440px;
  margin: 22px auto 0;
  font-size: clamp(14px, 1.3vw, 16.5px);
  font-weight: 600;
  line-height: 1.6;
  color: #fff;
  animation: rise 1s 0.24s var(--ease) both;
}
@keyframes rise {
  from {
    opacity: 0;
    translate: 0 26px;
    filter: blur(6px);
  }
}

/* ============ stage ============ */
.stage {
  --floor: 86px;
  position: relative;
  flex: 1 1 0;
  min-height: 0;
  container-type: size;
  margin-top: clamp(16px, 3vh, 44px);
  perspective: 1100px;
  perspective-origin: 50% 35%;
  touch-action: pan-y;
  outline: none;
  user-select: none;
  -webkit-user-select: none;
}
.stage:focus-visible .card[data-pos='0'] .card__media {
  outline: 2px solid var(--red);
  outline-offset: 4px;
}

/* card size follows the space left under the copy (cqh = stage height),
   so the section is always exactly one screen tall */
.stage > * {
  --cw: clamp(170px, min(24vw, calc((100cqh - var(--floor) - 16px) / 1.2424)), 350px);
  --s1: calc(var(--cw) * 0.78);
  --s2: calc(var(--cw) * 1.34);
}

/* ============ cards ============ */
.card {
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  --x: 0px;
  --y: 0px;
  --ry: 0deg;
  --sc: 1;
  --radius: 22px;
  position: absolute;
  left: 50%;
  bottom: var(--floor);
  width: var(--cw);
  aspect-ratio: 33 / 41;
  transform-origin: 50% 100%;
  transform-style: preserve-3d;
  transform: translateX(-50%) translateX(var(--x)) translateY(var(--y)) rotateY(var(--ry))
    scale(var(--sc));
  transition:
    transform 0.9s var(--ease),
    opacity 0.6s;
  animation: deal 0.9s calc(0.3s + var(--i) * 0.06s) var(--ease) backwards;
}
@keyframes deal {
  from {
    opacity: 0;
    translate: 0 60px;
  }
}

.card[data-pos='0'] {
  z-index: 5;
  /* a finger on the centre card drives the tilt in every direction instead of
     being taken over by page scrolling (horizontal swipes still change cards) */
  touch-action: none;
}
.card.is-jump {
  transition: none;
}
.card[data-pos='-1'],
.card[data-pos='1'] {
  --y: -30px;
  --sc: 0.68;
  z-index: 4;
}
.card[data-pos='-2'],
.card[data-pos='2'] {
  --y: -34px;
  --sc: 0.6;
  z-index: 3;
}
.card[data-pos='-1'] {
  --x: calc(var(--s1) * -1);
  --ry: 38deg;
}
.card[data-pos='1'] {
  --x: var(--s1);
  --ry: -38deg;
}
.card[data-pos='-2'] {
  --x: calc(var(--s2) * -1);
  --ry: 34deg;
}
.card[data-pos='2'] {
  --x: var(--s2);
  --ry: -34deg;
}

/* the tilting layer — no overflow clip here so the chip can float in 3D */
.card__body {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: var(--radius);
  transform-style: preserve-3d;
  transform: rotateX(var(--tx, 0deg)) rotateY(var(--ty, 0deg))
    translateZ(calc(var(--lift, 0) * 26px));
  transition: transform 0.8s var(--ease);
}
/* while the pointer drives it, rAF does the easing */
.card.is-live .card__body {
  transition: none;
}
/* clip-path keeps the rounded corners while cards move in 3D
   (overflow:hidden alone loses them on composited layers) */
.card__media {
  position: absolute;
  inset: 0;
  border-radius: var(--radius);
  overflow: hidden;
  clip-path: inset(0 round var(--radius));
  background: #2a0b10;
}
.card__media::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.14) inset;
  pointer-events: none;
}
.card[data-pos='0'] .card__media::after {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3) inset;
}

.card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  scale: 1.04;
  transition: scale 0.9s var(--ease);
  pointer-events: none;
}
.card[data-pos='0'] .card__img {
  scale: 1.1;
}

/* neon sheen in the logo's red→pink — follows the (eased) pointer position */
.card__holo {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    115deg,
    transparent 24%,
    rgba(232, 16, 28, 0.3) 39%,
    rgba(255, 47, 110, 0.45) 47%,
    rgba(255, 179, 200, 0.4) 53%,
    rgba(255, 47, 110, 0.38) 61%,
    transparent 76%
  );
  background-size: 260% 260%;
  background-position: var(--mx, 50%) var(--my, 50%);
  mix-blend-mode: overlay;
  opacity: 0;
  transition: opacity 0.6s;
  pointer-events: none;
}
.card[data-pos='0'] .card__holo {
  opacity: 1;
}
.card__shine {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--mx, 50%) var(--my, 30%),
    rgba(255, 90, 140, 0.3),
    rgba(232, 16, 28, 0.12) 30%,
    transparent 52%
  );
  mix-blend-mode: screen;
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;
}
.card.is-over .card__shine {
  opacity: 1;
}

/* glass chip floats above the art (only on the centre card) */
.card__chip {
  position: absolute;
  top: 14px;
  left: 14px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 5px 16px 5px 5px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(14, 8, 10, 0.62);
  backdrop-filter: blur(16px) saturate(1.3);
  -webkit-backdrop-filter: blur(16px) saturate(1.3);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0;
  transform: translateZ(40px) translateY(10px);
  transition:
    opacity 0.5s,
    transform 0.6s var(--ease);
  /* load only (set on every card so it never re-runs on switch). Starts the
     moment the centre card's deal ends (0.3s + 2 * 0.06s delay + 0.9s): while
     a card is still fading in, its opacity flattens 3D and breaks the blur,
     which made the label jump */
  animation: chip-in 0.25s 1.32s ease-out backwards;
}
.card[data-pos='0'] .card__chip {
  opacity: 1;
  transform: translateZ(40px);
  transition-delay: 0.35s;
}
@keyframes chip-in {
  from {
    opacity: 0;
  }
}
/* avatar ring: a red→pink conic gradient spinning behind the picture */
.card__avatar {
  position: relative;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  padding: 2px;
  border-radius: 50%;
  overflow: hidden;
  isolation: isolate;
}
.card__avatar::before {
  content: '';
  position: absolute;
  inset: -25%;
  z-index: -1;
  background: conic-gradient(#e8101c, #ff2f6e, #ffb3c8, #ff2f6e, #e8101c);
  animation: ring-spin 3s linear infinite;
}
@keyframes ring-spin {
  to {
    rotate: 1turn;
  }
}
.card__avatar img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
.card__chip small {
  display: block;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--ink-2);
}

.card__hit {
  position: absolute;
  inset: 0;
  border: 0;
  border-radius: var(--radius);
  background: transparent;
  cursor: pointer;
}

/* ============ controls ============ */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

/* ============ responsive ============ */
@media (max-width: 720px) {
  /* stage only as tall as the cards need; copy + cards centred together
     under the nav so there's no big gap between them */
  .hero__copy {
    margin-top: auto;
    padding-top: 40px;
  }
  .stage {
    --floor: 84px;
    flex: 0 0 auto;
    height: calc(min(48vw, 210px) * 1.2424 + var(--floor) + 16px);
    margin-top: 28px;
    margin-bottom: auto;
  }
  .stage > * {
    --cw: min(48vw, 210px, calc((100cqh - var(--floor) - 16px) / 1.2424));
    --s1: calc(var(--cw) * 0.74);
    /* outer slots sit just past the screen edge: cards slide out solid,
       like desktop, instead of fading out on screen */
    --s2: calc(var(--cw) * 1.75);
  }
  .card {
    --radius: 18px;
  }
  .card[data-pos='-2'],
  .card[data-pos='2'] {
    pointer-events: none;
  }
  .card[data-pos='-1'],
  .card[data-pos='1'] {
    --sc: 0.7;
  }
  .card[data-pos='-1'] {
    --ry: 34deg;
  }
  .card[data-pos='1'] {
    --ry: -34deg;
  }
  /* compact label so the all-caps line stays on one row on small cards */
  .card__chip {
    top: 10px;
    left: 10px;
    gap: 7px;
    padding: 4px 12px 4px 4px;
    font-size: 10px;
    letter-spacing: 0.03em;
    white-space: nowrap;
  }
  .card__chip small {
    font-size: 8.5px;
  }
  .card__avatar {
    width: 29px;
    height: 29px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__stars i,
  .hero__title em,
  .card__avatar::before {
    animation: none;
  }
  .hero__line,
  .hero__sub,
  .card,
  .card__chip {
    animation: none;
  }
  .card,
  .card__body {
    transition-duration: 0.01s;
  }
}
</style>
