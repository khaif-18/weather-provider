import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  // Enable class-based dark mode (toggled by adding `dark` to <html>)
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display:    ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        body:       ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono:       ['"Fira Code"', 'monospace'],
        cursive:    ['Caveat', 'cursive'],
        // Control Compressed substitute — Druk Wide equivalent (DESIGN.md)
        compressed: ['"Bebas Neue"', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        // ── CSS-variable-backed colors — auto-swap in dark mode ──
        canvas: {
          DEFAULT: 'rgb(var(--color-canvas) / <alpha-value>)',
          warm:    'rgb(var(--color-canvas-warm) / <alpha-value>)',
          pure:    'rgb(var(--color-canvas-pure) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
          mid:     'rgb(var(--color-ink-mid) / <alpha-value>)',
          soft:    'rgb(var(--color-ink-soft) / <alpha-value>)',
          faint:   'rgb(var(--color-ink-faint) / <alpha-value>)',
        },
        sky: {
          DEFAULT: '#2b7fff',
          light:   '#5b9fff',
          pale:    'rgb(var(--color-sky-pale) / <alpha-value>)',
          mist:    'rgb(var(--color-sky-mist) / <alpha-value>)',
        },
        // ── Static accent tokens ──────────────────────────────────
        'signal-blue': '#2b7fff',
        'dusk-blue':   '#426188',
        // ── Weather condition indicators ─────────────────────────
        sun:   { DEFAULT: '#f5a623', pale: '#fef3dc' },
        rain:  { DEFAULT: '#5b8db8', pale: '#e3eef8' },
        snow:  { DEFAULT: '#8fb8d9', pale: '#eaf3fb' },
        storm: { DEFAULT: '#6e7d9a', pale: '#eceef3' },
        wind:  { DEFAULT: '#63b8a0', pale: '#e4f4ef' },
        // ── AQI scale ────────────────────────────────────────────
        'aqi-1': '#00b050', 'aqi-2': '#92d050',
        'aqi-3': '#ffc000', 'aqi-4': '#ff0000', 'aqi-5': '#c00000',
      },
      backgroundImage: {
        'sky-gradient': 'linear-gradient(180deg, #8a7bc2 0%, #b29fc8 35%, #d4b8a0 70%, #d4a578 100%)',
        'clear-day':    'linear-gradient(145deg, #EEF6FF 0%, #DAEEFF 40%, #BDD9F5 100%)',
        'rain-bg':      'linear-gradient(145deg, #E8EEF8 0%, #D4E2F0 60%, #C4D6EA 100%)',
        'cloud-bg':     'linear-gradient(145deg, #F0F2F6 0%, #E4E8F0 100%)',
        'dot-grid':     'radial-gradient(circle, #C4C9D4 1px, transparent 1px)',
      },
      boxShadow: {
        'card':        'var(--shadow-card)',
        'card-md':     'var(--shadow-card-md)',
        'card-lg':     '0 20px 60px rgba(27,27,27,0.16)',
        'input':       '0 1px 4px rgba(27,27,27,0.06)',
        'input-focus': '0 0 0 3px rgba(43,127,255,0.15)',
        'btn':         '0 4px 16px rgba(27,27,27,0.08)',
        'sky':         '0 4px 20px rgba(138,123,194,0.25)',
      },
      animation: {
        'float':       'float 7s ease-in-out infinite',
        'shimmer':     'shimmer 2s linear infinite',
        'fade-up':     'fadeUp 0.5s ease-out forwards',
        'fade-in':     'fadeIn 0.4s ease-out forwards',
        'scale-in':    'scaleIn 0.35s ease-out forwards',
        'slide-right': 'slideRight 0.4s ease-out forwards',
        'spin-slow':   'spin 10s linear infinite',
      },
      keyframes: {
        float:       { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer:     { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        fadeUp:      { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:      { from: { opacity: '0' }, to: { opacity: '1' } },
        scaleIn:     { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'scale(1)' } },
        slideRight:  { from: { opacity: '0', transform: 'translateX(-16px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
      borderRadius: {
        '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem',
        'card': '11px',
        'pill': '9999px',
      },
      fontSize: {
        'temp-hero': ['7rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
        'temp-lg':   ['3.5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
    },
  },
  plugins: [],
} satisfies Config
