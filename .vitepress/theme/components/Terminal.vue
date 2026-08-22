<template>
  <div class="terminal-window">
    <div class="terminal-body" tabindex="0">
      <div class="terminal-line"><span class="prompt">~</span> {{ prompt }}</div>
      <slot />
      <div class="terminal-line"><span class="prompt">~</span> <span class="cursor">█</span></div>
    </div>
    <div v-if="$slots.statusbar" class="window-statusbar">
      <slot name="statusbar" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ prompt: string }>()
</script>
