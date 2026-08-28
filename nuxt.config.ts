// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  ssr: true,

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'KeroSpace Workspace',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'KeroSpace — AI workspace dashboard.' },
        { name: 'theme-color', content: '#df2531' },

        // Open Graph (LinkedIn, Facebook, Slack, …)
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'KeroSpace' },
        { property: 'og:title', content: 'KeroSpace Workspace' },
        {
          property: 'og:description',
          content: 'KeroSpace — AI workspace dashboard.',
        },
        { property: 'og:url', content: 'https://kerospace.vercel.app/' },
        {
          property: 'og:image',
          content: 'https://kerospace.vercel.app/images/thumbnail.png',
        },
        { property: 'og:image:width', content: '3018' },
        { property: 'og:image:height', content: '1718' },
        { property: 'og:image:alt', content: 'KeroSpace Workspace dashboard' },

        // Twitter / X
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'KeroSpace Workspace' },
        {
          name: 'twitter:description',
          content: 'KeroSpace — AI workspace dashboard.',
        },
        {
          name: 'twitter:image',
          content: 'https://kerospace.vercel.app/images/thumbnail.png',
        },
      ],
      link: [
        { rel: 'icon', href: '/favicon.webp' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&display=swap',
        },
      ],
    },
  },
})
