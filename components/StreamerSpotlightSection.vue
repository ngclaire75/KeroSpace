<script setup lang="ts">
import { prepareImage } from '~/utils/responsiveImages'
const section = ref<HTMLElement>()
const armed = ref(false)
let observer: IntersectionObserver | undefined

type Creator = {
  game: string
  gameName: string
  name: string
  handle: string
  photo: string
  banner: string
  category: string
  bio: string
}

// one creator per supported game; channels verified on Twitch.
// banners: your uploaded key art
const creators: Creator[] = [
  {
    game: 'hsr',
    gameName: 'Honkai: Star Rail',
    name: 'Tectone',
    handle: 'tectone',
    photo: '/images/streamers/tectone.webp',
    banner: '/images/streamers/banner-hsr.webp',
    category: 'Honkai: Star Rail · Gacha streamer',
    bio: 'A gacha creator with plenty to say. His Star Rail coverage brings game updates, reactions and lively discussion together.',
  },
  {
    game: 'genshin',
    gameName: 'Genshin Impact',
    name: 'Tuonto',
    handle: 'tuonto',
    photo: '/images/streamers/tuonto.webp',
    banner: '/images/streamers/banner-genshin.webp',
    category: 'Genshin Impact · Gaming creator',
    bio: 'Known for his dedication to Jean, Tuonto brings a playful side to Genshin through character builds, challenges and pulls.',
  },
  {
    game: 'hi3',
    gameName: 'Honkai Impact 3rd',
    name: 'Fenrysk',
    handle: 'fenrysk',
    photo: '/images/streamers/fenrysk.webp',
    banner: '/images/streamers/banner-hi3.webp',
    category: 'Honkai Impact 3rd · Streamer',
    bio: 'An artist and competitive Honkai player. Fenrysk shares the challenge of mastering combat through gameplay and theorycrafting.',
  },
  {
    game: 'wuwa',
    gameName: 'Wuthering Waves',
    name: 'Rubee',
    handle: 'rubee',
    photo: '/images/streamers/rubee.webp',
    banner: '/images/streamers/banner-wuwa.webp',
    category: 'Wuthering Waves · Streamer',
    bio: 'A worm VTuber with a taste for discovery. Join Rubee in Wuthering Waves for exploration and finds worth sharing with chat.',
  },
  {
    game: 'nte',
    gameName: 'Neverness to Everness',
    name: 'Bnuy',
    handle: 'bnuy',
    photo: '/images/streamers/bnuy.webp',
    banner: '/images/streamers/banner-nte.webp',
    category: 'Neverness to Everness · Streamer',
    bio: 'A Sweden-based gamer and cosplayer, Bnuy mixes gaming with creativity. Discover her channel through Neverness to Everness.',
  },
  {
    game: 'mlbb',
    gameName: 'Mobile Legends: Bang Bang',
    name: 'smetanduck',
    handle: 'smetanduck',
    photo: '/images/streamers/smetanduck.webp',
    banner: '/images/streamers/banner-mlbb.webp',
    category: 'Mobile Legends · Russian-language creator',
    bio: 'Known as SMETANA, this MLBB creator breaks down the ranked climb. Tune in for strategy, live matches and answers to chat’s questions.',
  },
]
const activeIndex = ref(1)
const loadedCreators = ref([1])
const bannerSizes = '(max-width: 760px) 100vw, 760px'
let creatorRequest = 0
async function showCreator(index: number) {
  const request = ++creatorRequest
  await prepareImage(creators[index]!.banner, bannerSizes)
  if (request !== creatorRequest) return
  if (!loadedCreators.value.includes(index)) loadedCreators.value.push(index)
  activeIndex.value = index
  void prepareImage(creators[(index + 1) % creators.length]!.banner, bannerSizes)
}
useImageWarmup(section, () => {
  void prepareImage(creators[1]!.banner, bannerSizes)
  void prepareImage(creators[2]!.banner, bannerSizes)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) startSlideTimer()
})
const creator = computed(() => creators[activeIndex.value])

// auto-advances like the first banner; picking a bar restarts the timer
let slideTimer: ReturnType<typeof setInterval> | undefined
function startSlideTimer() {
  if (slideTimer !== undefined) clearInterval(slideTimer)
  slideTimer = setInterval(() => {
    if (!document.hidden) void showCreator((activeIndex.value + 1) % creators.length)
  }, 5000)
}
function selectCreator(index: number) {
  void showCreator(index)
  startSlideTimer()
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!('IntersectionObserver' in window)) return
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        observer?.unobserve(entry.target)
      }
    },
    { threshold: 0.1 },
  )
  section.value?.querySelectorAll('[data-enter]').forEach((el) => observer?.observe(el))
  armed.value = true
})
onBeforeUnmount(() => {
  observer?.disconnect()
  if (slideTimer !== undefined) clearInterval(slideTimer)
})
</script>

