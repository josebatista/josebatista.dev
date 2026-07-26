<template>
  <div class="projects-window">
    <div class="projects-body">
      <div class="terminal-line"><span class="prompt">~</span> ls -la</div>
      <div class="project-card" v-for="project in projects" :key="project.name">
        <h3 class="project-name">{{ project.name }}</h3>
        <p class="project-desc">{{ project.description }}</p>
        <div class="project-meta">
          <span class="project-lang">{{ project.language }}</span>
          <span class="project-stars">★ {{ project.stars }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { data as pages } from '../projects.data.js'

const projects = computed(() => {
  if (pages && pages.length > 0) {
    return (pages[0].frontmatter as any).projects || []
  }
  return []
})
</script>
