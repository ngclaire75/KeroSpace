<script setup lang="ts">
type Game = {
  id: string
  name: string
  dev: string
  year: number | string
  genre: string
  desc: string
  items: string
  platforms: string
}

const games: Game[] = [
  {
    id: 'hsr',
    name: 'Honkai: Star Rail',
    dev: 'HoYoverse',
    year: 2023,
    genre: 'Turn-based RPG',
    desc: 'Ride the Astral Express across the stars in a story-rich, turn-based space fantasy.',
    items: 'Light Cones · Relics',
    platforms: 'PC · PS5 · Mobile',
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    dev: 'HoYoverse',
    year: 2020,
    genre: 'Open-world RPG',
    desc: 'Explore Teyvat, master seven elements and team up four heroes in real-time combat.',
    items: 'Weapons · Artifacts',
    platforms: 'PC · PS5 · Xbox · Mobile',
  },
  {
    id: 'hi3',
    name: 'Honkai Impact 3rd',
    dev: 'HoYoverse',
    year: 2016,
    genre: 'Action RPG',
    desc: 'Fast, stylish 3D combat as Valkyries battle the Honkai to protect the world.',
    items: 'Weapons · Stigmata',
    platforms: 'PC · Mobile',
  },
  {
    id: 'wuwa',
    name: 'Wuthering Waves',
    dev: 'Kuro Games',
    year: 2024,
    genre: 'Open-world RPG',
    desc: 'Wake as the Rover in a post-apocalyptic world built on fluid, parry-driven combat.',
    items: 'Weapons · Echoes',
    platforms: 'PC · PS5 · Mobile',
  },
  {
    id: 'nte',
    name: 'Neverness to Everness',
    dev: 'Hotta Studio',
    year: 2026,
    genre: 'Urban open-world RPG',
    desc: 'Explore Hethereau as an Anomaly Hunter, uncover supernatural mysteries and shape your own life in the city.',
    items: 'Arcs · Cartridges',
    platforms: 'PC · Mac · PS5 · Mobile',
  },
  {
    id: 'mlbb',
    name: 'Mobile Legends: Bang Bang',
    dev: 'MOONTON Games',
    year: 2016,
    genre: '5v5 MOBA',
    desc: 'Choose your hero, team up in fast-paced 5v5 battles and turn smart builds into match-winning plays.',
    items: 'Equipment · Emblems',
    platforms: 'iOS · Android',
  },
]

const posters: Record<string, { src: string; width: number; height: number }> = {
  hsr: { src: '/images/games/card-hsr.webp', width: 1600, height: 2134 },
  genshin: { src: '/images/games/card-genshin.webp', width: 1600, height: 1600 },
  hi3: { src: '/images/games/card-hi3.webp', width: 1600, height: 1680 },
  wuwa: { src: '/images/games/card-wuwa.webp', width: 1600, height: 1600 },
  nte: { src: '/images/games/card-nte.webp', width: 1600, height: 1282 },
  mlbb: { src: '/images/games/card-mlbb.webp', width: 1800, height: 1792 },
}

const facts = [
  { k: 'Explore', v: 'Worlds & stories' },
  { k: 'Learn', v: 'Combat & progression' },
  { k: 'Discover', v: 'Items & equipment' },
  { k: 'Get started', v: 'Beginner introductions' },
]
const banners = [
  { src: '/images/games/banner-hsr-chrysos.webp', mobile: '/images/games/banner-hsr-mobile.webp', alt: 'Honkai: Star Rail — Crimson Heir of Chrysos banner', width: 2560, height: 1096 },
  { src: '/images/games/banner-wuwa-desktop-jpg-esrgan.webp', mobile: '/images/games/banner-wuwa-mobile-5461-esrgan.webp', alt: 'Wuthering Waves — Crimson character banner', width: 3832, height: 1642 },
]
const activeBanner = ref(0)
let bannerTimer: ReturnType<typeof setInterval> | undefined
function startBannerTimer() {
  if (bannerTimer !== undefined) clearInterval(bannerTimer)
  bannerTimer = setInterval(() => {
    if (!document.hidden) activeBanner.value = (activeBanner.value + 1) % banners.length
  }, 3000)
}
function selectBanner(index: number) {
  activeBanner.value = index
  startBannerTimer()
}

