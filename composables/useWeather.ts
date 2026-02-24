// composables/useWeather.ts
import { useQuery } from '@tanstack/vue-query'
import type { CurrentWeatherResponse, TemperatureUnit } from '~/types/weather.types'

export function useWeather(
  city: Ref<string>,
  unit: Ref<TemperatureUnit>,
  lat?: Ref<number | null>,
  lon?: Ref<number | null>,
) {
  const api = useWeatherApi()

  return useQuery<CurrentWeatherResponse>({
    queryKey: computed(() => [QUERY_KEYS.CURRENT_WEATHER, city.value, unit.value]),
    queryFn: () => {
      if (lat?.value != null && lon?.value != null) {
        return api.getCurrentWeatherByCoords(lat.value, lon.value, unit.value)
      }
      return api.getCurrentWeatherByCity(city.value, unit.value)
    },
    staleTime: STALE_TIME.WEATHER,
    enabled: computed(() => Boolean(city.value || (lat?.value != null && lon?.value != null))),
    retry: 2,
  })
}