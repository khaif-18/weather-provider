<template>
  <BaseCard variant="default" padding="lg" rounded="2xl">
    <h2 class="text-xs font-body font-semibold text-ink-soft uppercase tracking-widest mb-1">
      Details
    </h2>

    <div class="mt-2">
      <StatItem label="Humidity" :value="data.main.humidity" unit="%" />
      <StatItem label="Wind" :value="formatWind(data.wind.speed, unit)" :unit="windDegToCompass(data.wind.deg)" />
      <StatItem label="Visibility" :value="formatVisibility(data.visibility)" />
      <StatItem label="Pressure" :value="data.main.pressure" unit="hPa" />
      <StatItem label="Cloud cover" :value="data.clouds.all" unit="%" />
      <StatItem v-if="data.wind.gust" label="Gust" :value="formatWind(data.wind.gust!, unit)" />
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { CurrentWeatherResponse, TemperatureUnit } from '~/types/weather.types'
defineProps<{ data: CurrentWeatherResponse; unit: TemperatureUnit }>()
</script>
