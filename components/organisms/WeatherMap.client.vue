<template>
  <div class="card overflow-hidden">
    <div class="flex items-center justify-between px-5 py-4 border-b border-ink-faint/20">
      <h2 class="section-label">
        Weather Map
      </h2>
      <div class="flex bg-canvas rounded-pill p-0.5 gap-0.5">
        <button
          v-for="layer in layers"
          :key="layer.value"
          :class="[
            'px-2.5 py-1 rounded-pill text-[11px] font-body font-medium transition-all duration-150',
            activeLayer === layer.value
              ? 'bg-canvas-pure text-ink shadow-btn'
              : 'text-ink/45 hover:text-ink',
          ]"
          @click="setLayer(layer.value)"
        >
          {{ layer.label }}
        </button>
      </div>
    </div>
    <div ref="mapEl" class="w-full h-64 md:h-80 z-0" />
  </div>
</template>

<script setup lang="ts">
import { useDark } from '@vueuse/core'
import L from 'leaflet'

const props = defineProps<{ lat: number; lon: number; city: string }>()

const isDark  = useDark()
const mapEl   = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let baseTile: L.TileLayer | null = null
let weatherLayer: L.TileLayer | null = null
let marker: L.Marker | null = null

const config = useRuntimeConfig()
const apiKey = config.public.openWeatherApiKey

const layers = [
  { value: 'temp_new',          label: 'Temp'  },
  { value: 'precipitation_new', label: 'Rain'  },
  { value: 'wind_new',          label: 'Wind'  },
  { value: 'clouds_new',        label: 'Cloud' },
]
const activeLayer = ref('temp_new')

function baseTileUrl(dark: boolean) {
  return dark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
}

function getLayerUrl(layer: string) {
  return `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${apiKey}`
}

function setLayer(layer: string) {
  activeLayer.value = layer
  if (!map) return
  weatherLayer?.remove()
  weatherLayer = L.tileLayer(getLayerUrl(layer), { opacity: 0.5 }).addTo(map)
}

onMounted(() => {
  if (!mapEl.value) return

  map = L.map(mapEl.value, { zoomControl: false }).setView([props.lat, props.lon], 8)

  baseTile = L.tileLayer(baseTileUrl(isDark.value), {
    attribution: '© OpenStreetMap © CARTO', subdomains: 'abcd', maxZoom: 19,
  }).addTo(map)

  weatherLayer = L.tileLayer(getLayerUrl(activeLayer.value), { opacity: 0.5 }).addTo(map)

  const icon = L.divIcon({
    html: `<div style="width:12px;height:12px;background:#2b7fff;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 8px rgba(43,127,255,0.35)"></div>`,
    className: '', iconSize: [12, 12], iconAnchor: [6, 6],
  })

  marker = L.marker([props.lat, props.lon], { icon })
    .addTo(map)
    .bindPopup(`<strong style="font-family:Inter,sans-serif;font-size:13px">${props.city}</strong>`)

  L.control.zoom({ position: 'bottomright' }).addTo(map)
})

// Swap tile layer when dark mode toggles
watch(isDark, (dark) => {
  if (!map) return
  baseTile?.remove()
  baseTile = L.tileLayer(baseTileUrl(dark), {
    attribution: '© OpenStreetMap © CARTO', subdomains: 'abcd', maxZoom: 19,
  }).addTo(map)
  // Re-add weather layer on top
  weatherLayer?.addTo(map)
})

watch([() => props.lat, () => props.lon], ([lat, lon]) => {
  if (!map) return
  map.setView([lat, lon], 8)
  marker?.setLatLng([lat, lon])
  marker?.setPopupContent(`<strong style="font-family:Inter,sans-serif;font-size:13px">${props.city}</strong>`)
})

onUnmounted(() => { map?.remove() })
</script>
