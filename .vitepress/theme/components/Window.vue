<template>
<div
    ref="windowRef"
    v-show="!minimized"
    class="window"
    :class="{ 'window-dragging': isDragging, 'window-resizing': isResizing, 'window-opening': opening, 'window-closing': closing }"
    :style="windowStyle"
    role="dialog"
    :aria-labelledby="titleId"
    tabindex="-1"
    @pointerdown="$emit('focus')"
    @keydown.esc="handleClose"
  >
    <div
      class="window-titlebar"
      @pointerdown.prevent="startDrag"
      @dblclick.prevent="onTitlebarDblclick"
    >
      <div class="window-controls" @dblclick.stop>
        <button class="dot dot-red" @click.stop="handleClose" :title="t('window.close')" :aria-label="t('window.close')"><span class="dot-icon" aria-hidden="true">✕</span></button>
        <button v-if="!isPhone" class="dot dot-yellow" @click.stop="$emit('toggle-maximize')" :title="maximized ? t('window.restore') : t('window.maximize')" :aria-label="maximized ? t('window.restore') : t('window.maximize')"><span class="dot-icon" aria-hidden="true">{{ maximized ? '⧉' : '□' }}</span></button>
      </div>
      <span class="window-title" :id="titleId">{{ t(titleKey) }}</span>
      <div class="window-spacer"></div>
    </div>
    <div class="window-content">
      <AboutWindow v-if="type === WINDOW_TYPES.TERMINAL" />
      <BlogWindow v-else-if="type === WINDOW_TYPES.BLOG" :initial-article="data?.initialArticle" />
      <ProjectsWindow v-else-if="type === WINDOW_TYPES.PROJECTS" />
      <ContactWindow v-else-if="type === WINDOW_TYPES.CONTACT" />
      <NotFoundWindow v-else-if="type === WINDOW_TYPES.NOT_FOUND" />
    </div>
    <div
      v-if="!maximized"
      class="window-resizer"
      @pointerdown.stop.prevent="startResize"
      :title="t('window.resize')"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, useId } from 'vue'
import AboutWindow from '../content/AboutWindow.vue'
import BlogWindow from '../content/BlogWindow.vue'
import ProjectsWindow from '../content/ProjectsWindow.vue'
import ContactWindow from '../content/ContactWindow.vue'
import NotFoundWindow from '../content/NotFoundWindow.vue'
import { useI18n } from '../i18n/index'
import { useIsMobile } from '../composables/useIsMobile'
import { WINDOW_TYPES } from '../constants'

const { t } = useI18n()
const { isPhone } = useIsMobile()

const props = defineProps<{
  titleKey: string
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
const titleId = useId()
const windowRef = ref<HTMLElement | null>(null)

function clampToViewport() {
  if (props.maximized) return
  const vw = window.innerWidth
  const vh = window.innerHeight
  const M = 12
  width.value = Math.min(Math.max(width.value, MIN_WIDTH), vw - M * 2)
  height.value = Math.min(Math.max(height.value, MIN_HEIGHT), vh - TOP_BAR_HEIGHT - M * 2)
  x.value = Math.min(Math.max(x.value, M), vw - width.value - M)
  y.value = Math.min(Math.max(y.value, TOP_BAR_HEIGHT), vh - height.value - M)
}

onMounted(() => {
  requestAnimationFrame(() => { opening.value = false })
  windowRef.value?.focus({ preventScroll: true })
  window.addEventListener('resize', clampToViewport)
})

onUnmounted(() => {
  window.removeEventListener('resize', clampToViewport)
})

function handleClose() {
  closing.value = true
  setTimeout(() => emit('close'), 200)
}

const x = ref(props.initialX)
const y = ref(props.initialY)
const width = ref(props.initialWidth)
const height = ref(props.initialHeight)
const isDragging = ref(false)
const dragOffset = { x: 0, y: 0 }
let lastTitlebarClick = 0

function onTitlebarDblclick() {
  if (isPhone.value) return
  emit('toggle-maximize')
}

function startDrag(e: PointerEvent) {
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

  function onMove(ev: PointerEvent) {
    if (!isDragging.value) return
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    x.value = Math.min(Math.max(ev.clientX - dragOffset.x, 0), viewportWidth - TITLEBAR_VISIBLE)
    y.value = Math.min(Math.max(ev.clientY - dragOffset.y, TOP_BAR_HEIGHT), viewportHeight - TITLEBAR_VISIBLE)
  }

  function onUp() {
    isDragging.value = false
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerup', onUp)
  }

  document.addEventListener('pointermove', onMove)
  document.addEventListener('pointerup', onUp)
}

const isResizing = ref(false)
const MIN_WIDTH = 320
const MIN_HEIGHT = 240

function startResize(e: PointerEvent) {
  if (props.maximized) return
  emit('focus')
  isResizing.value = true
  const startX = e.clientX
  const startY = e.clientY
  const startWidth = width.value
  const startHeight = height.value

  function onMove(ev: PointerEvent) {
    if (!isResizing.value) return
    width.value = Math.max(MIN_WIDTH, startWidth + (ev.clientX - startX))
    height.value = Math.max(MIN_HEIGHT, startHeight + (ev.clientY - startY))
  }

  function onUp() {
    isResizing.value = false
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerup', onUp)
  }

  document.addEventListener('pointermove', onMove)
  document.addEventListener('pointerup', onUp)
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
