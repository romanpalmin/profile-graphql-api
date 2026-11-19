import { describe, expect, it } from 'vitest'
import { formatLevel, formatPeriod, groupSkillsByCategory } from './format'
import type { Skill } from './types'

describe('formatPeriod', () => {
  it('показывает начало и конец периода месяцами', () => {
    expect(formatPeriod('2023-11-01T00:00:00.000Z', '2026-07-31T00:00:00.000Z')).toBe('ноя 2023 — июл 2026')
  })

  it('для endDate = null пишет «по н.в.»', () => {
    expect(formatPeriod('2023-11-01T00:00:00.000Z', null)).toBe('ноя 2023 — по н.в.')
  })

  // Две границы: в часовых поясах восточнее UTC ломается конец года, западнее UTC — начало.
  // Тест ловит ошибку «читать в местном времени» в любом поясе, где он запущен.
  it('читает даты в UTC, а не в местном времени', () => {
    expect(formatPeriod('2020-01-01T00:30:00.000Z', '2020-12-31T23:30:00.000Z')).toBe('янв 2020 — дек 2020')
  })
})

describe('formatLevel', () => {
  it('переводит уровни словами', () => {
    expect(formatLevel('BASIC')).toBe('базовый')
    expect(formatLevel('INTERMEDIATE')).toBe('средний')
    expect(formatLevel('ADVANCED')).toBe('продвинутый')
  })

  it('для навыка без уровня возвращает null', () => {
    expect(formatLevel(null)).toBeNull()
  })
})

describe('groupSkillsByCategory', () => {
  const skill = (id: string, category: string): Skill => ({ id, name: id, category, level: null, note: null })

  it('группирует по категории и сохраняет порядок появления', () => {
    const groups = groupSkillsByCategory([skill('a', 'B'), skill('b', 'A'), skill('c', 'B')])
    expect(groups.map((g) => g.category)).toEqual(['B', 'A'])
    expect(groups[0].skills.map((s) => s.id)).toEqual(['a', 'c'])
  })

  it('для пустого списка возвращает пустой список', () => {
    expect(groupSkillsByCategory([])).toEqual([])
  })
})
