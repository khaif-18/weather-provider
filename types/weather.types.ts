// types/weather.types.ts

export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface MainWeather {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
  sea_level?: number
  grnd_level?: number
}

export interface Wind {
  speed: number
  deg: number
  gust?: number
}

export interface Clouds {
  all: number
}

export interface Rain {
  '1h'?: number
  '3h'?: number
}

export interface Snow {
  '1h'?: number
  '3h'?: number
}

export interface Sys {
  type?: number
  id?: number
  country: string
  sunrise: number
  sunset: number
}

export interface Coord {
  lon: number
  lat: number
}

// Current Weather Response
export interface CurrentWeatherResponse {
  coord: Coord
  weather: WeatherCondition[]
  base: string
  main: MainWeather
  visibility: number
  wind: Wind
  clouds: Clouds
  rain?: Rain
  snow?: Snow
  dt: number
  sys: Sys
  timezone: number
  id: number
  name: string
  cod: number
}

// Forecast (5 day / 3 hour)
export interface ForecastItem {
  dt: number
  main: MainWeather
  weather: WeatherCondition[]
  clouds: Clouds
  wind: Wind
  visibility: number
  pop: number // Probability of precipitation
  rain?: Rain
  snow?: Snow
  sys: { pod: 'd' | 'n' }
  dt_txt: string
}

export interface ForecastCity {
  id: number
  name: string
  coord: Coord
  country: string
  population: number
  timezone: number
  sunrise: number
  sunset: number
}

export interface ForecastResponse {
  cod: string
  message: number
  cnt: number
  list: ForecastItem[]
  city: ForecastCity
}

// Geo coding
export interface GeoLocation {
  name: string
  local_names?: Record<string, string>
  lat: number
  lon: number
  country: string
  state?: string
}

// Processed / UI types
export interface DailyForecast {
  date: string
  dateLabel: string
  dayShort: string
  icon: string
  condition: string
  tempMax: number
  tempMin: number
  pop: number
}

export interface HourlyForecast {
  dt: number
  timeLabel: string
  icon: string
  condition: string
  temp: number
  pop: number
  wind: number
}

export type TemperatureUnit = 'metric' | 'imperial'
export type WeatherConditionGroup =
  | 'thunderstorm'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'atmosphere'
  | 'clear'
  | 'clouds'
  | 'unknown'
