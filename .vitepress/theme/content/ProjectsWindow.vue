<template>
  <div class="projects-content">
    <div class="project-card" v-for="project in projects" :key="project.name">
      <h3 class="project-name">{{ project.name }}</h3>
      <p class="project-desc">{{ project.description }}</p>
      <div class="project-meta">
        <span class="project-lang">{{ project.language }}</span>
        <span class="project-stars">★ {{ project.stars }}</span>
      </div>
    </div>
    <div class="eof-marker"><span>[EOF]</span><span class="cursor-blink">█</span></div>
  </div>
</template>

<script setup lang="ts">
const projects = [
  { name: 'neomancy-wm', description: 'A custom window manager written in Rust with a focus on minimalism and keyboard-driven workflows.', language: 'Rust', stars: '1.2k' },
  { name: 'dotfiles', description: 'My personal dotfiles configuration for a fully terminal-based development environment.', language: 'Shell', stars: '847' },
  { name: 'vim-whisper', description: 'Neovim plugin that integrates local LLM suggestions directly into your editing flow.', language: 'Lua', stars: '2.3k' },
  { name: 'kernel-modules', description: 'Collection of Linux kernel modules for experimenting with system-level programming.', language: 'C', stars: '456' },
]
</script>
