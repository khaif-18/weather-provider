<script setup lang="ts">
import { useShare, useClipboard } from '@vueuse/core'
import { MapPin, Wind, Droplets, Eye, Sunrise, Sunset, RefreshCw, Share2, Check } from 'lucide-vue-next'
import type { CurrentWeatherResponse, TemperatureUnit } from '~/types/weather.types'

const props = defineProps<{
  data: CurrentWeatherResponse
  unit: TemperatureUnit
  minutesAgo?: number | null
  refetching?: boolean
}>()

defineEmits<{ refresh: [] }>()

// ── Share current weather (native share API, clipboard fallback) ──
const { share, isSupported: shareSupported } = useShare()
const { copy } = useClipboard()
const shareDone = ref(false)

const shareText = computed(() =>
  `${props.data.name} — ${Math.round(props.data.main.temp)}°${props.unit === 'metric' ? 'C' : 'F'}, `
  + `${capitalize(props.data.weather[0]?.description ?? '')}. `
  + `Feels like ${formatTemp(props.data.main.feels_like, props.unit)}.`
)

const shareTitle = computed(() =>
  shareSupported.value ? 'Share weather' : (shareDone.value ? 'Copied!' : 'Copy weather')
)

async function shareWeather() {
  const url = typeof window !== 'undefined' ? window.location.href : 'https://kaether.netlify.app'
  if (shareSupported.value) {
    try { await share({ title: 'Kaether Weather', text: shareText.value, url }) }
    catch { /* user dismissed the share sheet */ }
  }
  else {
    await copy(`${shareText.value} ${url}`)
    shareDone.value = true
    setTimeout(() => { shareDone.value = false }, 2000)
  }
}

const unitSymbol  = computed(() => props.unit === 'metric' ? 'C' : 'F')
const cityName    = computed(() => props.data.name)
const country     = computed(() => props.data.sys.country)
const temp        = computed(() => props.data.main.temp)
const feelsLike   = computed(() => props.data.main.feels_like)
const tempMax     = computed(() => props.data.main.temp_max)
const tempMin     = computed(() => props.data.main.temp_min)
const description = computed(() => capitalize(props.data.weather[0]?.description ?? ''))
const iconUrl     = computed(() => getWeatherIconUrl(props.data.weather[0]?.icon ?? '01d', '4x'))

const currentDate = computed(() =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
)

const sunriseTime = computed(() => formatTime(props.data.sys.sunrise, props.data.timezone))
const sunsetTime  = computed(() => formatTime(props.data.sys.sunset, props.data.timezone))

const dayProgress = computed(() => {
  const now = Date.now() / 1000
  const { sunrise, sunset } = props.data.sys
  if (now < sunrise) return 0
  if (now > sunset)  return 100
  return Math.round(((now - sunrise) / (sunset - sunrise)) * 100)
})

const dayProgressLabel = computed(() => {
  if (dayProgress.value === 0) return 'Before sunrise'
  if (dayProgress.value === 100) return 'After sunset'
  return `${100 - dayProgress.value}% of daylight remaining`
})
</script>

