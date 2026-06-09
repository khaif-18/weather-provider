<script setup lang="ts">
import { useQueries } from '@tanstack/vue-query'
import type { GeoLocation } from '~/types/weather.types'

const appStore = useAppStore()
const api      = useWeatherApi()

// Parallel queries for mini temperature of each saved city
const results = useQueries({
  queries: computed(() =>
    appStore.savedCities.map(city => ({
      queryKey: ['saved-temp', city.name, city.lat, city.lon, appStore.unit] as const,
      queryFn:  () => city.lat && city.lon
        ? api.getCurrentWeatherByCoords(city.lat, city.lon, appStore.unit)
        : api.getCurrentWeatherByCity(city.name, appStore.unit),
      staleTime: STALE_TIME.WEATHER,
      retry: 1,
    }))
  ),
})

const cityTemps = computed(() =>
  results.value.map(r =>
    r.isSuccess && r.data ? `${Math.round(r.data.main.temp)}°` : null
  )
)

function selectCity(city: GeoLocation) {
  appStore.setCity(city.name, city.lat, city.lon)
}
</script>

<template>
  <div v-if="appStore.savedCities.length" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
      <span class="text-[11px] font-body font-medium text-white/45 uppercase tracking-widest shrink-0 pr-1">
        Saved
      </span>
      <button
        v-for="(city, i) in appStore.savedCities"
        :key="city.name"
        :class="[
          'flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-pill text-sm font-body font-medium',
          'transition-all duration-150 shrink-0 border',
          appStore.cityName === city.name
            ? 'bg-ink/20 text-ink border-ink shadow-btn'
            : 'bg-transparent text-white/80 border-white/40 hover:bg-white/10 hover:text-white',
        ]"
        @click="selectCity(city)"
      >
        <span>{{ city.name }}</span>
        <!-- Mini temperature (from parallel queries) -->
        <span
          v-if="cityTemps[i]"
          :class="['text-[11px] font-mono', appStore.cityName === city.name ? 'text-ink/90' : 'text-white/50']"
        >{{ cityTemps[i] }}</span>

        <span
          class="w-4 h-4 flex items-center justify-center rounded-full text-[10px] leading-none
                 hover:bg-black/10 transition-colors"
          :class="appStore.cityName === city.name ? 'text-ink/40' : 'text-white/40'"
          @click.stop="appStore.removeSavedCity(city.name)"
        >×</span>
      </button>
    </div>
  </div>
</template>
