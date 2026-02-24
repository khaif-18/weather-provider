<template>
  <option
    :value="value"
    :disabled="disabled"
    :selected="selected"
    class="bg-sky-deep text-frost-pale"
  >
    <slot>{{ label }}</slot>
  </option>
</template>

<script setup lang="ts">
interface Props {
  value: string | number
  label?: string
  disabled?: boolean
  selected?: boolean
}

defineProps<Props>()
</script>
