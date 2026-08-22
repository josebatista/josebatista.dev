<template>
  <Terminal prompt="cat ~/me.txt">
    <div class="terminal-content" v-html="content"></div>

    <div class="sysinfo-grid">
      <div class="sysinfo-item">
        <span class="sysinfo-label">{{ t('sys.os') }}</span>
        <span class="sysinfo-value">Neomancy v2.4.1</span>
      </div>
      <div class="sysinfo-item">
        <span class="sysinfo-label">{{ t('sys.kernel') }}</span>
        <span class="sysinfo-value">6.5.0-dev-generic</span>
      </div>
      <div class="sysinfo-item">
        <span class="sysinfo-label">{{ t('sys.shell') }}</span>
        <span class="sysinfo-value">Zsh (Oh-My-Zsh)</span>
      </div>
      <div class="sysinfo-item">
        <span class="sysinfo-label">{{ t('sys.wm') }}</span>
        <span class="sysinfo-value">Mutter/Custom</span>
      </div>
    </div>

    <template #statusbar>
      <span>{{ SYSINFO.terminal }}</span>
      <span>{{ SYSINFO.sync }}</span>
    </template>
  </Terminal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Terminal from '../components/Terminal.vue'
import { data as pages } from '../../loaders/about.data.js'
import { useI18n } from '../i18n/index'
import { SYSINFO } from '../constants'

const { isPT, t } = useI18n()

const content = computed(() => {
  if (pages && pages.length > 0) {
    const page = pages[0] as any
    return isPT.value && page.html_pt ? page.html_pt : page.html_en
  }
  return ''
})
</script>
