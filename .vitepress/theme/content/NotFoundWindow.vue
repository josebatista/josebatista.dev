<template>
  <Terminal prompt="cat /var/log/route.log">
    <div class="terminal-content">
      <p class="nf-code">$ HTTP 404 &middot; NOT_FOUND</p>
      <h2 class="nf-heading">{{ t('notFound.heading') }}</h2>
      <p class="nf-message">{{ t('notFound.message') }}</p>
      <p class="nf-hint">{{ t('notFound.hint') }}</p>
    </div>

    <template #statusbar>
      <span>status: 404</span>
    </template>
  </Terminal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Terminal from '../components/Terminal.vue'
import { useI18n } from '../i18n/index'

const { t } = useI18n()

const route = ref('')
onMounted(() => {
  route.value = window.location.pathname || '/'
})
</script>
