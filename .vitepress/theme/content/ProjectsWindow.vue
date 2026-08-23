<template>
  <div class="projects-window">
    <div class="projects-body" tabindex="0">
      <div class="terminal-line"><span class="prompt">~</span> ls -la</div>
      <div class="project-card" v-for="project in projects" :key="project.name">
        <h2 class="project-name">{{ project.name }}</h2>
        <p class="project-desc">{{ project.description }}</p>
        <div class="project-meta">
          <span class="project-lang">{{ project.language }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { data as pages } from '../../loaders/projects.data.js'
import { useI18n } from '../i18n/index'

const { isPT } = useI18n()

const projects = computed(() => {
  if (pages && pages.length > 0) {
    const page = pages[0] as any
    return isPT.value && page.projects_pt?.length ? page.projects_pt : page.projects || []
  }
  return []
})
</script>
