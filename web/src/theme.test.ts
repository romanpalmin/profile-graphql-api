import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { initTheme, theme, toggleTheme } from './theme'

// Подменяем matchMedia: dark — тема системы, reduce — «уменьшить движение»
function mockMedia({ dark = false, reduce = false } = {}) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('prefers-color-scheme') ? dark : query.includes('prefers-reduced-motion') ? reduce : false,
  }))
}

beforeEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.theme
  mockMedia()
})

afterEach(() => {
  vi.unstubAllGlobals()
  // @ts-expect-error: убираем подмену, сделанную в тесте
  delete document.startViewTransition
  vi.restoreAllMocks()
})

describe('initTheme', () => {
  it('без сохранённого выбора берёт тему системы', () => {
    mockMedia({ dark: true })
    initTheme()
    expect(theme.value).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('сохранённый выбор важнее темы системы', () => {
    localStorage.setItem('theme', 'light')
    mockMedia({ dark: true })
    initTheme()
    expect(theme.value).toBe('light')
  })

  it('мусор в хранилище игнорирует', () => {
    localStorage.setItem('theme', 'purple')
    initTheme()
    expect(theme.value).toBe('light')
  })
})

describe('toggleTheme', () => {
  it('переключает тему, ставит атрибут на <html> и запоминает выбор', () => {
    initTheme()
    toggleTheme()
    expect(theme.value).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
    toggleTheme()
    expect(theme.value).toBe('light')
  })

  it('если есть View Transitions, меняет тему внутри перехода', async () => {
    initTheme()
    let callback: (() => Promise<void>) | undefined
    const start = vi.fn((cb: () => Promise<void>) => {
      callback = cb
      return {}
    })
    // @ts-expect-error: в happy-dom этого API нет
    document.startViewTransition = start

    toggleTheme()
    expect(start).toHaveBeenCalledTimes(1)
    // до вызова колбэка браузером тема ещё прежняя: снимок «до» должен успеть сняться
    expect(theme.value).toBe('light')
    await callback?.()
    expect(theme.value).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('при «уменьшить движение» не использует переход, тема меняется сразу', () => {
    initTheme()
    mockMedia({ reduce: true })
    const start = vi.fn()
    document.startViewTransition = start

    toggleTheme()
    expect(start).not.toHaveBeenCalled()
    expect(theme.value).toBe('dark')
  })

  it('если хранилище недоступно, всё равно переключает и не падает', () => {
    initTheme()
    // Подменяем сам localStorage целиком (а не прототип): так вызов точно попадает в подмену в любом порядке тестов
    const setItem = vi.fn(() => {
      throw new Error('quota')
    })
    vi.stubGlobal('localStorage', { getItem: () => null, setItem })

    expect(() => toggleTheme()).not.toThrow()
    expect(setItem).toHaveBeenCalledTimes(1)
    expect(theme.value).toBe('dark')
  })
})
