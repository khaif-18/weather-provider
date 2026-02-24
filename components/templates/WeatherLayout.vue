<template>
  <div class="min-h-dvh bg-canvas font-body">
    <!-- Subtle top gradient wash -->
    <div class="fixed top-0 left-0 right-0 h-64 bg-gradient-to-b from-sky-mist/60 to-transparent pointer-events-none z-0" />

    <AppHeader />

    <main class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <slot />
    </main>

    <footer class="relative z-10 border-t border-ink-faint/30 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-2">
          <span class="text-xs text-ink-soft font-body">
            Data provided by OpenWeatherMap · Refreshed every 10 min
          </span>
          <span class="text-xs text-ink-faint font-body">
            Built with Nuxt 4 + Bun 🇳🇴
          </span>
        </div>
      </div>
    </footer>
  </div>
</template>
