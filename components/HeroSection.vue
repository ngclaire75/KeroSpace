<script setup lang="ts">
type Item = {
  img: string
  name: string
  game: string
  type: string
  rarity: string
}

const items: Item[] = [
  { img: '/images/kitty-smug.webp', name: 'Smirk Mask', game: 'Kitty Dreamland', type: 'Cosmetic', rarity: 'Epic' },
  { img: '/images/kitty-wink.webp', name: 'Wink Charm', game: 'Pastel Party', type: 'Charm', rarity: 'Rare' },
  { img: '/images/kitty-fierce.webp', name: 'Fury Badge', game: 'Bow Brawlers', type: 'Power-up', rarity: 'Legendary' },
  { img: '/images/kitty-sleepy.webp', name: 'Dream Pillow', game: 'Kitty Dreamland', type: 'Consumable', rarity: 'Common' },
  { img: '/images/kitty-sweet.webp', name: 'Blush Bow', game: 'Pastel Party', type: 'Accessory', rarity: 'Uncommon' },
  { img: '/images/kitty-classic.webp', name: 'Classic Bow Pin', game: 'Bow Brawlers', type: 'Badge', rarity: 'Rare' },
]

const n = items.length
const active = ref(2)

// signed distance from the centre card: -2..2 are on stage, 3+ wait hidden behind
function pos(i: number) {
  return ((i - active.value + n + 2) % n) - 2
}
function go(i: number) {
  active.value = (i + n) % n
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
const stars = Array.from({ length: 70 }, () => ({
  left: `${(r() * 100).toFixed(2)}%`,
  top: `${(r() * 62).toFixed(2)}%`,
  size: `${(r() * 1.6 + 0.6).toFixed(2)}px`,
  delay: `${(r() * 6).toFixed(2)}s`,
  dur: `${(r() * 4 + 3).toFixed(2)}s`,
  o: (r() * 0.5 + 0.2).toFixed(2),
}))

/* ---------- pointer tilt + holo shine on the centre card ---------- */
function tilt(e: PointerEvent, i: number) {
  if (pos(i) !== 0 || e.pointerType === 'touch') return
  const el = e.currentTarget as HTMLElement
  const b = el.getBoundingClientRect()
  const x = (e.clientX - b.left) / b.width
  const y = (e.clientY - b.top) / b.height
  el.style.setProperty('--tx', `${((0.5 - y) * 14).toFixed(2)}deg`)
  el.style.setProperty('--ty', `${((x - 0.5) * 18).toFixed(2)}deg`)
  el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
  el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
  el.classList.add('is-tilting')
}
function untilt(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  el.style.removeProperty('--tx')
  el.style.removeProperty('--ty')
  el.style.removeProperty('--mx')
  el.style.removeProperty('--my')
  el.classList.remove('is-tilting')
}

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

/* ---------- autoplay (paused on hover / focus / reduced motion) ---------- */
const paused = ref(false)
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(() => {
    if (!paused.value && !document.hidden) next()
  }, 4800)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <section class="hero">
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
      <div class="stage__room" aria-hidden="true" />
      <div class="stage__floor" aria-hidden="true" />
      <div class="stage__glow" aria-hidden="true" />

      <article
        v-for="(it, i) in items"
        :key="it.name"
        class="card"
        :data-pos="pos(i)"
        :style="{ '--i': i }"
        @pointermove="tilt($event, i)"
        @pointerleave="untilt"
      >
        <div class="card__body">
          <img
            class="card__img"
            :src="it.img"
            :alt="`${it.name} from ${it.game}`"
            width="900"
            height="900"
            draggable="false"
            :loading="i === 2 ? 'eager' : 'lazy'"
          />
          <div class="card__holo" aria-hidden="true" />
          <div class="card__shine" aria-hidden="true" />

          <div class="card__chip">
            <img :src="it.img" alt="" width="34" height="34" />
            <span>
              <small>Game</small>
              {{ it.game }}
            </span>
          </div>

          <div class="card__panel">
            <div>
              <small>{{ it.type }}</small>
              <strong>
                {{ it.name }}
                <span class="card__rarity">{{ it.rarity }}</span>
              </strong>
            </div>
            <a href="#" class="card__more" :tabindex="pos(i) === 0 ? 0 : -1">
              Explain
              <svg viewBox="0 0 10 10" width="8" height="8" aria-hidden="true">
                <path d="M3 1v8l5-4z" fill="currentColor" />
              </svg>
            </a>
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

      <div class="stage__nav">
        <button type="button" class="stage__arrow" aria-label="Previous item" @click="prev">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6" /></svg>
        </button>
        <div class="stage__dots">
          <button
            v-for="(it, i) in items"
            :key="it.name"
            type="button"
            :class="{ 'is-on': i === active }"
            :aria-label="`Go to ${it.name}`"
            :aria-current="i === active"
            @click="go(i)"
          />
        </div>
        <button type="button" class="stage__arrow" aria-label="Next item" @click="next">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6" /></svg>
        </button>
      </div>

      <p class="sr-only" aria-live="polite">
        {{ items[active].name }} — {{ items[active].rarity }} {{ items[active].type }} from {{ items[active].game }}
      </p>
    </div>
  </section>
</template>

<style scoped>
/* ============ frame ============ */
.hero {
  position: relative;
  isolation: isolate;
  max-width: 1320px;
  margin: 0 auto;
  border: 1px solid var(--line);
  border-radius: clamp(22px, 3vw, 36px);
  overflow: hidden;
  background:
    radial-gradient(50% 32% at 50% 30%, rgba(255, 42, 61, 0.09), transparent 70%),
    radial-gradient(80% 50% at 50% -10%, #1d1d22, transparent 70%),
    var(--frame);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.6),
    0 40px 120px -30px rgba(0, 0, 0, 0.9),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
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
  padding: clamp(40px, min(6vw, 7vh), 80px) 20px 0;
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
  background: linear-gradient(95deg, #ff1830 0%, #ff3b4f 30%, #ff8a95 62%, #ffffff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: none;
  filter: drop-shadow(0 0 18px rgba(255, 42, 61, 0.45));
}
.hero__sub {
  max-width: 440px;
  margin: 22px auto 0;
  font-size: clamp(14px, 1.3vw, 16.5px);
  font-weight: 600;
  line-height: 1.6;
  color: var(--ink-3);
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
  --cw: clamp(210px, min(23vw, 32vh), 330px);
  --s1: calc(var(--cw) * 0.78);
  --s2: calc(var(--cw) * 1.34);
  --floor: 64px;
  position: relative;
  height: calc(var(--cw) * 1.2424 + var(--floor) + 44px);
  margin-top: clamp(20px, 3vh, 44px);
  perspective: 1100px;
  perspective-origin: 50% 35%;
  touch-action: pan-y;
  outline: none;
  user-select: none;
  -webkit-user-select: none;
}
.stage:focus-visible .card[data-pos='0'] .card__body {
  outline: 2px solid var(--red);
  outline-offset: 4px;
}

/* curved back wall — concave top edge like the inside of a cylinder */
.stage__room {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(42% 60% at 14% 70%, rgba(255, 42, 61, 0.16), transparent 70%),
    radial-gradient(42% 60% at 86% 70%, rgba(255, 42, 61, 0.16), transparent 70%),
    linear-gradient(180deg, #25252b 0%, #18181c 34%, #141417 62%, #1f1f24 100%);
  -webkit-mask: radial-gradient(72% 120px at 50% 0, transparent calc(100% - 1.5px), #000 100%);
  mask: radial-gradient(72% 120px at 50% 0, transparent calc(100% - 1.5px), #000 100%);
}

/* perspective grid floor, slowly drifting toward the viewer */
.stage__floor {
  position: absolute;
  left: -40%;
  right: -40%;
  bottom: 0;
  height: 300px;
  z-index: -1;
  transform: perspective(420px) rotateX(64deg);
  transform-origin: 50% 100%;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
  background-size: 90px 90px;
  background-position: 50% 0;
  -webkit-mask: linear-gradient(to top, #000 10%, transparent 85%);
  mask: linear-gradient(to top, #000 10%, transparent 85%);
  animation: drift 6s linear infinite;
}
@keyframes drift {
  to {
    background-position: 50% 90px;
  }
}

.stage__glow {
  position: absolute;
  left: 50%;
  bottom: calc(var(--floor) - 60px);
  width: calc(var(--cw) * 2.4);
  height: 180px;
  translate: -50% 0;
  z-index: -1;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(255, 42, 61, 0.42), rgba(255, 42, 61, 0.1) 60%, transparent);
  filter: blur(14px);
  animation: pulse 4.8s ease-in-out infinite;
}
@keyframes pulse {
  50% {
    opacity: 0.6;
    scale: 0.92;
  }
}

/* ============ cards ============ */
.card {
  --x: 0px;
  --y: 0px;
  --ry: 0deg;
  --sc: 1;
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
    filter 0.9s var(--ease),
    opacity 0.6s;
  animation: deal 1.1s calc(0.35s + var(--i) * 0.08s) var(--ease) both;
}
@keyframes deal {
  from {
    opacity: 0;
    translate: 0 60px;
  }
}

.card[data-pos='0'] {
  z-index: 5;
}
.card[data-pos='-1'],
.card[data-pos='1'] {
  --y: -30px;
  --sc: 0.68;
  z-index: 4;
  filter: brightness(0.78) saturate(0.95);
}
.card[data-pos='-2'],
.card[data-pos='2'] {
  --y: -34px;
  --sc: 0.6;
  z-index: 3;
  filter: brightness(0.62) saturate(0.9);
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
.card[data-pos='3'],
.card[data-pos='4'] {
  --y: -40px;
  --sc: 0.45;
  z-index: 1;
  opacity: 0;
  pointer-events: none;
}
.card:not([data-pos='0']):hover {
  filter: brightness(0.95);
}

.card__body {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 22px;
  overflow: hidden;
  background: #2a0b10;
  transform: rotateX(var(--tx, 0deg)) rotateY(var(--ty, 0deg));
  transition: transform 0.6s var(--ease), box-shadow 0.9s var(--ease);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.14) inset,
    0 30px 60px -20px rgba(0, 0, 0, 0.8);
  -webkit-box-reflect: below 10px linear-gradient(transparent 72%, rgba(0, 0, 0, 0.14));
}
.card.is-tilting .card__body {
  transition: transform 0.12s linear, box-shadow 0.9s var(--ease);
}
.card[data-pos='0'] .card__body {
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.3) inset,
    0 0 0 1px rgba(255, 42, 61, 0.35),
    0 0 50px -6px rgba(255, 42, 61, 0.55),
    0 40px 80px -24px rgba(0, 0, 0, 0.9);
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

/* iridescent sheen — idles on a slow sweep, follows the pointer on hover */
.card__holo {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    115deg,
    transparent 25%,
    rgba(255, 255, 255, 0.35) 42%,
    rgba(255, 70, 90, 0.35) 50%,
    rgba(255, 255, 255, 0.3) 58%,
    transparent 75%
  );
  background-size: 260% 260%;
  background-position: var(--mx, 0%) var(--my, 0%);
  mix-blend-mode: overlay;
  opacity: 0;
  transition: opacity 0.6s;
  pointer-events: none;
}
.card[data-pos='0'] .card__holo {
  opacity: 1;
  animation: sweep 5.5s ease-in-out infinite;
}
.card.is-tilting .card__holo {
  animation: none;
}
@keyframes sweep {
  0%,
  100% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
}
.card__shine {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--mx, 50%) var(--my, 30%),
    rgba(255, 255, 255, 0.28),
    transparent 45%
  );
  mix-blend-mode: soft-light;
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}
.card.is-tilting .card__shine {
  opacity: 1;
}

/* glass chip + panel (only on the centre card) */
.card__chip,
.card__panel {
  position: absolute;
  display: flex;
  align-items: center;
  background: rgba(14, 8, 10, 0.62);
  backdrop-filter: blur(16px) saturate(1.3);
  -webkit-backdrop-filter: blur(16px) saturate(1.3);
  border: 1px solid rgba(255, 255, 255, 0.16);
  opacity: 0;
  translate: 0 10px;
  transition:
    opacity 0.5s,
    translate 0.6s var(--ease);
  transform: translateZ(30px);
}
.card[data-pos='0'] .card__chip,
.card[data-pos='0'] .card__panel {
  opacity: 1;
  translate: 0 0;
  transition-delay: 0.35s;
}

.card__chip {
  top: 14px;
  left: 14px;
  gap: 9px;
  padding: 5px 16px 5px 5px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 800;
  line-height: 1.15;
}
.card__chip img {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.75);
  object-fit: cover;
}
.card__chip small {
  display: block;
  font-size: 10px;
  font-weight: 600;
  color: var(--ink-2);
}

.card__panel {
  left: 14px;
  right: 14px;
  bottom: 14px;
  justify-content: space-between;
  gap: 10px;
  padding: 13px 16px;
  border-radius: 16px;
}
.card__panel small {
  display: block;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--ink-2);
}
.card__panel strong {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0 8px;
  margin-top: 2px;
  font-family: var(--display);
  font-size: clamp(14px, 1.45vw, 18px);
  font-weight: 700;
  letter-spacing: 0.01em;
}
.card__rarity {
  font-family: var(--ui);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: linear-gradient(90deg, #ff4456, #ffc2c8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.card__more {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ff4d5e;
  text-shadow: 0 0 12px var(--red-glow);
  transition: gap 0.25s var(--ease), color 0.25s;
}
.card__more:hover {
  gap: 9px;
  color: #fff;
}

.card__hit {
  position: absolute;
  inset: 0;
  border: 0;
  border-radius: 22px;
  background: transparent;
  cursor: pointer;
}

/* ============ controls ============ */
.stage__nav {
  position: absolute;
  left: 50%;
  bottom: 18px;
  z-index: 6;
  display: flex;
  align-items: center;
  gap: 14px;
  translate: -50% 0;
}
.stage__arrow {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  cursor: pointer;
  transition: background 0.25s, border-color 0.25s;
}
.stage__arrow:hover {
  background: var(--red);
  border-color: var(--red);
}
.stage__dots {
  display: flex;
  gap: 7px;
}
.stage__dots button {
  width: 7px;
  height: 7px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.25);
  cursor: pointer;
  transition: width 0.5s var(--ease), background 0.3s;
}
.stage__dots button.is-on {
  width: 26px;
  background: var(--red);
  box-shadow: 0 0 12px var(--red-glow);
}

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
  .stage {
    --cw: min(62vw, 270px);
    --s1: calc(var(--cw) * 0.74);
    --floor: 70px;
  }
  .card[data-pos='-2'],
  .card[data-pos='2'] {
    opacity: 0;
    pointer-events: none;
  }
  .card[data-pos='-1'],
  .card[data-pos='1'] {
    --sc: 0.7;
    --ry: 0deg;
  }
  .card[data-pos='-1'] {
    --ry: 34deg;
  }
  .card[data-pos='1'] {
    --ry: -34deg;
  }
  .stage__room {
    -webkit-mask: radial-gradient(80% 70px at 50% 0, transparent calc(100% - 1.5px), #000 100%);
    mask: radial-gradient(80% 70px at 50% 0, transparent calc(100% - 1.5px), #000 100%);
  }
  .card__body,
  .card__hit {
    border-radius: 18px;
  }
  .card__body {
    -webkit-box-reflect: unset;
  }
  .card__chip {
    top: 10px;
    left: 10px;
  }
  .card__panel {
    left: 10px;
    right: 10px;
    bottom: 10px;
    padding: 11px 13px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__stars i,
  .stage__floor,
  .stage__glow,
  .card[data-pos='0'] .card__holo {
    animation: none;
  }
  .hero__line,
  .hero__sub,
  .card {
    animation: none;
  }
  .card,
  .card__body {
    transition-duration: 0.01s;
  }
}
</style>
