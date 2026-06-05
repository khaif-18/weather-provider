<template>
  <div class="grid grid-cols-2 gap-3">

    <!-- Humidity -->
    <MetricCard :icon="Droplets" label="Humidity" :phrase="humidityPhraseText">
      <p class="text-3xl font-semibold text-ink leading-none mb-3">{{ humidity }}%</p>
      <div class="h-2 rounded-full bg-ink-faint/20 overflow-hidden">
        <div class="h-full rounded-full transition-all duration-700"
          style="background:linear-gradient(90deg,#7ab3e8,#2b7fff)"
          :style="{ width: `${humidity}%` }" />
      </div>
    </MetricCard>

    <!-- Dew point -->
    <MetricCard :icon="Thermometer" label="Dew point" :phrase="dewPhraseText">
      <p class="text-4xl font-semibold text-ink leading-none">{{ dewDisplay }}°</p>
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
      <p class="text-3xl font-semibold text-ink leading-none">{{ visibilityText }}</p>
    </MetricCard>

    <!-- Moon -->
    <MetricCard :icon="Moon" label="Moon" :phrase="moon.name">
      <div class="flex items-center gap-3">
        <MoonDisc :phase="moon.fraction" :size="46" />
        <div>
          <p class="text-2xl font-semibold text-ink leading-none">{{ illumPct }}%</p>
          <p class="text-[10px] text-ink/50 mt-1">illuminated</p>
        </div>
      </div>
    </MetricCard>
  </div>
</template>

<script setup lang="ts">
import { Droplets, Wind, Thermometer, Gauge, Eye, Moon } from 'lucide-vue-next'
import MetricCard from '~/components/molecules/MetricCard.vue'
import WindCompass from '~/components/atoms/WindCompass.vue'
import GaugeArc from '~/components/atoms/GaugeArc.vue'
import MoonDisc from '~/components/atoms/MoonDisc.vue'
import type { CurrentWeatherResponse, TemperatureUnit } from '~/types/weather.types'

const props = defineProps<{ data: CurrentWeatherResponse; unit: TemperatureUnit }>()

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
</script>
