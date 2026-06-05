<script setup lang="ts">
import {
  Zap, Thermometer, Sun, Snowflake, Wind, CloudOff, AlertTriangle, X,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import type { WeatherAlertData } from '~/utils/weatherAlerts'

const props = defineProps<{ alerts: WeatherAlertData[] }>()

const ALERT_ICONS: Record<string, Component> = {
  'thunderstorm':  Zap,
  'extreme-heat':  Thermometer,
  'heat':          Sun,
  'frost':         Snowflake,
  'high-wind':     Wind,
  'wind':          Wind,
  'dense-fog':     CloudOff,
}

const dismissed = ref<Set<string>>(new Set())
const visibleAlerts = computed(() => props.alerts.filter(a => !dismissed.value.has(a.id)))

function dismiss(id: string) {
  dismissed.value = new Set([...dismissed.value, id])
}

watch(() => props.alerts.map(a => a.id).join(','), () => { dismissed.value = new Set() })

const styles = SEVERITY_STYLES
</script>

<template>
  <TransitionGroup name="alert" tag="div" class="flex flex-col gap-2 mb-4">
    <div
      v-for="alert in visibleAlerts"
      :key="alert.id"
      v-motion
      :class="[
        'flex items-start gap-3 px-4 py-3 rounded-card border text-sm font-body',
        styles[alert.severity].bg,
        styles[alert.severity].border,
        styles[alert.severity].text,
      ]"
      :initial="{ opacity: 0, y: -12, scale: 0.97 }"
      :enter="{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 28 } }"
    >
      <!-- Severity icon -->
      <component
        :is="ALERT_ICONS[alert.id] ?? AlertTriangle"
        :size="16"
        :stroke-width="1.75"
        :class="['shrink-0 mt-0.5', styles[alert.severity].icon]"
      />

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <p class="font-semibold leading-none mb-1">
          {{ alert.title }}
        </p>
        <p class="text-[12px] opacity-80 leading-snug">
          {{ alert.message }}
        </p>
      </div>

      <!-- Dismiss -->
      <button
        :class="['shrink-0 p-1 rounded-full opacity-40 hover:opacity-80 transition-opacity',
                 styles[alert.severity].text]"
        @click="dismiss(alert.id)"
      >
        <X :size="13" :stroke-width="2" />
      </button>
    </div>
  </TransitionGroup>
</template>

<style scoped>
.alert-enter-active { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
.alert-leave-active { transition: all 0.18s ease; }
.alert-enter-from, .alert-leave-to { opacity: 0; transform: translateY(-8px) scale(0.97); }
</style>
