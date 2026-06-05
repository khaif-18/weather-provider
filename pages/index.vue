<template>
  <WeatherLayout>

    <ErrorState
      v-if="weatherError"
      title="City not found"
      message="We couldn't find weather data for this location. Try searching for another city."
      :icon="CloudOff"
      action="Try Again"
      @action="refetchWeather"
    />

    <template v-else>
      <!-- Weather alerts banner (dismissible, rule-based) -->
      <WeatherAlert v-if="weatherData && alerts.length" :alerts="alerts" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <!-- ── Left column (2/3) ── -->
        <div class="lg:col-span-2 flex flex-col gap-4 min-w-0">

          <div v-if="weatherLoading" class="skeleton h-72" />
          <WeatherHero
            v-else-if="weatherData"
            :data="weatherData"
            :unit="appStore.unit"
            :minutes-ago="minutesAgo"
            :refetching="weatherFetching"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } }"
            @refresh="refetchWeather"
          />

          <HourlyForecast :data="forecastData" :unit="appStore.unit" :loading="forecastLoading" />

          <!-- Suggestions — between hourly and chart -->
          <WeatherSuggestions
            v-if="weatherData"
            :data="weatherData"
            :unit="appStore.unit"
          />

          <ClientOnly>
            <WeatherChart v-if="forecastData" :data="forecastData" :unit="appStore.unit" />
            <template #fallback><div class="skeleton-card h-52" /></template>
          </ClientOnly>

          <ClientOnly>
            <WeatherMap
              v-if="weatherData"
              :lat="weatherData.coord.lat"
              :lon="weatherData.coord.lon"
              :city="weatherData.name"
            />
            <template #fallback><div class="skeleton-card h-64" /></template>
          </ClientOnly>
        </div>

        <!-- ── Right column (1/3) ── -->
        <div class="flex flex-col gap-4 min-w-0">

          <ForecastList :data="forecastData" :unit="appStore.unit" :loading="forecastLoading" />

          <div v-if="weatherLoading" class="skeleton-card h-52" />
          <WeatherStats v-else-if="weatherData" :data="weatherData" :unit="appStore.unit" />

          <AirQuality
            v-if="weatherData"
            :lat="weatherData.coord.lat"
            :lon="weatherData.coord.lon"
          />
        </div>

      </div>
    </template>
  </WeatherLayout>
</template>

<script setup lang="ts">
import { CloudOff } from 'lucide-vue-next'

const appStore = useAppStore()

const cityRef = computed(() => appStore.cityName)
const unitRef = computed(() => appStore.unit)
const latRef  = computed(() => appStore.lat)
const lonRef  = computed(() => appStore.lon)

const {
  data: weatherData,
  isLoading: weatherLoading,
  isFetching: weatherFetching,
  error: weatherError,
  refetch: refetchWeather,
  dataUpdatedAt,
} = useWeather(cityRef, unitRef, latRef, lonRef)

const {
  data: forecastData,
  isLoading: forecastLoading,
} = useForecast(cityRef, unitRef, latRef, lonRef)

const minutesAgo = computed(() => {
  if (!dataUpdatedAt.value) return null
  return Math.round((Date.now() - dataUpdatedAt.value) / 60000)
})

const alerts = computed(() =>
  weatherData.value ? getWeatherAlerts(weatherData.value, appStore.unit) : []
)

useSeoMeta({
  title: () => weatherData.value
    ? `${weatherData.value.name} — ${Math.round(weatherData.value.main.temp)}°${appStore.unit === 'metric' ? 'C' : 'F'} · Kaether`
    : 'Kaether — Weather',
  description: 'Minimal weather app — real-time conditions, hourly & 7-day forecasts, UV index, air quality, moon phase, and interactive map.',
})
</script>
