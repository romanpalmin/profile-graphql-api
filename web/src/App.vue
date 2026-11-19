<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { fetchProfile } from './api'
import AppLoader from './components/AppLoader.vue'
import ProfileCard from './components/ProfileCard.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import type { Profile } from './types'

// Три состояния запроса: загрузка, ошибка, данные (карточка профиля).
const profile = ref<Profile | null>(null)
const error = ref<string | null>(null)
const loading = ref(true)

// Отмена запроса при уходе со страницы: не оставляем висящий fetch.
const controller = new AbortController()

onMounted(async () => {
  try {
    profile.value = await fetchProfile(controller.signal)
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return
    error.value = e instanceof Error ? e.message : 'Неизвестная ошибка'
  } finally {
    loading.value = false
  }
})

onUnmounted(() => controller.abort())
</script>

<template>
  <ThemeToggle />
  <main>
    <AppLoader v-if="loading" />
    <p v-else-if="error" class="error" role="alert">Ошибка: {{ error }}</p>
    <ProfileCard v-else-if="profile" :profile="profile" />
  </main>
</template>

<style scoped>
/* Ошибку тоже ставим по центру экрана, чтобы она не терялась в углу */
.error {
  min-height: 100vh;
  display: grid;
  place-items: center;
  margin: 0;
  padding: 0 16px;
  text-align: center;
  color: var(--text);
}
</style>
