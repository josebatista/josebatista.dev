<template>
  <Layout v-if="!page?.isNotFound" />
  <DesktopHome v-else />
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DesktopHome from './layouts/DesktopHome.vue'

const { Layout } = DefaultTheme
const { page } = useData()
</script>
