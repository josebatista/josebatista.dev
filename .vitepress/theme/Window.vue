<template>
  <div
    v-show="!minimized"
    class="window"
    :style="windowStyle"
    @mousedown.prevent="$emit('focus')"
  >
    <div
      class="window-titlebar"
      @mousedown.prevent="startDrag"
    >
      <div class="window-controls">
        <button class="dot dot-red" @click.stop="$emit('close')" title="Close"><span class="dot-icon">✕</span></button>
        <button class="dot dot-yellow" @click.stop="$emit('toggle-maximize')" :title="maximized ? 'Restore' : 'Maximize'"><span class="dot-icon">{{ maximized ? '⧉' : '□' }}</span></button>
      </div>
      <span class="window-title">{{ title }}</span>
      <div class="window-spacer"></div>
    </div>
    <div class="window-content" ref="contentRef">
      <TerminalWindow v-if="type === 'terminal'" />
      <BlogWindow v-else-if="type === 'blog'" />
      <ProjectsWindow v-else-if="type === 'projects'" />
      <ContactWindow v-else-if="type === 'contact'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TerminalWindow from './content/TerminalWindow.vue'
import BlogWindow from './content/BlogWindow.vue'
import ProjectsWindow from './content/ProjectsWindow.vue'
import ContactWindow from './content/ContactWindow.vue'

const props = defineProps<{
  title: string
  type: string
  icon: string
  zIndex: number
  initialX: number
  initialY: number
  initialWidth: number
  initialHeight: number
  minimized: boolean
  maximized: boolean
  data?: any
}>()

defineEmits<{
  close: []
  focus: []
  'toggle-maximize': []
}>()

const x = ref(props.initialX)
const y = ref(props.initialY)
const width = ref(props.initialWidth)
const height = ref(props.initialHeight)
const contentRef = ref<HTMLElement | null>(null)

const isDragging = ref(false)
const dragOffset = { x: 0, y: 0 }

function startDrag(e: MouseEvent) {
  if (props.maximized) return
  isDragging.value = true
  dragOffset.x = e.clientX - x.value
  dragOffset.y = e.clientY - y.value

  function onMove(ev: MouseEvent) {
    if (!isDragging.value) return
    x.value = ev.clientX - dragOffset.x
    y.value = ev.clientY - dragOffset.y
  }

  function onUp() {
    isDragging.value = false
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

const TOP_BAR_HEIGHT = 36

const windowStyle = computed(() => ({
  left: props.maximized ? '0px' : x.value + 'px',
  top: props.maximized ? TOP_BAR_HEIGHT + 'px' : y.value + 'px',
  width: props.maximized ? '100vw' : width.value + 'px',
  height: props.maximized ? `calc(100vh - ${TOP_BAR_HEIGHT}px)` : height.value + 'px',
  zIndex: props.zIndex,
}))
</script>
