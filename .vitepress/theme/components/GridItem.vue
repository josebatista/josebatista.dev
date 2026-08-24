<template>
  <button type="button" class="ui-button grid-item" @click="$emit('select')">
    <div class="grid-item-thumb">
      <slot name="thumbnail">
        <img v-if="cover" class="grid-item-cover" :src="cover" :alt="title || ''" />
        <span v-else class="grid-item-icon material-symbols-outlined" aria-hidden="true">{{ icon }}</span>
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
  cover?: string
}>(), {
  icon: 'description',
})

defineEmits<{ select: [] }>()
</script>
