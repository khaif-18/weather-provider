// stores/useAppStore.ts
import { defineStore } from 'pinia'
import type { TemperatureUnit } from '~/types/weather.types'

interface AppState {
  cityName: string
  lat: number | null
  lon: number | null
  unit: TemperatureUnit
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    cityName: DEFAULT_CITY,
    lat: null,
    lon: null,
    unit: DEFAULT_UNIT,
  }),

  getters: {
    hasCoords: (state) => state.lat !== null && state.lon !== null,
    unitLabel: (state) => UNIT_LABELS[state.unit],
  },

  actions: {
    setCity(name: string, lat?: number, lon?: number) {
      this.cityName = name
      this.lat = lat ?? null
      this.lon = lon ?? null
    },

    setUnit(unit: TemperatureUnit) {
      this.unit = unit
    },

    reset() {
      this.cityName = DEFAULT_CITY
      this.lat = null
      this.lon = null
    },
  },
})
