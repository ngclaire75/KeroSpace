<script setup lang="ts">
import { imageSources } from '~/utils/responsiveImages'
const year = new Date().getFullYear()

// ticker words (Korean gaming vocabulary)
const tickerWords = ['게임', '아이템', '레벨 업', '크로스 플레이', '협동 플레이', '퀘스트', '보스 레이드', '파티 모집', '랭크전', '모험', '장비', '승리']

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Games', href: '/#supported-games' },
      { label: 'Items', href: '/#' },
      { label: 'Community', href: '/community' },
      { label: 'Guides', href: '/#' },
      { label: 'Top Up', href: '/top-up' },
      { label: 'E-Sports', href: '/#' },
    ],
  },
  {
    title: 'Games',
    links: [
      { label: 'Honkai: Star Rail', href: '/#supported-games' },
      { label: 'Genshin Impact', href: '/#supported-games' },
      { label: 'Honkai Impact 3rd', href: '/#supported-games' },
      { label: 'Wuthering Waves', href: '/#supported-games' },
      { label: 'Neverness to Everness', href: '/#supported-games' },
      { label: 'Mobile Legends: Bang Bang', href: '/#supported-games' },
    ],
  },
]
</script>

<template>
  <footer class="footer">
    <!-- neon ticker along the top edge -->
    <div class="ticker" aria-hidden="true">
      <div class="ticker__track">
        <ul v-for="copy in 2" :key="copy" class="ticker__list">
          <li v-for="word in tickerWords" :key="word">
            <span>{{ word }}</span>
            <svg class="ticker__star" viewBox="0 0 80 80" width="12" height="12" focusable="false">
              <path fill="currentColor" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="4"
                d="m40 12l7.92 20.08L68 40l-20.08 7.92L40 68l-7.92-20.08L12 40l20.08-7.92z" />
            </svg>
          </li>
        </ul>
      </div>
    </div>

    <!-- Vexana artwork, fading into the black footer -->
    <figure class="footer__art">
      <picture>
        <source media="(max-width: 700px)" :srcset="imageSources('/images/vexana-mobile-esrgan.webp').srcset" sizes="100vw" width="1080" height="608" />
        <AppImage src="/images/vexana-esrgan.webp" alt="Vexana character banner from Mobile Legends: Bang Bang" width="3200" height="1067" loading="lazy" decoding="async" />
      </picture>
    </figure>

    <div class="footer__wrap">
      <!-- ===== brand + link columns ===== -->
      <div class="grid">
        <div class="brand">
          <a href="/" class="brand__mark" aria-label="KeroSpace home">
            <AppImage src="/images/logo.webp" alt="" width="44" height="44" />
          </a>
        </div>

        <nav v-for="col in columns" :key="col.title" class="col" :aria-label="col.title">
          <h3 class="col__title">{{ col.title }}</h3>
          <ul>
            <li v-for="l in col.links" :key="l.label">
              <a :href="l.href">{{ l.label }}</a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- ===== bottom bar ===== -->
      <div class="bar">
        <p class="bar__copy">© {{ year }} KeroSpace. All rights reserved.</p>
        <p class="bar__note">
          Game names, logos and artwork belong to their respective owners, including
          HoYoverse, Kuro Games, Hotta Studio and MOONTON Games.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  --f-red: #ff183b;
  --f-pink: #ff54bb;
  --f-purple: #b26bff;
  --f-panel: #0b0b0e;
  --f-line: rgba(255, 255, 255, 0.28);
  --f-grad: linear-gradient(100deg, var(--f-purple), var(--f-red) 52%, var(--f-pink));
  position: relative;
  isolation: isolate;
  padding: 0 0 28px;
  overflow: hidden;
  background: #000;
}
/* ---------- neon ticker (slim) ---------- */
.ticker {
  position: relative;
  z-index: 2;
  overflow: hidden;
  padding: 6px 0;
  background: linear-gradient(90deg, #5b1dff 0%, #8a3dff 25%, #b26bff 50%, #8a3dff 75%, #5b1dff 100%);
  box-shadow:
    0 0 18px rgba(160, 90, 255, 0.6),
    0 0 40px rgba(120, 50, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
}
.ticker__track {
  display: flex;
  width: max-content;
  will-change: transform;
  animation: footer-ticker 40s linear infinite;
}
.ticker__list {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}
.ticker__list li {
  display: flex;
  align-items: center;
  gap: clamp(14px, 1.8vw, 24px);
  padding-right: clamp(14px, 1.8vw, 24px);
  white-space: nowrap;
}
.ticker__list span {
  font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', 'Noto Sans CJK KR', 'Malgun Gothic', var(--ui);
  font-size: clamp(12px, 1vw, 14px);
  font-weight: 800;
  line-height: 1.4;
  letter-spacing: 0.02em;
  color: #fff;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5), 0 0 18px rgba(230, 190, 255, 0.55);
}
/* trim the text box to the glyphs (cap height → baseline) so the Korean
   letters sit dead-centre in the band and level with the stars, instead of
   riding high on the font's tall descent area. Padding grows to keep the
   band the same slim height. */
@supports (text-box: trim-both cap alphabetic) {
  .ticker {
    padding: 9px 0;
  }
  .ticker__list span {
    text-box: trim-both cap alphabetic;
  }
}
.ticker__star {
  flex-shrink: 0;
  width: clamp(10px, 0.9vw, 12px);
  height: auto;
  display: block;
  color: #fff;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.8));
}
@keyframes footer-ticker {
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .ticker__track {
    animation: none;
  }
}

/* ---------- artwork ---------- */
.footer__art {
  position: relative;
  z-index: -1;
  margin: 0;
  height: clamp(280px, 34vw, 500px);
  --fade: linear-gradient(180deg,
    #000 0%, #000 30%,
    rgba(0, 0, 0, 0.94) 40%, rgba(0, 0, 0, 0.82) 50%, rgba(0, 0, 0, 0.64) 60%,
    rgba(0, 0, 0, 0.44) 70%, rgba(0, 0, 0, 0.26) 80%, rgba(0, 0, 0, 0.11) 90%,
    rgba(0, 0, 0, 0.03) 96%, transparent 100%);
  -webkit-mask-image: var(--fade);
  mask-image: var(--fade);
  transform: translateZ(0);
  backface-visibility: hidden;
}
.footer__art picture,
.footer__art img {
  display: block;
  width: 100%;
  height: 100%;
}
.footer__art img {
  object-fit: cover;
  object-position: center 35%;
}
/* push the art toward the neon red → purple palette */
.footer__art::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(255, 24, 59, 0.32) 0%, rgba(255, 24, 59, 0.18) 20%, rgba(255, 84, 187, 0.06) 45%, rgba(178, 107, 255, 0.08) 60%, rgba(178, 107, 255, 0.22) 80%, rgba(178, 107, 255, 0.36) 100%);
  mix-blend-mode: color;
}
.footer__wrap {
  width: min(1240px, 100% - 2 * clamp(16px, 4vw, 40px));
  margin: 0 auto;
}