<template>
  <section
    id="creator-spotlight"
    ref="section"
    class="creator-section"
    :class="{ 'is-armed': armed }"
    aria-labelledby="creator-title"
  >
    <div class="creator-wrap">
      <!-- ===== heading ===== -->
      <header class="creator-head" data-enter>
        <p class="creator-eyebrow">From the community</p>
        <h2 id="creator-title">The games you love.<br /><em>A new perspective.</em></h2>
        <p class="creator-intro">
          There’s more to a game than its items. Discover the reactions, adventures and
          conversations that bring its world to life through the people who play it.
        </p>
      </header>

      <!-- ===== creator panel: banner + profile side by side ===== -->
      <article class="creator-card" data-enter aria-labelledby="streamer-name">
        <div class="creator-banner">
          <div
            v-for="(entry, index) in creators"
            :key="entry.handle"
            class="creator-banner__slide"
            :class="{ 'is-active': activeIndex === index }"
            aria-hidden="true"
          >
            <AppImage
              v-if="loadedCreators.includes(index)"
              class="creator-banner__art"
              :sizes="bannerSizes"
              :src="entry.banner"
              alt=""
              width="1200"
              height="675"
              loading="lazy"
            />
          </div>
          <span class="creator-banner__shade" aria-hidden="true" />
          <span class="creator-banner__brand">
            <AppImage src="/images/streamers/twitch-wordmark.svg" alt="Twitch" width="64" height="22" />
          </span>

          <div class="creator-bars" role="group" aria-label="Choose a creator">
            <button
              v-for="(c, index) in creators"
              :key="c.handle"
              type="button"
              :class="{ 'is-active': activeIndex === index }"
              :aria-label="`Show ${c.name}, ${c.gameName}`"
              :aria-pressed="activeIndex === index"
              @click="selectCreator(index)"
            ><span aria-hidden="true" /></button>
          </div>
        </div>

        <div class="creator-body" aria-live="polite">
          <div class="creator-top">
            <div class="creator-avatar">
              <Transition name="creator-fade">
                <AppImage
                  :key="creator.photo"
                  :src="creator.photo" sizes="120px"
                  :alt="`${creator.name}, Twitch streamer`"
                  width="450"
                  height="450"
                  loading="lazy"
                />
              </Transition>
              <!-- verified seal, in neon purple -->
              <svg class="creator-avatar__badge" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
                <path
                  fill="#ff4d5e"
                  stroke="#0b0b0e"
                  stroke-width="2.2"
                  paint-order="stroke"
                  d="M12 1.5l2.2 1.6 2.7-.3 1.1 2.5 2.5 1.1-.3 2.7L21.8 11.3 20.2 13.5l.3 2.7-2.5 1.1-1.1 2.5-2.7-.3L12 21.1l-2.2-1.6-2.7.3-1.1-2.5-2.5-1.1.3-2.7L2.2 11.3 3.8 9.1l-.3-2.7 2.5-1.1 1.1-2.5 2.7.3z"
                />
                <path d="m7.8 11.5 2.9 2.9 5.5-5.6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>

          <!-- every creator's text is stacked in the same grid cell, so the box is
               always as tall as the longest one and never changes height on a swap
               (an out-in transition used to empty it for a moment, which made the
               whole page below jump every 5s — felt as a shake at the bottom) -->
          <div class="creator-identity">
            <div
              v-for="(entry, index) in creators"
              :key="entry.handle"
              class="creator-identity__slide"
              :class="{ 'is-active': activeIndex === index }"
              :aria-hidden="activeIndex !== index"
            >
              <p class="creator-category">{{ entry.category }}</p>
              <h3 :id="activeIndex === index ? 'streamer-name' : undefined">{{ entry.name }}</h3>
              <p class="creator-bio">{{ entry.bio }}</p>
            </div>
          </div>

          <a
            class="creator-cta"
            :href="`https://www.twitch.tv/${creator.handle}`"
            :aria-label="`Watch ${creator.name} on Twitch`"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="creator-cta__content" aria-hidden="true">
              <Transition name="creator-cta-text">
                <span :key="creator.handle" class="creator-cta__group">
                  <AppImage src="/images/streamers/twitch-glitch-red.svg" alt="" width="26" height="26" />
                  <span>Watch {{ creator.name }} on Twitch</span>
                  <svg viewBox="0 0 24 24" width="17" height="17">
                    <path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </Transition>
            </span>
          </a>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.creator-section {
  --creator-red: #ff183b;
  --creator-pink: #ff4d5e;
  --creator-purple: #ff4d5e;
  --creator-panel: #0b0b0e;
  --creator-line: rgba(255, 255, 255, 0.1);
  --creator-grad: linear-gradient(100deg, #ff183b, #ff183b 55%, #dcdce0);
  position: relative;
  /* no top padding: the games section above already leaves room */
  padding: 0 0 clamp(80px, 10vw, 136px);
  background: transparent;
}
.creator-wrap {
  width: min(1240px, 100% - 2 * clamp(16px, 4vw, 40px));
  margin: 0 auto;
}

/* ---------- heading ---------- */
.creator-head {
  max-width: 720px;
}
.creator-eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 18px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #fff;
}
.creator-head h2 {
  margin: 0;
  font-family: var(--display);
  font-size: clamp(26px, 3.4vw, 46px);
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: #fff;
  text-wrap: balance;
}
/* solid neon first; the gradient only replaces it where clipping to text works */
.creator-head em {
  font-style: normal;
  color: var(--creator-pink);
}
@supports ((-webkit-background-clip: text) or (background-clip: text)) {
  .creator-head em {
    background: var(--creator-grad);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
}
.creator-intro {
  max-width: 600px;
  margin: 20px 0 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.8;
  color: var(--ink-2);
}

/* ---------- creator panel ---------- */
.creator-card {
  --creator-radius: 0px;
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
  margin-top: clamp(28px, 4vw, 44px);
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: var(--creator-radius);
  background:
    linear-gradient(var(--creator-panel), var(--creator-panel)) padding-box,
    conic-gradient(from var(--card-outline-angle), #ff183b, #ff183b 35%, #dcdce0 50%, #ff183b 65%, #ff183b) border-box;
  animation: card-outline-turn 3s linear infinite;
}

.creator-banner {
  position: relative;
  min-height: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #08080c;
  border-radius: var(--creator-radius) 0 0 var(--creator-radius);
}
.creator-banner__slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.65s ease;
}
.creator-banner__slide.is-active { opacity: 1; }
.creator-banner__art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center;
  transform: scale(1);
  transition: transform 4.5s cubic-bezier(0.2, 0.45, 0.35, 1);
}
.creator-banner__slide.is-active .creator-banner__art {
  transform: scale(1.065);
}
/* light top darkening keeps the Twitch pill readable; no side fade */
.creator-banner__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, transparent 28%);
  pointer-events: none;
}
.creator-banner__brand {
  position: absolute;
  top: 14px;
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: rgba(10, 6, 8, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.creator-banner__brand {
  right: 14px;
}
.creator-banner__brand img {
  width: 58px;
  height: 20px;
  object-fit: contain;
}

/* slider bars, matching the first banner */
.creator-bars {
  position: absolute;
  bottom: 6px;
  left: 50%;
  translate: -50% 0;
  z-index: 2;
  display: flex;
  gap: 6px;
}
.creator-bars button {
  display: grid;
  place-items: center;
  width: 48px;
  height: 36px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}
.creator-bars span {
  width: 40px;
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.35);
  transition:
    background 0.3s,
    box-shadow 0.3s;
}
.creator-bars button.is-active span {
  background: linear-gradient(90deg, #ff183b, #ff183b 55%, #dcdce0);
  box-shadow: 0 0 7px rgba(255, 77, 94, 0.65);
}

/* ---------- profile ---------- */
.creator-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: clamp(22px, 2.6vw, 34px);
  border-radius: 0 var(--creator-radius) var(--creator-radius) 0;
}
.creator-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.creator-avatar {
  position: relative;
  flex-shrink: 0;
  width: 84px;
  height: 84px;
  padding: 3px;
  border-radius: 50%;
  background: var(--creator-grad);
}
.creator-avatar > img {
  position: absolute;
  inset: 3px;
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  border: 4px solid var(--creator-panel);
  border-radius: 50%;
  object-fit: cover;
  background: var(--creator-panel);
}
.creator-avatar__badge {
  position: absolute;
  right: -3px;
  bottom: -1px;
  z-index: 1;
  width: 26px;
  height: 26px;
  /* the dark halo is the SVG stroke. No CSS filter here: a filtered layer
     on top of the cross-fading photo gets re-rasterised every frame and
     visibly jiggles. Own layer so the fade underneath can't nudge it. */
  overflow: visible;
  transform: translateZ(0);
}

.creator-identity {
  flex: 1;
  min-height: 150px;
  margin-top: 20px;
}
.creator-category {
  margin: 0 0 8px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #ff4d5e;
}
.creator-identity h3 {
  margin: 0;
  font-family: var(--display);
  font-size: clamp(26px, 2.6vw, 34px);
  line-height: 1.15;
  text-transform: uppercase;
}
.creator-bio {
  margin: 12px 0 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
  font-size: 14px;
  line-height: 1.75;
  color: var(--ink-2);
}

.creator-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 22px;
  padding: 14px 20px;
  border: 1px solid transparent;
  border-radius: 10px;
  /* solid red → dark red fill; border-box origin so the gradient runs edge to edge with no seam */
  background: linear-gradient(135deg, #ff183b, #c8102e 50%, #6e0614) border-box;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: filter 0.3s var(--ease);
}
.creator-cta img {
  width: 26px;
  height: 26px;
}
.creator-cta__content {
  display: inline-grid;
  align-items: center;
  justify-items: center;
  white-space: nowrap;
}
.creator-cta__group {
  grid-area: 1 / 1;
  display: inline-flex;
  align-items: center;
  gap: var(--cta-gap, 12px);
}
.creator-cta__group > img,
.creator-cta__group > svg {
  flex-shrink: 0;
}
.creator-cta-text-enter-active,
.creator-cta-text-leave-active {
  transition: opacity 0.4s ease;
}
.creator-cta-text-enter-from,
.creator-cta-text-leave-to {
  opacity: 0;
}

/* ---------- swaps ---------- */
.creator-fade-enter-active,
.creator-fade-leave-active {
  transition: opacity 0.4s var(--ease);
}
.creator-fade-leave-active {
  position: absolute;
}
.creator-fade-enter-from,
.creator-fade-leave-to {
  opacity: 0;
}
.creator-identity {
  display: grid;
}
.creator-identity__slide {
  grid-area: 1 / 1;
  min-width: 0;
  opacity: 0;
  translate: 0 8px;
  visibility: hidden;
  transition:
    opacity 0.26s var(--ease),
    translate 0.26s var(--ease),
    visibility 0s linear 0.26s;
}
.creator-identity__slide.is-active {
  opacity: 1;
  translate: none;
  visibility: visible;
  transition-delay: 0.12s, 0.12s, 0s;
}

/* ---------- entrance ---------- */
.creator-section.is-armed [data-enter]:not(.is-visible) {
  opacity: 0;
}
[data-enter] {
  transition: opacity 0.8s var(--ease);
}

@media (hover: hover) {
  .creator-bars button:not(.is-active):hover span {
    background: rgba(255, 255, 255, 0.7);
  }
  .creator-cta:hover {
    filter: brightness(1.12);
  }
}

/* ---------- responsive ---------- */
@media (max-width: 900px) {
  /* stack: banner on top, profile below */
  .creator-card {
    grid-template-columns: minmax(0, 1fr);
  }
  .creator-banner { border-radius: var(--creator-radius) var(--creator-radius) 0 0; }
  .creator-body { border-radius: 0 0 var(--creator-radius) var(--creator-radius); }
  .creator-banner__shade {
    background:
      linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, transparent 30%),
      linear-gradient(0deg, rgba(11, 11, 14, 0.75) 0%, transparent 40%);
  }
  .creator-identity {
    min-height: 0;
  }
}

