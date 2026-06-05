import { useQuery } from '@tanstack/vue-query'
import type { PollenResponse } from '~/types/weather.types'

/**
 * Pollen via Open-Meteo air-quality API (free, no key).
 * Coverage is Europe-only (CAMS model); elsewhere the fields are null,
 * which `summarizePollen` reports as unavailable.
 */
export function usePollen(lat: Ref<number | null>, lon: Ref<number | null>) {
  return useQuery<PollenResponse>({
    queryKey: computed(() => ['pollen', lat.value, lon.value]),
    queryFn: () => $fetch<PollenResponse>('https://air-quality-api.open-meteo.com/v1/air-quality', {
      query: {
        latitude: lat.value,
        longitude: lon.value,
        current: 'alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen',
      },
    }),
    staleTime: 30 * 60 * 1000,
    enabled: computed(() => lat.value != null && lon.value != null),
    retry: 0,
  })
}
