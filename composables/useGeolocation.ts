// composables/useGeolocation.ts
import type { GeoLocation } from '~/types/weather.types'

export function useGeolocation() {
  const locating = ref(false)
  const error = ref<string | null>(null)
  // useWeatherApi() dipanggil di dalam composable — konteks Nuxt valid
  const api = useWeatherApi()

  async function geolocate(): Promise<GeoLocation | null> {
    if (!navigator.geolocation) {
      error.value = 'Geolocation not supported by your browser'
      return null
    }

    locating.value = true
    error.value = null

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10_000,
          maximumAge: 300_000,
        })
      })

      const { latitude: lat, longitude: lon } = position.coords
      const results = await api.reverseGeocode(lat, lon)
      const city = results[0]

      if (!city) {
        error.value = 'Could not determine city from coordinates'
        return null
      }

      return { ...city, lat, lon }
    }
    catch (err: unknown) {
      const e = err as GeolocationPositionError
      error.value = e.code === 1
        ? 'Location access denied. Please enable permissions.'
        : 'Could not get your location. Please try again.'
      return null
    }
    finally {
      locating.value = false
    }
  }

  return { locating, error, geolocate }
}