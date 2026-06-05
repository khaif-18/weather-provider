<script setup lang="ts">
const props = withDefaults(defineProps<{
  phase: number   // 0..1 lunar cycle fraction
  size?: number
}>(), { size: 44 })

const R = 17
const clipId = `moon-${Math.random().toString(36).slice(2, 8)}`

const shadowPath = computed(() => {
  const p = props.phase
  const cos = Math.cos(2 * Math.PI * p)
  const rx = Math.abs(cos) * R
  const waxing = p < 0.5

  // Limb = the fully-dark side; terminator = the curved ellipse boundary.
  const sweepLimb = waxing ? 0 : 1
  const sweepTerm = waxing ? (cos > 0 ? 0 : 1) : (cos > 0 ? 1 : 0)

  return `M20,${20 - R} A${R},${R} 0 0 ${sweepLimb} 20,${20 + R} A${rx.toFixed(2)},${R} 0 0 ${sweepTerm} 20,${20 - R} Z`
})
</script>

<template>
  <!-- Moon disc rendered from lunar-cycle fraction (0=new … 0.5=full). -->
  <svg
    viewBox="0 0 40 40"
    :width="size"
    :height="size"
    class="shrink-0"
  >
    <defs>
      <clipPath :id="clipId">
        <circle cx="20" cy="20" :r="R" />
      </clipPath>
    </defs>
    <!-- Lit base -->
    <circle
      cx="20"
      cy="20"
      :r="R"
      fill="#e9e7ff"
    />
    <!-- Shadow overlay -->
    <path :d="shadowPath" fill="#2a2a44" :clip-path="`url(#${clipId})`" />
    <!-- Rim -->
    <circle
      cx="20"
      cy="20"
      :r="R"
      fill="none"
      stroke="currentColor"
      stroke-opacity="0.15"
      stroke-width="1"
      class="text-ink"
    />
  </svg>
</template>
