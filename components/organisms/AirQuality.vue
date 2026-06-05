<script setup lang="ts">
const props = defineProps<{
  lat: number
  lon: number
}>()

const latRef = computed((): number | null => props.lat)
const lonRef = computed((): number | null => props.lon)

const { data: aqiData, isLoading, error } = useAirQuality(latRef, lonRef)

const aqi = computed(() => aqiData.value?.list[0]?.main.aqi ?? 1)
const meta = computed(() => getAqiMeta(aqi.value))

const aqiDescription = computed(() => {
  const descriptions = [
    'Air quality is satisfactory.',
    'Acceptable; some pollutants may affect sensitive groups.',
    'Sensitive groups may experience health effects.',
    'Health effects possible for everyone.',
    'Health alert — everyone may be affected.',
  ]
  return descriptions[aqi.value - 1] ?? ''
})

const pollutants = computed(() => {
  const c = aqiData.value?.list[0]?.components
  if (!c) return []
  return [
    { key: 'pm2_5', label: 'PM2.5', value: `${c.pm2_5.toFixed(1)} µg` },
    { key: 'pm10',  label: 'PM10',  value: `${c.pm10.toFixed(1)} µg` },
    { key: 'no2',   label: 'NO₂',   value: `${c.no2.toFixed(1)} µg` },
    { key: 'o3',    label: 'O₃',    value: `${c.o3.toFixed(1)} µg` },
  ]
})
</script>

<template>
  <div class="card p-5">
    <h2 class="section-label mb-4">
      Air Quality
    </h2>

    <!-- Loading -->
    <div v-if="isLoading" class="flex flex-col gap-2">
      <div class="skeleton-card h-8 rounded-[8px]"></div>
      <div class="skeleton-card h-6 w-2/3 rounded-[8px]"></div>
    </div>

    <!-- Error / no data -->
    <div v-else-if="error || !aqiData" class="text-sm text-ink/40 font-body py-2">
      AQI data unavailable
    </div>

    <!-- AQI display -->
    <template v-else>
      <div class="flex items-center justify-between mb-4">
        <!-- AQI number + label -->
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-card flex items-center justify-center text-white font-body font-bold text-lg shrink-0"
            :style="{ backgroundColor: meta.color }"
          >
            {{ aqi }}
          </div>
          <div>
            <p class="text-base font-body font-semibold text-ink">
              {{ meta.label }}
            </p>
            <p class="text-xs text-ink/45 font-body mt-0.5">
              {{ aqiDescription }}
            </p>
          </div>
        </div>
      </div>

      <!-- 5-segment scale bar -->
      <div class="flex gap-0.5 mb-4">
        <div
          v-for="level in 5"
          :key="level"
          :class="['flex-1 h-1.5 rounded-full transition-all duration-500',
                   level <= aqi ? '' : 'opacity-20']"
          :style="{ backgroundColor: AQI_META[level - 1]!.color }"
        ></div>
      </div>

      <!-- Key pollutants grid -->
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="p in pollutants"
          :key="p.key"
          class="flex items-center justify-between py-1.5 px-3 rounded-[8px] bg-canvas"
        >
          <span class="text-[11px] font-body text-ink/50">{{ p.label }}</span>
          <span class="text-xs font-mono font-medium text-ink">{{ p.value }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
