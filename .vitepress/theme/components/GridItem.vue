<template>
  <button type="button" class="ui-button grid-item" @click="$emit('select')">
    <div class="grid-item-thumb">
      <slot name="thumbnail">
        <span class="grid-item-icon" aria-hidden="true">{{ icon }}</span>
      </slot>
    </div>
    <div class="grid-item-body">
      <slot>
        <span class="grid-item-title">{{ title }}</span>
        <span class="grid-item-date">{{ date }}</span>
      </slot>
    </div>
  </button>
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
