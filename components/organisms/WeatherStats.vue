<script setup lang="ts">
import { Droplets, Wind, Thermometer, Gauge, Eye, Moon, Flower2, Waves, ArrowUp, ArrowDown, Minus } from 'lucide-vue-next'
import MetricCard from '~/components/molecules/MetricCard.vue'
import WindCompass from '~/components/atoms/WindCompass.vue'
import GaugeArc from '~/components/atoms/GaugeArc.vue'
import MoonDisc from '~/components/atoms/MoonDisc.vue'
import type { CurrentWeatherResponse, TemperatureUnit } from '~/types/weather.types'

const props = defineProps<{ data: CurrentWeatherResponse; unit: TemperatureUnit }>()

// Coordinates drive the Open-Meteo pollen + marine queries.
const lat = computed((): number | null => props.data.coord.lat)
const lon = computed((): number | null => props.data.coord.lon)

// ── Humidity ──────────────────────────────────────────────────────
const humidity = computed(() => props.data.main.humidity)
const humidityPhraseText = computed(() => humidityPhrase(humidity.value))

// ── Dew point ─────────────────────────────────────────────────────
const tempC = computed(() => toCelsius(props.data.main.temp, props.unit))
const dewC = computed(() => dewPointC(tempC.value, humidity.value))
const dewDisplay = computed(() =>
  Math.round(props.unit === 'imperial' ? dewC.value * 9 / 5 + 32 : dewC.value)
)
const dewPhraseText = computed(() => dewPhrase(dewC.value))

// ── Wind ──────────────────────────────────────────────────────────
const windDeg = computed(() => props.data.wind.deg)
const windValue = computed(() => Math.round(props.data.wind.speed))
const windUnit = computed(() => (props.unit === 'metric' ? 'm/s' : 'mph'))
const windDir = computed(() => windDegToCompass(props.data.wind.deg))
const windPhraseText = computed(() => windPhrase(windToKmh(props.data.wind.speed, props.unit)))

// ── Pressure ──────────────────────────────────────────────────────
const pressure = computed(() => props.data.main.pressure)
const pressurePhraseText = computed(() => pressurePhrase(pressure.value))

// ── Visibility ────────────────────────────────────────────────────
const visibilityText = computed(() => formatVisibility(props.data.visibility))
const visibilityPhraseText = computed(() => visibilityPhrase(props.data.visibility))

// ── Moon ──────────────────────────────────────────────────────────
const moon = computed(() => getMoonInfo())
const illumPct = computed(() => Math.round(moon.value.illumination * 100))

// ── Pollen (Open-Meteo) ───────────────────────────────────────────
const { data: pollenData, isLoading: pollenLoading } = usePollen(lat, lon)
const pollen = computed(() => summarizePollen(pollenData.value?.current))

// ── Tide / waves (Open-Meteo Marine) ──────────────────────────────
const { data: marineData, isLoading: marineLoading } = useMarine(lat, lon)
const tide = computed(() => summarizeMarine(marineData.value))
const tideLevel = computed(() => `${tide.value.level >= 0 ? '+' : ''}${tide.value.level.toFixed(1)}`)
const tideTrendLabel = computed(() =>
  tide.value.trend === 'rising' ? 'Tide rising' : tide.value.trend === 'falling' ? 'Tide falling' : 'Tide steady'
)
const tideTrendIcon = computed(() =>
  tide.value.trend === 'rising' ? ArrowUp : tide.value.trend === 'falling' ? ArrowDown : Minus
)
</script>

