# KeroSpace

Game item explorer — browse games, identify any in-game item and learn how it works.
**Nuxt 3**, black + red theme, Orbitron + Nunito.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm run preview   # production
```

## Guide data on deployment

Guide rosters include a verified initial batch and local artwork, so the first
render does not wait for external wikis. The browser refreshes the list from the
live API and retains the saved batch if the source is unavailable. Search and
pagination continue to use live data. Successful catalogue and build responses
are cached on Vercel for five minutes; unavailable responses are not cached.

Refresh the saved rosters and images before a deployment when characters change:

```bash
python3 scripts/sync-guide-rosters.py https://kerospace.vercel.app
```

Commit `data/guideRosterSnapshots.json`, `data/guideArtwork.json`, and
`public/images/guide-roster/` with the code. This command is deliberately separate
from the build, so an upstream outage cannot break a deployment. Build-provider
challenge pages trigger the public CDN fallback instead of an empty build.

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
