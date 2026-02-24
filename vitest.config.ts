import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [
        'utils/**/*.ts',
        'stores/**/*.ts',
        'composables/**/*.ts',
        'services/**/*.ts',
      ],
      exclude: ['**/*.d.ts', '**/*.config.*', '**/node_modules/**'],
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(process.cwd(), '.'),
    },
  },
})