/* ---------- grid ---------- */
/* wordmark on its own row, the two link columns directly under it */
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 240px));
  column-gap: clamp(28px, 5vw, 72px);
  row-gap: 28px;
  padding: clamp(28px, 3.5vw, 48px) 0 clamp(36px, 5vw, 56px);
}
.brand {
  grid-column: 1 / -1;
  min-width: 0;
}
.brand__mark {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  /* the logo PNG has ~8.6px of transparent padding on its left; pull it back
     so the visible mark lines up with the column titles below */
  margin-left: -8.6px;
}
.brand__mark > img:first-child {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.col {
  min-width: 0;
}
.col__title {
  margin: 0 0 18px;
  font-family: var(--display);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
}
.col ul {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.col a {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.82);
  transition: color 0.25s;
}


/* ---------- bottom bar ---------- */
.bar {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 24px;
  margin-top: clamp(20px, 3vw, 32px);
  padding-top: 22px;
  border-top: 1px solid #fff;
}
.bar__copy,
.bar__note {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.78);
}
.bar__copy {
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
}
.bar__note {
  text-align: right;
}

@media (hover: hover) {
  .col a:hover {
    color: #fff;
    text-shadow: 0 0 12px rgba(178, 107, 255, 0.9);
  }
}

/* ---------- responsive ---------- */
@media (max-width: 980px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .bar {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }
  .bar__note {
    text-align: left;
  }
}

/* desktop: tuck the content up into the faded bottom of the art */
@media (min-width: 701px) {
  .grid {
    margin-top: clamp(-72px, -4.5vw, -40px);
    padding-top: 12px;
  }
}

@media (max-width: 700px) {
  .footer__art {
    height: auto;
    aspect-ratio: 1080 / 608;
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 36px;
  }
}

@media (max-width: 380px) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
