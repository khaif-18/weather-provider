<script setup lang="ts">
import { CloudOff } from 'lucide-vue-next'

const appStore = useAppStore()
const { geolocate } = useGeolocation()

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

// Auto-geolocate on first visit (one-time, only if still on default city)
onMounted(async () => {
  if (typeof window === 'undefined') return
  const hasLocated = localStorage.getItem('kaether_geolocated')
  if (!hasLocated && appStore.cityName === DEFAULT_CITY && !appStore.hasCoords) {
    localStorage.setItem('kaether_geolocated', '1')
    const result = await geolocate()
    if (result) appStore.setCity(result.name, result.lat, result.lon)
  }
})

// Shared entrance spring config
const spring = { type: 'spring', stiffness: 280, damping: 24 } as const
function enterMotion(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { ...spring, delay } },
  }
}

useSeoMeta({
  title: () => weatherData.value
    ? `${weatherData.value.name} — ${Math.round(weatherData.value.main.temp)}°${appStore.unit === 'metric' ? 'C' : 'F'} · Kaether`
    : 'Kaether — Weather',
  description: 'Minimal weather app — real-time conditions, hourly & 7-day forecasts, UV index, air quality, moon phase, and interactive map.',
})
</script>

<template>
  <WeatherLayout>
    <!-- Condition-driven animated backdrop (fixed, behind all content) -->
    <WeatherBackdrop
      v-if="weatherData"
      :condition-code="weatherData.weather[0]?.id ?? 800"
      :is-day="isDaytime(weatherData.weather[0]?.icon ?? '01d')"
    />

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

      <!-- City switch crossfade: key resets the subtree when city changes -->
      <Transition name="city-fade" mode="out-in">
        <div :key="appStore.cityName">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <!-- ── Left column (2/3) ── -->
            <div class="lg:col-span-2 flex flex-col gap-4 min-w-0">
              <div v-if="weatherLoading" class="skeleton h-72" />
              <WeatherHero
                v-else-if="weatherData"
                v-motion
                :data="weatherData"
                :unit="appStore.unit"
                :minutes-ago="minutesAgo"
                :refetching="weatherFetching"
                v-bind="enterMotion(0)"
                @refresh="refetchWeather"
              />

              <HourlyForecast
                v-motion
                v-bind="enterMotion(80)"
                :data="forecastData"
                :unit="appStore.unit"
                :loading="forecastLoading"
              />

              <WeatherSuggestions
                v-if="weatherData"
                v-motion
                v-bind="enterMotion(140)"
                :data="weatherData"
                :unit="appStore.unit"
              />

              <ClientOnly>
                <WeatherChart
                  v-if="forecastData"
                  v-motion
                  v-bind="enterMotion(180)"
                  :data="forecastData"
                  :unit="appStore.unit"
                />
                <template #fallback>
                  <div class="skeleton-card h-52" />
                </template>
              </ClientOnly>

              <ClientOnly>
                <WeatherMap
                  v-if="weatherData"
                  v-motion
                  v-bind="enterMotion(220)"
                  :lat="weatherData.coord.lat"
                  :lon="weatherData.coord.lon"
                  :city="weatherData.name"
                />
                <template #fallback>
                  <div class="skeleton-card h-64" />
                </template>
              </ClientOnly>
            </div>

            <!-- ── Right column (1/3) ── -->
            <div class="flex flex-col gap-4 min-w-0">
              <ForecastList
                v-motion
                v-bind="enterMotion(100)"
                :data="forecastData"
                :unit="appStore.unit"
                :loading="forecastLoading"
              />

              <div v-if="weatherLoading" class="skeleton-card h-52" />
              <WeatherStats
                v-else-if="weatherData"
                v-motion
                v-bind="enterMotion(160)"
                :data="weatherData"
                :unit="appStore.unit"
              />

              <AirQuality
                v-if="weatherData"
                v-motion
                v-bind="enterMotion(200)"
                :lat="weatherData.coord.lat"
                :lon="weatherData.coord.lon"
              />
            </div>
          </div>
        </div>
      </Transition>
    </template>
  </WeatherLayout>
</template>
