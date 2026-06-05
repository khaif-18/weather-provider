<script setup lang="ts">
defineProps<{ deg: number }>()
</script>

<template>
  <!-- Ring compass with a direction arrow; center content via slot.
       Uses currentColor so it adapts to dark mode. -->
  <div class="relative mx-auto w-full" style="max-width:116px;aspect-ratio:1">
    <svg viewBox="0 0 120 120" class="w-full h-full text-ink">
      <circle
        cx="60"
        cy="60"
        r="52"
        fill="none"
        stroke="currentColor"
        stroke-width="4"
        opacity="0.08"
      />

      <!-- Cardinal labels -->
      <text
        x="60"
        y="16"
        text-anchor="middle"
        font-size="9"
        font-weight="700"
        fill="#e5484d"
        font-family="Inter,sans-serif"
      >N</text>
      <text
        x="60"
        y="111"
        text-anchor="middle"
        font-size="8"
        fill="currentColor"
        opacity="0.4"
        font-family="Inter,sans-serif"
      >S</text>
      <text
        x="109"
        y="63"
        text-anchor="middle"
        font-size="8"
        fill="currentColor"
        opacity="0.4"
        font-family="Inter,sans-serif"
      >E</text>
      <text
        x="11"
        y="63"
        text-anchor="middle"
        font-size="8"
        fill="currentColor"
        opacity="0.4"
        font-family="Inter,sans-serif"
      >W</text>

      <!-- Intercardinal labels -->
      <text
        x="92"
        y="31"
        text-anchor="middle"
        font-size="7"
        fill="currentColor"
        opacity="0.3"
        font-family="Inter,sans-serif"
      >NE</text>
      <text
        x="92"
        y="95"
        text-anchor="middle"
        font-size="7"
        fill="currentColor"
        opacity="0.3"
        font-family="Inter,sans-serif"
      >SE</text>
      <text
        x="28"
        y="95"
        text-anchor="middle"
        font-size="7"
        fill="currentColor"
        opacity="0.3"
        font-family="Inter,sans-serif"
      >SW</text>
      <text
        x="28"
        y="31"
        text-anchor="middle"
        font-size="7"
        fill="currentColor"
        opacity="0.3"
        font-family="Inter,sans-serif"
      >NW</text>

      <!-- Direction arrow (points from the bearing the wind blows FROM) -->
      <g :style="{ transform: `rotate(${deg}deg)`, transformOrigin: '60px 60px', transition: 'transform 0.9s cubic-bezier(0.34,1.56,0.64,1)' }">
        <path d="M60,22 L65,33 L60,29 L55,33 Z" fill="#2b7fff" />
      </g>
    </svg>

    <!-- Center value -->
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
      <slot></slot>
    </div>
  </div>
</template>
