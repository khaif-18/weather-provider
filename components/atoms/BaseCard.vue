<template>
  <div :class="classes" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'flat' | 'sky' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'xl' | '2xl' | '3xl'
  hoverable?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  rounded: '2xl',
})

const variantClasses = {
  default: 'bg-canvas-pure border border-ink-faint/30 shadow-card',
  flat:    'bg-canvas border border-ink-faint/20',
  sky:     'bg-sky-mist border border-sky/20',
  ghost:   'bg-transparent border border-ink-faint/30',
}

const paddingClasses = {
  none: '',
  sm:   'p-3',
  md:   'p-5',
  lg:   'p-6',
  xl:   'p-7 md:p-8',
}

const roundedClasses = {
  xl:   'rounded-xl',
  '2xl':'rounded-2xl',
  '3xl':'rounded-3xl',
}

const classes = computed(() => [
  'relative transition-all duration-200',
  variantClasses[props.variant],
  paddingClasses[props.padding],
  roundedClasses[props.rounded],
  props.hoverable ? 'hover:shadow-card-md hover:border-sky/30' : '',
  props.clickable ? 'cursor-pointer active:scale-[0.99]' : '',
])
</script>
