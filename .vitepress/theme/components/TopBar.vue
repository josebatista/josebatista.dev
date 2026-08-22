<template>
  <header class="top-bar">
    <span class="brand">{{ SITE_NAME }}</span>
    <div class="top-bar-right">
      <button
        type="button"
        class="lang-switch ui-button"
        :aria-label="t('switch.to')"
        :title="t('switch.to')"
        @click="toggleLocale"
      >
        <CountryFlag :country="locale === LOCALE_EN ? 'us' : 'br'" />
        <span class="lang-label sr-only">{{ locale === LOCALE_EN ? 'PT' : 'EN' }}</span>
      </button>
      <button
        type="button"
        class="theme-switch ui-button"
        :aria-label="theme === 'dark' ? t('theme.toLight') : t('theme.toDark')"
        :title="theme === 'dark' ? t('theme.toLight') : t('theme.toDark')"
        @click="toggleTheme"
      >
        <span class="material-symbols-outlined">{{ theme === 'dark' ? 'light_mode' : 'dark_mode' }}</span>
      </button>
      <span class="clock">{{ time }}</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../i18n/index'
import { useTheme } from '../theme/index'
import { SITE_NAME, LOCALE_EN } from '../constants'
import CountryFlag from './CountryFlag.vue'

const { locale, toggleLocale, t } = useI18n()
const { theme, toggleTheme } = useTheme()
const time = ref('')

function updateClock() {
  const now = new Date()
  time.value = now.toLocaleDateString(locale.value, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

let timer: number
onMounted(() => {
  updateClock()
  timer = window.setInterval(updateClock, 10000)
})
watch(locale, updateClock)
onUnmounted(() => clearInterval(timer))
</script>
