<template>
  <div :class="['relative overflow-hidden rounded-3xl transition-all duration-700', meta.heroBg]">

    <!-- Subtle dot-grid texture overlay -->
    <div class="absolute inset-0 dot-grid opacity-[0.04]" />

    <!-- Decorative large circle blur -->
    <div
      :class="['absolute -top-16 -right-16 w-72 h-72 rounded-full blur-3xl opacity-30 transition-colors duration-700', conditionCircle]" />

    <div class="relative z-10 p-7 md:p-10">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-8">

        <!-- Left: Location + Temp -->
        <div class="flex flex-col gap-5 animate-fade-up">
          <!-- Location pill -->
          <div class="flex items-center gap-3">
            <div
              class="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/80 shadow-card">
              <span class="text-xs">📍</span>
              <span class="font-body font-semibold text-sm text-ink">{{ cityName }}</span>
              <span v-if="country" class="text-ink-soft text-xs font-body">{{ country }}</span>
            </div>
            <BaseBadge variant="neutral" size="xs">{{ currentDate }}</BaseBadge>
          </div>

          <!-- Giant temperature -->
          <div class="flex items-start">
            <span class="temp-hero text-ink">{{ Math.round(temp) }}</span>
            <div class="flex flex-col ml-3 mt-5">
              <span class="text-3xl font-display font-semibold text-ink/60">°{{ unitSymbol }}</span>
            </div>
          </div>

          <!-- Condition + feels like -->
          <div class="flex flex-col gap-1">
            <p class="font-display italic text-lg text-ink-mid">{{ description }}</p>
            <p class="text-sm text-ink-soft font-body">
              Feels like
              <span class="font-semibold text-ink-mid">{{ formatTemp(feelsLike, unit) }}</span>
              · High <span class="text-sun font-semibold">{{ formatTemp(tempMax, unit) }}</span>
              · Low <span class="text-sky font-semibold">{{ formatTemp(tempMin, unit) }}</span>
            </p>
          </div>
        </div>

        <!-- Right: Weather icon -->
        <div class="flex flex-col items-center gap-4 animate-scale-in">
          <img :src="iconUrl" :alt="description" class="w-32 h-32 md:w-40 md:h-40 object-contain animate-float"
            style="filter: drop-shadow(0 8px 24px rgba(74,144,217,0.2))" />
        </div>
      </div>

      <!-- Sunrise / Sunset strip -->
      <div class="mt-8 pt-5 border-t border-ink/8">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5">
            <span class="text-sm">Sunrise:</span>
            <span class="text-xs font-mono text-ink-mid font-medium">{{ sunriseTime }}</span>
          </div>

          <!-- Day progress bar -->
          <div class="flex-1 flex items-center gap-1.5">
            <div class="flex-1 h-1 bg-ink/10 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-sun/70 to-sky rounded-full transition-all duration-1000"
                :style="{ width: `${dayProgress}%` }" />
            </div>
            <!-- Sun position indicator -->
            <span class="text-base transition-all duration-1000"
              :style="{ marginLeft: `calc(${dayProgress}% - 12px)`, position: 'relative' }">
              {{ dayProgress > 50 ? '🌇' : '☀️' }}
            </span>
          </div>

          <div class="flex items-center gap-1.5">
            <span class="text-xs font-mono text-ink-mid font-medium">{{ sunsetTime }}</span>
            <span class="text-sm">🌇</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CurrentWeatherResponse, TemperatureUnit } from '~/types/weather.types'

const props = defineProps<{
  data: CurrentWeatherResponse
  unit: TemperatureUnit
}>()

const unitSymbol = computed(() => props.unit === 'metric' ? 'C' : 'F')
const cityName = computed(() => props.data.name)
const country = computed(() => props.data.sys.country)
const temp = computed(() => props.data.main.temp)
const feelsLike = computed(() => props.data.main.feels_like)
const tempMax = computed(() => props.data.main.temp_max)
const tempMin = computed(() => props.data.main.temp_min)
const description = computed(() => capitalize(props.data.weather[0]?.description ?? ''))
const icon = computed(() => props.data.weather[0]?.icon ?? '01d')
const conditionCode = computed(() => props.data.weather[0]?.id ?? 800)
const meta = computed(() => getConditionMeta(conditionCode.value))
const iconUrl = computed(() => getWeatherIconUrl(icon.value, '4x'))

// Decorative circle color based on condition
const conditionCircle = computed(() => ({
  thunderstorm: 'bg-storm',
  drizzle: 'bg-rain',
  rain: 'bg-rain',
  snow: 'bg-snow',
  atmosphere: 'bg-ink-faint',
  clear: 'bg-sun',
  clouds: 'bg-sky-light',
  unknown: 'bg-sky',
}[meta.value.group]))

const currentDate = computed(() =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
)

const sunriseTime = computed(() => formatTime(props.data.sys.sunrise, props.data.timezone))
const sunsetTime = computed(() => formatTime(props.data.sys.sunset, props.data.timezone))

const dayProgress = computed(() => {
  const now = Date.now() / 1000
  const { sunrise, sunset } = props.data.sys
  if (now < sunrise) return 0
  if (now > sunset) return 100
  return Math.round(((now - sunrise) / (sunset - sunrise)) * 100)
})
</script>
