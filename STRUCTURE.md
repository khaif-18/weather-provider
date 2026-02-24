# Weather App — Project Structure

```
weather-app/
│
├── assets/
│   ├── css/
│   │   ├── main.css              # Tailwind directives + global styles
│   │   └── animations.css        # Custom keyframe animations
│   └── fonts/                    # Local font files (optional)
│
├── components/
│   ├── atoms/                    # Smallest indivisible UI units
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   ├── BaseSelect.vue
│   │   ├── BaseOption.vue
│   │   ├── BaseBadge.vue
│   │   ├── BaseIcon.vue
│   │   ├── BaseSpinner.vue
│   │   ├── BaseTooltip.vue
│   │   ├── BaseToggle.vue
│   │   └── BaseCard.vue
│   │
│   ├── molecules/                # Combinations of atoms
│   │   ├── SearchBar.vue         # BaseInput + BaseButton
│   │   ├── UnitToggle.vue        # BaseToggle + label
│   │   ├── WeatherIcon.vue       # BaseIcon + condition label
│   │   ├── StatItem.vue          # Label + value pair (humidity, wind, etc)
│   │   ├── ForecastCard.vue      # Day + icon + temp range
│   │   └── HourlyItem.vue        # Hour + icon + temp
│   │
│   ├── organisms/                # Complex, self-contained sections
│   │   ├── WeatherHero.vue       # Main current weather display
│   │   ├── WeatherStats.vue      # Grid of StatItems
│   │   ├── ForecastList.vue      # 7-day forecast strip
│   │   ├── HourlyForecast.vue    # Horizontal scroll hourly
│   │   ├── WeatherChart.vue      # ECharts temperature graph (client-only)
│   │   ├── WeatherMap.vue        # Leaflet map (client-only)
│   │   └── AppHeader.vue         # Logo + SearchBar + UnitToggle
│   │
│   └── templates/                # Page-level layout wrappers
│       ├── WeatherLayout.vue     # Main layout shell
│       └── ErrorState.vue        # Empty/error full-page state
│
├── composables/
│   ├── useWeather.ts             # TanStack Query — current weather
│   ├── useForecast.ts            # TanStack Query — 5-day/hourly forecast
│   ├── useGeolocation.ts         # Browser geolocation wrapper
│   ├── useUnitConverter.ts       # °C ↔ °F conversion helpers
│   └── useWeatherTheme.ts        # Dynamic bg/colors based on condition
│
├── stores/
│   ├── useAppStore.ts            # Global: city, unit preference
│   └── useWeatherStore.ts        # Cached weather data + loading state
│
├── services/
│   └── weatherApi.ts             # OpenWeatherMap API client (typed)
│
├── types/
│   ├── weather.types.ts          # OpenWeatherMap response types
│   └── app.types.ts              # App-level types
│
├── utils/
│   ├── formatters.ts             # Date, wind direction, humidity formatters
│   ├── weatherConditions.ts      # Condition code → icon/description map
│   └── constants.ts              # API base URL, default city, etc
│
├── tests/
│   ├── unit/
│   │   ├── composables/
│   │   │   ├── useUnitConverter.test.ts
│   │   │   └── useWeatherTheme.test.ts
│   │   ├── utils/
│   │   │   ├── formatters.test.ts
│   │   │   └── weatherConditions.test.ts
│   │   └── stores/
│   │       └── useAppStore.test.ts
│   └── components/
│       ├── atoms/
│       │   ├── BaseButton.test.ts
│       │   └── BaseToggle.test.ts
│       └── molecules/
│           └── SearchBar.test.ts
│
├── plugins/
│   └── vue-query.ts
│
├── layouts/
│   └── default.vue
│
├── pages/
│   ├── index.vue                 # Home — current city weather
│   └── city/
│       └── [name].vue            # Dynamic city route
│
├── app.vue
├── nuxt.config.ts
├── tailwind.config.ts
├── vitest.config.ts
├── tsconfig.json
├── .env.example
└── bunfig.toml                   # Bun config
```

## Atomic Design Philosophy

| Level      | Contoh                        | Prinsip                              |
|------------|-------------------------------|--------------------------------------|
| Atoms      | BaseButton, BaseInput         | Tidak bisa dibagi lagi, props-driven |
| Molecules  | SearchBar, ForecastCard       | 2–4 atoms, single responsibility     |
| Organisms  | WeatherHero, ForecastList     | Terhubung ke store/composable        |
| Templates  | WeatherLayout                 | Layout shell, slot-based             |
| Pages      | index.vue, [name].vue         | Data fetching, orchestrasi           |