const artwork = {
  3: '/images/ChatGPT Image Oct 14, 2026 at 02_41_12 PM-3.png',
  7: '/images/ChatGPT Image Oct 14, 2026 at 02_41_18 PM-7.png',
  4: '/images/ChatGPT Image Oct 14, 2026 at 02_41_13 PM-4.png',
  1: '/images/ChatGPT Image Oct 14, 2026 at 02_41_09 PM-1.png',
  5: '/images/ChatGPT Image Oct 14, 2026 at 02_41_15 PM-5.png',
  10: '/images/ChatGPT Image Oct 14, 2026 at 02_41_22 PM-10.png',
  2: '/images/ChatGPT Image Oct 14, 2026 at 02_41_11 PM-2.png',
  8: '/images/ChatGPT Image Oct 14, 2026 at 02_41_19 PM-8.png',
  6: '/images/ChatGPT Image Oct 14, 2026 at 02_41_16 PM-6.png',
}

const covers = [
  {
    t: 'Story & world',
    d: 'The setting, factions and the story so far, kept spoiler-light.',
    image: artwork[3],
  },
  {
    t: 'How it plays',
    d: 'Core combat, progression and what to focus on first.',
    image: artwork[6],
  },
  {
    t: 'Key items',
    d: 'The gear that matters most and how to read its stats.',
    image: artwork[1],
  },
  {
    t: 'First steps',
    d: 'A clear starting path so your first hours really count.',
    image: artwork[10],
  },
]

/* ---------- scroll reveal ----------
   Content renders visible (SSR / no-JS safe). Once mounted, the section is
   "armed" so anything not yet on screen waits, then fades up as it enters. */
const root = ref<HTMLElement>()
const armed = ref(false)
let io: IntersectionObserver | undefined

onMounted(() => {
  startBannerTimer()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const els = root.value?.querySelectorAll<HTMLElement>('[data-reveal]')
  if (!els?.length) return
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.classList.add('is-in')
        io?.unobserve(e.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  )
  els.forEach((el) => io!.observe(el))
  armed.value = true
})
onBeforeUnmount(() => {
  io?.disconnect()
  if (bannerTimer !== undefined) clearInterval(bannerTimer)
})
</script>

