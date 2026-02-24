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
  theme: {
    extend: {
      fontFamily: {
        // Playfair Display: editorial, refined — for big temp numbers & headings
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        // Plus Jakarta Sans: clean, modern, highly legible — for all body text
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        // Fira Code: for numeric data labels
        mono: ['"Fira Code"', 'monospace'],
      },
      colors: {
        // Core palette — Nordic white & grey scale
        canvas: {
          DEFAULT: '#F8F9FB',   // main page bg — off-white, not pure white
          warm:    '#FAFAF8',   // warm off-white for card surfaces
          pure:    '#FFFFFF',
        },
        ink: {
          DEFAULT: '#1A1F2E',   // near-black for headings
          mid:     '#4A5162',   // body text
          soft:    '#8A91A3',   // labels, captions
          faint:   '#C4C9D4',   // dividers, placeholder
        },
        // Sky blue — the single accent colour
        sky: {
          DEFAULT: '#4A90D9',   // primary blue
          light:   '#7AB3E8',   // hover / lighter tint
          pale:    '#E6F0FB',   // bg tint chips
          mist:    '#EEF4FD',   // very light bg wash
        },
        // Condition-specific accents
        sun:   { DEFAULT: '#F5A623', pale: '#FEF3DC' },
        rain:  { DEFAULT: '#5B8DB8', pale: '#E3EEF8' },
        snow:  { DEFAULT: '#8FB8D9', pale: '#EAF3FB' },
        storm: { DEFAULT: '#6E7D9A', pale: '#ECEEF3' },
        wind:  { DEFAULT: '#63B8A0', pale: '#E4F4EF' },
      },
      backgroundImage: {
        // Condition-adaptive hero backgrounds
        'clear-day':   'linear-gradient(145deg, #EEF6FF 0%, #DAEEFF 40%, #BDD9F5 100%)',
        'clear-night': 'linear-gradient(145deg, #E8EDF8 0%, #D0DAF0 100%)',
        'rain-bg':     'linear-gradient(145deg, #E8EEF8 0%, #D4E2F0 60%, #C4D6EA 100%)',
        'storm-bg':    'linear-gradient(145deg, #EAECF0 0%, #D8DCE8 100%)',
        'snow-bg':     'linear-gradient(145deg, #EEF5FF 0%, #E0EEFF 100%)',
        'cloud-bg':    'linear-gradient(145deg, #F0F2F6 0%, #E4E8F0 100%)',
        // Subtle dot grid texture
        'dot-grid':    'radial-gradient(circle, #C4C9D4 1px, transparent 1px)',
      },
      boxShadow: {
        // Very subtle, clean shadows — Nordic style
        'card':    '0 1px 4px rgba(26,31,46,0.06), 0 4px 16px rgba(26,31,46,0.04)',
        'card-md': '0 2px 8px rgba(26,31,46,0.08), 0 8px 24px rgba(26,31,46,0.06)',
        'card-lg': '0 4px 16px rgba(26,31,46,0.10), 0 16px 40px rgba(26,31,46,0.08)',
        'input':   '0 1px 3px rgba(26,31,46,0.08), 0 0 0 1px rgba(74,144,217,0)',
        'input-focus': '0 0 0 3px rgba(74,144,217,0.15)',
        'btn':     '0 1px 3px rgba(74,144,217,0.25), 0 2px 8px rgba(74,144,217,0.15)',
        'sky':     '0 4px 20px rgba(74,144,217,0.2)',
      },
      animation: {
        'float':      'float 7s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
        'fade-up':    'fadeUp 0.5s ease-out forwards',
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        'scale-in':   'scaleIn 0.35s ease-out forwards',
        'slide-right':'slideRight 0.4s ease-out forwards',
        'spin-slow':  'spin 10s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      fontSize: {
        'temp-hero': ['7rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
        'temp-lg':   ['3.5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
    },
  },
  plugins: [],
} satisfies Config