@media (max-width: 560px) {
  .creator-head h2 {
    font-size: clamp(25px, 6.5vw, 34px);
  }
  .creator-intro {
    font-size: 15px;
  }
  .creator-card {
    --creator-radius: 0px;
  }
  .creator-banner__brand {
    top: 10px;
    height: 28px;
  }
  .creator-banner__brand {
    right: 10px;
  }
  .creator-bars {
    bottom: 2px;
    gap: 2px;
  }
  .creator-bars button {
    width: 40px;
  }
  .creator-bars span {
    width: 32px;
  }
  .creator-avatar {
    width: 72px;
    height: 72px;
  }
  .creator-cta {
    --cta-gap: 10px;
    width: 100%;
    gap: 10px;
    padding: 13px 14px;
    font-size: 12px;
    letter-spacing: 0.03em;
    white-space: nowrap;
  }
  .creator-cta img {
    width: 22px;
    height: 22px;
  }
}

@media (max-width: 380px) {
  .creator-cta {
    --cta-gap: 6px;
    gap: 6px;
    padding-inline: 10px;
    font-size: 10px;
  }
  .creator-cta img { width: 18px; height: 18px; }
  .creator-cta__group > svg { width: 14px; height: 14px; }
}

@media (prefers-reduced-motion: reduce) {
  .creator-card { animation: none; }
  .creator-banner__slide.is-active .creator-banner__art {
    transform: none;
  }
  [data-enter],
  .creator-banner__slide,
  .creator-banner__art,
  .creator-cta,
  .creator-cta-text-enter-active,
  .creator-cta-text-leave-active,
  .creator-fade-enter-active,
  .creator-fade-leave-active,
  .creator-identity__slide {
    transition: none;
  }
  .creator-section.is-armed [data-enter]:not(.is-visible) {
    opacity: 1;
    translate: none;
  }
}
</style>
