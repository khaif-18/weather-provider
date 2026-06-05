<script setup lang="ts">
import { Droplet } from 'lucide-vue-next'
import type { TemperatureUnit } from '~/types/weather.types'

interface Props {
  timeLabel: string
  icon: string
  condition: string
  temp: number
  pop: number
  unit?: TemperatureUnit
  isNow?: boolean
  isSelected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  unit: 'metric',
  isNow: false,
  isSelected: false,
})

defineEmits<{ click: [] }>()

const iconUrl = computed(() => getWeatherIconUrl(props.icon, '2x'))
</script>

<template>
  <button
    :class="[
      'flex flex-col items-center gap-2 px-3 py-3 rounded-[8px] transition-all duration-150 min-w-[60px]',
      'focus:outline-none',
      isSelected
        ? 'bg-sky-mist ring-2 ring-signal-blue/25'
        : isNow
          ? 'bg-canvas ring-1 ring-black/8'
          : 'hover:bg-canvas/70',
    ]"
    @click="$emit('click')"
  >
    <span
      :class="[
        'text-[11px] font-body font-medium leading-none',
        isSelected || isNow ? 'text-signal-blue font-semibold' : 'text-ink/45',
      ]"
    >
      {{ isNow ? 'Now' : timeLabel }}
    </span>

    <img
      :src="iconUrl"
      :alt="condition"
      :class="['w-8 h-8 object-contain transition-transform duration-200', isSelected ? 'scale-110' : '']"
      loading="lazy"
    />

    <!-- Precipitation probability -->
    <div v-if="pop > 0.1" class="flex items-center gap-0.5 h-4">
      <Droplet :size="9" :stroke-width="2" class="text-rain shrink-0" />
      <span class="font-mono text-[10px] font-medium leading-none text-rain">{{ formatPop(pop) }}</span>
    </div>
    <div v-else class="h-4"></div>

    <span
      :class="[
        'text-sm font-body font-semibold leading-none',
        isSelected || isNow ? 'text-ink' : 'text-ink/80',
      ]"
    >
      {{ formatTemp(temp, unit) }}
    </span>
  </button>
</template>
