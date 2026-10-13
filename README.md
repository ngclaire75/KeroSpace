# KeroSpace

Game item explorer — browse games, identify any in-game item and learn how it works.
**Nuxt 3**, black + red theme, Orbitron + Nunito.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm run preview   # production
```

## Structure

```
pages/index.vue              page shell
components/SiteNav.vue       top nav (glowing active tab, mobile menu)
components/HeroSection.vue   hero: headline + 3D tilted item carousel
assets/css/main.css          design tokens + base styles
public/images/kitty-*.webp   carousel item art
```

The carousel supports click, arrow keys, swipe, autoplay (paused on hover/focus,
off under `prefers-reduced-motion`) and a pointer-driven tilt + holo sheen on the
centre card.
