// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  ssr: true,

  css: ['~/assets/css/main.css'],

  routeRules: {
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
