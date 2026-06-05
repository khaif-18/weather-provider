// Kaether Service Worker — Workbox CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js')

const {
  routing: { registerRoute, NavigationRoute },
  strategies: { NetworkFirst, CacheFirst, StaleWhileRevalidate },
  expiration: { ExpirationPlugin },
  cacheableResponse: { CacheableResponsePlugin },
  precaching: { cleanupOutdatedCaches },
} = workbox

cleanupOutdatedCaches()

// ── OWM current weather + forecast + air quality ──────────────────
// Network-first: always try fresh data, fall back to 10-min cache when offline.
registerRoute(
  ({ url }) => url.hostname === 'api.openweathermap.org' && url.pathname.startsWith('/data/'),
  new NetworkFirst({
    cacheName: 'owm-api',
    networkTimeoutSeconds: 6,
    plugins: [
      new ExpirationPlugin({ maxEntries: 40, maxAgeSeconds: 600 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
)

// ── OWM geocoding ─────────────────────────────────────────────────
registerRoute(
  ({ url }) => url.hostname === 'api.openweathermap.org' && url.pathname.startsWith('/geo/'),
  new NetworkFirst({
    cacheName: 'owm-geo',
    networkTimeoutSeconds: 5,
    plugins: [
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 30 * 60 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
)

// ── OWM weather icons ─────────────────────────────────────────────
// Cache-first: icons don't change; 7-day TTL.
registerRoute(
  ({ url }) => url.hostname === 'openweathermap.org' && url.pathname.startsWith('/img/wn/'),
  new CacheFirst({
    cacheName: 'owm-icons',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
)

// ── Map tiles (CartoDB + OWM) ─────────────────────────────────────
registerRoute(
  ({ url }) => url.hostname.endsWith('cartocdn.com') || url.hostname.endsWith('openweathermap.org') && url.pathname.startsWith('/map/'),
  new CacheFirst({
    cacheName: 'map-tiles',
    plugins: [
      new ExpirationPlugin({ maxEntries: 500, maxAgeSeconds: 24 * 60 * 60 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
)

// ── Google Fonts ──────────────────────────────────────────────────
registerRoute(
  ({ url }) => url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts',
    plugins: [new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 })],
  })
)

// ── App shell — SPA navigation fallback ──────────────────────────
registerRoute(
  new NavigationRoute(
    new NetworkFirst({
      cacheName: 'pages',
      networkTimeoutSeconds: 3,
      plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
    })
  )
)

// Cache all same-origin static assets on first fetch
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({ cacheName: 'static-assets' })
)
