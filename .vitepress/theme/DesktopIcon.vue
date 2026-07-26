<template>
  <div class="desktop-icon" @dblclick="$emit('dblclick')">
    <div class="icon-box">
      <span v-if="icon.icon === 'terminal'" class="icon-symbol">></span>
      <span v-else-if="icon.icon === 'folder'" class="icon-symbol">📁</span>
      <span v-else-if="icon.icon === 'folder_open'" class="icon-symbol">📂</span>
      <span v-else-if="icon.icon === 'mail'" class="icon-symbol">✉</span>
    </div>
    <span class="icon-label">{{ icon.label }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: { id: string; label: string; icon: string; type: string }
}>()

defineEmits<{
  dblclick: []
}>()
</script>
