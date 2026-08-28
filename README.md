# KeroSpace Workspace

AI workspace dashboard — **Nuxt 3 + HTML5 + WebGL**.

Rebuilt pixel-for-pixel from the reference mock, in the **Mokoto** palette
(`#df2531` / `#ffffff` / `#000000`) with **Urbanist** throughout.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm run preview   # production
```

## Stack notes

| Piece | Where | Detail |
| --- | --- | --- |
| Framework | Nuxt 3 (SSR) | `nuxt.config.ts`, file-based routing in `pages/` |
| Layout | `pages/index.vue` + `components/` | Full-bleed: the shell fills `100dvh` / `100%` width, no outer margin |
| WebGL | `components/GradientCanvas.vue` | Raw WebGL + GLSL fragment shader. Animated `70deg` linear gradient (`#df2531 → #ff5a63 → #7a0f16`). `requestAnimationFrame` loop, `ResizeObserver`, DPR-aware, context-loss safe. Static single frame under `prefers-reduced-motion`; CSS-gradient fallback with no WebGL. Mounted via `<ClientOnly>`. |
| UI icons | `components/AppIcon.vue` | [Lucide](https://lucide.dev) geometry (ISC), inlined — no runtime icon dependency |
| File-type icons | `public/icons/` | Official brand SVGs: `figma.svg`, `pdf.svg` (Adobe), `excel.svg` + `powerpoint.svg` (Microsoft) — from Wikimedia Commons |
| Type | `nuxt.config.ts` head | Urbanist 400–800 via Google Fonts |
| Styles | `assets/css/main.css` | Design tokens + all component classes (BEM-ish) |

## Structure

```
nuxt.config.ts
app.vue
pages/index.vue
components/
  TopBar.vue  StatCard.vue  PanelCard.vue  ListRow.vue
  StorageOverview.vue  ProductivityChart.vue
  ChatCard.vue  GradientCanvas.vue  AppIcon.vue
assets/css/main.css
public/favicon.svg
public/icons/{figma,pdf,excel,powerpoint}.svg
```
