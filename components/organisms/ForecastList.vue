<template>
  <div class="card p-5">
    <h2 class="section-label mb-4">7-Day Forecast</h2>

    <!-- Skeleton -->
    <div v-if="loading" class="flex flex-col gap-2">
      <div v-for="i in 7" :key="i" class="skeleton-card h-10 rounded-[8px]" />
    </div>

    <!-- Data — vertical rows -->
    <div v-else-if="dailyForecasts.length" class="flex flex-col stagger">
      <ForecastCard
        v-for="(day, index) in dailyForecasts"
        :key="day.date"
        :day-short="day.dayShort"
        :icon="day.icon"
        :condition="day.condition"
        :temp-max="day.tempMax"
        :temp-min="day.tempMin"
        :pop="day.pop"
        :unit="unit"
        :is-today="index === 0"
        :temp-range-min="globalTempMin"
        :temp-range-max="globalTempMax"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ForecastResponse, DailyForecast, TemperatureUnit } from '~/types/weather.types'

const props = defineProps<{
  data?: ForecastResponse | null
  unit: TemperatureUnit
  loading?: boolean
}>()

const dailyForecasts = computed<DailyForecast[]>(() => {
  if (!props.data) return []

  const grouped = new Map<string, typeof props.data.list[0][]>()
  for (const item of props.data.list) {
    const day = item.dt_txt.split(' ')[0]
    if (!day) continue
    if (!grouped.has(day)) grouped.set(day, [])
    grouped.get(day)!.push(item)
  }

  return Array.from(grouped.entries()).slice(0, 7).map(([date, items]) => {
    const noon = items.find(i => i.dt_txt.includes('12:00')) ?? items[0]
    const temps = items.map(i => i.main.temp)
    const pops = items.map(i => i.pop)

    return {
      date,
      dateLabel: formatDate(noon!.dt),
      dayShort: formatDayShort(noon!.dt),
      icon: noon!.weather[0]?.icon ?? '01d',
      condition: noon!.weather[0]?.description ?? '',
      tempMax: Math.max(...temps),
      tempMin: Math.min(...temps),
      pop: Math.max(...pops),
    }
  })
})

// Global min/max for relative temperature bar widths
const globalTempMin = computed(() =>
  dailyForecasts.value.length ? Math.min(...dailyForecasts.value.map(d => d.tempMin)) : 0
)
const globalTempMax = computed(() =>
  dailyForecasts.value.length ? Math.max(...dailyForecasts.value.map(d => d.tempMax)) : 40
)
</script>
