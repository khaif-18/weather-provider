// composables/useForecast.ts
import { useQuery } from '@tanstack/vue-query'
import type { ForecastResponse, TemperatureUnit } from '~/types/weather.types'

export function useForecast(
  city: Ref<string>,
  unit: Ref<TemperatureUnit>,
  lat?: Ref<number | null>,
  lon?: Ref<number | null>,
) {
  const api = useWeatherApi()

  return useQuery<ForecastResponse>({
    queryKey: computed(() => [QUERY_KEYS.FORECAST, city.value, unit.value]),
    queryFn: () => {
      if (lat?.value != null && lon?.value != null) {
        return api.getForecastByCoords(lat.value, lon.value, unit.value)
      }
      return api.getForecastByCity(city.value, unit.value)
    },
    staleTime: STALE_TIME.FORECAST,
    enabled: computed(() => Boolean(city.value || (lat?.value != null && lon?.value != null))),
    retry: 2,
  })
}