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
