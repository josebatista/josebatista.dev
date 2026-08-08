<template>
  <button type="button" class="ui-button desktop-icon" :aria-label="`Open ${icon.label}`" @click="$emit('open')">
    <div class="icon-box" aria-hidden="true">
      <span v-if="icon.icon === 'terminal'" class="icon-symbol">></span>
      <span v-else-if="icon.icon === 'folder'" class="icon-symbol">📁</span>
      <span v-else-if="icon.icon === 'folder_open'" class="icon-symbol">📂</span>
      <span v-else-if="icon.icon === 'mail'" class="icon-symbol">✉</span>
    </div>
    <span class="icon-label">{{ icon.label }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  icon: { id: string; label: string; icon: string; type: string }
}>()

defineEmits<{
  open: []
}>()
</script>