<template>
  <section id="games" ref="root" class="games" :class="{ 'is-armed': armed }" aria-labelledby="games-title">
    <div class="games__wrap">
      <!-- ===== heading ===== -->
      <header class="games__head" data-reveal>
        <p class="eyebrow"><span aria-hidden="true" />Game introductions</p>
        <h2 id="games-title" class="games__title">Get to know <em>every world</em></h2>
        <p class="games__lede">
          Find your next game or get familiar with one you already play. Explore each
          world, learn the combat and discover the gear that shapes your experience.
        </p>
      </header>

      <article id="game-introduction" tabindex="-1" class="feature" data-reveal aria-labelledby="feature-title">
        <div id="banner-slides" class="feature__media">
          <picture
            v-for="(banner, index) in banners"
            :key="banner.src"
            class="feature__slide"
            :class="{ 'is-active': activeBanner === index }"
            :aria-hidden="activeBanner !== index"
          >
            <source v-if="banner.mobile" media="(max-width: 560px)" :srcset="banner.mobile" />
            <img class="feature__art" :width="banner.width" :height="banner.height" :src="banner.src" :alt="banner.alt" loading="eager" />
          </picture>
          <div class="banner-indicators" role="group" aria-label="Choose a banner">
            <button
              v-for="(banner, index) in banners"
              :key="banner.src"
              type="button"
              :class="{ 'is-active': activeBanner === index }"
              :aria-label="`Show ${banner.alt}`"
              :aria-pressed="activeBanner === index"
              aria-controls="banner-slides"
              @click="selectBanner(index)"
            ><span aria-hidden="true" /></button>
          </div>
        </div>
        <div class="feature__body">
          <div class="feature__summary">
            <p class="feature__label"><span aria-hidden="true" />Explore with KeroSpace</p>
            <h3 id="feature-title" class="feature__title">Your guide to <em>every game</em></h3>
            <p class="feature__text">Get to know the games you love with KeroSpace. Explore their worlds, understand how they play and learn about the items and equipment that shape your experience.</p>
          </div>

          <dl class="feature__facts">
            <div v-for="f in facts" :key="f.k">
              <dt>{{ f.k }}</dt>
              <dd>{{ f.v }}</dd>
            </div>
          </dl>
        </div>
      </article>

      <!-- ===== what each introduction covers ===== -->
      <div class="covers" data-reveal>
        <div class="shelf__head">
          <h3 class="shelf__title">Every introduction covers</h3>
        </div>
        <ol class="covers__list">
          <li v-for="c in covers" :key="c.t" class="cover">
            <span class="cover__icon" :class="{ 'cover__icon--first-steps': c.t === 'First steps' }" aria-hidden="true">
              <img :src="c.image" alt="" width="64" height="64" loading="lazy" />
            </span>
            <h4 class="cover__title">{{ c.t }}</h4>
            <p class="cover__text">{{ c.d }}</p>
          </li>
        </ol>
      </div>

      <!-- ===== supported games ===== -->
      <div id="supported-games" class="shelf">
        <div class="shelf__head" data-reveal>
          <h3 class="shelf__title">Supported games</h3>
        </div>

        <ul class="shelf__list" data-reveal>
          <li v-for="(g, k) in games" :key="g.id" class="gcard" :style="{ '--k': k }">
            <article class="gcard__link" :aria-label="g.name">
              <span class="gcard__poster-frame">
                <img
                  class="gcard__poster"
                  :class="`gcard__poster--${g.id}`"
                  :src="posters[g.id].src"
                  alt=""
                  :width="posters[g.id].width"
                  :height="posters[g.id].height"
                  loading="lazy"
                />
                <span class="gcard__veil" aria-hidden="true" />

                <span class="gcard__tags">
                  <span class="gcard__genre">{{ g.genre }}</span>
                </span>

                <span class="gcard__logo" :class="`gcard__logo--${g.id}`">
                  <img :src="`/images/games/${g.id}-logo.webp`" :alt="g.name" loading="lazy" />
                </span>
              </span>

              <span class="gcard__body">
                <span class="gcard__name">{{ g.name }}</span>
                <span class="gcard__meta">
                  <span class="gcard__dev">{{ g.dev }}</span>
                </span>
                <span class="gcard__desc">{{ g.desc }}</span>

                <span class="gcard__stats">
                  <span class="gcard__stat">
                    <span class="gcard__stat-k">Items</span>
                    <span class="gcard__stat-v">{{ g.items }}</span>
                  </span>
                  <span class="gcard__stat">
                    <span class="gcard__stat-k">Platforms</span>
                    <span class="gcard__stat-v">{{ g.platforms }}</span>
                  </span>
                </span>

                <span class="gcard__foot">
                  <span class="gcard__cta">Read introduction</span>
                  <span class="gcard__go" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                </span>
              </span>
            </article>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.games {
  --grad: linear-gradient(90deg, #e8101c, #ff2f6e);
  --panel: #0b0b0e;
  --edge: rgba(255, 255, 255, 0.08);
  position: relative;
  padding: clamp(32px, 4.5vw, 56px) 0 clamp(80px, 10vw, 136px);
  background: #000;
}
.games__wrap {
  width: min(1240px, 100% - 2 * clamp(16px, 4vw, 40px));
  margin: 0 auto;
}

/* ============ reveal ============ */
.games.is-armed [data-reveal]:not(.is-in) {
  opacity: 0;
  translate: 0 28px;
}
.games [data-reveal] {
  transition:
    opacity 0.8s var(--ease),
    translate 0.9s var(--ease);
}

/* ============ heading ============ */
.games__head {
  max-width: 720px;
}
.eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-2);
}
.eyebrow span {
  width: 26px;
  height: 2px;
  border-radius: 2px;
  background: var(--grad);
}
.games__title {
  margin: 0;
  font-family: var(--display);
  font-size: clamp(28px, 4.4vw, 52px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  text-wrap: balance;
}
.games__title em {
  font-style: normal;
  background: linear-gradient(90deg, #e8101c, #ff2f6e 55%, #ffb3c8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.games__lede {
  margin: 18px 0 0;
  max-width: 600px;
  font-size: clamp(15px, 1.4vw, 17px);
  font-weight: 600;
  line-height: 1.65;
  color: var(--ink-2);
}

/* ============ game browser ============ */
@property --kero-banner-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

@keyframes banner-outline {
  to { --kero-banner-angle: 360deg; }
}

.feature {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  margin-top: 28px;
  border-radius: 10px;
  overflow: hidden;
  background: var(--panel);
  scroll-margin-top: 100px;
}
.feature:focus-visible {
  outline: none;
}
.feature__media {
  position: relative;
  isolation: isolate;
  display: grid;
  place-items: center;
  min-width: 0;
  aspect-ratio: 1916 / 821;
  overflow: hidden;
  border-radius: 9px 9px 0 0;
  background: #08080a;
}
.feature__media::before,
.feature__media::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  pointer-events: none;
}
.feature__media::before {
  box-shadow:
    inset 0 0 14px rgba(255, 16, 43, 0.12),
    inset 0 0 14px rgba(255, 47, 139, 0.12),
    inset 0 0 14px rgba(168, 60, 255, 0.12);
}
.feature__media::after {
  padding: 2px;
  background: conic-gradient(
    from var(--kero-banner-angle),
    #ff102b 0%,
    #ff2f8b 33.333%,
    #a83cff 66.667%,
    #ff102b 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.35));
  animation: banner-outline 6s linear infinite;
}
.feature__slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.65s ease;
}
.feature__art {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 0;
  object-fit: cover;
}
.feature__slide.is-active { opacity: 1; }
.banner-indicators {
  position: absolute;
  bottom: 6px;
  left: 50%;
  translate: -50% 0;
  z-index: 2;
  display: flex;
  gap: 6px;
}
.banner-indicators button {
  display: grid;
  place-items: center;
  width: 48px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
}
.banner-indicators span {
  width: 40px;
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.55);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.8);
}
.banner-indicators button.is-active span {
  background: linear-gradient(90deg, #ff9bdd, #c69aff);
  box-shadow: 0 0 7px rgba(221, 154, 255, 0.65);
}
.feature__body {
  position: relative;
  isolation: isolate;
  border-radius: 0 0 9px 9px;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: clamp(24px, 4vw, 56px);
  align-items: start;
  padding: clamp(22px, 3vw, 36px);
  border: 1px solid var(--edge);
}
.feature__label {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 12px;
  color: #ff5a8a;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.feature__label span {
  flex-shrink: 0;
  width: 22px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, #e8101c, #ff2f6e);
}
.feature__title {
  margin: 0;
  font-family: var(--display);
  font-size: clamp(21px, 2.4vw, 30px);
  line-height: 1.3;
  text-transform: uppercase;
  text-wrap: balance;
}
.feature__title em {
  font-style: normal;
  background: linear-gradient(90deg, #e8101c, #ff2f6e 58%, #ffb3c8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.feature__text {
  margin: 12px 0 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.65;
  color: var(--ink-2);
}
.feature__gear {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin-top: 20px;
  font-size: 12px;
  color: var(--ink-3);
}
.feature__gear b { color: #ff8aaa; }
.feature__facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 30px 18px;
  margin: 0;
  padding: 0 0 0 28px;
  border-left: 1px solid var(--edge);
}
.feature__facts div { min-width: 0; }
.feature__facts dt {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.feature__facts dd {
  margin: 8px 0 0;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
}

.feature__summary { min-width: 0; }
/* ============ covers ============ */
.covers {
  margin-top: clamp(56px, 7vw, 88px);
}
.covers__list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.cover {
  position: relative;
  padding: 22px;
  border: 1px solid var(--edge);
  border-radius: 8px;
  background: var(--panel);
  transition: border-color 0.3s;
}
.cover:hover {
  border-color: rgba(255, 47, 110, 0.4);
}
.cover__icon {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
}
.cover__icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.cover__icon--first-steps img {
  width: 56px;
  height: 56px;
}
.cover__title {
  margin: 18px 0 0;
  font-family: var(--display);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
.cover__text {
  margin: 8px 0 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.55;
  color: var(--ink-2);
}

/* ============ supported games ============ */
.shelf {
  margin-top: clamp(56px, 7vw, 88px);
}
.shelf__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}
.shelf__title {
  margin: 0;
  font-family: var(--display);
  font-size: clamp(20px, 2.2vw, 28px);
  font-weight: 800;
  text-transform: uppercase;
}
.shelf__list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.gcard {
  min-width: 0;
}
.gcard__link {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0;
  text-align: left;
  border: 1px solid var(--edge);
  /* matches the feature panel above */
  border-radius: 10px;
  overflow: hidden;
  background:
    radial-gradient(120% 70% at 50% 0%, rgba(232, 16, 28, 0.1), transparent 62%),
    var(--panel);
  transition: border-color 0.4s var(--ease);
}
.gcard__poster-frame {
  position: relative;
  display: block;
  width: 100%;
  flex-shrink: 0;
  aspect-ratio: 4 / 3;
  border-radius: 9px 9px 0 0;
  overflow: hidden;
  /* the scaling poster is composited, so clip it here rather than relying on
     the card's overflow — keeps the card's own 1px outline unclipped */
  clip-path: inset(0 round 9px 9px 0 0);
}
.gcard__poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 20%;
}
.gcard__poster--hi3 {
  object-position: 50% 35%;
}
/* square source: pull the crop down so the face clears the logo */
.gcard__poster--wuwa {
  object-position: 50% 100%;
}
/* art fades into the panel so the logo always has a dark bed */
.gcard__veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.05) 26%,
    rgba(0, 0, 0, 0.35) 62%,
    rgba(11, 11, 14, 0.92) 88%,
    var(--panel) 100%
  );
  pointer-events: none;
}
.gcard__tags {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.gcard__genre {
  padding: 5px 10px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(10, 6, 8, 0.62);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
}
.gcard__genre {
  min-width: 0;
  overflow: hidden;
  color: #ff8aaa;
  text-overflow: ellipsis;
}

/* every logo centres in the same box, so different shapes line up */
.gcard__logo {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 14px;
  display: flex;
  align-items: flex-end;
  height: 56px;
}
.gcard__logo img {
  max-width: 88%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  object-position: left bottom;
  filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.75));
}
/* both marks are tall for their width, so the 56px bed left them small —
   give them height to match the wide wordmarks (they overflow upward) */
