<template>
  <span :class="classes"><slot /></span>
</template>

<script setup lang="ts">
type BadgeVariant = 'sky' | 'sun' | 'rain' | 'snow' | 'success' | 'danger' | 'neutral'

interface Props {
  variant?: BadgeVariant
  size?: 'xs' | 'sm' | 'md'
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'sky',
  size: 'sm',
  rounded: true,
})

const variantClasses: Record<BadgeVariant, string> = {
  sky:     'bg-sky-pale text-sky border border-sky/20',
  sun:     'bg-sun-pale text-sun border border-sun/20',
  rain:    'bg-rain-pale text-rain border border-rain/20',
  snow:    'bg-snow-pale text-snow border border-snow/20',
  success: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  danger:  'bg-red-50 text-red-600 border border-red-200',
  neutral: 'bg-canvas text-ink-soft border border-ink-faint/60',
}

const sizeClasses = {
  xs: 'text-[10px] px-1.5 py-0.5',
  sm: 'text-xs px-2.5 py-1',
  md: 'text-sm px-3 py-1.5',
}

const classes = computed(() => [
  'inline-flex items-center gap-1 font-body font-semibold',
  props.rounded ? 'rounded-full' : 'rounded-lg',
  variantClasses[props.variant],
  sizeClasses[props.size],
])
</script>
