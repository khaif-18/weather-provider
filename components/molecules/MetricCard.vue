<template>
  <div class="card p-4 sm:p-5 flex flex-col gap-1.5 min-h-[150px]">
    <!-- Header: icon + label -->
    <div class="flex items-center gap-1.5">
      <component :is="icon" :size="14" :stroke-width="1.75" class="text-ink/35 shrink-0" />
      <span class="section-label">{{ label }}</span>
    </div>

    <!-- Descriptive phrase -->
    <p v-if="phrase" class="text-sm text-ink/75 font-medium leading-snug">{{ phrase }}</p>

    <!-- Spacer pushes value/visual to the bottom (Apple-Weather rhythm) -->
    <div class="flex-1" />

    <!-- Value + visual -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  label: string
  phrase?: string
}>()
</script>
