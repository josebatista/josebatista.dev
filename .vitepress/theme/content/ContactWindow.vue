<template>
  <Terminal prompt="echo $CONTACT">
    <div class="contact-grid">
      <div class="contact-item" v-for="link in links" :key="link.label">
        <span class="contact-label">{{ link.label }}</span>
        <a
          :href="link.url"
          class="contact-value"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`${link.text} (opens in new tab)`"
        >{{ link.text }}</a>
      </div>
    </div>
  </Terminal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Terminal from '../components/Terminal.vue'
import { data as pages } from '../../loaders/contact.data.js'
import { useI18n } from '../i18n/index'

const { isPT } = useI18n()

const links = computed(() => {
  if (pages && pages.length > 0) {
    const page = pages[0] as any
    return isPT.value && page.links_pt?.length ? page.links_pt : page.links || []
  }
  return []
})
</script>
