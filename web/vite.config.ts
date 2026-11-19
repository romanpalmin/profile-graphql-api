import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

// Фронт ходит на /graphql относительным путём (тот же домен, CORS не нужен).
// В разработке запросы к /graphql проксируются на локальный API (npm run start:dev в корне проекта).
export default defineConfig({
  plugins: [vue()],
  // Тесты компонентов идут в имитации браузера (happy-dom), без настоящего браузера
  test: { environment: 'happy-dom' },
  server: {
    proxy: {
      '/graphql': process.env.API_URL ?? 'http://localhost:3000',
    },
  },
})
