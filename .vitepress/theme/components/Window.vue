<template>
  <div
    v-show="!minimized"
    class="window"
    :class="{ 'window-dragging': isDragging, 'window-resizing': isResizing, 'window-opening': opening, 'window-closing': closing }"
    :style="windowStyle"
    @mousedown="$emit('focus')"
  >
    <div
      class="window-titlebar"
      @mousedown.prevent="startDrag"
      @dblclick.prevent="onTitlebarDblclick"
    >
      <div class="window-controls" @dblclick.stop>
        <button class="dot dot-red" @click.stop="handleClose" title="Close"><span class="dot-icon">✕</span></button>
        <button class="dot dot-yellow" @click.stop="$emit('toggle-maximize')" :title="maximized ? 'Restore' : 'Maximize'"><span class="dot-icon">{{ maximized ? '⧉' : '□' }}</span></button>
      </div>
      <span class="window-title">{{ title }}</span>
      <div class="window-spacer"></div>
    </div>
    <div class="window-content" ref="contentRef">
      <AboutWindow v-if="type === 'terminal'" />
      <BlogWindow v-else-if="type === 'blog'" :initial-article="data?.initialArticle" />
      <ProjectsWindow v-else-if="type === 'projects'" />
      <ContactWindow v-else-if="type === 'contact'" />
    </div>
    <div
      v-if="!maximized"
      class="window-resizer"
      @mousedown.stop.prevent="startResize"
      title="Resize"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AboutWindow from '../content/AboutWindow.vue'
import BlogWindow from '../content/BlogWindow.vue'
import ProjectsWindow from '../content/ProjectsWindow.vue'
import ContactWindow from '../content/ContactWindow.vue'

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

const emit = defineEmits<{
  close: []
  focus: []
  'toggle-maximize': []
}>()

const opening = ref(true)
const closing = ref(false)

onMounted(() => {
  requestAnimationFrame(() => { opening.value = false })
})

function handleClose() {
  closing.value = true
  setTimeout(() => emit('close'), 200)
}

const x = ref(props.initialX)
const y = ref(props.initialY)
const width = ref(props.initialWidth)
const height = ref(props.initialHeight)
const contentRef = ref<HTMLElement | null>(null)

const isDragging = ref(false)
const dragOffset = { x: 0, y: 0 }
let lastTitlebarClick = 0

function onTitlebarDblclick() {
  emit('toggle-maximize')
}

function startDrag(e: MouseEvent) {
  if (props.maximized) return
  const now = Date.now()
  if (now - lastTitlebarClick < 400) {
    lastTitlebarClick = now
    return
  }
  lastTitlebarClick = now
  isDragging.value = true
  dragOffset.x = e.clientX - x.value
  dragOffset.y = e.clientY - y.value

  function onMove(ev: MouseEvent) {
    if (!isDragging.value) return
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    x.value = Math.min(Math.max(ev.clientX - dragOffset.x, 0), viewportWidth - TITLEBAR_VISIBLE)
    y.value = Math.min(Math.max(ev.clientY - dragOffset.y, TOP_BAR_HEIGHT), viewportHeight - TITLEBAR_VISIBLE)
  }

  function onUp() {
    isDragging.value = false
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

const isResizing = ref(false)
const MIN_WIDTH = 320
const MIN_HEIGHT = 240

function startResize(e: MouseEvent) {
  if (props.maximized) return
  emit('focus')
  isResizing.value = true
  const startX = e.clientX
  const startY = e.clientY
  const startWidth = width.value
  const startHeight = height.value

  function onMove(ev: MouseEvent) {
    if (!isResizing.value) return
    width.value = Math.max(MIN_WIDTH, startWidth + (ev.clientX - startX))
    height.value = Math.max(MIN_HEIGHT, startHeight + (ev.clientY - startY))
  }

  function onUp() {
    isResizing.value = false
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

const TOP_BAR_HEIGHT = 36
const TITLEBAR_VISIBLE = 32

const windowStyle = computed(() => ({
  left: props.maximized ? '0px' : x.value + 'px',
  top: props.maximized ? TOP_BAR_HEIGHT + 'px' : y.value + 'px',
  width: props.maximized ? '100vw' : width.value + 'px',
  height: props.maximized ? `calc(100vh - ${TOP_BAR_HEIGHT}px)` : height.value + 'px',
  zIndex: props.zIndex,
}))
</script>
