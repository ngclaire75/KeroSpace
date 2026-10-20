// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  // Production checks must not overwrite a running dev server's generated files.
  $production: { buildDir: '.nuxt-production' },
  ssr: true,
  // Run server rendering and the guide APIs in Singapore, next to most visitors, instead of
  // Vercel's default Washington DC region (every request otherwise crosses the Pacific).
  nitro: { vercel: { functions: { maxDuration: 60, regions: ['sin1'] } } },
  runtimeConfig: { public: { siteUrl: '' } },

  css: ['~/assets/css/main.css'],

  routeRules: {
    // Guide pages render the same HTML for everyone: let Vercel's CDN serve them. A new
    // deployment clears this cache, so visitors never get HTML pointing at old scripts.
    '/guides': { headers: { 'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' } },
    '/guides/**': { headers: { 'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' } },
    '/images/guide-roster/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/optimized/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },

  app: {
    head: {
      title: 'KeroSpace — Explore Every Game Item',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'KeroSpace — browse a library of games, identify any in-game item and learn what it does and how it works.',
        },
        { name: 'theme-color', content: '#000000' },
        // Fandom and KeqingMains refuse images requested with another site's referrer. The <img>
        // tags already say no-referrer, but Safari still sends one on some requests, which fails
        // the first load of those images; a page-wide policy covers every browser.
        { name: 'referrer', content: 'no-referrer' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'KeroSpace' },
        { property: 'og:title', content: 'KeroSpace — Explore Every Game Item' },
        {
          property: 'og:description',
          content: 'Identify any in-game item and learn exactly how it works.',
        },
        { name: 'twitter:card', content: 'summary' },
      ],
      link: [
        { rel: 'icon', href: '/favicon-64.webp' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;800;900&family=Nunito:wght@500;600;700;800&display=swap',
        },
      ],
    },
  },
})
