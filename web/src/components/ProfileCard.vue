<script setup lang="ts">
import { computed } from 'vue'
import { formatLevel, formatPeriod, groupSkillsByCategory } from '../format'
import type { Profile } from '../types'

const props = defineProps<{ profile: Profile }>()

const skillGroups = computed(() => groupSkillsByCategory(props.profile.skills))

// Внешние ссылки открываем в новой вкладке; mailto: и tel: оставляем как есть.
const isExternal = (url: string) => /^https?:\/\//.test(url)
</script>

<template>
  <article class="card">
    <header class="head">
      <h1>{{ profile.name }}</h1>
      <p class="title">{{ profile.title }}</p>
      <p v-if="profile.location" class="muted">{{ profile.location }}</p>
      <p class="description">{{ profile.description }}</p>
      <ul class="links">
        <li v-for="link in profile.links" :key="link.id">
          <a
            :href="link.url"
            :target="isExternal(link.url) ? '_blank' : undefined"
            :rel="isExternal(link.url) ? 'noopener noreferrer' : undefined"
            >{{ link.label }}</a
          >
        </li>
      </ul>
    </header>

    <section>
      <h2>Навыки</h2>
      <div v-for="group in skillGroups" :key="group.category" class="skill-group">
        <h3>{{ group.category }}</h3>
        <ul class="skills">
          <li v-for="skill in group.skills" :key="skill.id">
            <span class="skill-name">{{ skill.name }}</span>
            <span v-if="formatLevel(skill.level)" class="muted"> · {{ formatLevel(skill.level) }}</span>
            <span v-if="skill.note" class="muted"> ({{ skill.note }})</span>
          </li>
        </ul>
      </div>
    </section>

    <section>
      <h2>Опыт</h2>
      <div v-for="item in profile.experience" :key="item.id" class="job">
        <h3>{{ item.position }} · {{ item.company }}</h3>
        <p class="muted">{{ formatPeriod(item.startDate, item.endDate) }}</p>
        <ul v-if="item.achievements.length" class="achievements">
          <li v-for="achievement in item.achievements" :key="achievement.id">{{ achievement.text }}</li>
        </ul>
      </div>
    </section>

    <section>
      <h2>Проекты</h2>
      <div v-for="project in profile.projects" :key="project.id" class="project">
        <h3>
          <a :href="project.url" target="_blank" rel="noopener noreferrer">{{ project.name }}</a>
        </h3>
        <p>{{ project.description }}</p>
        <p class="muted">{{ project.technologies.join(', ') }}</p>
      </div>
    </section>
  </article>
</template>

<style scoped>
.card {
  max-width: 820px;
  margin: 0 auto;
  padding: 24px 16px 48px;
  font-family: system-ui, sans-serif;
  line-height: 1.5;
  color: #1c2333;
}
h1 { margin: 0 0 4px; }
h2 { margin: 32px 0 8px; border-bottom: 1px solid #d8dde8; padding-bottom: 4px; }
h3 { margin: 16px 0 4px; font-size: 1.05rem; }
.title { margin: 0; font-size: 1.15rem; }
.muted { color: #5b6478; margin: 2px 0; }
.links, .skills { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 4px 16px; }
.achievements { margin: 6px 0 0; padding-left: 20px; }
.achievements li { margin-bottom: 4px; }
</style>
