// Типы ответа GraphQL API. Совпадают со схемой бэкенда (src/profile/models/*.model.ts).
// Даты приходят строками (ISO) — GraphQL-скаляр Date сериализуется в JSON как строка.

export type SkillLevel = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'

export interface Link {
  id: string
  label: string
  url: string
}

export interface Skill {
  id: string
  name: string
  category: string
  level: SkillLevel | null
  note: string | null
}

export interface Achievement {
  id: string
  text: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  /** null означает «по настоящее время»: подпись «по н.в.» подставляет клиент */
  endDate: string | null
  achievements: Achievement[]
}

export interface Project {
  id: string
  name: string
  url: string
  description: string
  technologies: string[]
}

export interface Profile {
  id: string
  slug: string
  name: string
  title: string
  description: string
  location: string | null
  links: Link[]
  skills: Skill[]
  experience: Experience[]
  projects: Project[]
}
