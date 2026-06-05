# 🌤️ Kaether — Weather App

[![Netlify Status](https://api.netlify.com/api/v1/badges/16f3958c-5d0c-4153-b1d5-a6721ca08918/deploy-status)](https://app.netlify.com/projects/kaether/deploys)

Dashboard cuaca yang bersih dan minimal dengan bahasa desain **"Air"** — kanvas gradien langit, kartu putih mengambang, dan tipografi kursif. Dibangun di atas **Nuxt 4 + Bun**, data real-time dari **OpenWeatherMap** dan **Open-Meteo**.

🔗 **Live:** [kaether.netlify.app](https://kaether.netlify.app)

---

# 📖 Bagian 1 — Tentang Aplikasi

## Apa itu Kaether?

Kaether adalah aplikasi cuaca single-page (SPA statis) yang menampilkan kondisi terkini, prakiraan, kualitas udara, dan beragam metrik atmosfer dalam satu dashboard. Fokusnya pada **kejelasan visual** dan **interaktivitas** — setiap kartu bisa diklik untuk detail lebih dalam, dan tampilan beradaptasi penuh untuk mobile maupun desktop.

## 🎨 Design Language — "Air"

| Elemen        | Gaya                                                                 |
| ------------- | ------------------------------------------------------------------- |
| Background    | Gradien langit (lavender → peach siang / deep-purple → hitam malam) |
| Kartu         | Putih mengambang, radius `11px`, bayangan lembut                    |
| Tipografi     | **Inter** (UI) + **Caveat** (wordmark & aksen kursif)              |
| Warna aksen   | `#1b1b1b` ink · `#2b7fff` signal-blue · `#426188` dusk-blue        |
| Tombol        | Ghost-pill (outline) & filled-pill                                  |
| Dark mode     | Gradien langit malam + permukaan kartu gelap (CSS variables)       |

## ✨ Fitur

### Inti
- 🌡️ **Cuaca terkini** — suhu, kondisi, feels-like, High/Low, chip kondisi, bar sunrise/sunset, status "Updated Xm ago" + tombol refresh
- ⏱️ **Prakiraan per jam** — klik jam mana pun untuk detail (feels-like, angin, kelembaban, volume presipitasi mm)
- 📅 **Prakiraan 7 hari** — bisa di-expand, dengan bar rentang suhu relatif
- 📈 **Grafik** — tren suhu / curah hujan / angin (ECharts, mode switcher, sadar dark mode)
- 🗺️ **Peta interaktif** — layer temp/rain/wind/cloud (Leaflet + OWM tiles, tile gelap saat dark mode)
- 🔍 **Pencarian kota** dengan autocomplete + **geolokasi**
- ⭐ **Kota tersimpan** — disimpan di localStorage, menampilkan mini-suhu paralel
- 🌓 **Dark mode** & toggle **°C / °F**

### Kartu metrik detail (gaya Apple Weather)
Grid kartu mengambang: **Humidity** (bar), **Dew point**, **Wind** (kompas SVG animasi), **Pressure** (gauge barometer), **Visibility**, **Moon** (fase + iluminasi), **Pollen** (Open-Meteo), **Tide** (Open-Meteo marine — tinggi pasang nyata + tren naik/turun).

### Air Quality
Indeks kualitas udara OWM (AQI 1–5) + polutan PM2.5, PM10, NO₂, O₃.

### Ekstra
- 👕 **Saran pakaian & aktivitas** (rule-based dari kondisi terkini)
- ⚠️ **Peringatan cuaca ekstrem** (banner rule-based: badai, gelombang panas, angin kencang, dll.)
- 🌧️ **Animated backdrop** — partikel sesuai kondisi (hujan, salju, kabut, sun glow, bintang, awan, kilat); menghormati `prefers-reduced-motion`
- 📤 **Share cuaca** — native share API dengan fallback clipboard
- 📲 **PWA installable** + caching offline

> **Catatan cakupan API:** Pollen (Open-Meteo) hanya tersedia untuk Eropa — di luar itu kartu menampilkan "not available". Tide butuh titik pesisir/laut — kota pedalaman menampilkan "no coastal data". Keduanya gagal dengan anggun (graceful degradation).

---

# 🛠️ Bagian 2 — Pengembangan

## Tech Stack

| Layer          | Library                                  |
| -------------- | ---------------------------------------- |
| Framework      | Nuxt 4.3 (SSR **off** → output statis)   |
| Runtime        | Bun                                      |
| Bahasa         | TypeScript (strict)                      |
| Styling        | Tailwind CSS v3 + custom CSS (Air tokens)|
| State          | Pinia (+ persist localStorage)           |
| Data fetching  | TanStack Vue Query                       |
| Charts         | Apache ECharts + vue-echarts             |
| Maps           | Leaflet                                  |
| Animasi        | @vueuse/motion (spring) + CSS keyframes  |
| Ikon           | lucide-vue-next                          |
| Utilities      | @vueuse/core                             |
| PWA            | Service worker manual (Workbox CDN)      |
| Testing        | Vitest + @nuxt/test-utils                |
| Deploy         | Netlify (static hosting)                 |

## Prasyarat

- [Bun](https://bun.sh) (runtime & package manager)
- API key gratis dari [OpenWeatherMap](https://openweathermap.org/api) (aktif ~30 menit setelah daftar)

> Open-Meteo (pollen & marine) gratis dan **tanpa API key**.

## Setup & Menjalankan

```bash
# 1. Install dependencies
bun install

# 2. Siapkan environment
cp .env.example .env
#   lalu isi NUXT_PUBLIC_OWM_API_KEY di .env

# 3. Jalankan dev server  → http://localhost:3000
bun run dev
```

### Environment Variables

```env
# .env
NUXT_PUBLIC_OWM_API_KEY=your_api_key_here
```

## Scripts

```bash
bun run dev            # Dev server (localhost:3000)
bun run build          # Generate statis → dist/
bun run preview        # Serve dist/ secara lokal
bun run test           # Vitest
bun run test:ui        # Vitest UI mode
bun run test:coverage  # Coverage report
bun run typecheck      # Pengecekan TypeScript
bun run lint           # ESLint
```

## 🏗️ Arsitektur (Atomic Design)

```
pages/
  index.vue          # Dashboard utama — orkestrasi data fetching

components/
  atoms/             # BaseButton, BaseInput, BaseCard, WindCompass, GaugeArc, MoonDisc …
  molecules/         # SearchBar, StatItem, HourlyItem, ForecastCard, MetricCard …
  organisms/         # AppHeader, WeatherHero, HourlyForecast, WeatherStats, ForecastList,
                     # WeatherChart, WeatherMap, AirQuality, WeatherAlert,
                     # WeatherSuggestions, WeatherBackdrop, SavedCitiesBar …
  templates/         # WeatherLayout, ErrorState

composables/         # useWeather, useForecast, useAirQuality, usePollen, useMarine, useGeolocation
stores/              # useAppStore (city, unit, savedCities, dark mode)
services/            # weatherApi (OWM client)
utils/               # formatters, weatherConditions, metrics, suggestions, weatherAlerts
types/               # weather.types.ts (OWM + AQI + pollen + marine + app types)
assets/css/          # main.css (Air tokens, dark mode vars), animations.css
public/              # sw.js, manifest.webmanifest, ikon PWA
```

### Prinsip lapisan
- **Atoms** → komponen terkecil, hanya props, tanpa state global
- **Molecules** → gabungan 2–4 atoms, satu tanggung jawab
- **Organisms** → terhubung ke store/composable, section self-contained
- **Templates** → layout shell berbasis slot
- **Pages** → orkestrasi data fetching + komposisi organisms

## 🔌 API yang Dipakai

### OpenWeatherMap (butuh key)
| Endpoint                       | Kegunaan                |
| ------------------------------ | ----------------------- |
| `/data/2.5/weather`            | Cuaca terkini           |
| `/data/2.5/forecast`           | Prakiraan 5 hari/3 jam  |
| `/data/2.5/air_pollution`      | AQI + polutan           |
| `/geo/1.0/direct`              | Geocoding (cari kota)   |
| `/geo/1.0/reverse`             | Reverse geocoding       |
| `/map/{layer}/{z}/{x}/{y}.png` | Tile peta cuaca         |

Semua dibungkus di `services/weatherApi.ts`.

### Open-Meteo (gratis, tanpa key)
| Endpoint                                          | Kegunaan                  |
| ------------------------------------------------- | ------------------------- |
| `air-quality-api.open-meteo.com/v1/air-quality`   | Pollen (Eropa saja)       |
| `marine-api.open-meteo.com/v1/marine`             | Tide (`sea_level_height_msl`) + gelombang |

## 🧪 Testing

Unit test ada di `tests/unit/`:

```bash
bun run test
```

Cakupan: `utils/formatters.ts`, `utils/weatherConditions.ts`, atoms, dan `stores/useAppStore`.

## 🚀 Build & Deploy

```bash
bun run build   # → dist/ (static)
```

Deploy ke **Netlify** otomatis dari branch `main` (lihat `netlify.toml`). Karena `ssr: false`, output adalah situs statis murni di `dist/`.

### Catatan PWA

PWA memakai **service worker manual** (`public/sw.js` via Workbox CDN) — bukan `vite-plugin-pwa`, karena plugin tersebut **menyebabkan segfault Bun** saat build di Windows. Service worker meng-cache OWM, Open-Meteo, tile peta, ikon cuaca, dan Google Fonts dengan strategi NetworkFirst/CacheFirst. Ikon di-generate dari `public/favicon.svg`.

---

Dibangun dengan Nuxt 4 + Bun.
