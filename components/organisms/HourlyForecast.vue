<template>
  <BaseCard variant="default" padding="lg" rounded="2xl">
    <h2 class="text-xs font-body font-semibold text-ink-soft uppercase tracking-widest mb-4">
      Hourly Forecast
    </h2>

    <div v-if="loading" class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      <div v-for="i in 8" :key="i" class="skeleton w-16 h-28 rounded-2xl shrink-0" />
    </div>

    <div v-else-if="hours.length" class="relative">
      <div class="flex gap-1 overflow-x-auto no-scrollbar pb-1 stagger">
        <HourlyItem v-for="hour in hours" :key="hour.dt" :time-label="hour.timeLabel" :icon="hour.icon"
          :condition="hour.condition" :temp="hour.temp" :pop="hour.pop" :unit="unit" :is-now="hour.isNow"
          class="shrink-0" />
      </div>
      <!-- Fade right edge -->
      <div
        class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-canvas-pure to-transparent pointer-events-none rounded-r-2xl" />
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { ForecastResponse, TemperatureUnit } from '~/types/weather.types'

const props = defineProps<{
  data?: ForecastResponse | null
  unit: TemperatureUnit
  loading?: boolean
}>()

const hours = computed(() => {
  if (!props.data) return []
  const nowDt = Math.floor(Date.now() / 1000)

  return props.data.list.slice(0, 12).map((item, i) => ({
    dt: item.dt,
    timeLabel: formatTimeFromDtTxt(item.dt_txt),
    icon: item.weather[0]?.icon ?? '01d',
    condition: item.weather[0]?.description ?? '',
    temp: item.main.temp,
    pop: item.pop,
    wind: item.wind.speed,
    // Mark first item as "now"
    isNow: i === 0,
  }))
})
</script>
