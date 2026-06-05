/**
 * Estimates UV Index from conditions we already fetch.
 * Not a substitute for real UV data but accurate enough for daily planning.
 */
export function estimateUVI(
  cloudCover: number,   // 0-100 %
  conditionCode: number,
  sunrise: number,      // unix ts
  sunset: number,       // unix ts
): number {
  const now = Date.now() / 1000
  if (now <= sunrise || now >= sunset) return 0

  // Parabolic solar factor: peaks at solar noon
  const progress = (now - sunrise) / (sunset - sunrise)
  const solarFactor = 4 * progress * (1 - progress)

  // Base UV by condition group
  let baseUV: number
  if (conditionCode === 800) baseUV = 10           // clear
  else if (conditionCode <= 802) baseUV = 7        // few/scattered clouds
  else if (conditionCode <= 804) baseUV = 4        // broken/overcast
  else if (conditionCode < 300) baseUV = 2         // thunderstorm
  else if (conditionCode < 600) baseUV = 2         // rain/drizzle
  else if (conditionCode < 700) baseUV = 1         // snow
  else baseUV = 3                                   // fog/mist/haze

  // Cloud cover dampens UV by up to 65%
  const cloudFactor = 1 - (cloudCover / 100) * 0.65

  return Math.max(0, Math.round(baseUV * solarFactor * cloudFactor * 10) / 10)
}

export interface UVMeta {
  level: string
  advice: string
  color: string
  bg: string
}

export function getUVMeta(uvi: number): UVMeta {
  if (uvi < 1)  return { level: 'None',      advice: 'No sun protection needed.',          color: '#6b6b6b', bg: '#f5f5f5' }
  if (uvi < 3)  return { level: 'Low',       advice: 'Minimal protection required.',       color: '#00b050', bg: '#f0faf3' }
  if (uvi < 6)  return { level: 'Moderate',  advice: 'Wear sunscreen SPF 30+.',            color: '#f5a623', bg: '#fff8ec' }
  if (uvi < 8)  return { level: 'High',      advice: 'Sunscreen + hat recommended.',       color: '#ff6b35', bg: '#fff3ec' }
  if (uvi < 11) return { level: 'Very High', advice: 'Avoid midday sun. SPF 50+.',         color: '#e53e3e', bg: '#fff0f0' }
  return         { level: 'Extreme',         advice: 'Stay indoors near midday.',          color: '#c00000', bg: '#ffe8e8' }
}
