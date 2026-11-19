import type { Profile } from '../types'

// Небольшой профиль для тестов: одно текущее место (endDate = null), одно законченное, навыки двух категорий.
export const profileFixture: Profile = {
  id: '1',
  slug: 'test',
  name: 'Иван Тестов',
  title: 'Backend-разработчик',
  description: 'Пишу API.',
  location: 'Санкт-Петербург',
  links: [
    { id: '1', label: 'GitHub', url: 'https://github.com/example' },
    { id: '2', label: 'Email', url: 'mailto:test@example.com' },
  ],
  skills: [
    { id: '1', name: 'TypeScript', category: 'Языки', level: 'ADVANCED', note: null },
    { id: '2', name: 'Docker', category: 'Инфраструктура', level: 'INTERMEDIATE', note: 'личные проекты' },
    { id: '3', name: 'JavaScript', category: 'Языки', level: 'ADVANCED', note: null },
  ],
  experience: [
    {
      id: '1',
      company: 'Текущая компания',
      position: 'Разработчик',
      startDate: '2023-11-01T00:00:00.000Z',
      endDate: null,
      achievements: [{ id: '1', text: 'Ускорил сборку вдвое' }],
    },
    {
      id: '2',
      company: 'Старая компания',
      position: 'Стажёр',
      startDate: '2020-01-01T00:00:00.000Z',
      endDate: '2020-12-31T00:00:00.000Z',
      achievements: [],
    },
  ],
  projects: [
    {
      id: '1',
      name: 'Демо',
      url: 'https://example.com/demo',
      description: 'Учебный проект',
      technologies: ['Vue', 'NestJS'],
    },
  ],
}
