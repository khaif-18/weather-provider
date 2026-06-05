<template>
  <div class="stat-row">
    <div class="flex items-center gap-2.5">
      <span class="w-5 flex items-center justify-center text-ink/35 shrink-0">
        <component :is="icon" v-if="icon" :size="15" :stroke-width="1.75" />
      </span>
      <span class="text-sm text-ink/60 font-body">{{ label }}</span>
    </div>
    <div class="flex items-center gap-2 text-right">
      <span class="text-sm font-body font-semibold text-ink">{{ value }}</span>
      <span v-if="sub" class="text-[11px] text-ink/40 font-body">{{ sub }}</span>
      <slot name="extra" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
defineProps<{
  icon?: Component
  label: string
  value: string | number
  sub?: string
}>()
</script>
