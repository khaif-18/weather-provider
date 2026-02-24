// utils/constants.ts

export const DEFAULT_CITY = 'Jakarta'
export const DEFAULT_UNIT = 'metric' as const

export const OWM_ICON_BASE = 'https://openweathermap.org/img/wn'

export const QUERY_KEYS = {
  CURRENT_WEATHER: 'currentWeather',
  FORECAST: 'forecast',
  GEO_SEARCH: 'geoSearch',
} as const

export const STALE_TIME = {
  WEATHER: 10 * 60 * 1000,    // 10 minutes
  FORECAST: 30 * 60 * 1000,   // 30 minutes
  GEO: 5 * 60 * 1000,         // 5 minutes
} as const

export const UNIT_LABELS = {
  metric: { temp: '°C', speed: 'm/s', label: 'Celsius' },
  imperial: { temp: '°F', speed: 'mph', label: 'Fahrenheit' },
} as const
