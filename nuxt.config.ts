// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  // ── Static SPA untuk Netlify ──────────────────────────────────────────
  ssr: false,

  nitro: {
    // 'static' → output ke dist/ (sesuai log Netlify)
    // jangan pakai netlify-static karena konflik dengan nuxt generate
    preset: 'static',
  },

  // Auto-import components by directory
  components: [
    { path: '~/components/atoms', prefix: 'Base', pathPrefix: false },
    { path: '~/components/molecules', pathPrefix: false },
    { path: '~/components/organisms', pathPrefix: false },
    { path: '~/components/templates', pathPrefix: false },
  ],

  // Auto-import composables
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
    // MATIKAN saat build — penyebab timeout 18 menit di CI
    // Jalankan typecheck manual: bun run typecheck
    typeCheck: false,
  },

  vite: {
    optimizeDeps: {
      include: ['echarts', 'vue-echarts'],
    },
  },
})