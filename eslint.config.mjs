// eslint.config.mjs
// ESLint 9 Flat Config — Nuxt 4 + Vue 3 + TypeScript
import pluginVue from 'eslint-plugin-vue'
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'
import globals from 'globals'

export default defineConfigWithVueTs(
  // ── 1. Global ignores ────────────────────────────────────────────────
  {
    ignores: [
      '.nuxt/**',
      '.output/**',
      '.nitro/**',
      '.cache/**',
      'dist/**',
      'node_modules/**',
      'coverage/**',
    ],
  },

  // ── 2. Global language options ────────────────────────────────────────
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // Nuxt auto-imports
        defineNuxtConfig: 'readonly',
        defineNuxtPlugin: 'readonly',
        defineNuxtRouteMiddleware: 'readonly',
        useRuntimeConfig: 'readonly',
        useNuxtApp: 'readonly',
        useRouter: 'readonly',
        useRoute: 'readonly',
        useFetch: 'readonly',
        useAsyncData: 'readonly',
        useSeoMeta: 'readonly',
        useId: 'readonly',
        navigateTo: 'readonly',
        // Vue auto-imports
        ref: 'readonly',
        reactive: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        watchEffect: 'readonly',
        onMounted: 'readonly',
        onUnmounted: 'readonly',
        onBeforeMount: 'readonly',
        nextTick: 'readonly',
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineOptions: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
        useTemplateRef: 'readonly',
      },
    },
  },

  // ── 3. Vue 3 rules ────────────────────────────────────────────────────
  ...pluginVue.configs['flat/recommended'],

  // ── 4. TypeScript rules ───────────────────────────────────────────────
  vueTsConfigs.recommended,

  // ── 5. Custom rule overrides ──────────────────────────────────────────
  {
    files: ['**/*.vue', '**/*.ts', '**/*.mts'],
    rules: {
      // ── Vue ──────────────────────────────────────────────────────────
      // Wajib satu root element, kecuali fragment (Nuxt/Vue 3 support fragments)
      'vue/no-multiple-template-root': 'off',

      // Attribute order — konsisten
      'vue/attributes-order': ['warn', {
        order: [
          'DEFINITION',       // is, v-is
          'LIST_RENDERING',   // v-for
          'CONDITIONALS',     // v-if, v-else-if, v-else, v-show, v-cloak
          'RENDER_MODIFIERS', // v-pre, v-once
          'GLOBAL',           // id
          'UNIQUE',           // ref, key
          'TWO_WAY_BINDING',  // v-model
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',           // @click, v-on
          'CONTENT',          // v-html, v-text
        ],
        alphabetical: false,
      }],

      // Emits harus dideklarasikan
      'vue/require-explicit-emits': 'error',

      // Props harus ada default atau required
      'vue/require-default-prop': 'off', // TypeScript sudah handle ini

      // Gunakan shorthand :prop bukan v-bind:prop
      'vue/v-bind-style': 'warn',

      // Gunakan shorthand @event bukan v-on:event
      'vue/v-on-style': 'warn',

      // Self-closing tags untuk komponen tanpa slot
      'vue/html-self-closing': ['warn', {
        html: { void: 'always', normal: 'never', component: 'always' },
        svg: 'always',
        math: 'always',
      }],

      // Konsisten satu statement per baris di template
      'vue/max-attributes-per-line': ['warn', {
        singleline: { max: 3 },
        multiline: { max: 1 },
      }],

      // Block order di SFC: <script>, <template>, <style>
      'vue/block-order': ['warn', {
        order: ['script', 'template', 'style'],
      }],

      // Nama komponen harus PascalCase
      'vue/component-name-in-template-casing': ['warn', 'PascalCase', {
        registeredComponentsOnly: false,
        ignores: [],
      }],

      // Larang v-html untuk mencegah XSS (boleh warn, bukan error)
      'vue/no-v-html': 'warn',

      // ── TypeScript ───────────────────────────────────────────────────
      // Boleh gunakan 'any' tapi warn
      '@typescript-eslint/no-explicit-any': 'warn',

      // Tidak perlu anotasi return type di semua fungsi
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Boleh non-null assertion (!) tapi hati-hati
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Unused vars — error tapi ignore yang diawali _
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],

      // Konsistensi import type
      '@typescript-eslint/consistent-type-imports': ['warn', {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      }],

      // ── General JS/TS ────────────────────────────────────────────────
      // Tidak boleh console.log di production (warn saja)
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

      // Tidak boleh debugger
      'no-debugger': 'error',

      // Prefer const
      'prefer-const': 'error',

      // Tidak boleh var
      'no-var': 'error',

      // Objek shorthand
      'object-shorthand': 'warn',
    },
  },

  // ── 6. Test files — lebih longgar ────────────────────────────────────
  {
    files: ['tests/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
)
