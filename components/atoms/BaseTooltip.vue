<template>
  <div class="relative inline-flex group" v-bind="$attrs">
    <slot />
    <div
      v-if="text"
      :class="[
        'absolute z-50 pointer-events-none whitespace-nowrap',
        'px-3 py-1.5 rounded-lg text-xs font-body font-medium',
        'bg-ink text-white shadow-card-md',
        'opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-300',
        positionClasses,
      ]"
    >
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), { position: 'top' })
defineOptions({ inheritAttrs: false })

const positionClasses = computed(() => ({
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  right:  'left-full top-1/2 -translate-y-1/2 ml-2',
}[props.position]))
</script>
