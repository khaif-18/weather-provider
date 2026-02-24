// tests/unit/utils/formatters.test.ts
import { describe, it, expect } from 'vitest'
import {
  formatTemp,
  windDegToCompass,
  formatWind,
  formatVisibility,
  humidityLabel,
  formatPop,
  capitalize,
} from '~/utils/formatters'

describe('formatters', () => {
  describe('formatTemp', () => {
    it('formats celsius correctly', () => {
      expect(formatTemp(25, 'metric')).toBe('25°C')
      expect(formatTemp(25.7, 'metric')).toBe('26°C')
      expect(formatTemp(-5, 'metric')).toBe('-5°C')
    })

    it('formats fahrenheit correctly', () => {
      expect(formatTemp(77, 'imperial')).toBe('77°F')
    })

    it('defaults to metric', () => {
      expect(formatTemp(20)).toBe('20°C')
    })
  })

  describe('windDegToCompass', () => {
    it('maps 0° to N', () => expect(windDegToCompass(0)).toBe('N'))
    it('maps 90° to E', () => expect(windDegToCompass(90)).toBe('E'))
    it('maps 180° to S', () => expect(windDegToCompass(180)).toBe('S'))
    it('maps 270° to W', () => expect(windDegToCompass(270)).toBe('W'))
    it('maps 45° to NE', () => expect(windDegToCompass(45)).toBe('NE'))
  })

  describe('formatWind', () => {
    it('formats metric wind', () => expect(formatWind(5.4, 'metric')).toBe('5 m/s'))
    it('formats imperial wind', () => expect(formatWind(12, 'imperial')).toBe('12 mph'))
  })

  describe('formatVisibility', () => {
    it('formats km when >= 1000m', () => expect(formatVisibility(10000)).toBe('10.0 km'))
    it('formats meters when < 1000', () => expect(formatVisibility(500)).toBe('500 m'))
  })

  describe('humidityLabel', () => {
    it('returns Dry for < 30%', () => expect(humidityLabel(20)).toBe('Dry'))
    it('returns Comfortable for 30-59%', () => expect(humidityLabel(50)).toBe('Comfortable'))
    it('returns Humid for 60-79%', () => expect(humidityLabel(70)).toBe('Humid'))
    it('returns Very Humid for >= 80%', () => expect(humidityLabel(85)).toBe('Very Humid'))
  })

  describe('formatPop', () => {
    it('formats probability as percentage', () => {
      expect(formatPop(0.4)).toBe('40%')
      expect(formatPop(1)).toBe('100%')
      expect(formatPop(0)).toBe('0%')
    })
  })

  describe('capitalize', () => {
    it('capitalizes first letter', () => expect(capitalize('hello world')).toBe('Hello world'))
    it('handles empty string', () => expect(capitalize('')).toBe(''))
  })
})
