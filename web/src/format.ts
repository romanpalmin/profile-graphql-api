import type { Skill, SkillLevel } from './types'

const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

const LEVELS: Record<SkillLevel, string> = {
  BASIC: 'базовый',
  INTERMEDIATE: 'средний',
  ADVANCED: 'продвинутый',
}

/** «2023-11-01T00:00:00.000Z» → «ноя 2023». Даты хранятся в UTC, поэтому и читаем их в UTC. */
function formatMonth(iso: string): string {
  const date = new Date(iso)
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

/** Период работы. endDate = null означает «по настоящее время»: подпись «по н.в.» ставит клиент. */
export function formatPeriod(startDate: string, endDate: string | null): string {
  return `${formatMonth(startDate)} — ${endDate ? formatMonth(endDate) : 'по н.в.'}`
}

/** Уровень владения словами; у навыков без уровня (например, языки общения) подписи нет. */
export function formatLevel(level: SkillLevel | null): string | null {
  return level ? LEVELS[level] : null
}

export interface SkillGroup {
  category: string
  skills: Skill[]
}

/** Группирует навыки по категории, сохраняя порядок, в котором их отдал API. */
export function groupSkillsByCategory(skills: Skill[]): SkillGroup[] {
  const groups = new Map<string, Skill[]>()
  for (const skill of skills) {
    const list = groups.get(skill.category)
    if (list) list.push(skill)
    else groups.set(skill.category, [skill])
  }
  return [...groups].map(([category, items]) => ({ category, skills: items }))
}
