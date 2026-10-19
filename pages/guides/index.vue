<script setup lang="ts">
import { guideGames } from '~/data/guides'

const route = useRoute()
// Old links like /guides?game=hsr now have their own page.
const legacyGame = typeof route.query.game === 'string' && guideGames.some(game => game.id === route.query.game) ? route.query.game : null
if (legacyGame) await navigateTo(`/guides/${legacyGame}`, { redirectCode: 301, replace: true })

useSeoMeta({
  title: 'Guides — Learn your game | KeroSpace',
  description: 'Character builds for six games, with released characters, equipment recommendations and stat priorities from game databases.',
})


</script>

<template>
  <div class="gd-page gd-page--wall">
    <GuideWall />
    <SiteNav />
    <main class="gd-wrap">
      <!-- ===== hero ===== -->
      <header class="gl-hero">
        <div class="gl-hero__copy">
          <p class="gd-eyebrow">KeroSpace guides</p>
          <h1 class="gd-h1">Less guessing.<br /><em class="gd-em">More game.</em></h1>
          <p class="gd-lede">
            Pick a game to explore its released characters and heroes, with recommended equipment and stat priorities for their builds.
          </p>
        </div>
      </header>

      <!-- ===== games ===== -->
      <section id="games" class="gd-section" aria-labelledby="games-title">
        <div class="gd-section-head">
          <div>
            <p class="gd-eyebrow">Choose your game</p>
            <h2 id="games-title" class="gd-h2">Six worlds. <em class="gd-em">Find your way.</em></h2>
          </div>
        </div>
        <ul class="gl-games">
          <li v-for="(game, index) in guideGames" :key="game.id">
            <NuxtLink :to="`/guides/${game.id}`" class="gd-card neon-hover-outline gl-game">
              <span class="gl-game__art">
                <AppImage :src="game.banner" :alt="`${game.name} artwork`" sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 400px" width="480" height="270" :loading="index < 3 ? 'eager' : 'lazy'" />
                <span class="gd-tag gl-game__genre">{{ game.genre }}</span>
              </span>
              <span class="gl-game__body">
                <span class="gl-game__meta">{{ game.dev }} · {{ game.year }}</span>
                <span class="gl-game__name">{{ game.name }}</span>
                <span class="gl-game__desc">{{ game.desc }}</span>
                <span class="gl-game__foot">
                  <span>Characters · Best builds</span>
                  <span class="gd-go" aria-hidden="true">↗</span>
                </span>
              </span>
            </NuxtLink>
          </li>
        </ul>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>

<style src="../../assets/css/guides.css"></style>

<style scoped>
.gl-hero .gd-lede {
  color: #fff;
}

/* ---------- hero ---------- */
.gl-hero {
  max-width: 760px;
  padding-top: clamp(40px, 6vw, 88px);
}
/* ---------- game cards ---------- */
.gl-games {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.gl-games > li {
  min-width: 0;
}
.gl-game {
  height: 100%;
}
.gl-game__art {
  position: relative;
  display: block;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--gd-panel-2);
}
.gl-game__art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: scale 0.6s var(--ease);
}
.gl-game__genre {
  position: absolute;
  left: 12px;
  top: 12px;
}
.gl-game__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
}
.gl-game__meta {
  color: var(--ink-3);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.gl-game__name {
  font: 800 19px / 1.3 var(--display);
}
.gl-game__desc {
  flex: 1;
  color: var(--ink-2);
  font-size: 14px;
  line-height: 1.65;
}
.gl-game__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
  padding-top: 6px;
  color: var(--ink-2);
  font-size: 12px;
  font-weight: 800;
}

@media (hover: hover) {
  .gl-game:hover .gl-game__art img {
    scale: 1.04;
  }
}

@media (max-width: 1000px) {
  .gl-games {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .gl-games {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .gl-game__art img {
    transition: none;
  }
}
</style>
