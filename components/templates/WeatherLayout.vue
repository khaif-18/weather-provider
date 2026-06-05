<template>
  <div class="min-h-dvh">
    <AppHeader />
    <SavedCitiesBar />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <slot />
    </main>
    <footer class="pb-8 mt-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-white/35 text-xs font-body">
          Data by OpenWeatherMap · Refreshed every 10 min
        </p>
      </div>
    </footer>
  </div>
</template>