<template>
  <div class="grid grid-cols-2 gap-3">
    <!-- Humidity -->
    <MetricCard :icon="Droplets" label="Humidity" :phrase="humidityPhraseText">
      <p class="text-3xl font-semibold text-ink leading-none mb-3">
        {{ humidity }}%
      </p>
      <div class="h-2 rounded-full bg-ink-faint/20 overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-700"
          style="background:linear-gradient(90deg,#7ab3e8,#2b7fff)"
          :style="{ width: `${humidity}%` }"
        ></div>
      </div>
    </MetricCard>

    <!-- Dew point -->
    <MetricCard :icon="Thermometer" label="Dew point" :phrase="dewPhraseText">
      <p class="text-4xl font-semibold text-ink leading-none">
        {{ dewDisplay }}°
      </p>
    </MetricCard>

    <!-- Wind -->
    <MetricCard :icon="Wind" label="Wind" :phrase="windPhraseText">
      <WindCompass :deg="windDeg">
        <span class="text-xl font-semibold text-ink leading-none">{{ windValue }}</span>
        <span class="text-[10px] text-ink/50 mt-0.5">{{ windUnit }}</span>
        <span class="text-[10px] text-ink/40 font-medium mt-1">{{ windDir }}</span>
      </WindCompass>
    </MetricCard>

    <!-- Pressure -->
    <MetricCard :icon="Gauge" label="Pressure" :phrase="pressurePhraseText">
      <GaugeArc :value="pressure">
        <span class="text-lg font-semibold text-ink leading-none">{{ pressure }}</span>
        <span class="text-[10px] text-ink/50">hPa</span>
      </GaugeArc>
    </MetricCard>

    <!-- Visibility -->
    <MetricCard :icon="Eye" label="Visibility" :phrase="visibilityPhraseText">
      <p class="text-3xl font-semibold text-ink leading-none">
        {{ visibilityText }}
      </p>
    </MetricCard>

    <!-- Moon -->
    <MetricCard :icon="Moon" label="Moon" :phrase="moon.name">
      <div class="flex items-center gap-3">
        <MoonDisc :phase="moon.fraction" :size="46" />
        <div>
          <p class="text-2xl font-semibold text-ink leading-none">
            {{ illumPct }}%
          </p>
          <p class="text-[10px] text-ink/50 mt-1">
            illuminated
          </p>
        </div>
      </div>
    </MetricCard>

    <!-- Pollen (Open-Meteo, Europe-only coverage) -->
    <MetricCard :icon="Flower2" label="Pollen" :phrase="pollen.available ? `${pollen.dominant} dominant` : undefined">
      <p v-if="pollenLoading" class="text-2xl font-semibold text-ink/25 leading-none">
        …
      </p>
      <template v-else-if="pollen.available">
        <p class="text-3xl font-semibold text-ink leading-none mb-3">
          {{ pollen.level }}
        </p>
        <div class="h-2 rounded-full bg-ink-faint/20 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-700"
            :style="{ width: `${pollen.pct}%`, backgroundColor: pollen.color }"
          ></div>
        </div>
      </template>
      <p v-else class="text-sm font-medium text-ink/35 leading-snug">
        Not available<br />for this area
      </p>
    </MetricCard>

    <!-- Tide / waves (Open-Meteo Marine, coastal only) -->
    <MetricCard :icon="Waves" label="Tide" :phrase="tide.available ? tideTrendLabel : undefined">
      <p v-if="marineLoading" class="text-2xl font-semibold text-ink/25 leading-none">
        …
      </p>
      <template v-else-if="tide.available">
        <div class="flex items-baseline gap-1">
          <component
            :is="tideTrendIcon"
            :size="20"
            :stroke-width="2.25"
            class="text-signal-blue shrink-0 self-center"
          />
          <p class="text-3xl font-semibold text-ink leading-none">
            {{ tideLevel }}
          </p>
          <span class="text-sm text-ink/50">m</span>
        </div>
        <p v-if="tide.waveHeight != null" class="text-[11px] text-ink/45 mt-2">
          Waves {{ tide.waveHeight.toFixed(1) }} m
        </p>
      </template>
      <p v-else class="text-sm font-medium text-ink/35 leading-snug">
        No coastal<br />data here
      </p>
    </MetricCard>
  </div>
</template>
