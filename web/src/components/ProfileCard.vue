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
  max-width: 860px;
  margin: 0 auto;
  padding: 32px 16px 64px;
}

/* Шапка: имя крупно, должность акцентным цветом, ссылки «пилюлями» */
.head {
  padding-bottom: 8px;
}
h1 {
  margin: 0;
  font-size: 2.2rem;
  letter-spacing: -0.02em;
}
.title {
  margin: 4px 0 0;
  font-size: 1.2rem;
  color: var(--accent);
  font-weight: 600;
}
.description {
  margin: 16px 0;
  max-width: 68ch;
}
.muted {
  margin: 2px 0;
  color: var(--muted);
}
.links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.links a {
  display: inline-block;
  padding: 4px 12px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  color: var(--accent);
  text-decoration: none;
  font-size: 0.9rem;
  transition: border-color 0.15s;
}
.links a:hover {
  border-color: var(--accent);
}

/* Разделы: заголовок с акцентной чертой */
section {
  margin-top: 40px;
}
h2 {
  margin: 0 0 16px;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 12px;
}
h2::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--line);
}
h3 {
  margin: 0 0 6px;
  font-size: 1rem;
}

/* Навыки: «пилюли» по категориям */
.skill-group {
  margin-bottom: 16px;
}
.skills {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.skills li {
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--chip);
  font-size: 0.9rem;
}
.skill-name {
  font-weight: 600;
}
.skills .muted {
  font-size: 0.8rem;
}

/* Опыт: линия времени слева, у каждого места точка */
.job {
  position: relative;
  margin: 0 0 24px 8px;
  padding-left: 20px;
  border-left: 2px solid var(--line);
}
.job::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
}
.achievements {
  margin: 8px 0 0;
  padding-left: 18px;
}
.achievements li {
  margin-bottom: 4px;
}

/* Проекты: карточки */
.project {
  margin-bottom: 12px;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface);
}
.project h3 a {
  color: var(--accent);
  text-decoration: none;
}
.project h3 a:hover {
  text-decoration: underline;
}
.project p {
  margin: 4px 0;
}

@media (max-width: 520px) {
  h1 {
    font-size: 1.8rem;
  }
}
</style>
