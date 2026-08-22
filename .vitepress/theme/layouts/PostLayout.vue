<template>
  <DesktopHome :initial-article="articleSlug" :title="pageTitle" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import DesktopHome from './DesktopHome.vue'
import { SITE_NAME } from '../constants'

const { page } = useData()

const articleSlug = computed(() => {
  const relativePath = page.value?.relativePath ?? ''
  const parts = relativePath.split('/').filter(Boolean)
  const file = parts[parts.length - 1] ?? ''
  return file.replace(/\.md$/, '')
})

const pageTitle = computed(() => page.value?.title || SITE_NAME)
</script>