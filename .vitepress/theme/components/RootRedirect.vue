<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  if (typeof window === 'undefined') return
  const lang = (navigator.language || 'en').toLowerCase().startsWith('pt') ? 'pt' : 'en'
  window.location.replace(`/${lang}/`)
})
</script>

<template>
  <p style="font-family: monospace; padding: 2rem">Redirecting…</p>
</template>
