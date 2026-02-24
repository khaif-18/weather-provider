<template>
  <div :class="[
    'flex flex-col items-center gap-2 px-3 py-4 rounded-2xl transition-all duration-150',
    'border border-transparent cursor-default',
    isToday
      ? 'bg-sky-pale border-sky/25 shadow-card'
      : 'hover:bg-canvas hover:border-ink-faint/40',
  ]">
    <span :class="[
      'text-xs font-body font-semibold uppercase tracking-widest',
      isToday ? 'text-sky' : 'text-ink-soft',
    ]">
      {{ isToday ? 'Today' : dayShort }}
    </span>

    <img :src="iconUrl" :alt="condition" class="w-9 h-9 object-contain" loading="lazy" />

    <div v-if="pop > 0.1" class="flex items-center gap-0.5">
      <span class="text-[10px]">💧</span>
      <span class="font-mono text-[10px] text-rain font-medium">{{ formatPop(pop) }}</span>
    </div>
    <div v-else class="h-4" />

    <div class="flex flex-col items-center">
      <span :class="['text-sm font-body font-bold', isToday ? 'text-ink' : 'text-ink-mid']">
        {{ formatTemp(tempMax, unit) }}
      </span>
      <span class="text-xs font-body text-ink-faint">
        {{ formatTemp(tempMin, unit) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TemperatureUnit } from '~/types/weather.types'

interface Props {
  dayShort: string
  icon: string
  condition: string
  tempMax: number
  tempMin: number
  pop: number
  unit?: TemperatureUnit
  isToday?: boolean
}

const props = withDefaults(defineProps<Props>(), { unit: 'metric', isToday: false })
const iconUrl = computed(() => getWeatherIconUrl(props.icon, '2x'))
</script>
