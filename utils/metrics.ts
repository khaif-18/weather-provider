import type { TemperatureUnit } from '~/types/weather.types'

/** Dew point in °C via the Magnus formula. */
export function dewPointC(tempC: number, humidity: number): number {
  const a = 17.27
  const b = 237.7
  const alpha = (a * tempC) / (b + tempC) + Math.log(Math.max(humidity, 1) / 100)
  return (b * alpha) / (a - alpha)
}

/** Convert a display temperature to °C for formula input. */
export function toCelsius(temp: number, unit: TemperatureUnit): number {
  return unit === 'imperial' ? (temp - 32) * 5 / 9 : temp
}

/** Convert wind speed (display unit) to km/h for phrase thresholds. */
export function windToKmh(speed: number, unit: TemperatureUnit): number {
  return unit === 'imperial' ? speed * 1.609 : speed * 3.6
}

// ─── Short descriptive phrases (Apple-Weather style) ──────────────

export function uvPhrase(uvi: number, isDay: boolean): string {
  if (!isDay) return 'Low for the night'
  if (uvi < 3) return 'Low rest of day'
  if (uvi < 6) return 'Moderate levels'
  if (uvi < 8) return 'High — take care'
  if (uvi < 11) return 'Very high today'
  return 'Extreme exposure'
}

export function humidityPhrase(h: number): string {
  if (h < 30) return 'Quite dry air'
  if (h < 50) return 'Comfortable level'
  if (h < 70) return 'Slightly humid'
  if (h < 85) return 'Feeling humid'
  return 'Very humid'
}

export function windPhrase(kmh: number): string {
  if (kmh < 2) return 'Calm and still'
  if (kmh < 12) return 'Light air'
  if (kmh < 20) return "It's breezy"
  if (kmh < 39) return 'Quite windy'
  if (kmh < 62) return 'Strong winds'
  return 'Gale force'
}

export function dewPhrase(dpC: number): string {
  if (dpC < 5) return 'A little dry'
  if (dpC < 10) return 'Comfortable'
  if (dpC < 16) return 'Getting humid'
  if (dpC < 20) return 'Quite humid'
  if (dpC < 24) return 'It is very humid'
  return 'Oppressive & sticky'
}

export function pressurePhrase(hpa: number): string {
  if (hpa < 1000) return 'Low pressure'
  if (hpa < 1010) return 'Slightly below normal'
  if (hpa < 1020) return 'Within normal range'
  return 'High pressure'
}

export function visibilityPhrase(meters: number): string {
  if (meters >= 10000) return 'Perfectly clear'
  if (meters >= 6000) return 'Clear view'
  if (meters >= 2000) return 'Slightly hazy'
  if (meters >= 1000) return 'Hazy conditions'
  return 'Poor visibility'
}

// ─── Moon phase ───────────────────────────────────────────────────

export interface MoonInfo {
  fraction: number   // 0..1 position in lunar cycle
  illumination: number // 0..1 illuminated disc fraction
  name: string
}

export function getMoonInfo(now = Date.now()): MoonInfo {
  const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime()
  const lunationMs = 29.530588853 * 24 * 60 * 60 * 1000
  const fraction = ((now - knownNewMoon) % lunationMs + lunationMs) % lunationMs / lunationMs
  const illumination = (1 - Math.cos(2 * Math.PI * fraction)) / 2

  const phases: Array<[number, string]> = [
    [0.0625, 'New Moon'],
    [0.1875, 'Waxing Crescent'],
    [0.3125, 'First Quarter'],
    [0.4375, 'Waxing Gibbous'],
    [0.5625, 'Full Moon'],
    [0.6875, 'Waning Gibbous'],
    [0.8125, 'Last Quarter'],
    [0.9375, 'Waning Crescent'],
  ]
  const name = phases.find(([edge]) => fraction < edge)?.[1] ?? 'New Moon'
  return { fraction, illumination, name }
}
