<template>
  <button type="button" role="switch" :aria-checked="modelValue" :aria-label="label" :disabled="disabled" :class="[
    'relative inline-flex shrink-0 cursor-pointer rounded-full',
    'border-2 border-transparent transition-colors duration-300 ease-in-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky/40 focus-visible:ring-offset-1',
    size === 'sm' ? 'w-8 h-4' : size === 'lg' ? 'w-14 h-7' : 'w-11 h-6',
    modelValue ? 'bg-sky' : 'bg-ink-faint',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
  ]" @click="$emit('update:modelValue', !modelValue)">
    <span class="sr-only">{{ label }}</span>
    <span :class="[
      'pointer-events-none inline-block rounded-full bg-white shadow transform transition-transform duration-300 ease-in-out',
      size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4',
      modelValue
        ? size === 'sm'
          ? 'translate-x-4'
          : size === 'lg'
            ? 'translate-x-7'
            : 'translate-x-5'
        : size === 'sm'
          ? 'translate-x-0.5'
          : size === 'lg'
            ? 'translate-x-1'
            : 'translate-x-1',
    ]" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: boolean
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), { modelValue: false, size: 'md' })
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>