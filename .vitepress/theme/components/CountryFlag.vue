<template>
  <svg
    class="lang-flag"
    :viewBox="country === 'br' ? '0 0 30 21' : '0 0 30 20'"
    aria-hidden="true"
    focusable="false"
  >
    <template v-if="country === 'us'">
      <rect width="30" height="20" fill="#fff" />
      <rect y="0" width="30" height="1.54" fill="#b22234" />
      <rect y="3.08" width="30" height="1.54" fill="#b22234" />
      <rect y="6.15" width="30" height="1.54" fill="#b22234" />
      <rect y="9.23" width="30" height="1.54" fill="#b22234" />
      <rect y="12.31" width="30" height="1.54" fill="#b22234" />
      <rect y="15.38" width="30" height="1.54" fill="#b22234" />
      <rect y="18.46" width="30" height="1.54" fill="#b22234" />
      <rect width="15.6" height="10.77" fill="#3c3b6e" />
    </template>
    <template v-else>
      <rect width="30" height="21" fill="#009b3a" />
      <polygon points="15,3 27,10.5 15,18 3,10.5" fill="#ffdf00" />
      <circle cx="15" cy="10.5" r="6.2" fill="#002776" />
    </template>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ country: 'us' | 'br' }>()
</script>
