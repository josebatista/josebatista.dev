<template>
  <Terminal prompt="echo $CONTACT">
    <div class="contact-grid">
      <div class="contact-item" v-for="link in links" :key="link.label">
        <span class="contact-label">{{ link.label }}</span>
        <a :href="link.url" class="contact-value" target="_blank">{{ link.text }}</a>
      </div>
    </div>
  </Terminal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Terminal from '../components/Terminal.vue'
import { data as pages } from '../../loaders/contact.data.js'

const links = computed(() => {
  if (pages && pages.length > 0) {
    return (pages[0].frontmatter as any).links || []
  }
  return []
})
</script>
