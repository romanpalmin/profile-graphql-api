<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { fetchProfile } from './api'
import ProfileCard from './components/ProfileCard.vue'
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
  <main>
    <p v-if="loading">Загрузка…</p>
    <p v-else-if="error" role="alert">Ошибка: {{ error }}</p>
    <ProfileCard v-else-if="profile" :profile="profile" />
  </main>
</template>
