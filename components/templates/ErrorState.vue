<template>
  <div class="flex flex-col items-center justify-center min-h-[50vh] gap-6 text-center px-4 animate-fade-up">
    <div class="w-20 h-20 rounded-3xl bg-canvas border border-ink-faint/40 shadow-card-md flex items-center justify-center text-4xl">
      {{ icon }}
    </div>
    <div class="space-y-2">
      <h2 class="font-display font-bold text-xl text-ink">{{ title }}</h2>
      <p class="text-ink-soft text-sm font-body max-w-xs">{{ message }}</p>
    </div>
    <BaseButton v-if="action" variant="primary" @click="$emit('action')">
      {{ action }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  message?: string
  icon?: string
  action?: string
}>(), {
  title:   'Something went wrong',
  message: 'We couldn\'t load the weather data. Please try again.',
  icon:    '⛅',
})

defineEmits<{ action: [] }>()
</script>
