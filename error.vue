<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError | null
}>()

const isDev = import.meta.dev

const statusCode = computed(() => props.error?.statusCode ?? 500)

const errorIcon = computed(() => {
  const code = statusCode.value
  if (code === 404) return '🌫️'
  if (code === 403) return '🔒'
  if (code === 401) return '🔑'
  if (code === 408 || code === 504) return '⏱️'
  if (code >= 500) return '⛈️'
  return '⛅'
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
  if (code === 408 || code === 504) return 'The request took too long. Please check your connection and try again.'
  if (code === 500) return 'An unexpected server error occurred. Our team has been notified.'
  if (code === 503) return 'The service is temporarily unavailable. Please try again in a moment.'
  return 'An unexpected error occurred. Please try refreshing the page.'
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-dvh bg-canvas font-body flex flex-col">
    <!-- Minimal header without search (error state) -->
    <header class="bg-canvas-pure/90 backdrop-blur-md border-b border-ink-faint/30 px-6 py-4">
      <NuxtLink to="/" class="flex items-center gap-2 w-fit">
        <span class="text-xl">🌤️</span>
        <span class="font-display font-bold text-lg text-ink">Aether</span>
      </NuxtLink>
    </header>

    <!-- Error content -->
    <main class="flex-1 flex flex-col items-center justify-center px-4 text-center">
      <!-- Error code display -->
      <div class="relative mb-8 select-none">
        <span class="font-display font-bold leading-none text-ink-faint/25 tracking-tighter"
          style="font-size: clamp(5rem, 18vw, 10rem)">
          {{ statusCode }}
        </span>
        <span class="absolute inset-0 flex items-center justify-center text-6xl animate-float">
          {{ errorIcon }}
        </span>
      </div>

      <!-- Message -->
      <div class="flex flex-col gap-3 mb-8 max-w-md">
        <h1 class="font-display font-bold text-2xl md:text-3xl text-ink">
          {{ errorTitle }}
        </h1>
        <p class="font-body text-ink-soft text-sm md:text-base leading-relaxed">
          {{ errorMessage }}
        </p>

        <!-- Dev mode: show raw error message -->
        <details v-if="isDev && error?.message" class="mt-2 text-left">
          <summary class="text-xs text-ink-faint cursor-pointer font-mono hover:text-ink-soft transition-colors">
            Show error details
          </summary>
          <pre
            class="mt-2 p-3 bg-canvas rounded-xl text-xs text-ink-mid font-mono overflow-auto border border-ink-faint/30 text-left whitespace-pre-wrap">{{ error?.message }}</pre>
        </details>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center gap-3">
        <button
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky text-white font-body font-semibold text-sm shadow-btn hover:bg-sky-light transition-all"
          @click="handleError">
          Try Again
        </button>
        <NuxtLink to="/"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-canvas-pure text-ink-mid font-body font-semibold text-sm border border-ink-faint/60 shadow-card hover:border-sky/40 hover:text-sky transition-all">
          Back to Home
        </NuxtLink>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-ink-faint/30 px-6 py-4 text-center">
      <span class="text-xs text-ink-faint font-body">
        If this keeps happening, please refresh the page.
      </span>
    </footer>
  </div>
</template>