.gcard__logo--hsr img {
  height: 86px;
  max-height: 86px;
  max-width: 100%;
}
.gcard__logo--hi3 img {
  height: 72px;
  max-height: 72px;
  max-width: 100%;
}
/* near-square mark: give it height so it reads at a similar weight
   to the wide wordmarks (it overflows the 56px bed upward, by design) */
.gcard__logo--nte img {
  height: 78px;
  max-height: 78px;
  max-width: 100%;
}

/* ---- body ---- */
.gcard__body {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  width: 100%;
  padding: 16px;
}
.gcard__name {
  font-family: var(--display);
  font-size: 15.5px;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: 0.01em;
}
.gcard__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: -4px;
}
.gcard__dev {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.gcard__desc {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.62;
  color: var(--ink-2);
}

/* ---- stat rows ---- */
.gcard__stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.gcard__stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
  padding: 9px 12px;
  border: 1px solid transparent;
  border-radius: 9px;
  background:
    linear-gradient(100deg, rgba(232, 16, 28, 0.3), rgba(255, 47, 110, 0.26) 58%, rgba(150, 60, 255, 0.28)) padding-box,
    linear-gradient(100deg, #e8101c, #ff2f6e 58%, #9b3cff) border-box;
}
.gcard__stat-k {
  flex-shrink: 0;
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #fff;
}
.gcard__stat-v {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 11.5px;
  font-weight: 700;
  line-height: 1.45;
  text-align: right;
  color: #fff;
}

/* ---- footer ---- */
.gcard__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 2px;
  padding-top: 4px;
}
.gcard__cta {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-2);
  transition: color 0.3s;
}
.gcard__go {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  transition: background 0.35s;
}