<template>
  <div class="card p-6 md:p-8 animate-fade-up">
    <!-- Location + date -->
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-2">
        <MapPin :size="14" :stroke-width="2" class="text-ink/40 shrink-0" />
        <span class="font-body font-semibold text-sm text-ink">{{ cityName }}</span>
        <span
          v-if="country"
          class="text-[11px] font-medium text-ink/50 bg-canvas px-2 rounded-pill leading-none"
          style="padding-top:3px;padding-bottom:3px"
        >{{ country }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-ink/40 font-body">{{ currentDate }}</span>
        <button
          class="text-ink/35 hover:text-signal-blue transition-colors p-1 -mr-1 rounded shrink-0"
          :title="shareTitle"
          @click="shareWeather"
        >
          <component :is="shareDone ? Check : Share2" :size="14" :stroke-width="1.875" />
        </button>
      </div>
    </div>

    <!-- Temp + condition -->
    <div class="flex items-start justify-between gap-4">
      <div class="flex flex-col gap-3">
        <div class="flex items-start gap-1">
          <span
            class="font-body font-semibold text-ink leading-none tracking-tight"
            style="font-size:clamp(4.5rem,11vw,7rem);letter-spacing:-0.04em"
          >{{ Math.round(temp) }}</span>
          <span class="text-xl md:text-2xl font-medium text-ink/40 mt-3">°{{ unitSymbol }}</span>
        </div>

        <p class="font-cursive font-bold text-xl md:text-2xl text-dusk-blue leading-tight">
          {{ description }}
        </p>

        <div class="flex flex-wrap gap-x-3 gap-y-1 text-sm font-body">
          <span class="text-ink/50">Feels like <span class="text-ink font-medium">{{ formatTemp(feelsLike, unit) }}</span></span>
          <span class="text-ink/30">·</span>
          <span class="text-ink/50">H <span class="font-semibold" style="color:#c27c3a">{{ formatTemp(tempMax, unit) }}</span></span>
          <span class="text-ink/30">·</span>
          <span class="text-ink/50">L <span class="font-semibold text-dusk-blue">{{ formatTemp(tempMin, unit) }}</span></span>
        </div>

        <!-- Condition chips -->
        <div class="flex flex-wrap gap-2 mt-1">
          <span v-if="data.wind.speed > 5" class="pill bg-canvas border border-ink-faint/20 text-[11px] text-ink/60">
            <Wind :size="10" :stroke-width="2" class="shrink-0" />
            {{ formatWind(data.wind.speed, unit) }} {{ windDegToCompass(data.wind.deg) }}
          </span>
          <span v-if="data.main.humidity > 70" class="pill bg-canvas border border-ink-faint/20 text-[11px] text-ink/60">
            <Droplets :size="10" :stroke-width="2" class="shrink-0" />
            {{ data.main.humidity }}% humidity
          </span>
          <span v-if="data.visibility < 5000" class="pill bg-canvas border border-ink-faint/20 text-[11px] text-ink/60">
            <Eye :size="10" :stroke-width="2" class="shrink-0" />
            Low visibility
          </span>
        </div>
      </div>

      <img
        :src="iconUrl"
        :alt="description"
        class="w-24 h-24 md:w-32 md:h-32 object-contain animate-float shrink-0"
        style="filter:drop-shadow(0 8px 24px rgba(66,97,136,0.25))"
      />
    </div>

    <!-- Sunrise / Sunset -->
    <div class="mt-6 pt-5 border-t border-ink-faint/20">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1.5 shrink-0">
          <Sunrise :size="14" :stroke-width="1.75" class="text-ink/35" />
          <span class="text-xs font-mono text-ink/50">{{ sunriseTime }}</span>
        </div>
        <div class="flex-1 relative h-1.5 bg-ink-faint/20 rounded-full overflow-hidden">
          <div
            class="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
            style="background:linear-gradient(90deg,#f5a623,#7ab3e8)"
            :style="{ width: `${dayProgress}%` }"
          ></div>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <span class="text-xs font-mono text-ink/50">{{ sunsetTime }}</span>
          <Sunset :size="14" :stroke-width="1.75" class="text-ink/35" />
        </div>
      </div>

      <!-- Refresh footer -->
      <div class="flex items-center justify-between mt-3">
        <p class="text-[10px] text-ink/30 font-body">
          {{ dayProgressLabel }}
        </p>
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-ink/30 font-body">
            {{ minutesAgo !== null ? (minutesAgo === 0 ? 'Just updated' : `Updated ${minutesAgo}m ago`) : '' }}
          </span>
          <button
            class="flex items-center gap-1 text-[11px] text-ink/40 hover:text-signal-blue transition-colors font-body font-medium disabled:opacity-50"
            :disabled="refetching"
            @click="$emit('refresh')"
          >
            <RefreshCw :size="11" :stroke-width="2" :class="refetching ? 'animate-spin' : ''" />
            <span>{{ refetching ? 'Updating…' : 'Refresh' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
