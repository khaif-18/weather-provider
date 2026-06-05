<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import type { ForecastResponse, TemperatureUnit } from '~/types/weather.types'

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent])

const props = defineProps<{ data?: ForecastResponse | null; unit: TemperatureUnit }>()

const isDark = useDark()

// Palette adapts to light / dark mode
const p = computed(() => isDark.value
  ? { text: '#9490cc', line: '#4040a0', bg: '#16143a', split: '#252548', tipBg: '#1e1c44', tipBorder: '#4040a0', tipText: '#dcdaff' }
  : { text: '#6b6b6b', line: '#d0d0d0', bg: '#ffffff',  split: '#f5f5f5', tipBg: '#ffffff',  tipBorder: '#d0d0d0', tipText: '#1b1b1b'  }
)

const chartModes: Array<{ value: 'temp' | 'rain' | 'wind'; label: string }> = [
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

const items  = computed(() => props.data?.list.slice(0, 16) ?? [])
const labels = computed(() => items.value.map(i => formatTimeFromDtTxt(i.dt_txt)))

const baseStyle = computed(() => ({
  textStyle: { fontFamily: 'Inter', color: p.value.text, fontSize: 10 },
  grid: { left: 36, right: 12, top: 12, bottom: 24, containLabel: false },
  tooltip: {
    trigger: 'axis',
    backgroundColor: p.value.tipBg,
    borderColor: p.value.tipBorder,
    borderWidth: 1,
    textStyle: { color: p.value.tipText, fontFamily: 'Inter', fontSize: 12 },
    extraCssText: `box-shadow: var(--shadow-card-md); border-radius: 11px;`,
  },
  xAxis: {
    type: 'category',
    data: labels.value,
    axisLine: { lineStyle: { color: p.value.line } },
    axisLabel: { color: p.value.text, fontSize: 10 },
    splitLine: { show: false },
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisLabel: { color: p.value.text, fontSize: 10 },
    splitLine: { lineStyle: { color: p.value.split, width: 1 } },
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
        lineStyle: { color: '#2b7fff', width: 2 },
        itemStyle: { color: '#2b7fff', borderColor: p.value.bg, borderWidth: 2 },
        areaStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(43,127,255,0.12)' }, { offset: 1, color: 'rgba(43,127,255,0)' }] },
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
          color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: '#5b8db8' }, { offset: 1, color: 'rgba(91,141,184,0.3)' }] },
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
      lineStyle: { color: '#63b8a0', width: 2 },
      itemStyle: { color: '#63b8a0', borderColor: p.value.bg, borderWidth: 2 },
      areaStyle: {
        color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: 'rgba(99,184,160,0.12)' }, { offset: 1, color: 'rgba(99,184,160,0)' }] },
      },
    }],
  }
})
</script>

<template>
  <div class="card p-5">
    <div class="flex items-center justify-between mb-5">
      <h2 class="section-label">
        {{ chartModeLabel }}
      </h2>
      <div class="flex bg-canvas rounded-pill p-0.5 gap-0.5">
        <button
          v-for="mode in chartModes"
          :key="mode.value"
          :class="[
            'px-3 py-1.5 rounded-pill text-[11px] font-body font-medium transition-all duration-150',
            activeMode === mode.value
              ? 'bg-canvas-pure text-ink shadow-btn'
              : 'text-ink/45 hover:text-ink',
          ]"
          @click="activeMode = mode.value"
        >
          {{ mode.label }}
        </button>
      </div>
    </div>

    <VChart
      class="w-full"
      style="height: 200px;"
      :option="chartOption"
      autoresize
    />
  </div>
</template>
