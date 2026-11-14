// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/seo',
    'motion-v/nuxt',
  ],

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  // overridden per deploy environment by NUXT_SITE_URL / NUXT_SITE_ENV at build time
  site: {
    url: 'https://example.com',
    name: 'Nuxt Site Template',
    description: 'Starting point for a Nuxt site deployed as a Docker image.',
    defaultLocale: 'en',
  },

  compatibilityDate: '2025-07-15',

  // bundle the icons the app uses so static builds need no icon server
  icon: {
    clientBundle: { scan: true },
  },

  // no renderer installed, enable with `npx nuxt-og-image enable takumi` when a site needs it
  ogImage: { enabled: false },
})
