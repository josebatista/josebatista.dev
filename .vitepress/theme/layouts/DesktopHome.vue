<template>
  <main class="desktop" @contextmenu.prevent>
    <h1 class="sr-only">{{ title }}</h1>
    <div class="desktop-wallpaper">
      <MatrixRain />
    </div>

    <TopBar />

    <div class="desktop-icons">
      <DesktopIcon
        v-for="icon in icons"
        :key="icon.id"
        :icon="icon"
        @open="openWindow(icon)"
      />
    </div>

    <Window
      v-for="win in windows"
      :key="win.id"
      :title-key="win.titleKey"
      :type="win.type"
      :icon="win.icon"
      :z-index="win.zIndex"
      :initial-x="win.x"
      :initial-y="win.y"
      :initial-width="win.width"
      :initial-height="win.height"
      :minimized="win.minimized"
      :maximized="win.maximized"
      :data="win.data"
      @close="closeWindow(win.id)"
      @focus="focusWindow(win.id)"
      @toggle-maximize="toggleMaximize(win.id)"
      :class="{ 'window-focused': win.id === activeWindow }"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useData } from 'vitepress'
import MatrixRain from '../components/MatrixRain.vue'
import TopBar from '../components/TopBar.vue'
import Window from '../components/Window.vue'
import DesktopIcon from '../components/DesktopIcon.vue'
import { useI18n } from '../i18n/index'
import { useIsMobile } from '../composables/useIsMobile'
import { SITE_NAME, WINDOW_TYPES, SECTIONS, PREFIX_EN, PREFIX_PT, type WindowType } from '../constants'

const { t, isPT } = useI18n()
const { isPhone } = useIsMobile()
const { page, site } = useData()

const props = withDefaults(defineProps<{ initialArticle?: string; title?: string }>(), {
  initialArticle: '',
  title: SITE_NAME,
})

interface Icon {
  id: string
  key?: string
  label: string
  icon: string
  type: WindowType
}

interface AppWindow {
  id: string
  titleKey: string
  type: WindowType
  icon: string
  x: number
  y: number
  width: number
  height: number
  minimized: boolean
  maximized: boolean
  zIndex: number
  data?: any
  trigger?: HTMLElement | null
}

const iconDefs: { id: string; key: string; icon: string; type: WindowType }[] = [
  { id: SECTIONS.ABOUT, key: 'icons.about', icon: 'terminal', type: WINDOW_TYPES.TERMINAL },
  { id: SECTIONS.BLOG, key: 'icons.blog', icon: 'folder', type: WINDOW_TYPES.BLOG },
  { id: SECTIONS.PROJECTS, key: 'icons.projects', icon: 'folder', type: WINDOW_TYPES.PROJECTS },
  { id: SECTIONS.CONTACT, key: 'icons.contact', icon: 'mail', type: WINDOW_TYPES.CONTACT },
]

const icons = computed(() =>
  iconDefs.map((d) => ({ ...d, label: t(d.key) }))
)

const windows = ref<AppWindow[]>([])
const activeWindow = ref<string | null>(null)
let nextZ = 1

function openWindow(icon: Icon, data?: any) {
  const existing = windows.value.find(w => w.id === icon.id)
  if (existing) {
    existing.minimized = false
    existing.data = data
    focusWindow(icon.id)
    return
  }

  const positions: Record<string, { x: number; y: number; width: number; height: number }> = {
    [SECTIONS.ABOUT]: { x: 300, y: 100, width: 720, height: 540 },
    [SECTIONS.BLOG]: { x: 200, y: 80, width: 960, height: 640 },
    [SECTIONS.PROJECTS]: { x: 250, y: 120, width: 720, height: 500 },
    [SECTIONS.CONTACT]: { x: 350, y: 150, width: 640, height: 480 },
    [SECTIONS.NOT_FOUND]: { x: 320, y: 140, width: 560, height: 380 },
  }

  const pos = positions[icon.id] || { x: 200, y: 100, width: 720, height: 540 }

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const MARGIN = 12
  const TOP_BAR = 36
  const winW = Math.min(pos.width, vw - MARGIN * 2)
  const winH = Math.min(pos.height, vh - TOP_BAR - MARGIN * 2)
  const winX = Math.max(MARGIN, Math.min(pos.x, vw - winW - MARGIN))
  const winY = Math.max(TOP_BAR, Math.min(pos.y, vh - winH - MARGIN))

  windows.value.push({
    id: icon.id,
    titleKey: icon.key ?? icon.label,
    type: icon.type,
    icon: icon.icon,
    x: winX,
    y: winY,
    width: winW,
    height: winH,
    minimized: false,
    maximized: isPhone.value,
    zIndex: nextZ++,
    data,
    trigger:
      typeof document !== 'undefined' && document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null,
  })

  activeWindow.value = icon.id
}

function openNotFoundWindow() {
  const nfIcon: Icon = {
    id: SECTIONS.NOT_FOUND,
    key: 'notFound.title',
    label: t('notFound.title'),
    icon: 'error',
    type: WINDOW_TYPES.NOT_FOUND,
  }
  openWindow(nfIcon)
  // Clean the invalid path from the URL bar without triggering a route
  // change (VitePress only reacts to click/popstate, not replaceState), so
  // the 404 window stays open on the desktop.
  if (typeof window !== 'undefined') {
    const home = isPT.value ? `/${PREFIX_PT}/` : `/${PREFIX_EN}/`
    history.replaceState(null, '', home)
  }
}

onMounted(() => {
  if (props.initialArticle) {
    const blog = icons.value.find(i => i.id === SECTIONS.BLOG)
    if (blog) openWindow(blog, { initialArticle: props.initialArticle })
  }
})

watch(
  () => page.value?.isNotFound,
  (isNotFound) => {
    if (isNotFound) openNotFoundWindow()
  },
  { immediate: true }
)

function closeWindow(id: string) {
  const win = windows.value.find(w => w.id === id)
  windows.value = windows.value.filter(w => w.id !== id)
  if (activeWindow.value === id) {
    activeWindow.value = windows.value.length > 0 ? windows.value[windows.value.length - 1].id : null
  }
  if (win?.trigger && document.contains(win.trigger)) {
    win.trigger.focus({ preventScroll: true })
  }
}

function focusWindow(id: string) {
  const win = windows.value.find(w => w.id === id)
  if (win) {
    win.zIndex = nextZ++
    activeWindow.value = id
  }
}

function toggleMaximize(id: string) {
  const win = windows.value.find(w => w.id === id)
  if (win) {
    win.maximized = !win.maximized
  }
}
</script>
