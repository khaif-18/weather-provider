export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  ssr: false,

  // Hapus nitro preset — Nuxt 4 default sudah output ke .output/public
  // preset 'static' menyebabkan dual output (dist/ DAN .output/public)

  components: [
    { path: '~/components/atoms', prefix: 'Base', pathPrefix: false },
    { path: '~/components/molecules', pathPrefix: false },
    { path: '~/components/organisms', pathPrefix: false },
    { path: '~/components/templates', pathPrefix: false },
  ],

  imports: {
    dirs: [
      'composables/**',
      'stores/**',
      'utils/**',
      'services/**',
    ],
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },

  runtimeConfig: {
    public: {
      openWeatherApiKey: process.env.NUXT_PUBLIC_OWM_API_KEY || '',
      openWeatherBaseUrl: 'https://api.openweathermap.org/data/2.5',
      openWeatherGeoUrl: 'https://api.openweathermap.org/geo/1.0',
    },
  },

  css: [
    '~/assets/css/main.css',
    '~/assets/css/animations.css',
    'leaflet/dist/leaflet.css',
  ],

  typescript: {
    strict: true,
    typeCheck: false,
  },

  vite: {
    optimizeDeps: {
      include: ['echarts', 'vue-echarts'],
    },
  },
})