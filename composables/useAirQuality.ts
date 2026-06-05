import { useQuery } from '@tanstack/vue-query'
import type { AirQualityResponse } from '~/types/weather.types'

export function useAirQuality(lat: Ref<number | null>, lon: Ref<number | null>) {
  const api = useWeatherApi()

  return useQuery<AirQualityResponse>({
    queryKey: computed(() => ['air-quality', lat.value, lon.value]),
    queryFn: () => api.getAirQuality(lat.value!, lon.value!),
    staleTime: 10 * 60 * 1000, // 10 min
    enabled: computed(() => lat.value != null && lon.value != null),
    retry: 1,
  })
}

export const AQI_META = [
  { level: 1, label: 'Good',      color: '#00b050', tailwind: 'bg-aqi-1' },
  { level: 2, label: 'Fair',      color: '#92d050', tailwind: 'bg-aqi-2' },
  { level: 3, label: 'Moderate',  color: '#ffc000', tailwind: 'bg-aqi-3' },
  { level: 4, label: 'Poor',      color: '#ff0000', tailwind: 'bg-aqi-4' },
  { level: 5, label: 'Very Poor', color: '#c00000', tailwind: 'bg-aqi-5' },
] as const

export function getAqiMeta(aqi: 1 | 2 | 3 | 4 | 5) {
  return AQI_META[aqi - 1]!
}
