<template>
  <header class="sticky top-0 z-40 w-full bg-canvas-pure/90 backdrop-blur-md border-b border-ink-faint/30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-4 h-16">

        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 shrink-0 group">
          <span class="text-xl transition-transform group-hover:scale-110 duration-300">🌤️</span>
          <span class="font-display font-bold text-lg text-ink tracking-tight hidden sm:block">
            Kaether
          </span>
        </NuxtLink>

        <!-- Search bar -->
        <div class="flex-1 max-w-md">
          <SearchBar @select="handleCitySelect" @search="handleSearch" />
        </div>

        <!-- Right controls -->
        <div class="flex items-center gap-2 shrink-0">
          <!-- Geolocation -->
          <BaseTooltip text="Use my location">
            <BaseButton variant="ghost" size="sm" icon-only rounded :loading="locating" aria-label="Use my location"
              @click="handleGeolocate">
              📍
            </BaseButton>
          </BaseTooltip>

          <!-- Unit toggle -->
          <UnitToggle v-model="isFahrenheit" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { GeoLocation } from '~/types/weather.types'

const appStore = useAppStore()
const { locating, geolocate } = useGeolocation()

const isFahrenheit = computed({
  get: () => appStore.unit === 'imperial',
  set: (val) => appStore.setUnit(val ? 'imperial' : 'metric'),
})

function handleCitySelect(city: GeoLocation) {
  appStore.setCity(city.name, city.lat, city.lon)
}

function handleSearch(query: string) {
  appStore.setCity(query)
}

async function handleGeolocate() {
  const result = await geolocate()
  if (result) appStore.setCity(result.name, result.lat, result.lon)
}
</script>
