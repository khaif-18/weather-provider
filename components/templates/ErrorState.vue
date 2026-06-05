<template>
  <div class="flex flex-col items-center justify-center min-h-[50vh] gap-6 text-center px-4 animate-fade-up">
    <div class="w-20 h-20 rounded-card bg-canvas-pure shadow-card flex items-center justify-center">
      <component :is="icon ?? CloudOff" :size="36" :stroke-width="1.5" class="text-ink/25" />
    </div>
    <div class="space-y-2">
      <h2 class="font-body font-semibold text-xl text-white">{{ title }}</h2>
      <p class="text-white/60 text-sm font-body max-w-xs">{{ message }}</p>
    </div>
    <button v-if="action" class="btn-filled" @click="$emit('action')">{{ action }}</button>
  </div>
</template>

<script setup lang="ts">
import { CloudOff } from 'lucide-vue-next'
import type { Component } from 'vue'

withDefaults(defineProps<{
  title?: string
  message?: string
  icon?: Component
  action?: string
}>(), {
  title:   'Something went wrong',
  message: 'We couldn\'t load the weather data. Please try again.',
})

defineEmits<{ action: [] }>()
</script>
