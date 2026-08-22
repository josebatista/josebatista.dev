<template>
  <button type="button" class="ui-button desktop-icon" :aria-label="`Open ${icon.label}`" @click="$emit('open')">
    <div class="icon-box" aria-hidden="true">
      <span class="icon-symbol material-symbols-outlined">{{ icon.icon }}</span>
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
