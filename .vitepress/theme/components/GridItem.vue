<template>
  <div class="grid-item" @click="$emit('select')">
    <div class="grid-item-thumb">
      <slot name="thumbnail">
        <span class="grid-item-icon">{{ icon }}</span>
      </slot>
    </div>
    <div class="grid-item-body">
      <slot>
        <span class="grid-item-title">{{ title }}</span>
        <span class="grid-item-date">{{ date }}</span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  title?: string
  date?: string
}>(), {
  icon: '📄',
})

defineEmits<{ select: [] }>()
</script>
