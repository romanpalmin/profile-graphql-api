import { ref } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

// localStorage может быть недоступен (приватное окно, запрет сайтов): без него просто не запоминаем выбор.
function readSaved(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function apply(value: Theme) {
  document.documentElement.dataset.theme = value
}

export const theme = ref<Theme>('light')

/** Вызывается один раз до монтирования приложения: сохранённый выбор, иначе тема системы. */
export function initTheme() {
  theme.value = readSaved() ?? systemTheme()
  apply(theme.value)
}

/** Переключает тему. Класс theme-anim включает плавный переход цветов только на время смены. */
export function toggleTheme() {
  const root = document.documentElement
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduceMotion) {
    root.classList.add('theme-anim')
    window.setTimeout(() => root.classList.remove('theme-anim'), 400)
  }
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  apply(theme.value)
  try {
    localStorage.setItem(STORAGE_KEY, theme.value)
  } catch {
    // не запоминаем, тема всё равно переключилась
  }
}
