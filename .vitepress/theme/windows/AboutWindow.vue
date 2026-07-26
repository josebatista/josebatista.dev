<template>
  <Terminal prompt="cat ~/me.txt">
    <div class="terminal-content" v-html="content"></div>

    <div class="sysinfo-grid">
      <div class="sysinfo-item">
        <span class="sysinfo-label">OS</span>
        <span class="sysinfo-value">Neomancy v2.4.1</span>
      </div>
      <div class="sysinfo-item">
        <span class="sysinfo-label">Kernel</span>
        <span class="sysinfo-value">6.5.0-dev-generic</span>
      </div>
      <div class="sysinfo-item">
        <span class="sysinfo-label">Shell</span>
        <span class="sysinfo-value">Zsh (Oh-My-Zsh)</span>
      </div>
      <div class="sysinfo-item">
        <span class="sysinfo-label">WM</span>
        <span class="sysinfo-value">Mutter/Custom</span>
      </div>
    </div>

    <template #statusbar>
      <span>zsh | utf-8 | josebatista@os-v1.0</span>
      <span>SYNC: OK | v1.0.4-STABLE</span>
    </template>
  </Terminal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Terminal from '../components/Terminal.vue'
import { data as pages } from '../about.data.js'

const content = computed(() => {
  if (pages && pages.length > 0) {
    return pages[0].html
  }
  return ''
})
</script>
