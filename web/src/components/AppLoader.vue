<script setup lang="ts">
import logo from '../assets/favicon.svg'

// Экран загрузки по центру: логотип (та же иконка, что на вкладке) мягко «дышит».
withDefaults(defineProps<{ text?: string }>(), { text: 'Загрузка…' })
</script>

<template>
  <div class="loader" role="status" aria-live="polite">
    <img class="logo" :src="logo" alt="" width="72" height="72" />
    <p class="text">{{ text }}</p>
  </div>
</template>

<style scoped>
.loader {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
.logo {
  animation: pulse 1.4s ease-in-out infinite;
}
.text {
  margin: 0;
  color: var(--muted);
}
@keyframes pulse {
  0%,
  100% {
    opacity: 0.55;
    transform: scale(0.92);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}
/* Тем, у кого в системе отключено движение, показываем неподвижный логотип */
@media (prefers-reduced-motion: reduce) {
  .logo {
    animation: none;
  }
}
</style>
