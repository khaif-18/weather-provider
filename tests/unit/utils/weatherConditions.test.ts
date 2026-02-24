// tests/unit/utils/weatherConditions.test.ts
import { describe, it, expect } from 'vitest'
import {
  getConditionGroup,
  getConditionMeta,
  getWeatherIconUrl,
  isDaytime,
} from '~/utils/weatherConditions'

describe('weatherConditions', () => {
  describe('getConditionGroup', () => {
    it('identifies thunderstorm range (200-299)', () => {
      expect(getConditionGroup(200)).toBe('thunderstorm')
      expect(getConditionGroup(299)).toBe('thunderstorm')
    })
    it('identifies drizzle range (300-399)', () => {
      expect(getConditionGroup(300)).toBe('drizzle')
    })
    it('identifies rain range (500-599)', () => {
      expect(getConditionGroup(500)).toBe('rain')
    })
    it('identifies snow range (600-699)', () => {
      expect(getConditionGroup(601)).toBe('snow')
    })
    it('identifies atmosphere range (700-799)', () => {
      expect(getConditionGroup(701)).toBe('atmosphere')
    })
    it('identifies clear sky (800)', () => {
      expect(getConditionGroup(800)).toBe('clear')
    })
    it('identifies clouds range (801-899)', () => {
      expect(getConditionGroup(801)).toBe('clouds')
      expect(getConditionGroup(804)).toBe('clouds')
    })
    it('returns unknown for out-of-range codes', () => {
      expect(getConditionGroup(999)).toBe('unknown')
    })
  })

  describe('getConditionMeta', () => {
    it('returns meta with correct group', () => {
      const meta = getConditionMeta(800)
      expect(meta.group).toBe('clear')
      expect(meta.emoji).toBe('☀️')
    })
  })

  describe('getWeatherIconUrl', () => {
    it('builds correct icon URL', () => {
      expect(getWeatherIconUrl('01d')).toBe('https://openweathermap.org/img/wn/01d@2x.png')
      expect(getWeatherIconUrl('01d', '4x')).toBe('https://openweathermap.org/img/wn/01d@4x.png')
    })
  })

  describe('isDaytime', () => {
    it('returns true for day icons (ending in d)', () => {
      expect(isDaytime('01d')).toBe(true)
      expect(isDaytime('10d')).toBe(true)
    })
    it('returns false for night icons (ending in n)', () => {
      expect(isDaytime('01n')).toBe(false)
    })
  })
})
