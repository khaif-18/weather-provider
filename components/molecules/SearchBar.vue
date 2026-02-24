<template>
  <div class="relative w-full">
    <BaseInput v-model="query" type="search" placeholder="Search city…" prefix-icon="🔍" autocomplete="off"
      @enter="handleSearch" @input="handleInput">
      <template #right>
        <div class="flex items-center">
          <BaseSpinner v-if="isPending" size="xs" class="text-sky" />
        </div>
      </template>
    </BaseInput>

    <!-- Suggestions dropdown -->
    <Transition name="dropdown">
      <div v-if="suggestions.length && showDropdown"
        class="absolute top-full mt-2 left-0 right-0 z-50 bg-canvas-pure rounded-2xl shadow-card-lg border border-ink-faint/30 overflow-hidden">
        <ul role="listbox" class="py-1.5 max-h-64 overflow-y-auto">
          <li v-for="(city, index) in suggestions" :key="`${city.lat}-${city.lon}`" role="option" :class="[
            'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-sky-mist',
            index < suggestions.length - 1 ? 'border-b border-ink-faint/20' : '',
          ]" @click="handleSelect(city)">
            <span class="text-sky text-sm shrink-0">📍</span>
            <div class="min-w-0">
              <p class="text-ink text-sm font-semibold truncate font-body">{{ city.name }}</p>
              <p class="text-ink-soft text-xs font-body">
                {{ [city.state, city.country].filter(Boolean).join(', ') }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { GeoLocation } from '~/types/weather.types'

const emit = defineEmits<{
  select: [city: GeoLocation]
  search: [query: string]
}>()

// useWeatherApi() aman dipanggil di sini karena kita dalam <script setup>
const api = useWeatherApi()

const query = ref('')
const showDropdown = ref(false)
const suggestions = ref<GeoLocation[]>([])
const isPending = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function debouncedFetch(q: string) {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    if (q.length < 2) { suggestions.value = []; return }
    try {
      isPending.value = true
      suggestions.value = await api.searchCities(q)
      showDropdown.value = true

      console.log('Suggestions:', suggestions.value) // Debug log
    }
    catch { suggestions.value = [] }
    finally { isPending.value = false }
  }, 400)
}

function handleInput(val: unknown) {
  const str = String(val)
  if (!str) { suggestions.value = []; showDropdown.value = false; return }
  debouncedFetch(str)
}

function handleSearch(val: unknown) {
  const str = String(val)
  if (str.trim()) emit('search', str.trim())
  showDropdown.value = false
}

function handleSelect(city: GeoLocation) {
  query.value = city.name
  showDropdown.value = false
  suggestions.value = []
  emit('select', city)
}

function handleClear() {
  query.value = ''
  suggestions.value = []
  showDropdown.value = false
}

// Close on outside click — native, tanpa @vueuse/core dependency
function onOutsideClick(e: MouseEvent) {
  const el = document.querySelector('[data-searchbar]')
  if (el && !el.contains(e.target as Node)) showDropdown.value = false
}

onMounted(() => document.addEventListener('click', onOutsideClick))
onUnmounted(() => document.removeEventListener('click', onOutsideClick))
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.18s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>