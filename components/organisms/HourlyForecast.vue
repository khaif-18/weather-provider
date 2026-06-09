<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { ForecastResponse, TemperatureUnit } from '~/types/weather.types'

const props = defineProps<{ data?: ForecastResponse | null; unit: TemperatureUnit; loading?: boolean }>()

const selectedIndex = ref<number | null>(null)

const hours = computed(() => {
  if (!props.data) return []
  return props.data.list.slice(0, 12).map((item, i) => ({
    dt:        item.dt,
    timeLabel: formatTimeFromDtTxt(item.dt_txt),
    icon:      item.weather[0]?.icon ?? '01d',
    condition: item.weather[0]?.description ?? '',
    temp:      item.main.temp,
    feelsLike: item.main.feels_like,
    humidity:  item.main.humidity,
    pop:       item.pop,
    windSpeed: item.wind.speed,
    windDeg:   item.wind.deg,
    // Actual precipitation volume (rain + snow combined)
    precipMm:  (item.rain?.['3h'] ?? 0) + (item.snow?.['3h'] ?? 0),
    isNow:     i === 0,
  }))
})

const selectedHour = computed(() =>
  selectedIndex.value !== null ? hours.value[selectedIndex.value] : null
)

function toggleDetail(i: number) {
  selectedIndex.value = selectedIndex.value === i ? null : i
}

watch(() => props.data, () => { selectedIndex.value = null })
</script>

<template>
  <div class="card p-5">
    <h2 class="section-label mb-4">
      Hourly Forecast
    </h2>

    <div v-if="loading" class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      <div v-for="i in 8" :key="i" class="skeleton-card w-16 h-24 rounded-[8px] shrink-0"></div>
    </div>

    <div v-else-if="hours.length">
      <!-- Scrollable hour pills -->
      <div class="relative">
        <div class="flex gap-1 overflow-x-auto no-scrollbar pb-1 stagger">
          <HourlyItem
            v-for="(hour, i) in hours"
            :key="hour.dt"
            :time-label="hour.timeLabel"
            :icon="hour.icon"
            :condition="hour.condition"
            :temp="hour.temp"
            :feels-like="hour.feelsLike"
            :pop="hour.pop"
            :unit="unit"
            :is-now="hour.isNow"
            :is-selected="selectedIndex === i"
            class="shrink-0"
            @click="toggleDetail(i)"
          />
        </div>
        <div class="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-canvas-pure to-transparent pointer-events-none rounded-r-card"></div>
      </div>

      <!-- Expandable detail strip -->
      <Transition name="detail-expand">
        <div
          v-if="selectedIndex !== null && selectedHour"
          class="mt-3 pt-3 border-t border-ink-faint/20"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <p class="text-xs font-body font-semibold text-signal-blue">
                {{ selectedHour.isNow ? 'Right Now' : selectedHour.timeLabel }}
              </p>
              <p class="text-sm font-body text-ink/70 mt-0.5 capitalize">
                {{ selectedHour.condition }}
              </p>
            </div>
            <button class="text-ink/25 hover:text-ink/60 transition-colors text-base leading-none p-1" @click="selectedIndex = null">
              <X :size="14" :stroke-width="2" />
            </button>
          </div>

          <!-- Stats grid -->
          <div :class="['grid gap-2', selectedHour.precipMm > 0 ? 'grid-cols-4' : 'grid-cols-3']">
            <div class="flex flex-col gap-1 bg-canvas rounded-[8px] px-3 py-2.5">
              <span class="text-[10px] font-body text-ink/40 uppercase tracking-wide">Feels like</span>
              <span class="text-sm font-body font-semibold text-ink">{{ formatTemp(selectedHour.feelsLike, unit) }}</span>
            </div>
            <div class="flex flex-col gap-1 bg-canvas rounded-[8px] px-3 py-2.5">
              <span class="text-[10px] font-body text-ink/40 uppercase tracking-wide">Wind</span>
              <span class="text-sm font-body font-semibold text-ink">
                {{ formatWind(selectedHour.windSpeed, unit) }}
                <span class="text-[11px] font-normal text-ink/50">{{ windDegToCompass(selectedHour.windDeg) }}</span>
              </span>
            </div>
            <div class="flex flex-col gap-1 bg-canvas rounded-[8px] px-3 py-2.5">
              <span class="text-[10px] font-body text-ink/40 uppercase tracking-wide">Humidity</span>
              <span class="text-sm font-body font-semibold text-ink">{{ selectedHour.humidity }}%</span>
            </div>
            <!-- Precipitation volume (shown only when > 0) -->
            <div v-if="selectedHour.precipMm > 0" class="flex flex-col gap-1 bg-canvas rounded-[8px] px-3 py-2.5">
              <span class="text-[10px] font-body text-ink/40 uppercase tracking-wide">Precip.</span>
              <span class="text-sm font-body font-semibold text-ink">{{ selectedHour.precipMm.toFixed(1) }} mm</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.detail-expand-enter-active, .detail-expand-leave-active {
  transition: all 0.22s ease;
  overflow: hidden;
}
.detail-expand-enter-from, .detail-expand-leave-to {
  opacity: 0; max-height: 0; margin-top: 0; padding-top: 0;
}
.detail-expand-enter-to, .detail-expand-leave-from {
  opacity: 1; max-height: 200px;
}
</style>
