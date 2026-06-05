<script setup lang="ts">
import { Droplet, ChevronDown } from 'lucide-vue-next'
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
  tempRangeMin?: number
  tempRangeMax?: number
}

const props = withDefaults(defineProps<Props>(), {
  unit: 'metric',
  isToday: false,
  tempRangeMin: 0,
  tempRangeMax: 40,
})

const isExpanded = ref(false)
const iconUrl     = computed(() => getWeatherIconUrl(props.icon, '2x'))
const totalRange  = computed(() => props.tempRangeMax - props.tempRangeMin || 1)
const rangeOffset = computed(() => Math.round(((props.tempMin - props.tempRangeMin) / totalRange.value) * 100))
const rangeWidth  = computed(() => Math.max(6, Math.round(((props.tempMax - props.tempMin) / totalRange.value) * 100)))
</script>

<template>
  <button
    :class="[
      'w-full text-left border-b border-ink-faint/20 last:border-0 transition-all duration-150',
      'focus:outline-none',
      isExpanded ? 'bg-sky-mist rounded-[8px] border-transparent' : 'hover:bg-canvas/60 rounded-[8px]',
    ]"
    @click="isExpanded = !isExpanded"
  >
    <!-- Main row -->
    <div class="flex items-center gap-3 py-2.5 px-2">
      <span
        :class="['w-10 text-xs font-body font-medium shrink-0',
                 isToday ? 'text-signal-blue font-semibold' : 'text-ink/50']"
      >
        {{ isToday ? 'Today' : dayShort }}
      </span>

      <img
        :src="iconUrl"
        :alt="condition"
        class="w-7 h-7 object-contain shrink-0"
        loading="lazy"
      />

      <!-- Precipitation -->
      <span v-if="pop > 0.1" class="flex items-center gap-0.5 w-10 shrink-0">
        <Droplet :size="9" :stroke-width="2" class="text-rain shrink-0" />
        <span class="font-mono text-[10px] font-medium text-rain">{{ formatPop(pop) }}</span>
      </span>
      <div v-else class="w-10 shrink-0"></div>

      <!-- Temp range bar -->
      <div class="flex-1 flex items-center gap-2 min-w-0">
        <span class="text-xs font-mono font-medium text-ink/40 w-8 text-right shrink-0">
          {{ Math.round(tempMin) }}°
        </span>
        <div class="flex-1 h-1.5 bg-ink-faint/20 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            style="background: linear-gradient(90deg, #7ab3e8, #f5a623)"
            :style="{ marginLeft: `${rangeOffset}%`, width: `${rangeWidth}%` }"
          ></div>
        </div>
        <span class="text-xs font-mono font-medium text-ink w-8 shrink-0">
          {{ Math.round(tempMax) }}°
        </span>
      </div>

      <!-- Expand chevron -->
      <ChevronDown
        :size="12"
        :stroke-width="2"
        :class="['text-ink/25 transition-transform duration-200 shrink-0', isExpanded ? 'rotate-180' : '']"
      />
    </div>

    <!-- Expandable detail -->
    <Transition name="detail-slide">
      <div v-if="isExpanded" class="px-2 pb-3 pt-0">
        <div class="flex items-center gap-3 pt-2 border-t border-ink-faint/20">
          <img :src="iconUrl" :alt="condition" class="w-10 h-10 object-contain shrink-0" />
          <div>
            <p class="text-xs font-body font-medium text-ink capitalize">
              {{ condition }}
            </p>
            <p class="text-[11px] font-body text-ink/45 mt-0.5">
              {{ isToday ? 'Today · ' : '' }}{{ Math.round(tempMin) }}–{{ Math.round(tempMax) }}°{{ unit === 'metric' ? 'C' : 'F' }}
              <span v-if="pop > 0.1"> · {{ formatPop(pop) }} rain chance</span>
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </button>
</template>

<style scoped>
.detail-slide-enter-active, .detail-slide-leave-active {
  transition: all 0.18s ease;
  overflow: hidden;
}
.detail-slide-enter-from, .detail-slide-leave-to {
  opacity: 0; max-height: 0;
}
.detail-slide-enter-to, .detail-slide-leave-from {
  opacity: 1; max-height: 120px;
}
</style>
