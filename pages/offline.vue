<script setup lang="ts">
import { WifiOff, Sun, CloudRain, CloudLightning, Snowflake, Cloud } from 'lucide-vue-next'

useSeoMeta({
  title: 'Offline · Kaether',
  description: 'You are currently offline.',
})
</script>

<template>
  <WeatherLayout>
    <div class="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div class="relative mb-8 select-none">
        <span class="font-body font-bold text-[clamp(6rem,20vw,12rem)] leading-none text-white/10 tracking-tighter">
          Offline
        </span>
        <div class="absolute inset-0 flex items-center justify-center">
          <WifiOff :stroke-width="1" class="text-white/40 animate-float" style="width:clamp(3rem,8vw,5rem);height:clamp(3rem,8vw,5rem)" />
        </div>
      </div>

      <div class="flex flex-col gap-3 mb-8 max-w-sm">
        <h1 class="font-body font-bold text-2xl md:text-3xl text-white">
          No Connection
        </h1>
        <p class="font-body text-white/60 text-sm md:text-base leading-relaxed">
          You appear to be offline. Check your connection and try again.
        </p>
      </div>

      <button class="btn-filled" @click="navigateTo('/')">
        Try Again
      </button>

      <div class="flex items-center gap-8 mt-16 text-white/20 select-none">
        <Sun
          :size="28"
          :stroke-width="1"
          class="animate-float"
          style="animation-delay:0s"
        />
        <Cloud
          :size="28"
          :stroke-width="1"
          class="animate-float"
          style="animation-delay:0.4s"
        />
        <CloudRain
          :size="28"
          :stroke-width="1"
          class="animate-float"
          style="animation-delay:0.8s"
        />
        <Snowflake
          :size="28"
          :stroke-width="1"
          class="animate-float"
          style="animation-delay:1.2s"
        />
        <CloudLightning
          :size="28"
          :stroke-width="1"
          class="animate-float"
          style="animation-delay:1.6s"
        />
      </div>
    </div>
  </WeatherLayout>
</template>
