<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'manifest',         href: '/manifest.webmanifest' },
    { rel: 'icon',             href: '/favicon.ico',               sizes: 'any' },
    { rel: 'icon',             href: '/favicon.svg',               type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png' },
  ],
  meta: [
    { name: 'theme-color',                           content: '#8a7bc2' },
    { name: 'mobile-web-app-capable',                content: 'yes' },
    { name: 'apple-mobile-web-app-capable',          content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'apple-mobile-web-app-title',            content: 'Kaether' },
  ],
})

onMounted(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
      // SW registration failures are non-fatal
    })
  }
})
</script>

<template>
  <NuxtPage />
</template>
