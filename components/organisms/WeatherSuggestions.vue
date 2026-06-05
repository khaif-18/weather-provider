<script setup lang="ts">
import {
  Layers, Umbrella, Snowflake, Sun, Eye, Zap,
  Activity, Droplets, Wind, CloudOff, Info, Thermometer,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import type { CurrentWeatherResponse, TemperatureUnit } from '~/types/weather.types'

const props = defineProps<{ data: CurrentWeatherResponse; unit: TemperatureUnit }>()

const SUGGESTION_ICONS: Record<string, Component> = {
  'heavy-coat':   Layers,
  'warm-coat':    Layers,
  'jacket':       Layers,
  'light-clothes':Layers,
  'storm':        Zap,
  'umbrella':     Umbrella,
  'snow-gear':    Snowflake,
  'sunglasses':   Eye,
  'sunscreen':    Sun,
  'outdoor':      Activity,
  'hydration':    Droplets,
  'humid':        Thermometer,
  'wind-strong':  Wind,
  'fog':          CloudOff,
}

const suggestions = computed(() => getWeatherSuggestions(props.data, props.unit))
</script>

<template>
  <div
    v-if="suggestions.length"
    v-motion
    class="card p-5"
    :initial="{ opacity: 0, y: 18 }"
    :visible-once="{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24, delay: 120 } }"
  >
    <h2 class="section-label mb-3">
      Today's Tips
    </h2>

    <div class="grid grid-cols-2 gap-2">
      <div
        v-for="(s, i) in suggestions"
        :key="s.id"
        v-motion
        class="flex items-center gap-2.5 bg-canvas rounded-[8px] px-3 py-2.5"
        :initial="{ opacity: 0, scale: 0.92 }"
        :visible-once="{
          opacity: 1, scale: 1,
          transition: { type: 'spring', stiffness: 350, damping: 22, delay: 80 + i * 60 }
        }"
      >
        <component
          :is="SUGGESTION_ICONS[s.id] ?? Info"
          :size="15"
          :stroke-width="1.75"
          class="text-dusk-blue shrink-0"
        />
        <p class="text-[12px] font-body font-medium text-ink/75 leading-tight">
          {{ s.text }}
        </p>
      </div>
    </div>
  </div>
</template>
