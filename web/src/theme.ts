import { nextTick, ref } from 'vue'

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

/**
 * Переключает тему и запоминает выбор.
 * Плавность даёт View Transitions API: браузер снимает картинку страницы «до», применяет тему и растворяет старую
 * картинку в новую. Так текст не «сливается» с фоном на середине перехода, как при покраске цветов по прямой.
 * Если API нет или в системе включено «уменьшить движение», тема просто меняется сразу.
 */
export function toggleTheme() {
  const next: Theme = theme.value === 'dark' ? 'light' : 'dark'

  // nextTick: браузер должен увидеть уже обновлённую страницу (в том числе значок на кнопке) до конца перехода
  const change = async () => {
    theme.value = next
    apply(next)
    await nextTick()
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduceMotion && typeof document.startViewTransition === 'function') {
    document.startViewTransition(change)
  } else {
    void change()
  }

  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // не запоминаем, тема всё равно переключилась
  }
}
