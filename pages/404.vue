<script setup lang="ts">
const router = useRouter()

useSeoMeta({
  title: '404 — Page Not Found · Aether',
  description: 'The page you are looking for does not exist.',
})
</script>

<template>
  <WeatherLayout>
    <div class="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <!-- Big 404 number -->
      <div class="relative mb-8 select-none">
        <span
          class="font-display font-bold text-[clamp(6rem,20vw,12rem)] leading-none text-ink-faint/30 tracking-tighter">
          404
        </span>
        <!-- Weather icon floating over the number -->
        <span class="absolute inset-0 flex items-center justify-center text-[clamp(3rem,8vw,5rem)] animate-float">
          🌫️
        </span>
      </div>

      <!-- Message -->
      <div class="flex flex-col gap-3 mb-8 max-w-sm">
        <h1 class="font-display font-bold text-2xl md:text-3xl text-ink">
          Page Not Found
        </h1>
        <p class="font-body text-ink-soft text-sm md:text-base leading-relaxed">
          Looks like this page drifted off into the clouds. Let's get you back to clear skies.
        </p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center gap-3">
        <BaseButton variant="primary" size="lg" @click="navigateTo('/')">
          Back to Home
        </BaseButton>
        <BaseButton variant="secondary" size="lg" @click="router.back()">
          Go Back
        </BaseButton>
      </div>

      <!-- Decorative weather strip -->
      <div class="flex items-center gap-6 mt-16 text-2xl text-ink-faint/40 select-none">
        <span class="animate-float" style="animation-delay: 0s">☀️</span>
        <span class="animate-float" style="animation-delay: 0.5s">⛅</span>
        <span class="animate-float" style="animation-delay: 1s">🌧️</span>
        <span class="animate-float" style="animation-delay: 1.5s">❄️</span>
        <span class="animate-float" style="animation-delay: 2s">⛈️</span>
      </div>
    </div>
  </WeatherLayout>
</template>