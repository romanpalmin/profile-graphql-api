import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppLoader from './AppLoader.vue'

describe('AppLoader', () => {
  it('сообщает вспомогательным технологиям о загрузке и показывает текст по умолчанию', () => {
    const wrapper = mount(AppLoader)
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.text()).toBe('Загрузка…')
  })

  it('принимает свой текст', () => {
    expect(mount(AppLoader, { props: { text: 'Подождите' } }).text()).toBe('Подождите')
  })

  it('картинка декоративная: пустой alt, чтобы экранный диктор её не читал', () => {
    expect(mount(AppLoader).get('img').attributes('alt')).toBe('')
  })
})
