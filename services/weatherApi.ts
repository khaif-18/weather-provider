// services/weatherApi.ts
// Tidak menggunakan class dengan constructor agar tidak memanggil
// useRuntimeConfig() di luar konteks Nuxt

import type {
  CurrentWeatherResponse,
  ForecastResponse,
  GeoLocation,
  TemperatureUnit,
} from '~/types/weather.types'

function buildParams(apiKey: string, params: Record<string, string | number>): string {
  return new URLSearchParams({
    appid: apiKey,
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ),
  }).toString()
}

export function useWeatherApi() {
  // useRuntimeConfig() dipanggil di sini — dalam konteks composable, aman
  const config = useRuntimeConfig()
  const baseUrl = config.public.openWeatherBaseUrl as string
  const geoUrl = config.public.openWeatherGeoUrl as string
  const apiKey = config.public.openWeatherApiKey as string

  return {
    /** Current weather by city name */
    getCurrentWeatherByCity(city: string, unit: TemperatureUnit = 'metric') {
      const params = buildParams(apiKey, { q: city, units: unit })
      return $fetch<CurrentWeatherResponse>(`${baseUrl}/weather?${params}`)
    },

    /** Current weather by coords */
    getCurrentWeatherByCoords(lat: number, lon: number, unit: TemperatureUnit = 'metric') {
      const params = buildParams(apiKey, { lat, lon, units: unit })
      return $fetch<CurrentWeatherResponse>(`${baseUrl}/weather?${params}`)
    },

    /** 5-day / 3-hour forecast by city name */
    getForecastByCity(city: string, unit: TemperatureUnit = 'metric', cnt = 40) {
      const params = buildParams(apiKey, { q: city, units: unit, cnt })
      return $fetch<ForecastResponse>(`${baseUrl}/forecast?${params}`)
    },

    /** 5-day / 3-hour forecast by coords */
    getForecastByCoords(lat: number, lon: number, unit: TemperatureUnit = 'metric', cnt = 40) {
      const params = buildParams(apiKey, { lat, lon, units: unit, cnt })
      return $fetch<ForecastResponse>(`${baseUrl}/forecast?${params}`)
    },

    /** Geocoding — search cities */
    searchCities(query: string, limit = 5) {
      const params = buildParams(apiKey, { q: query, limit })
      return $fetch<GeoLocation[]>(`${geoUrl}/direct?${params}`)
    },

    /** Reverse geocoding */
    reverseGeocode(lat: number, lon: number) {
      const params = buildParams(apiKey, { lat, lon, limit: 1 })
      return $fetch<GeoLocation[]>(`${geoUrl}/reverse?${params}`)
    },
  }
}