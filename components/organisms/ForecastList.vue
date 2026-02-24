<template>
  <BaseCard variant="default" padding="lg" rounded="2xl">
    <h2 class="text-xs font-body font-semibold text-ink-soft uppercase tracking-widest mb-4">
      7-Day Forecast
    </h2>

    <!-- Skeleton -->
    <div v-if="loading" class="flex gap-1 overflow-x-auto no-scrollbar pb-1">
      <div v-for="i in 7" :key="i" class="skeleton w-16 h-32 rounded-2xl shrink-0" />
    </div>

    <!-- Data -->
    <div v-else-if="dailyForecasts.length" class="flex gap-1 overflow-x-auto no-scrollbar pb-1 stagger">
      <ForecastCard v-for="(day, index) in dailyForecasts" :key="day.date" :day-short="day.dayShort" :icon="day.icon"
        :condition="day.condition" :temp-max="day.tempMax" :temp-min="day.tempMin" :pop="day.pop" :unit="unit"
        :is-today="index === 0" class="shrink-0 flex-1 min-w-[90px]" />
    </div>
  </BaseCard>
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
</script>
