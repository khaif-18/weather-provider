// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  // ── Deployment: Static SPA untuk Netlify ─────────────────────────────
  // SSR dimatikan — semua rendering di client (cocok untuk weather app)
  // Build output: .output/public/ → deploy sebagai static site
  ssr: false,

  // Nuxt generate mode untuk static export
  nitro: {
    preset: 'netlify-static',
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

  // Pinia
  pinia: {
    storesDirs: ['./stores/**'],
  },

  // Runtime config (env vars)
  runtimeConfig: {
    public: {
      openWeatherApiKey: process.env.NUXT_PUBLIC_OWM_API_KEY || '',
      openWeatherBaseUrl: 'https://api.openweathermap.org/data/2.5',
      openWeatherGeoUrl: 'https://api.openweathermap.org/geo/1.0',
    },
  },

  // CSS
  css: [
    '~/assets/css/main.css',
    '~/assets/css/animations.css',
    'leaflet/dist/leaflet.css',
  ],

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: true,
  },

  // Vite
  vite: {
    optimizeDeps: {
      include: ['echarts', 'vue-echarts'],
    },
  },
})