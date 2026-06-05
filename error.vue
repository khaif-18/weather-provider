<script setup lang="ts">
import {
  CloudOff, Lock, KeyRound, Clock, CloudLightning, Cloud, AlertCircle,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError | null }>()

const isDev       = import.meta.dev
const statusCode  = computed(() => props.error?.statusCode ?? 500)

const errorIcon = computed((): Component => {
  const code = statusCode.value
  if (code === 404)           return CloudOff
  if (code === 403)           return Lock
  if (code === 401)           return KeyRound
  if (code === 408 || code === 504) return Clock
  if (code >= 500)            return CloudLightning
  return AlertCircle
})

const errorTitle = computed(() => {
  const code = statusCode.value
  if (code === 404) return 'Page Not Found'
  if (code === 403) return 'Access Forbidden'
  if (code === 401) return 'Unauthorized'
  if (code === 408 || code === 504) return 'Request Timed Out'
  if (code === 500) return 'Server Error'
  if (code === 503) return 'Service Unavailable'
  return 'Something Went Wrong'
})

const errorMessage = computed(() => {
  const code = statusCode.value
  if (code === 404) return "The page you're looking for doesn't exist or has been moved."
  if (code === 403) return "You don't have permission to access this page."
  if (code === 401) return 'You need to be logged in to view this page.'
  if (code === 408 || code === 504) return 'The request took too long. Check your connection and try again.'
  if (code === 500) return 'An unexpected server error occurred.'
  if (code === 503) return 'The service is temporarily unavailable. Please try again.'
  return 'An unexpected error occurred. Please try refreshing the page.'
})

function handleError() { clearError({ redirect: '/' }) }
</script>

<template>
  <div class="min-h-dvh font-body flex flex-col" style="background:linear-gradient(180deg,#8a7bc2 0%,#b29fc8 35%,#d4b8a0 70%,#d4a578 100%);background-attachment:fixed">

    <!-- Minimal header -->
    <header class="px-6 py-4">
      <NuxtLink to="/" class="inline-flex items-center gap-2 w-fit">
        <span class="font-cursive font-bold text-[26px] text-white leading-none">Kaether</span>
      </NuxtLink>
    </header>

    <main class="flex-1 flex flex-col items-center justify-center px-4 text-center">

      <div class="relative mb-8 select-none">
        <span class="font-body font-bold leading-none text-white/10 tracking-tighter"
          style="font-size:clamp(5rem,18vw,10rem)">
          {{ statusCode }}
        </span>
        <div class="absolute inset-0 flex items-center justify-center">
          <component :is="errorIcon" :stroke-width="1" class="text-white/40 animate-float"
            style="width:clamp(3rem,8vw,5rem);height:clamp(3rem,8vw,5rem)" />
        </div>
      </div>

      <div class="flex flex-col gap-3 mb-8 max-w-md">
        <h1 class="font-body font-bold text-2xl md:text-3xl text-white">{{ errorTitle }}</h1>
        <p class="text-white/60 text-sm md:text-base leading-relaxed">{{ errorMessage }}</p>

        <details v-if="isDev && error?.message" class="mt-2 text-left">
          <summary class="text-xs text-white/40 cursor-pointer font-mono hover:text-white/60 transition-colors">
            Show error details
          </summary>
          <pre class="mt-2 p-3 bg-black/20 rounded-[8px] text-xs text-white/70 font-mono overflow-auto text-left whitespace-pre-wrap">{{ error?.message }}</pre>
        </details>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-3">
        <button class="btn-filled" @click="handleError">Try Again</button>
        <NuxtLink to="/" class="btn-ghost">Back to Home</NuxtLink>
      </div>
    </main>

    <footer class="px-6 py-4 text-center">
      <span class="text-xs text-white/30 font-body">If this keeps happening, please refresh the page.</span>
    </footer>
  </div>
</template>
