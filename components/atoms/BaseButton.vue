<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :disabled="disabled || loading"
    :class="classes"
    v-bind="$attrs"
    @click="!disabled && !loading && $emit('click', $event)"
  >
    <BaseSpinner v-if="loading" :size="spinnerSize" class="shrink-0" />
    <span v-if="iconLeft && !loading" class="shrink-0" aria-hidden="true">{{ iconLeft }}</span>
    <span v-if="$slots.default" :class="{ 'sr-only': iconOnly }"><slot /></span>
    <span v-if="iconRight && !loading" class="shrink-0" aria-hidden="true">{{ iconRight }}</span>
  </component>
</template>

<script setup lang="ts">
import type { Variant, Size } from '~/types/app.types'

interface Props {
  variant?: Variant
  size?: Size
  type?: 'button' | 'submit' | 'reset'
  tag?: 'button' | 'a' | 'nuxt-link'
  disabled?: boolean
  loading?: boolean
  iconLeft?: string
  iconRight?: string
  iconOnly?: boolean
  block?: boolean
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  tag: 'button',
})

defineEmits<{ click: [event: MouseEvent] }>()

const sizeClasses: Record<Size, string> = {
  xs: 'text-xs px-2.5 py-1.5 gap-1',
  sm: 'text-xs px-3.5 py-2 gap-1.5 tracking-wide',
  md: 'text-sm px-5 py-2.5 gap-2',
  lg: 'text-sm px-6 py-3 gap-2',
  xl: 'text-base px-8 py-4 gap-2.5',
}

const iconOnlySizeClasses: Record<Size, string> = {
  xs: 'p-1.5',
  sm: 'p-2',
  md: 'p-2.5',
  lg: 'p-3',
  xl: 'p-4',
}

const variantClasses: Record<Variant, string> = {
  primary: `
    bg-sky text-white font-semibold shadow-btn
    hover:bg-sky-light hover:shadow-sky
    active:bg-sky/90 active:shadow-none
    disabled:opacity-40 disabled:shadow-none
  `,
  secondary: `
    bg-canvas border border-ink-faint/60 text-ink-mid font-medium shadow-card
    hover:border-sky/40 hover:text-sky hover:bg-sky-mist
    active:bg-sky-pale
    disabled:opacity-40
  `,
  ghost: `
    bg-transparent text-ink-soft font-medium
    hover:bg-canvas hover:text-ink
    active:bg-ink-faint/20
    disabled:opacity-40
  `,
  danger: `
    bg-red-50 text-red-600 border border-red-200 font-medium
    hover:bg-red-100 hover:border-red-300
    disabled:opacity-40
  `,
  frost: `
    bg-sky-pale text-sky border border-sky/30 font-medium
    hover:bg-sky-mist hover:border-sky/50
    active:bg-sky-pale
    disabled:opacity-40
  `,
}

const spinnerSize = computed(() =>
  props.size === 'xs' || props.size === 'sm' ? 'xs' : 'sm'
)

const classes = computed(() => [
  'inline-flex items-center justify-center font-body transition-all duration-150',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky/40 focus-visible:ring-offset-1',
  'cursor-pointer select-none',
  props.rounded ? 'rounded-full' : 'rounded-xl',
  props.block ? 'w-full' : '',
  props.iconOnly ? iconOnlySizeClasses[props.size] : sizeClasses[props.size],
  variantClasses[props.variant],
  (props.disabled || props.loading) ? 'cursor-not-allowed' : '',
])
</script>
