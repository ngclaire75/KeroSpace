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
        <!-- the feature boxes share the width of the button below them -->
        <div class="explorer__actions">
          <ul class="explorer__features">
            <li v-for="feature in features" :key="feature">{{ feature }}</li>
          </ul>
          <NuxtLink :to="rosterLink" class="explorer__cta">
            Browse all characters
          </NuxtLink>
        </div>
      </div>

      <!-- ===== artwork: fills the right side at exactly the height of the text ===== -->
      <div class="explorer__art">
        <AppImage :src="`/images/guide-details/${game.id}.webp`" :alt="`${game.name} artwork`" sizes="(max-width: 1000px) 100vw, 680px" loading="lazy" />
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
  background: conic-gradient(from var(--card-outline-angle), #ff183b, #ff183b 35%, #dcdce0 50%, #ff183b 65%, #ff183b);
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
/* one column as wide as its widest item (the button); the feature boxes stretch to match */
.explorer__actions {
  display: grid;
  width: fit-content;
}
.explorer__features {
  display: grid;
  gap: 10px;
  max-width: 420px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
}
.explorer__features li {
  display: flex;
  align-items: center;
  gap: 14px;
  /* each feature in its own dark grey box with a neon purple → pink edge */
  padding: 10px 16px;
  border: 1.5px solid transparent;
  background:
    linear-gradient(#000000, #000000) padding-box,
    linear-gradient(110deg, #ff183b, #6e0614) border-box;
  box-shadow: 0 0 14px rgba(255, 77, 94, 0.16);
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
  background: linear-gradient(100deg, #ff183b, #6e0614);
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
  /* black and white like the other art, but without --bw-art's darkening */
  filter: grayscale(1) contrast(1.15);
}
.explorer__cta:focus-visible {
  outline: 2px solid #ff4d5e;
  outline-offset: 4px;
}

@media (hover: hover) {
  .explorer__cta:hover {
    filter: brightness(1.1);
  }
}
/* desktop: the boxes and button span the same width as the intro paragraph */
@media (min-width: 1001px) {
  .explorer__actions {
    width: 100%;
    max-width: 440px;
  }
  .explorer__features {
    max-width: none;
  }
  .explorer__cta {
    justify-content: center;
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
  .explorer__copy {
    min-width: 0;
    padding-inline: 24px;
  }
  /* phones: the list and button lay out on their own, as before */
  .explorer__actions {
    display: contents;
  }
  .explorer__features {
    display: flex;
    flex-wrap: nowrap;
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    gap: 10px;
    padding: 0 0 4px;
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
