import type { CurrentWeatherResponse, TemperatureUnit } from '~/types/weather.types'

export interface Suggestion {
  id: string
  icon: string
  text: string
  category: 'wear' | 'protection' | 'activity' | 'health' | 'info'
}

export function getWeatherSuggestions(
  data: CurrentWeatherResponse,
  unit: TemperatureUnit,
): Suggestion[] {
  const tempC = unit === 'imperial'
    ? (data.main.temp - 32) * 5 / 9
    : data.main.temp

  const { humidity, feels_like } = data.main
  const feelsC = unit === 'imperial' ? (feels_like - 32) * 5 / 9 : feels_like
  const code = data.weather[0]?.id ?? 800
  const wind = data.wind.speed         // m/s
  const clouds = data.clouds.all       // %
  const now = Date.now() / 1000
  const isDay = now > data.sys.sunrise && now < data.sys.sunset

  const all: Suggestion[] = []

  // ─── What to wear ───────────────────────────────────────────────
  if (feelsC < 0)
    all.push({ id: 'heavy-coat', icon: '🧥', text: 'Heavy coat + gloves needed', category: 'wear' })
  else if (feelsC < 10)
    all.push({ id: 'warm-coat', icon: '🧣', text: 'Wear a warm coat and scarf', category: 'wear' })
  else if (feelsC < 17)
    all.push({ id: 'jacket', icon: '🧥', text: 'Light jacket recommended', category: 'wear' })
  else if (feelsC >= 30)
    all.push({ id: 'light-clothes', icon: '👕', text: 'Very light clothing only', category: 'wear' })

  // ─── Rain / umbrella ────────────────────────────────────────────
  if (code >= 200 && code < 300)
    all.push({ id: 'storm', icon: '⛈️', text: 'Stay indoors — thunderstorm', category: 'protection' })
  else if ((code >= 300 && code < 600) || (code >= 500 && code < 502))
    all.push({ id: 'umbrella', icon: '☂️', text: 'Bring an umbrella', category: 'protection' })

  // ─── Snow / ice ─────────────────────────────────────────────────
  if (code >= 600 && code < 700)
    all.push({ id: 'snow-gear', icon: '🧤', text: 'Watch for icy surfaces', category: 'protection' })

  // ─── Sun protection ─────────────────────────────────────────────
  if (isDay && clouds < 40 && code >= 800) {
    all.push({ id: 'sunglasses', icon: '🕶️', text: 'Wear sunglasses', category: 'protection' })
    if (tempC > 24)
      all.push({ id: 'sunscreen', icon: '🧴', text: 'Apply sunscreen', category: 'health' })
  }

  // ─── Activity suitability ────────────────────────────────────────
  const goodForOutdoor = feelsC >= 14 && feelsC <= 26 && code >= 800 && wind < 8
  if (goodForOutdoor)
    all.push({ id: 'outdoor', icon: '🏃', text: 'Great conditions for outdoor activity', category: 'activity' })

  // ─── Health / hydration ─────────────────────────────────────────
  if (tempC >= 32)
    all.push({ id: 'hydration', icon: '💧', text: 'Stay hydrated — hot day', category: 'health' })
  if (humidity > 80 && tempC > 25)
    all.push({ id: 'humid', icon: '🌫️', text: 'High humidity — limit exertion', category: 'health' })

  // ─── Wind ───────────────────────────────────────────────────────
  if (wind >= 15)
    all.push({ id: 'wind-strong', icon: '💨', text: 'Strong wind — secure loose items', category: 'info' })

  // ─── Visibility ─────────────────────────────────────────────────
  if (data.visibility < 2000)
    all.push({ id: 'fog', icon: '🌫️', text: 'Low visibility — drive carefully', category: 'info' })

  // Return top 4, wear first
  const ordered = [
    ...all.filter(s => s.category === 'wear'),
    ...all.filter(s => s.category === 'protection'),
    ...all.filter(s => s.category === 'health'),
    ...all.filter(s => s.category === 'activity'),
    ...all.filter(s => s.category === 'info'),
  ]

  return ordered.slice(0, 4)
}
