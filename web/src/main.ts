import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { initTheme } from './theme'

// Тему ставим до монтирования, чтобы страница не мигала не той темой
initTheme()

createApp(App).mount('#app')
