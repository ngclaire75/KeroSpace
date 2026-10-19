<script setup lang="ts">
import { guideGames } from '~/data/guides'

const props = defineProps<{ gameId: string }>()
const game = computed(() => guideGames.find(item => item.id === props.gameId)!)
const rosterLink = computed(() => `/guides/${game.value.id}/characters`)

const features = ['Recommended equipment', 'Stats to aim for', 'Upgrade priorities', 'Team synergy']
</script>

<template>
  <section id="database" class="gx-section explorer" aria-labelledby="gx-db-title">
    <div class="explorer__panel" data-reveal>
      <!-- ===== copy ===== -->
      <div class="explorer__copy">
        <p class="explorer__eyebrow">Explore {{ game.short }}</p>
        <h2 id="gx-db-title" class="explorer__title">The details behind<br /><em class="gd-em">every build.</em></h2>
        <p class="explorer__intro">Every released character and hero, with the equipment, stats and upgrade order that make their build work.</p>
        <ul class="explorer__features">
          <li v-for="feature in features" :key="feature">{{ feature }}</li>
        </ul>
        <NuxtLink :to="rosterLink" class="explorer__cta">
          Browse all characters
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
        </NuxtLink>
      </div>

      <!-- ===== artwork: fills the right side at exactly the height of the text ===== -->
      <div class="explorer__art">
        <img :src="`/images/guide-details/${game.id}.webp`" :alt="`${game.name} artwork`" loading="lazy" decoding="async" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.explorer__panel {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  border: 2px solid transparent;
  background: #000;
}
.explorer__panel::after {
  /* permanent neon outline, same recipe as the other guide cards */
  content: '';
  position: absolute;
  inset: -2px;
  padding: 2px;
  background: conic-gradient(from var(--card-outline-angle), #ff69c8, #b26bff, #ff3158, #ff69c8);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  animation: card-outline-turn 8s linear infinite;
  pointer-events: none;
}

/* ============ copy ============ */
.explorer__copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(28px, 4vw, 56px);
  border-right: 1px solid #2a2a31;
}
.explorer__eyebrow {
  margin: 0 0 18px;
  color: #fff;
  font: 800 11px / 1.4 var(--ui);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.explorer__title {
  margin: 0;
  font: 900 clamp(27px, 3.4vw, 46px) / 1.1 var(--display);
  letter-spacing: -0.04em;
  text-transform: uppercase;
}
.explorer__intro {
  max-width: 440px;
  margin: 20px 0 0;
  color: #fff;
  font: 600 15px / 1.75 var(--ui);
}
.explorer__features {
  display: grid;
  gap: 14px;
  max-width: 420px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
}
.explorer__features li {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0;
  color: #fff;
  font: 800 14px / 1.4 var(--ui);
  text-transform: uppercase;
  white-space: nowrap;
}
.explorer__cta {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
  padding: 15px 22px;
  background: linear-gradient(100deg, #ff2a3d, #ff54bb 50%, #b26bff);
  color: #fff;
  font: 800 14px / 1 var(--ui);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: filter 0.2s;
}

/* ============ artwork ============ */
/* The image is taken out of the flow, so the panel's height comes from the text column
   alone; the artwork then covers that exact height. */
.explorer__art {
  position: relative;
  overflow: hidden;
  background: #050507;
}
.explorer__art img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
}
.explorer__cta:focus-visible {
  outline: 2px solid #f2b6ff;
  outline-offset: 4px;
}

@media (hover: hover) {
  .explorer__cta:hover {
    filter: brightness(1.1);
  }
}
@media (max-width: 1000px) {
  .explorer__panel {
    grid-template-columns: minmax(0, 1fr);
  }
  .explorer__copy {
    border-right: 0;
    border-bottom: 1px solid #2a2a31;
  }
  /* stacked: the text no longer sets the image's height, so show the square artwork whole */
  .explorer__art {
    aspect-ratio: 1;
  }
}
@media (max-width: 540px) {
  .explorer__panel {
    margin-inline: -8px;
  }
  .explorer__copy {
    min-width: 0;
    padding-inline: 24px;
  }
  .explorer__features {
    display: flex;
    flex-wrap: nowrap;
    gap: 20px;
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 4px;
  }
  .explorer__features::-webkit-scrollbar {
    display: none;
  }
  .explorer__features li {
    flex: 0 0 auto;
    font-size: 12px;
  }
  .explorer__cta {
    align-self: stretch;
    justify-content: center;
  }
}
@media (prefers-reduced-motion: reduce) {
  .explorer__panel::after {
    animation: none;
  }
}
</style>
