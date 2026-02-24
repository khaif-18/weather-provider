<template>
  <BaseCard variant="default" padding="none" rounded="2xl" class="overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-4 border-b border-ink-faint/30">
      <h2 class="text-xs font-body font-semibold text-ink-soft uppercase tracking-widest">Weather Map</h2>
      <div class="flex bg-canvas rounded-xl p-1 border border-ink-faint/30">
        <button
          v-for="layer in layers"
          :key="layer.value"
          :class="[
            'px-2.5 py-1 rounded-lg text-xs font-body font-semibold transition-all duration-150',
            activeLayer === layer.value
              ? 'bg-canvas-pure text-sky shadow-card'
              : 'text-ink-soft hover:text-ink',
          ]"
          @click="setLayer(layer.value)"
        >
          {{ layer.label }}
        </button>
      </div>
    </div>

    <div ref="mapEl" class="w-full h-60 md:h-72 z-0" />
  </BaseCard>
</template>

<script setup lang="ts">
import L from 'leaflet'

const props = defineProps<{ lat: number; lon: number; city: string }>()

const mapEl = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let weatherLayer: L.TileLayer | null = null
let marker: L.Marker | null = null

const config = useRuntimeConfig()
const apiKey = config.public.openWeatherApiKey

const layers = [
  { value: 'temp_new',          label: 'Temp' },
  { value: 'precipitation_new', label: 'Rain' },
  { value: 'wind_new',          label: 'Wind' },
  { value: 'clouds_new',        label: 'Cloud' },
]
const activeLayer = ref('temp_new')

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

  // Light Carto tile — matches our clean airy theme
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map)

  weatherLayer = L.tileLayer(getLayerUrl(activeLayer.value), { opacity: 0.5 }).addTo(map)

  // Clean blue dot marker
  const icon = L.divIcon({
    html: `<div style="width:12px;height:12px;background:#4A90D9;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 8px rgba(74,144,217,0.4)"></div>`,
    className: '',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  })

  marker = L.marker([props.lat, props.lon], { icon })
    .addTo(map)
    .bindPopup(`<strong style="font-family:Plus Jakarta Sans">${props.city}</strong>`)

  L.control.zoom({ position: 'bottomright' }).addTo(map)
})

watch([() => props.lat, () => props.lon], ([lat, lon]) => {
  if (!map) return
  map.setView([lat, lon], 8)
  marker?.setLatLng([lat, lon])
  marker?.setPopupContent(`<strong style="font-family:Plus Jakarta Sans">${props.city}</strong>`)
})

onUnmounted(() => { map?.remove() })
</script>
