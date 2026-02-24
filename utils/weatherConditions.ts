// utils/weatherConditions.ts
import type { WeatherConditionGroup } from '~/types/weather.types'

export interface ConditionMeta {
  group: WeatherConditionGroup
  label: string
  emoji: string
  // Hero gradient background class
  heroBg: string
  // Accent color for text/icons
  accentColor: string
  // Pale tint for chips/badges
  paleBg: string
}

export const CONDITION_MAP: Record<WeatherConditionGroup, ConditionMeta> = {
  thunderstorm: {
    group: 'thunderstorm',
    label: 'Thunderstorm',
    emoji: '⛈️',
    heroBg: 'bg-storm-bg',
    accentColor: 'text-storm',
    paleBg: 'bg-storm-pale',
  },
  drizzle: {
    group: 'drizzle',
    label: 'Drizzle',
    emoji: '🌦️',
    heroBg: 'bg-rain-bg',
    accentColor: 'text-rain',
    paleBg: 'bg-rain-pale',
  },
  rain: {
    group: 'rain',
    label: 'Rain',
    emoji: '🌧️',
    heroBg: 'bg-rain-bg',
    accentColor: 'text-rain',
    paleBg: 'bg-rain-pale',
  },
  snow: {
    group: 'snow',
    label: 'Snow',
    emoji: '❄️',
    heroBg: 'bg-snow-bg',
    accentColor: 'text-snow',
    paleBg: 'bg-snow-pale',
  },
  atmosphere: {
    group: 'atmosphere',
    label: 'Foggy',
    emoji: '🌫️',
    heroBg: 'bg-cloud-bg',
    accentColor: 'text-ink-soft',
    paleBg: 'bg-canvas',
  },
  clear: {
    group: 'clear',
    label: 'Clear Sky',
    emoji: '☀️',
    heroBg: 'bg-clear-day',
    accentColor: 'text-sun',
    paleBg: 'bg-sun-pale',
  },
  clouds: {
    group: 'clouds',
    label: 'Cloudy',
    emoji: '☁️',
    heroBg: 'bg-cloud-bg',
    accentColor: 'text-sky',
    paleBg: 'bg-sky-mist',
  },
  unknown: {
    group: 'unknown',
    label: 'Weather',
    emoji: '🌡️',
    heroBg: 'bg-canvas',
    accentColor: 'text-sky',
    paleBg: 'bg-sky-mist',
  },
}

/** Map OpenWeatherMap condition code to group */
export function getConditionGroup(code: number): WeatherConditionGroup {
  if (code >= 200 && code < 300) return 'thunderstorm'
  if (code >= 300 && code < 400) return 'drizzle'
  if (code >= 500 && code < 600) return 'rain'
  if (code >= 600 && code < 700) return 'snow'
  if (code >= 700 && code < 800) return 'atmosphere'
  if (code === 800) return 'clear'
  if (code >= 801 && code < 900) return 'clouds'
  return 'unknown'
}

export function getConditionMeta(code: number): ConditionMeta {
  return CONDITION_MAP[getConditionGroup(code)]
}

/** Get OWM icon URL */
export function getWeatherIconUrl(icon: string, size: '2x' | '4x' = '2x'): string {
  return `https://openweathermap.org/img/wn/${icon}@${size}.png`
}

/** Is it daytime based on icon code */
export function isDaytime(icon: string): boolean {
  return icon.endsWith('d')
}
