<template>
  <div class="card p-5">
    <h2 class="section-label mb-4">Details</h2>

    <div>
      <StatItem :icon="Droplets" label="Humidity"
        :value="`${data.main.humidity}%`"
        :sub="humidityLabel(data.main.humidity)" />

      <!-- Wind row: value + live compass -->
      <div class="stat-row">
        <div class="flex items-center gap-2.5">
          <span class="w-5 flex items-center justify-center text-ink/35 shrink-0">
            <Wind :size="15" :stroke-width="1.75" />
          </span>
          <span class="text-sm text-ink/60 font-body">Wind</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right">
            <p class="text-sm font-body font-semibold text-ink">{{ formatWind(data.wind.speed, unit) }}</p>
            <p class="text-[11px] text-ink/40">{{ windDegToCompass(data.wind.deg) }}</p>
          </div>
          <WindCompass :deg="data.wind.deg" />
        </div>
      </div>

      <StatItem v-if="data.wind.gust" :icon="Zap" label="Gust"
        :value="formatWind(data.wind.gust!, unit)" />

      <StatItem :icon="Gauge" label="Pressure"
        :value="`${data.main.pressure}`" sub="hPa" />

      <StatItem :icon="Eye" label="Visibility"
        :value="formatVisibility(data.visibility)" />

      <StatItem :icon="Cloud" label="Cloud cover"
        :value="`${data.clouds.all}%`" />

      <!-- UV Index (estimated) -->
      <div class="stat-row">
        <div class="flex items-center gap-2.5">
          <span class="w-5 flex items-center justify-center text-ink/35 shrink-0">
            <Sun :size="15" :stroke-width="1.75" />
          </span>
          <span class="text-sm text-ink/60 font-body">UV Index</span>
        </div>
        <div class="flex items-center gap-2">
          <div
            class="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-mono font-bold shrink-0"
            :style="{ backgroundColor: uvMeta.color }"
          >{{ Math.round(uvi) }}</div>
          <span class="text-sm font-body font-semibold text-ink">{{ uvMeta.level }}</span>
        </div>
      </div>
    </div>

    <!-- UV advice (when non-trivial) -->
    <p v-if="uvi >= 3" class="mt-2 text-[11px] font-body text-ink/45 leading-snug pl-7">
      {{ uvMeta.advice }}
    </p>

    <!-- Moon phase -->
    <div class="mt-4 pt-4 border-t border-ink-faint/20">
      <h2 class="section-label mb-3">Moon</h2>
      <button
        class="w-full flex items-center justify-between group cursor-default"
        :title="`${moonPhase.name} — ${Math.round(moonPhase.fraction * 100)}% of cycle`"
      >
        <div class="flex items-center gap-2.5">
          <MoonStar :size="15" :stroke-width="1.75" class="text-ink/35 shrink-0" />
          <div>
            <p class="text-sm font-body font-medium text-ink">{{ moonPhase.name }}</p>
            <p class="text-[11px] font-body text-ink/40 mt-0.5">
              {{ Math.round(moonPhase.fraction * 100) }}% of cycle
            </p>
          </div>
        </div>
        <!-- Phase progress pill -->
        <div class="flex items-center gap-2">
          <!-- Phase cycle progress bar -->
          <div class="w-14 h-1.5 bg-canvas rounded-full overflow-hidden">
            <div class="h-full rounded-full bg-dusk-blue/60 transition-all duration-700"
              :style="{ width: `${Math.round(moonPhase.fraction * 100)}%` }" />
          </div>
        </div>
      </button>
    </div>

    <!-- Comfort index -->
    <div class="mt-4 pt-4 border-t border-ink-faint/20">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <Thermometer :size="15" :stroke-width="1.75" class="text-ink/35 shrink-0" />
          <div>
            <p class="section-label">Comfort</p>
            <p class="text-sm font-body font-semibold text-ink mt-0.5">{{ comfortLabel }}</p>
          </div>
        </div>
        <!-- Score ring -->
        <div class="relative w-10 h-10 shrink-0">
          <svg viewBox="0 0 40 40" class="w-full h-full -rotate-90">
            <circle cx="20" cy="20" r="16" fill="none" class="stroke-canvas" stroke-width="4" />
            <circle cx="20" cy="20" r="16" fill="none" :stroke="comfortColor" stroke-width="4"
              stroke-linecap="round"
              :stroke-dasharray="`${comfortScore} 100`"
              style="transition: stroke-dasharray 0.8s ease-out"
              pathLength="100" />
          </svg>
          <span class="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-semibold text-ink">
            {{ comfortScore }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Droplets, Wind, Zap, Gauge, Eye, Cloud, MoonStar, Thermometer, Sun } from 'lucide-vue-next'
import type { CurrentWeatherResponse, TemperatureUnit } from '~/types/weather.types'

const props = defineProps<{
  data: CurrentWeatherResponse
  unit: TemperatureUnit
}>()

const uvi     = computed(() => estimateUVI(props.data.clouds.all, props.data.weather[0]?.id ?? 800, props.data.sys.sunrise, props.data.sys.sunset))
const uvMeta  = computed(() => getUVMeta(uvi.value))

const moonPhase = computed(() => {
  const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime()
  const lunationMs   = 29.530588853 * 24 * 60 * 60 * 1000
  const fraction     = ((Date.now() - knownNewMoon) % lunationMs + lunationMs) % lunationMs / lunationMs

  const phases = [
    { range: [0, 0.0625],      name: 'New Moon'         },
    { range: [0.0625, 0.1875], name: 'Waxing Crescent'  },
    { range: [0.1875, 0.3125], name: 'First Quarter'    },
    { range: [0.3125, 0.4375], name: 'Waxing Gibbous'   },
    { range: [0.4375, 0.5625], name: 'Full Moon'        },
    { range: [0.5625, 0.6875], name: 'Waning Gibbous'   },
    { range: [0.6875, 0.8125], name: 'Last Quarter'     },
    { range: [0.8125, 1.0],    name: 'Waning Crescent'  },
  ] as const

  const phase = phases.find(p => fraction >= p.range[0] && fraction < p.range[1]) ?? phases[0]!
  return { ...phase, fraction }
})

const comfortScore = computed(() => {
  const tempC = props.unit === 'imperial'
    ? (props.data.main.temp - 32) * 5 / 9
    : props.data.main.temp
  const humidity = props.data.main.humidity
  const wind     = props.data.wind.speed

  let score = 100
  if (tempC < 10)      score -= (10 - tempC) * 4
  if (tempC > 30)      score -= (tempC - 30) * 4
  if (humidity > 75)   score -= (humidity - 75) * 1.5
  if (humidity < 25)   score -= (25 - humidity) * 1.5
  if (wind > 10)       score -= (wind - 10) * 2
  return Math.max(5, Math.min(100, Math.round(score)))
})

const comfortLabel = computed(() => {
  const s = comfortScore.value
  if (s >= 80) return 'Very Comfortable'
  if (s >= 60) return 'Comfortable'
  if (s >= 40) return 'Moderate'
  if (s >= 20) return 'Uncomfortable'
  return 'Harsh'
})

const comfortColor = computed(() => {
  const s = comfortScore.value
  if (s >= 80) return '#00b050'
  if (s >= 60) return '#92d050'
  if (s >= 40) return '#ffc000'
  if (s >= 20) return '#ff6b35'
  return '#c00000'
})
</script>