@media (hover: hover) {
  /* no motion on hover: the card and arrow stay put */
  .gcard__link:hover {
    border-color: rgba(255, 47, 110, 0.45);
  }
  .gcard__link:hover .gcard__cta {
    color: #fff;
  }
  .gcard__link:hover .gcard__go {
    background: var(--grad);
  }
}

/* ============ responsive ============ */
@media (max-width: 980px) {
  .feature { grid-template-columns: minmax(0, 1fr); }
  .feature__body { grid-template-columns: minmax(0, 1fr); }
  .feature__facts {
    padding: 22px 0 0;
    border-left: 0;
    border-top: 1px solid var(--edge);
  }
  .covers__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .feature__media { aspect-ratio: 1672 / 941; }
  .feature__art { object-fit: contain; }
  .shelf__list {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }
  .banner-indicators {
    bottom: -5px;
  }
  .games__lede {
    font-size: 15px;
  }
  .feature {
    border-radius: 10px;
  }
  .feature__facts { grid-template-columns: minmax(0, 1fr); gap: 16px; }
  .feature__facts div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }
  .feature__facts dt { flex-shrink: 0; letter-spacing: 0.1em; }
  .feature__facts dd {
    margin: 0;
    font-size: clamp(11px, 3.3vw, 13px);
    white-space: nowrap;
    text-align: right;
  }
  .covers__list {
    grid-template-columns: 1fr;
  }
  .cover {
    display: grid;
    grid-template-columns: 64px minmax(0, 1fr);
    column-gap: 14px;
    padding: 18px;
  }
  .cover__icon {
    grid-row: span 2;
  }
  .cover__title {
    margin: 2px 0 0;
  }
  .cover__text {
    margin-top: 4px;
  }
  .shelf__head {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .feature__media::after { animation: none; }
  .feature__slide,
  .feature__art,
  .banner-indicators span,
  .games [data-reveal],
  .gcard__link,
  .gcard__poster,
  .cover,
  .gcard__go {
    transition: none;
  }
}
</style>
