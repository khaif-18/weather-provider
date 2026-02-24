<template>
  <div :class="[
    'flex flex-col items-center gap-2 px-4 py-3 rounded-2xl shrink-0 transition-all duration-150',
    isNow
      ? 'bg-sky text-white'
      : 'hover:bg-canvas',
  ]">
    <span :class="['text-xs font-body font-medium', isNow ? 'text-white/80' : 'text-ink-soft']">
      {{ isNow ? 'Now' : timeLabel }}
    </span>

    <img :src="iconUrl" :alt="condition" class="w-8 h-8 object-contain" loading="lazy" />

    <div v-if="pop > 0.1" class="flex items-center gap-0.5">
      <span class="text-[10px]">💧</span>
      <span :class="['font-mono text-[10px]', isNow ? 'text-white/70' : 'text-rain']">{{ formatPop(pop) }}</span>
    </div>
    <div v-else class="h-4" />

    <span :class="['text-sm font-body font-bold', isNow ? 'text-white' : 'text-ink']">
      {{ formatTemp(temp, unit) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { TemperatureUnit } from '~/types/weather.types'

interface Props {
  timeLabel: string
  icon: string
  condition: string
  temp: number
  pop: number
  unit?: TemperatureUnit
  isNow?: boolean
}

const props = withDefaults(defineProps<Props>(), { unit: 'metric', isNow: false })
const iconUrl = computed(() => getWeatherIconUrl(props.icon, '2x'))
</script>
