<template>
  <div class="flex items-center gap-2 bg-canvas rounded-full px-3 py-1.5 border border-ink-faint/40 shadow-card">
    <span :class="['text-xs font-body font-semibold transition-colors', !modelValue ? 'text-sky' : 'text-ink-faint']">°C</span>
    <BaseToggle
      :model-value="modelValue"
      size="sm"
      label="Toggle temperature unit"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <span :class="['text-xs font-body font-semibold transition-colors', modelValue ? 'text-sky' : 'text-ink-faint']">°F</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
