<template>
  <WeatherLayout>

    <!-- Error -->
    <ErrorState v-if="weatherError" title="City not found"
      message="We couldn't find weather data for this location. Try searching for another city." icon="🌫️"
      action="Try Again" @action="refetchWeather" />

    <template v-else>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <!-- ── Left column (2/3) ── -->
        <div class="lg:col-span-2 flex flex-col gap-5">

          <!-- Hero -->
          <div v-if="weatherLoading" class="skeleton rounded-3xl h-72" />
          <WeatherHero v-else-if="weatherData" :data="weatherData" :unit="appStore.unit" />

          <!-- Hourly -->
          <HourlyForecast :data="forecastData" :unit="appStore.unit" :loading="forecastLoading" />

          <!-- Chart (client-only) -->
          <ClientOnly>
            <WeatherChart v-if="forecastData" :data="forecastData" :unit="appStore.unit" />
            <template #fallback>
              <div class="skeleton rounded-2xl h-52" />
            </template>
          </ClientOnly>
        </div>

        <!-- ── Right column (1/3) ── -->
        <div class="flex flex-col gap-5">

          <!-- 7-day -->
          <ForecastList :data="forecastData" :unit="appStore.unit" :loading="forecastLoading" />

          <!-- Stats -->
          <div v-if="weatherLoading" class="skeleton rounded-2xl h-52" />
          <WeatherStats v-else-if="weatherData" :data="weatherData" :unit="appStore.unit" />

          <!-- Map (client-only) -->
          <ClientOnly>
            <WeatherMap v-if="weatherData" :lat="weatherData.coord.lat" :lon="weatherData.coord.lon"
              :city="weatherData.name" />
            <template #fallback>
              <div class="skeleton rounded-2xl h-60" />
            </template>
          </ClientOnly>
        </div>

      </div>
    </template>
  </WeatherLayout>
</template>

<script setup lang="ts">
const appStore = useAppStore()

const cityRef = computed(() => appStore.cityName)
const unitRef = computed(() => appStore.unit)
const latRef = computed(() => appStore.lat)
const lonRef = computed(() => appStore.lon)

const {
  data: weatherData,
  isLoading: weatherLoading,
  error: weatherError,
  refetch: refetchWeather,
} = useWeather(cityRef, unitRef, latRef, lonRef)

const {
  data: forecastData,
  isLoading: forecastLoading,
} = useForecast(cityRef, unitRef, latRef, lonRef)

useSeoMeta({
  title: () => weatherData.value
    ? `${weatherData.value.name} — ${Math.round(weatherData.value.main.temp)}°${appStore.unit === 'metric' ? 'C' : 'F'} · Kaether`
    : 'Kaether — Weather',
  description: 'Clean, minimal weather app with real-time data, hourly & 7-day forecasts, map, and charts.',
})
</script>
