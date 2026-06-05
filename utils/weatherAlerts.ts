import type { CurrentWeatherResponse, TemperatureUnit } from '~/types/weather.types'

export type AlertSeverity = 'info' | 'warning' | 'danger'

export interface WeatherAlertData {
  id: string
  severity: AlertSeverity
  title: string
  message: string
  icon: string
}

export function getWeatherAlerts(
  data: CurrentWeatherResponse,
  unit: TemperatureUnit,
): WeatherAlertData[] {
  const tempC = unit === 'imperial'
    ? (data.main.temp - 32) * 5 / 9
    : data.main.temp

  const code = data.weather[0]?.id ?? 800
  const wind = data.wind.speed  // m/s
  const vis  = data.visibility  // metres

  const alerts: WeatherAlertData[] = []

  // ── Thunderstorm ───────────────────────────────────────────────
  if (code >= 200 && code < 300)
    alerts.push({
      id: 'thunderstorm', severity: 'danger', icon: '⛈️',
      title: 'Thunderstorm Warning',
      message: 'Thunderstorm active. Avoid open areas and seek shelter immediately.',
    })

  // ── Extreme heat ───────────────────────────────────────────────
  else if (tempC >= 38)
    alerts.push({
      id: 'extreme-heat', severity: 'danger', icon: '🌡️',
      title: 'Extreme Heat',
      message: 'Dangerous heat. Stay indoors, use AC, and drink water frequently.',
    })
  else if (tempC >= 33)
    alerts.push({
      id: 'heat', severity: 'warning', icon: '☀️',
      title: 'Heat Advisory',
      message: 'Hot conditions. Limit outdoor exposure and stay hydrated.',
    })

  // ── Frost / freeze ─────────────────────────────────────────────
  if (tempC < 0)
    alerts.push({
      id: 'frost', severity: 'warning', icon: '🌨️',
      title: 'Frost Warning',
      message: 'Freezing temperatures. Dress in layers and watch for icy surfaces.',
    })

  // ── High wind ──────────────────────────────────────────────────
  if (wind >= 17)
    alerts.push({
      id: 'high-wind', severity: 'danger', icon: '💨',
      title: 'High Wind Warning',
      message: 'Hazardous winds. Avoid driving and secure all outdoor objects.',
    })
  else if (wind >= 11 && alerts.length === 0)
    alerts.push({
      id: 'wind', severity: 'info', icon: '💨',
      title: 'Windy Conditions',
      message: 'Strong gusts expected. Secure loose outdoor items.',
    })

  // ── Dense fog ──────────────────────────────────────────────────
  if (code >= 700 && code < 800 && vis < 500)
    alerts.push({
      id: 'dense-fog', severity: 'warning', icon: '🌫️',
      title: 'Dense Fog',
      message: 'Very poor visibility. Reduce speed and use fog lights when driving.',
    })

  // Surface max 2 (most severe first)
  const order: AlertSeverity[] = ['danger', 'warning', 'info']
  return alerts
    .sort((a, b) => order.indexOf(a.severity) - order.indexOf(b.severity))
    .slice(0, 2)
}

export const SEVERITY_STYLES: Record<AlertSeverity, { bg: string; border: string; text: string; icon: string }> = {
  danger:  { bg: 'bg-red-50 dark:bg-red-950/40',    border: 'border-red-200 dark:border-red-800/50',    text: 'text-red-700 dark:text-red-300',    icon: 'text-red-500' },
  warning: { bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-700/50', text: 'text-amber-700 dark:text-amber-300', icon: 'text-amber-500' },
  info:    { bg: 'bg-sky-50 dark:bg-sky-950/40',     border: 'border-sky-200 dark:border-sky-800/50',     text: 'text-sky-700 dark:text-sky-300',     icon: 'text-sky-500' },
}
