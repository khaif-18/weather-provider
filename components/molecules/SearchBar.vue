<script setup lang="ts">
import { Search, MapPin } from 'lucide-vue-next'
import type { GeoLocation } from '~/types/weather.types'

const emit = defineEmits<{ select: [city: GeoLocation]; search: [query: string] }>()

const api          = useWeatherApi()
const query        = ref('')
const showDropdown = ref(false)
const suggestions  = ref<GeoLocation[]>([])
const isPending    = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function debouncedFetch(q: string) {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    if (q.length < 2) { suggestions.value = []; return }
    try {
      isPending.value = true
      suggestions.value = await api.searchCities(q)
      showDropdown.value = true
    }
    catch { suggestions.value = [] }
    finally { isPending.value = false }
  }, 400)
}

function handleInput() {
  if (!query.value) { suggestions.value = []; showDropdown.value = false; return }
  debouncedFetch(query.value)
}
function handleSearch()                { if (query.value.trim()) emit('search', query.value.trim()); showDropdown.value = false }
function handleSelect(city: GeoLocation) { query.value = city.name; showDropdown.value = false; suggestions.value = []; emit('select', city) }

function onOutsideClick(e: MouseEvent) {
  const el = document.querySelector('[data-searchbar]')
  if (el && !el.contains(e.target as Node)) showDropdown.value = false
}
onMounted(() => document.addEventListener('click', onOutsideClick))
onUnmounted(() => document.removeEventListener('click', onOutsideClick))
</script>

<template>
  <div class="relative w-full" data-searchbar>
    <div class="relative flex items-center">
      <Search :size="14" :stroke-width="2" class="absolute left-3 text-ink/35 pointer-events-none shrink-0" />
      <input
        v-model="query"
        type="search"
        placeholder="Search city…"
        autocomplete="off"
        class="w-full bg-canvas text-ink font-body text-sm font-medium
               pl-8 pr-4 py-2.5 rounded border border-ink/20
               placeholder:text-ink/30 outline-none transition-all duration-150
               focus:border-signal-blue focus:shadow-[0_0_0_2px_rgba(43,127,255,0.15)]"
        @input="handleInput"
        @keydown.enter="handleSearch"
        @keydown.escape="showDropdown = false"
      />
      <div v-if="isPending" class="absolute right-3 pointer-events-none">
        <BaseSpinner size="xs" class="text-ink/40" />
      </div>
    </div>

    <Transition name="dropdown">
      <div
        v-if="suggestions.length && showDropdown"
        class="absolute top-full mt-2 left-0 right-0 z-50 bg-canvas-pure overflow-hidden
               rounded-lg border border-ink-faint/15"
        style="box-shadow: var(--shadow-dropdown)"
      >
        <ul role="listbox" class="py-1">
          <li
            v-for="(city, index) in suggestions"
            :key="`${city.lat}-${city.lon}`"
            role="option"
            :class="[
              'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-sky-mist',
              index < suggestions.length - 1 ? 'border-b border-ink-faint/15' : '',
            ]"
            @click="handleSelect(city)"
          >
            <MapPin :size="13" :stroke-width="2" class="text-dusk-blue shrink-0" />
            <div class="min-w-0">
              <p class="text-ink text-sm font-medium truncate font-body">
                {{ city.name }}
              </p>
              <p class="text-ink/50 text-xs font-body">
                {{ [city.state, city.country].filter(Boolean).join(', ') }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
