import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { profileFixture } from '../testing/profile.fixture'
import ProfileCard from './ProfileCard.vue'

const render = () => mount(ProfileCard, { props: { profile: profileFixture } })

describe('ProfileCard', () => {
  it('показывает имя, должность и город', () => {
    const text = render().text()
    expect(text).toContain('Иван Тестов')
    expect(text).toContain('Backend-разработчик')
    expect(text).toContain('Санкт-Петербург')
  })

  it('для текущего места пишет «по н.в.», для законченного даёт конец периода', () => {
    const text = render().text()
    expect(text).toContain('ноя 2023 — по н.в.')
    expect(text).toContain('янв 2020 — дек 2020')
  })

  it('группирует навыки по категориям и подписывает уровень и пометку', () => {
    const wrapper = render()
    const headings = wrapper.findAll('.skill-group h3').map((h) => h.text())
    expect(headings).toEqual(['Языки', 'Инфраструктура'])
    expect(wrapper.text()).toContain('Docker · средний (личные проекты)')
  })

  it('внешние ссылки открываются в новой вкладке с noopener, mailto: без этого', () => {
    const links = render().findAll('.links a')
    expect(links[0].attributes('target')).toBe('_blank')
    expect(links[0].attributes('rel')).toBe('noopener noreferrer')
    expect(links[1].attributes('target')).toBeUndefined()
  })

  it('выводит достижения и проекты с технологиями', () => {
    const text = render().text()
    expect(text).toContain('Ускорил сборку вдвое')
    expect(text).toContain('Vue, NestJS')
  })
})
