<template>
  <section class="giscus-comments" :aria-label="t('blog.comments')">
    <h2 class="giscus-heading">{{ t('blog.comments') }}</h2>
    <div ref="containerRef" class="giscus" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { GISCUS, LOCALE_PT } from '../constants'
import { useI18n } from '../i18n/index'
import { useTheme } from '../theme/index'

const { locale, t } = useI18n()
const { theme } = useTheme()
const containerRef = ref<HTMLElement | null>(null)

function giscusTheme() {
  return theme.value === 'dark' ? 'dark_dimmed' : 'light'
}

function giscusLanguage() {
  return locale.value === LOCALE_PT ? 'pt' : 'en'
}

function render() {
  const container = containerRef.value
  if (!container) return

  container.replaceChildren()

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('data-repo', GISCUS.repo)
  script.setAttribute('data-repo-id', GISCUS.repoId)
  script.setAttribute('data-category', GISCUS.category)
  script.setAttribute('data-category-id', GISCUS.categoryId)
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'bottom')
  script.setAttribute('data-theme', giscusTheme())
  script.setAttribute('data-lang', giscusLanguage())
  script.setAttribute('data-loading', 'lazy')
  container.appendChild(script)
}

function syncConfig() {
  const iframe = containerRef.value?.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  iframe?.contentWindow?.postMessage(
    {
      giscus: {
        setConfig: {
          theme: giscusTheme(),
          lang: giscusLanguage(),
        },
      },
    },
    'https://giscus.app'
  )
}

onMounted(render)
watch([theme, locale], syncConfig)
</script>
