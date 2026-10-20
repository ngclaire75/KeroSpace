<script setup lang="ts">
// Full-page animated background for the guides pages: tilted rows of artwork drifting
// in alternate directions under a dark shade. Every tile is a 1200×675 image from
// public/images/guides-wall (normalised from public/images/guides banner).
const TOTAL = 19
const PER_ROW = 8
const ROWS = 6
const images = Array.from({ length: TOTAL }, (_, i) => `/images/guides-wall/wall-${String(i + 1).padStart(2, '0')}.webp`)

// Each row starts at a different point in the set so neighbouring rows never repeat.
const rows = Array.from({ length: ROWS }, (_, r) =>
  Array.from({ length: PER_ROW }, (_, i) => images[(r * 5 + i * 3) % TOTAL]),
)
</script>

<template>
  <div class="gw" aria-hidden="true">
    <!-- the tilted wall lives in its own flattened layer, so no part of it can come
         forward through the dark shade drawn above it -->
    <div class="gw__scene">
    <div class="gw__stage">
      <div v-for="(row, r) in rows" :key="r" class="gw__row" :class="{ 'is-reverse': r % 2 === 1 }" :style="{ '--gw-speed': `${150 + r * 18}s` }">
        <!-- the set is drawn twice so the loop is seamless -->
        <div class="gw__track">
          <template v-for="copy in 2" :key="copy">
            <!-- tiles are at most ~410px wide, so a small optimised copy is enough; low priority
                 keeps this decorative wall from delaying the page's own artwork -->
            <AppImage v-for="(src, i) in row" :key="`${copy}-${i}`" class="gw__tile" :src="src" alt="" width="1200" height="675" sizes="(max-width: 800px) 214px, (max-width: 1530px) 27vw, 410px" fetchpriority="low" :loading="r < 4 ? 'eager' : 'lazy'" />
          </template>
        </div>
      </div>
    </div>
    </div>
    <div class="gw__shade" />
  </div>
</template>

<style scoped>
.gw {
  --gw-h: clamp(120px, 15vw, 230px);
  --gw-gap: clamp(12px, 1.4vw, 22px);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  /* the tallest the viewport gets (mobile toolbars hidden), so scrolling never uncovers an edge */
  height: 100vh;
  height: 100lvh;
  z-index: -1;
  overflow: hidden;
  background: #000;
  pointer-events: none;
}
.gw__scene {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  isolation: isolate;
  transform: translateZ(0);
}
.gw__stage {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  width: 220vmax;
  flex-direction: column;
  gap: var(--gw-gap);
  /* the reference's angle: rows rise to the right, with a slight 3D lean */
  transform: translate(-50%, -50%) perspective(1600px) rotateX(14deg) rotateZ(-14deg);
}
.gw__row {
  overflow: visible;
}
.gw__track {
  display: flex;
  width: max-content;
  gap: var(--gw-gap);
  animation: gw-drift var(--gw-speed) linear infinite;
  will-change: transform;
}
.gw__row.is-reverse .gw__track {
  animation-direction: reverse;
}
.gw__row:nth-child(even) {
  /* stagger alternate rows like a wall of posters */
  margin-left: calc(var(--gw-h) * -0.9);
}
.gw__tile {
  flex-shrink: 0;
  width: auto;
  height: var(--gw-h);
  aspect-ratio: 1200 / 675;
  border-radius: 14px;
  object-fit: cover;
  background: #111;
}
.gw__shade {
  position: absolute;
  inset: 0;
  z-index: 1;
  transform: translateZ(0);
  background:
    radial-gradient(120% 90% at 50% 40%, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.94) 70%, #000),
    rgba(0, 0, 0, 0.32);
}

@keyframes gw-drift {
  /* one full set (half the track), so the second copy lands exactly where the first began */
  to { transform: translateX(calc(-50% - var(--gw-gap) / 2)); }
}

@media (prefers-reduced-motion: reduce) {
  .gw__track {
    animation: none;
  }
}
</style>
