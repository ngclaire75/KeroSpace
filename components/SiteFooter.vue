<script setup lang="ts">
const year = new Date().getFullYear()

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
    <div class="footer__wrap">
      <!-- ===== brand + link columns ===== -->
      <div class="grid">
        <div class="brand">
          <a href="/" class="brand__mark" aria-label="KeroSpace home">
            <img src="/images/logo.webp" alt="" width="44" height="44" />
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
  padding: 0 0 28px;
  overflow: hidden;
  /* solid dark red → pink */
  background: linear-gradient(115deg, #a50b1b 0%, #cf1030 38%, #ec2a6c 74%, #ff4ea5 100%);
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
  padding: clamp(48px, 6vw, 72px) 0 clamp(36px, 5vw, 56px);
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
  border-top: 1px solid var(--f-line);
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
