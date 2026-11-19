<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { fetchProfile } from './api'
import type { Profile } from './types'

// Временный экран F2: показывает три состояния запроса. В F3 данные превратятся в карточку профиля.
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
    <template v-else-if="profile">
      <h1>{{ profile.name }}</h1>
      <p>{{ profile.title }}</p>
      <p>
        Навыков: {{ profile.skills.length }}, мест работы: {{ profile.experience.length }}, проектов:
        {{ profile.projects.length }}
      </p>
    </template>
  </main>
</template>
