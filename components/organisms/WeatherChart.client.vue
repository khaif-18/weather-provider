<template>
  <BaseCard variant="default" padding="lg" rounded="2xl">
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-xs font-body font-semibold text-ink-soft uppercase tracking-widest">
        {{ chartModeLabel }}
      </h2>
      <div class="flex bg-canvas rounded-xl p-1 border border-ink-faint/30">
        <button v-for="mode in chartModes" :key="mode.value" :class="[
          'px-3 py-1.5 rounded-lg text-xs font-body font-semibold transition-all duration-150',
          activeMode === mode.value
            ? 'bg-canvas-pure text-sky shadow-card'
            : 'text-ink-soft hover:text-ink',
        ]" @click="activeMode = mode.value">
          {{ mode.label }}
        </button>
      </div>
    </div>

    <v-chart class="w-full" style="height: 200px;" :option="chartOption" autoresize />
  </BaseCard>
</template>

<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import type { ForecastResponse, TemperatureUnit } from '~/types/weather.types'

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent])

const props = defineProps<{
  data?: ForecastResponse | null
  unit: TemperatureUnit
}>()

const chartModes: Array<{ value: 'temp' | 'rain' | 'wind', label: string }> = [
  { value: 'temp', label: 'Temp' },
  { value: 'rain', label: 'Rain' },
  { value: 'wind', label: 'Wind' },
]
const activeMode = ref<'temp' | 'rain' | 'wind'>('temp')

const chartModeLabel = computed(() => ({
  temp: 'Temperature Trend',
  rain: 'Precipitation Chance',
  wind: 'Wind Speed',
}[activeMode.value]))

const items = computed(() => props.data?.list.slice(0, 16) ?? [])
const labels = computed(() => items.value.map(i => formatTimeFromDtTxt(i.dt_txt)))

// Shared base styling — clean, minimal, no dark bg
const baseStyle = computed(() => ({
  textStyle: { fontFamily: 'Plus Jakarta Sans', color: '#8A91A3', fontSize: 10 },
  grid: { left: 36, right: 12, top: 12, bottom: 24, containLabel: false },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#FFFFFF',
    borderColor: '#E4E7EF',
    borderWidth: 1,
    textStyle: { color: '#1A1F2E', fontFamily: 'Plus Jakarta Sans', fontSize: 12 },
    extraCssText: 'box-shadow: 0 4px 16px rgba(26,31,46,0.1); border-radius: 12px;',
  },
  xAxis: {
    type: 'category',
    data: labels.value,
    axisLine: { lineStyle: { color: '#E4E7EF' } },
    axisLabel: { color: '#8A91A3', fontSize: 10 },
    splitLine: { show: false },
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisLabel: { color: '#8A91A3', fontSize: 10 },
    splitLine: { lineStyle: { color: '#F0F2F6', width: 1 } },
  },
}))

const chartOption = computed(() => {
  if (activeMode.value === 'temp') {
    return {
      ...baseStyle.value,
      series: [{
        name: `Temp (°${props.unit === 'metric' ? 'C' : 'F'})`,
        type: 'line',
        data: items.value.map(i => Math.round(i.main.temp)),
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { color: '#4A90D9', width: 2 },
        itemStyle: { color: '#4A90D9', borderColor: '#fff', borderWidth: 2 },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(74,144,217,0.15)' },
              { offset: 1, color: 'rgba(74,144,217,0)' },
            ],
          },
        },
      }],
    }
  }

  if (activeMode.value === 'rain') {
    return {
      ...baseStyle.value,
      series: [{
        name: 'Precipitation %',
        type: 'bar',
        data: items.value.map(i => Math.round(i.pop * 100)),
        barMaxWidth: 14,
        itemStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#5B8DB8' },
              { offset: 1, color: 'rgba(91,141,184,0.3)' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
      }],
    }
  }

  return {
    ...baseStyle.value,
    series: [{
      name: 'Wind m/s',
      type: 'line',
      data: items.value.map(i => +(i.wind.speed).toFixed(1)),
      smooth: true,
      lineStyle: { color: '#63B8A0', width: 2 },
      itemStyle: { color: '#63B8A0', borderColor: '#fff', borderWidth: 2 },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(99,184,160,0.15)' },
            { offset: 1, color: 'rgba(99,184,160,0)' },
          ],
        },
      },
    }],
  }
})
</script>
