<template>
  <header class="relative z-40 w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3 h-16">

        <NuxtLink to="/" class="shrink-0 group">
          <span class="font-cursive font-bold text-[30px] text-white leading-none tracking-tight
                       group-hover:opacity-80 transition-opacity">
            Kaether
          </span>
        </NuxtLink>

        <div class="flex-1 max-w-xs">
          <SearchBar @select="handleCitySelect" @search="handleSearch" />
        </div>

        <div class="flex items-center gap-2 shrink-0">

          <!-- Geolocation -->
          <button class="btn-ghost py-2 px-3 sm:px-4" :disabled="locating" @click="handleGeolocate">
            <LocateFixed v-if="!locating" :size="15" :stroke-width="1.75" />
            <LoaderCircle v-else :size="15" :stroke-width="1.75" class="animate-spin" />
            <span class="hidden sm:inline">Locate</span>
          </button>

          <!-- °C / °F -->
          <div class="flex rounded-pill border border-white/60 overflow-hidden text-sm font-body font-medium">
            <button
              :class="['px-3 py-1.5 leading-none transition-colors',
                appStore.unit === 'metric' ? 'bg-white text-ink' : 'text-white/75 hover:text-white hover:bg-white/10']"
              @click="appStore.setUnit('metric')"
            >°C</button>
            <button
              :class="['px-3 py-1.5 leading-none transition-colors',
                appStore.unit === 'imperial' ? 'bg-white text-ink' : 'text-white/75 hover:text-white hover:bg-white/10']"
              @click="appStore.setUnit('imperial')"
            >°F</button>
          </div>

          <!-- Dark mode toggle -->
          <button
            class="btn-ghost py-2 px-3"
            :title="isDark ? 'Light mode' : 'Dark mode'"
            @click="toggleDark()"
          >
            <component :is="isDark ? Sun : Moon" :size="15" :stroke-width="1.75" />
          </button>

          <!-- Save/unsave city -->
          <button
            :class="['btn-ghost py-2 px-3', appStore.isCurrentCitySaved ? 'bg-white/20' : '']"
            :title="appStore.isCurrentCitySaved ? 'Remove from saved' : 'Save city'"
            @click="toggleSave"
          >
            <component
              :is="appStore.isCurrentCitySaved ? BookmarkCheck : Bookmark"
              :size="15" :stroke-width="1.75"
            />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { Sun, Moon, LocateFixed, LoaderCircle, Bookmark, BookmarkCheck } from 'lucide-vue-next'
import type { GeoLocation } from '~/types/weather.types'

const appStore   = useAppStore()
const { locating, geolocate } = useGeolocation()
const isDark     = useDark()
const toggleDark = useToggle(isDark)

function toggleSave() {
  if (appStore.isCurrentCitySaved) {
    appStore.removeSavedCity(appStore.cityName)
  }
  else {
    const city: GeoLocation = { name: appStore.cityName, lat: appStore.lat ?? 0, lon: appStore.lon ?? 0, country: '' }
    appStore.addSavedCity(city)
  }
}

function handleCitySelect(city: GeoLocation) { appStore.setCity(city.name, city.lat, city.lon) }
function handleSearch(query: string)          { appStore.setCity(query) }

async function handleGeolocate() {
  const result = await geolocate()
  if (result) appStore.setCity(result.name, result.lat, result.lon)
}
</script>
