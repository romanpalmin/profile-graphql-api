<script setup lang="ts">
import { theme, toggleTheme } from '../theme'
</script>

<template>
  <button
    class="toggle"
    type="button"
    :aria-label="theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'"
    :title="theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'"
    @click="toggleTheme"
  >
    <!-- Солнце показываем в тёмной теме (куда переключит клик), луну в светлой -->
    <svg v-if="theme === 'dark'" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
    <svg v-else viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  </button>
</template>

<style scoped>
.toggle {
  position: fixed;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  padding: 0;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--surface);
  color: var(--accent);
  cursor: pointer;
}
.toggle:hover {
  border-color: var(--accent);
}
.toggle:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
