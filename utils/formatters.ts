// utils/formatters.ts
import type { TemperatureUnit } from '~/types/weather.types'

/** Format temperature with unit symbol */
export function formatTemp(temp: number, unit: TemperatureUnit = 'metric'): string {
  const rounded = Math.round(temp)
  return `${rounded}°${unit === 'metric' ? 'C' : 'F'}`
}

/** Format Unix timestamp to readable time */
export function formatTime(unixTs: number, timezone: number): string {
  const date = new Date((unixTs + timezone) * 1000)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  })
}

/** Format Unix timestamp to day name */
export function formatDay(unixTs: number): string {
  return new Date(unixTs * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
  })
}

/** Format Unix timestamp to short day */
export function formatDayShort(unixTs: number): string {
  return new Date(unixTs * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
  })
}

/** Format Unix timestamp to date string */
export function formatDate(unixTs: number): string {
  return new Date(unixTs * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

/** Format time from dt_txt string (e.g. "2024-01-15 09:00:00") */
export function formatTimeFromDtTxt(dtTxt: string): string {
  const [, time] = dtTxt.split(' ')
  const [h, m] = time?.split(':') || ['0', '0']
  return `${h}:${m}`
}

/** Wind direction in degrees to compass */
export function windDegToCompass(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return dirs[Math.round(deg / 22.5) % 16] || 'N/A'
}

/** Format wind speed */
export function formatWind(speed: number, unit: TemperatureUnit = 'metric'): string {
  return unit === 'metric'
    ? `${Math.round(speed)} m/s`
    : `${Math.round(speed)} mph`
}

/** Format visibility in km */
export function formatVisibility(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`
  return `${meters} m`
}

/** Humidity level label */
export function humidityLabel(humidity: number): string {
  if (humidity < 30) return 'Dry'
  if (humidity < 60) return 'Comfortable'
  if (humidity < 80) return 'Humid'
  return 'Very Humid'
}

/** UV index label */
export function uvIndexLabel(uvi: number): string {
  if (uvi <= 2) return 'Low'
  if (uvi <= 5) return 'Moderate'
  if (uvi <= 7) return 'High'
  if (uvi <= 10) return 'Very High'
  return 'Extreme'
}

/** Probability of precipitation as percentage string */
export function formatPop(pop: number): string {
  return `${Math.round(pop * 100)}%`
}

/** Capitalize first letter */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
