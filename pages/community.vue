<script setup lang="ts">
import { compatibilityGames } from '~/data/playTogether'
import { communityCreators } from '~/data/community'

useHead({ title: 'Community — KeroSpace' })

const gameById = Object.fromEntries(compatibilityGames.map(g => [g.id, g]))
// shorter labels where the full title is too long for the tiles
const shortName: Record<string, string> = { mlbb: 'Mobile Legends' }
const creators = communityCreators.map(c => ({ ...c, gameName: shortName[c.game] ?? gameById[c.game]?.name ?? '' }))

// Static community activities, one per game.
const jumps = [
  { game: 'Honkai: Star Rail', label: 'Gacha pull parties' },
  { game: 'Genshin Impact', label: 'Co-op chaos' },
  { game: 'Honkai Impact 3rd', label: 'Boss rush squads' },
  { game: 'Wuthering Waves', label: 'Late-night raids' },
  { game: 'Neverness to Everness', label: 'Open-world mayhem' },
  { game: 'Mobile Legends: Bang Bang', label: 'Ranked grind' },
]

const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <div class="cm">
    <!-- same animated poster wall as the homepage -->
    <GuideWall />
    <SiteNav />

    <main>
      <!-- ================= hero ================= -->
      <section class="hero" aria-labelledby="cm-title">
        <div class="wrap hero__grid">
          <div class="hero__copy">
            <p class="eyebrow">KeroSpace community</p>
            <h1 id="cm-title">Find your <em>party</em>.<br />Play it <em>together</em>.</h1>
            <p class="lead">Creators worth watching and friends to team up with, for every game we cover.</p>
            <ul class="jump" aria-label="Community activities">
              <li v-for="(j, i) in jumps" :key="j.game"><b>{{ pad(i + 1) }}</b>{{ j.label }}</li>
            </ul>
          </div>

          <div class="mosaic" aria-hidden="true">
            <div v-for="(c, i) in creators" :key="c.handle" class="mosaic__tile" :class="`mosaic__tile--${i + 1}`">
              <AppImage class="mosaic__bg" loading="eager" sizes="(max-width: 700px) 45vw, 240px" :src="c.tile" alt="" width="480" height="640" />
              <span class="mosaic__who">
                <span class="mosaic__ring"><AppImage loading="eager" :src="c.photo" alt="" width="40" height="40" /></span>
                <span class="mosaic__text"><b>{{ c.name }}</b>{{ c.gameName }}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <CommunityStreams />
      <CommunityPulse />
      <CommunityDiscord />
      <CommunityYouTube />
    </main>

    <SiteFooter />
  </div>
</template>

<style scoped>
.cm {
  --c-red: #ff183b;
  --c-pink: #ff4d5e;
  --c-purple: #ff4d5e;
  --c-muted: rgba(255, 255, 255, 0.66);
  --c-line: rgba(255, 255, 255, 0.1);
  --c-card: #0b0a0f;
  --c-grad: linear-gradient(100deg, #ff183b, #ff183b 55%, #dcdce0);
  min-height: 100vh;
  min-height: 100svh;
  position: relative;
  isolation: isolate;
  background: transparent;
}
.wrap {
  width: min(1240px, 100% - 2 * clamp(16px, 4vw, 40px));
  margin: 0 auto;
}
[id] {
  scroll-margin-top: 24px;
}

/* ---------- shared type ---------- */
.eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
h1,
h2,
h3 {
  margin: 0;
}
h1 em,
h2 em {
  font-style: normal;
  background: var(--c-grad);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ================= hero ================= */
.hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(40px, 6vw, 88px) 0 clamp(96px, 11vw, 160px);
}
.hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(32px, 5vw, 72px);
}
.hero h1 {
  font: 900 clamp(36px, 5.2vw, 72px)/1.05 var(--display);
  letter-spacing: -0.02em;
  text-transform: uppercase;
}
.lead {
  max-width: 480px;
  margin: 22px 0 0;
  color: var(--c-muted);
  font-size: 17px;
  font-weight: 600;
  line-height: 1.7;
}
.jump {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 30px 0 0;
  padding: 0;
  list-style: none;
}
.jump li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px 0 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 0 0 1px var(--c-line);
  font-size: 13px;
  font-weight: 800;
}
.jump b {
  display: grid;
  place-items: center;
  min-width: 28px;
  height: 28px;
  border-radius: 999px;
  background: var(--c-grad);
  font: 800 10px/1 var(--display);
}

/* creator mosaic */
.mosaic {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.mosaic__tile {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3 / 4;
  border-radius: 18px;
  background: #000000;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08), 0 20px 50px rgba(0, 0, 0, 0.6);
}
.mosaic__tile:nth-child(3n + 2) {
  transform: translateY(28px);
}
.mosaic__tile:nth-child(3n + 1) {
  transform: translateY(-10px);
}
.mosaic__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.mosaic__tile::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.85));
}
.mosaic__who {
  position: absolute;
  z-index: 1;
  left: 10px;
  right: 10px;
  bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.75);
}
.mosaic__who img {
  display: block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  /* thin dark gap between the photo and the neon ring */
  box-shadow: 0 0 0 1.5px #0b0a0f;
}
/* neon pink → purple ring that spins around each profile photo
   (reuses the global --card-outline-angle / card-outline-turn from main.css) */
.mosaic__ring {
  flex-shrink: 0;
  display: block;
  padding: 2px;
  border-radius: 50%;
  background: conic-gradient(from var(--card-outline-angle), #ff183b, #ff183b 35%, #dcdce0 50%, #ff183b 65%, #ff183b);
  animation: card-outline-turn 3s linear infinite;
}
.mosaic__who b {
  display: block;
  font-size: 12px;
  color: #fff;
}
.mosaic__text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .mosaic__ring {
    animation: none;
  }
}

@media (max-width: 960px) {
  .hero__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 700px) {
  .mosaic {
    gap: 8px;
  }
  .mosaic__tile {
    border-radius: 12px;
  }
  /* mobile: profile ring only, no name text */
  .mosaic__text {
    display: none;
  }
  .mosaic__who img {
    width: 26px;
    height: 26px;
  }
}
</style>
