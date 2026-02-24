<template>
  <div :class="['relative flex flex-col gap-1.5', block ? 'w-full' : '']">
    <label
      v-if="label"
      :for="inputId"
      class="text-xs font-body font-semibold text-ink-mid tracking-wide uppercase"
    >
      {{ label }}
      <span v-if="required" class="text-sky ml-0.5">*</span>
    </label>

    <div class="relative flex items-center">
      <!-- Left icon -->
      <div
        v-if="$slots.left || prefixIcon"
        class="absolute left-3.5 flex items-center pointer-events-none text-ink-soft z-10"
      >
        <slot name="left">
          <span class="text-sm">{{ prefixIcon }}</span>
        </slot>
      </div>

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :class="inputClasses"
        v-bind="$attrs"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
        @keydown.enter="$emit('enter', modelValue)"
      />

      <!-- Right slot -->
      <div v-if="$slots.right || (clearable && modelValue)" class="absolute right-3.5 flex items-center z-10">
        <slot name="right">
          <button
            v-if="clearable && modelValue"
            type="button"
            class="text-ink-faint hover:text-ink-soft transition-colors p-0.5 rounded-full"
            aria-label="Clear input"
            @click.stop="$emit('update:modelValue', ''); $emit('clear')"
          >
            ✕
          </button>
        </slot>
      </div>
    </div>

    <p
      v-if="error || hint"
      :class="['text-xs font-body', error ? 'text-red-500' : 'text-ink-soft']"
    >
      {{ error || hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  prefixIcon?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  clearable?: boolean
  block?: boolean
  autocomplete?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  clearable: false,
  block: true,
})

defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
  enter: [value: string | number | undefined]
}>()

defineOptions({ inheritAttrs: false })

const inputId = useId()

const sizeClasses = { sm: 'py-2 text-sm', md: 'py-2.5 text-sm', lg: 'py-3.5 text-base' }

const inputClasses = computed(() => {
  const hasLeft = Boolean(props.prefixIcon)
  const hasClear = props.clearable && props.modelValue

  return [
    'w-full bg-canvas-pure text-ink font-body',
    'border rounded-xl transition-all duration-150 outline-none',
    'placeholder:text-ink-faint',
    sizeClasses[props.size],
    hasLeft ? 'pl-10' : 'pl-4',
    hasClear ? 'pr-10' : 'pr-4',
    props.error
      ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]'
      : 'border-ink-faint/60 focus:border-sky focus:shadow-input-focus shadow-input',
    props.disabled ? 'opacity-50 cursor-not-allowed bg-canvas' : '',
  ]
})
</script>
