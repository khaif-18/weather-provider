<template>
  <div class="stat-row">
    <div class="flex items-center gap-2.5">
      <span class="text-base w-5 text-center" aria-hidden="true">{{ icon }}</span>
      <span class="text-sm text-ink-soft font-body">{{ label }}</span>
    </div>
    <div class="flex items-baseline gap-1 text-right">
      <span class="text-sm font-body font-semibold text-ink">{{ value }}</span>
      <span v-if="unit" class="text-xs text-ink-soft">{{ unit }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string
  label: string
  value: string | number
  unit?: string
}>()
</script>
