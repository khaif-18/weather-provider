# 🌤️ Aether Weather App

Aplikasi cuaca modern dibangun dengan **Nuxt 4**, **Bun**, dan data dari **OpenWeatherMap API**.

## Tech Stack

| Layer      | Library                     |
|------------|-----------------------------|
| Framework  | Nuxt 4.3.1                  |
| Runtime    | Bun                         |
| Styling    | Tailwind CSS                |
| State      | Pinia                       |
| Data Fetch | TanStack Query (Vue Query)  |
| Map        | Leaflet                     |
| Charts     | Apache ECharts + vue-echarts|
| Testing    | Vitest + @nuxt/test-utils   |
| Language   | TypeScript (strict)         |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd weather-app

# Install dependencies dengan Bun
bun install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` dan isi API key dari [OpenWeatherMap](https://openweathermap.org/api):

```env
NUXT_PUBLIC_OWM_API_KEY=your_api_key_here
```

> 💡 Daftar gratis di openweathermap.org, API key aktif dalam ~30 menit.

### 3. Jalankan Dev Server

```bash
bun run dev
```

App berjalan di `http://localhost:3000`

---

## 📋 Scripts

```bash
bun run dev          # Development server
bun run build        # Production build
bun run preview      # Preview production build
bun run test         # Run Vitest
bun run test:ui      # Vitest UI mode
bun run test:coverage # Coverage report
bun run typecheck    # TypeScript check
```

---

## 🏗️ Atomic Design Structure

```
components/
├── atoms/          # BaseButton, BaseInput, BaseSelect, BaseToggle, BaseCard, ...
├── molecules/      # SearchBar, UnitToggle, ForecastCard, StatItem, ...
├── organisms/      # WeatherHero, WeatherStats, WeatherMap, WeatherChart, ...
└── templates/      # WeatherLayout, ErrorState
```

### Prinsip

- **Atoms** → komponen terkecil, hanya menerima props, tidak tahu soal state global
- **Molecules** → gabungan 2-4 atoms, memiliki satu tanggung jawab
- **Organisms** → terhubung ke store/composable, self-contained section
- **Templates** → layout shell berbasis slot
- **Pages** → orchestrasi data fetching dan komposisi organisms

---

## 🌤️ Fitur

- ✅ Current weather (suhu, kelembaban, angin, tekanan, visibilitas)
- ✅ Hourly forecast (36 jam ke depan)
- ✅ 7-day forecast strip
- ✅ Grafik suhu, curah hujan & angin (ECharts)
- ✅ Peta cuaca interaktif (Leaflet + OWM tiles)
- ✅ Search kota dengan autocomplete
- ✅ Geolocation otomatis
- ✅ Toggle °C / °F
- ✅ Dynamic background sesuai kondisi cuaca
- ✅ Responsive design (mobile-first)
- ✅ SSR + Hydration support

---

## 🧪 Testing

Unit test ada di `tests/unit/`. Jalankan:

```bash
bun run test
```

Test coverage meliputi:
- `utils/formatters.ts` — format helpers
- `utils/weatherConditions.ts` — condition mapping
- Component atoms (BaseButton, BaseToggle)
- Stores (useAppStore)

---

## 🔑 OpenWeatherMap API

API yang digunakan:

| Endpoint | Kegunaan |
|----------|----------|
| `/data/2.5/weather` | Current weather |
| `/data/2.5/forecast` | 5-day/3-hour forecast |
| `/geo/1.0/direct` | Geocoding (search kota) |
| `/geo/1.0/reverse` | Reverse geocoding |
| `/map/{layer}/{z}/{x}/{y}.png` | Weather map tiles |

Semua request dibungkus di `services/weatherApi.ts`.
