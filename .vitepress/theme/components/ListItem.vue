<template>
  <button type="button" class="ui-button list-item" :class="{ active }" @click="$emit('select')">
    <span class="list-item-icon" aria-hidden="true">{{ icon }}</span>
    <div class="list-item-info">
      <span class="list-item-title">{{ title }}</span>
      <span v-if="description" class="list-item-desc">{{ description }}</span>
      <div v-if="$slots.meta" class="list-item-meta">
        <slot name="meta" />
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  title: string
  description?: string
  active?: boolean
}>(), {
  icon: '📄',
  active: false,
})

defineEmits<{ select: [] }>()
</script>
