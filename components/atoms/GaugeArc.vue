<script setup lang="ts">
const props = withDefaults(defineProps<{
  value: number
  min?: number
  max?: number
}>(), { min: 950, max: 1050 })

const cx = 60
const cy = 56
const r = 42
const startDeg = 135
const sweep = 270

function polar(deg: number) {
  const rad = (deg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arc(fromDeg: number, toDeg: number) {
  const s = polar(fromDeg)
  const e = polar(toDeg)
  const large = toDeg - fromDeg > 180 ? 1 : 0
  return `M${s.x.toFixed(2)},${s.y.toFixed(2)} A${r},${r} 0 ${large} 1 ${e.x.toFixed(2)},${e.y.toFixed(2)}`
}

const t = computed(() =>
  Math.max(0, Math.min(1, (props.value - props.min) / (props.max - props.min)))
)

const trackPath = arc(startDeg, startDeg + sweep)
const valuePath = computed(() => arc(startDeg, startDeg + sweep * t.value || startDeg + 0.01))
const knob = computed(() => polar(startDeg + sweep * t.value))
</script>

<template>
  <!-- 270° barometer gauge; center content via slot. -->
  <div class="relative mx-auto w-full" style="max-width:120px;aspect-ratio:120/104">
    <svg viewBox="0 0 120 104" class="w-full h-full text-ink">
      <!-- Track -->
      <path
        :d="trackPath"
        fill="none"
        stroke="currentColor"
        stroke-opacity="0.12"
        stroke-width="6"
        stroke-linecap="round"
      />
      <!-- Filled value arc -->
      <path
        :d="valuePath"
        fill="none"
        stroke="#2b7fff"
        stroke-width="6"
        stroke-linecap="round"
      />
      <!-- Knob -->
      <circle
        :cx="knob.x"
        :cy="knob.y"
        r="5"
        fill="#2b7fff"
        stroke="white"
        stroke-width="2"
      />
    </svg>

    <div class="absolute inset-0 flex flex-col items-center justify-center text-center pb-2">
      <slot></slot>
    </div>
  </div>
</template>
