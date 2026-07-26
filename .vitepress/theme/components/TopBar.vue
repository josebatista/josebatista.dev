<template>
  <div class="top-bar">
    <span class="brand">josebatista.dev</span>
    <span class="clock">{{ time }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const time = ref('')
let timer: number

function updateClock() {
  const now = new Date()
  time.value = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  updateClock()
  timer = window.setInterval(updateClock, 10000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>
