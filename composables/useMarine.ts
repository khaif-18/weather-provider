import { useQuery } from '@tanstack/vue-query'
import type { MarineResponse } from '~/types/weather.types'

/**
 * Tide + waves via Open-Meteo Marine API (free, no key).
 * `sea_level_height_msl` is the real tidal height (vs mean sea level).
 * Inland coordinates return HTTP 400 → query errors → reported as unavailable.
 */
export function useMarine(lat: Ref<number | null>, lon: Ref<number | null>) {
  return useQuery<MarineResponse>({
    queryKey: computed(() => ['marine', lat.value, lon.value]),
    queryFn: () => $fetch<MarineResponse>('https://marine-api.open-meteo.com/v1/marine', {
      query: {
        latitude: lat.value,
        longitude: lon.value,
        current: 'wave_height,sea_level_height_msl',
        hourly: 'sea_level_height_msl',
        forecast_days: 1,
      },
    }),
    staleTime: 30 * 60 * 1000,
    enabled: computed(() => lat.value != null && lon.value != null),
    retry: 0,
  })
}
