<template>
  <div class="contact-window">
    <div class="contact-body">
      <div class="terminal-line"><span class="prompt">~</span> echo $CONTACT</div>
      <div class="contact-grid">
        <div class="contact-item" v-for="link in links" :key="link.label">
          <span class="contact-label">{{ link.label }}</span>
          <a :href="link.url" class="contact-value" target="_blank">{{ link.text }}</a>
        </div>
      </div>
      <div class="terminal-line"><span class="prompt">~</span> <span class="cursor">█</span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { data as pages } from '../contact.data.js'

const links = computed(() => {
  if (pages && pages.length > 0) {
    return (pages[0].frontmatter as any).links || []
  }
  return []
})
</script>
