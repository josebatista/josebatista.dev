<template>
  <div class="desktop" @contextmenu.prevent>
    <div class="desktop-wallpaper"></div>

    <TopBar />

    <div class="desktop-icons">
      <DesktopIcon
        v-for="icon in icons"
        :key="icon.id"
        :icon="icon"
        @dblclick="openWindow(icon)"
      />
    </div>

    <Window
      v-for="win in windows"
      :key="win.id"
      :title="win.title"
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TopBar from './components/TopBar.vue'
import Window from './Window.vue'
import DesktopIcon from './DesktopIcon.vue'

interface Icon {
  id: string
  label: string
  icon: string
  type: 'terminal' | 'blog' | 'projects' | 'contact'
}

interface AppWindow {
  id: string
  title: string
  type: 'terminal' | 'blog' | 'projects' | 'contact'
  icon: string
  x: number
  y: number
  width: number
  height: number
  minimized: boolean
  maximized: boolean
  zIndex: number
  data?: any
}

const icons: Icon[] = [
  { id: 'about', label: 'about_me.sh', icon: 'terminal', type: 'terminal' },
  { id: 'blog', label: 'Blog', icon: 'folder', type: 'blog' },
  { id: 'projects', label: 'Projects.lnk', icon: 'folder_open', type: 'projects' },
  { id: 'contact', label: 'Contact.sh', icon: 'mail', type: 'contact' },
]

const windows = ref<AppWindow[]>([])
const activeWindow = ref<string | null>(null)
let nextZ = 1

function openWindow(icon: Icon) {
  const existing = windows.value.find(w => w.id === icon.id)
  if (existing) {
    existing.minimized = false
    focusWindow(icon.id)
    return
  }

  const positions: Record<string, { x: number; y: number; width: number; height: number }> = {
    about: { x: 300, y: 100, width: 720, height: 540 },
    blog: { x: 200, y: 80, width: 960, height: 640 },
    projects: { x: 250, y: 120, width: 720, height: 500 },
    contact: { x: 350, y: 150, width: 640, height: 480 },
  }

  const pos = positions[icon.id] || { x: 200, y: 100, width: 720, height: 540 }

  windows.value.push({
    id: icon.id,
    title: icon.label,
    type: icon.type,
    icon: icon.icon,
    x: pos.x,
    y: pos.y,
    width: pos.width,
    height: pos.height,
    minimized: false,
    maximized: false,
    zIndex: nextZ++,
  })

  activeWindow.value = icon.id
}

function closeWindow(id: string) {
  windows.value = windows.value.filter(w => w.id !== id)
  if (activeWindow.value === id) {
    activeWindow.value = windows.value.length > 0 ? windows.value[windows.value.length - 1].id : null
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
