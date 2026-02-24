<template>
  <div :class="['relative flex flex-col gap-1.5', block ? 'w-full' : '']">
    <label
      v-if="label"
      :for="selectId"
      class="text-xs font-body font-semibold text-ink-mid tracking-wide uppercase"
    >
      {{ label }}
    </label>

    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :class="[
          'w-full appearance-none bg-canvas-pure text-ink font-body',
          'border border-ink-faint/60 rounded-xl pl-4 pr-10 outline-none',
          'transition-all duration-150 cursor-pointer shadow-input',
          'focus:border-sky focus:shadow-input-focus',
          size === 'sm' ? 'py-2 text-sm' : size === 'lg' ? 'py-3.5 text-base' : 'py-2.5 text-sm',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
        ]"
        v-bind="$attrs"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option v-if="placeholder" value="" disabled :selected="!modelValue">{{ placeholder }}</option>
        <slot />
      </select>

      <div class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-soft">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <p v-if="hint" class="text-xs text-ink-soft font-body">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  hint?: string
  disabled?: boolean
  block?: boolean
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), { block: true, size: 'md' })
defineEmits<{ 'update:modelValue': [value: string] }>()
defineOptions({ inheritAttrs: false })

const selectId = useId()
</script>
