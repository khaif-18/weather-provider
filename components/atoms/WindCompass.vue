<template>
  <!-- SVG uses currentColor so it adapts to dark mode via parent text-ink class -->
  <svg viewBox="0 0 48 48" width="38" height="38" class="overflow-visible text-ink shrink-0">
    <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.08" />
    <line v-for="a in [0,90,180,270]" :key="a"
      :transform="`rotate(${a} 24 24)`"
      x1="24" y1="4" x2="24" y2="8"
      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.15" />
    <text x="24" y="3"   text-anchor="middle" dominant-baseline="auto"   font-size="5.5" fill="currentColor" opacity="0.45" font-family="Inter,sans-serif" font-weight="600">N</text>
    <text x="24" y="47"  text-anchor="middle" dominant-baseline="auto"   font-size="5.5" fill="currentColor" opacity="0.25" font-family="Inter,sans-serif" font-weight="500">S</text>
    <text x="2"  y="25"  text-anchor="start"  dominant-baseline="middle" font-size="5.5" fill="currentColor" opacity="0.25" font-family="Inter,sans-serif" font-weight="500">W</text>
    <text x="46" y="25"  text-anchor="end"    dominant-baseline="middle" font-size="5.5" fill="currentColor" opacity="0.25" font-family="Inter,sans-serif" font-weight="500">E</text>
    <g :style="{ transform: `rotate(${deg}deg)`, transformOrigin: '24px 24px', transition: 'transform 0.9s cubic-bezier(0.34,1.56,0.64,1)' }">
      <line x1="24" y1="24" x2="24" y2="35" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.18" />
      <line x1="24" y1="24" x2="24" y2="12" stroke="#2b7fff" stroke-width="2.5" stroke-linecap="round" />
      <polygon points="24,7 21,13 27,13" fill="#2b7fff" />
    </g>
    <circle cx="24" cy="24" r="2.5" fill="currentColor" opacity="0.25" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{ deg: number }>()
</script>
