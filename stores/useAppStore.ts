import { defineStore } from 'pinia'
import type { GeoLocation, TemperatureUnit } from '~/types/weather.types'

const SAVED_CITIES_KEY = 'kaether:saved-cities'

interface AppState {
  cityName: string
  lat: number | null
  lon: number | null
  unit: TemperatureUnit
  savedCities: GeoLocation[]
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    cityName: DEFAULT_CITY,
    lat: null,
    lon: null,
    unit: DEFAULT_UNIT,
    savedCities: loadSavedCities(),
  }),

  getters: {
    hasCoords: (state) => state.lat !== null && state.lon !== null,
    unitLabel: (state) => UNIT_LABELS[state.unit],
    isCurrentCitySaved: (state) =>
      state.savedCities.some(c => c.name === state.cityName),
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

    addSavedCity(city: GeoLocation) {
      if (!this.savedCities.some(c => c.name === city.name)) {
        this.savedCities.push(city)
        persistSavedCities(this.savedCities)
      }
    },

    removeSavedCity(name: string) {
      this.savedCities = this.savedCities.filter(c => c.name !== name)
      persistSavedCities(this.savedCities)
    },

    reset() {
      this.cityName = DEFAULT_CITY
      this.lat = null
      this.lon = null
    },
  },
})

function loadSavedCities(): GeoLocation[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(SAVED_CITIES_KEY)
    return raw ? JSON.parse(raw) : []
  }
  catch { return [] }
}

function persistSavedCities(cities: GeoLocation[]) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(SAVED_CITIES_KEY, JSON.stringify(cities)) }
  catch { /* storage unavailable */ }
}
