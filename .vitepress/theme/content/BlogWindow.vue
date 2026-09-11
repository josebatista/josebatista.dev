<template>
  <div class="blog-window">
    <div class="blog-toolbar" :class="isGridView ? 'view-grid' : 'view-article'">
      <template v-if="isGridView">
        <div class="toolbar-breadcrumb">
          <span class="crumb">~</span>
          <span class="crumb-sep">/</span>
          <span class="crumb">{{ t('blog.crumb.document') }}</span>
          <span class="crumb-sep">/</span>
          <span class="crumb active">{{ t('blog.crumb.blog') }}</span>
        </div>
      </template>
      <template v-else>
        <button class="toolbar-back" @click="backToGrid" :aria-label="t('blog.back')">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <div class="toolbar-breadcrumb">
          <span class="crumb">..</span>
          <span class="crumb-sep">/</span>
          <span class="crumb">{{ t('blog.crumb.blog') }}</span>
          <span class="crumb-sep">/</span>
          <span class="crumb active">{{ activePost?.title }}</span>
        </div>
      </template>
      <div class="toolbar-search">
        <div class="search-wrapper">
          <span class="search-icon material-symbols-outlined">search</span>
          <input type="text" :placeholder="t('blog.search')" aria-label="Search posts" v-model="searchQuery" />
        </div>
      </div>
    </div>

    <div v-if="isGridView" ref="gridRef" tabindex="-1" class="blog-grid">
      <GridItem
        v-for="post in filteredPosts"
        :key="post.url"
        :title="post.title"
        :date="formatDate(post.date)"
        :cover="post.cover"
        @select="openPost(post)"
      />
    </div>

    <div v-else class="blog-split">
      <div class="blog-sidebar">
        <div class="sidebar-directory">
          <div class="sidebar-label">{{ t('sidebar.directory') }}</div>
          <ListItem
            v-for="post in filteredPosts"
            :key="post.slug"
            :title="post.title"
            :description="post.description"
            :active="selectedPost?.slug === post.slug"
            @select="openPost(post)"
          >
            <template #meta>
              <div class="list-item-date">{{ formatDate(post.date) }}</div>
              <div class="list-item-tags">
                <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </template>
          </ListItem>
        </div>

        <div class="sidebar-footer">
          <div class="sidebar-section">
            <div class="sidebar-label">{{ t('sidebar.tags') }}</div>
            <div class="tags-list">
              <button
                v-for="tag in allTags"
                :key="tag"
                type="button"
                class="ui-button tag-pill"
                :class="{ active: activeTag === tag }"
                :aria-pressed="activeTag === tag"
                @click="activeTag = activeTag === tag ? '' : tag"
              >#{{ tag }}</button>
            </div>
          </div>

          <div class="sidebar-storage">
            <div class="storage-label">{{ t('sidebar.disk') }}</div>
            <div class="storage-bar"><div class="storage-fill" /></div>
            <span class="storage-text">{{ SYSINFO.diskPercent }}% — {{ SYSINFO.diskUsed }} / {{ SYSINFO.diskTotal }}</span>
          </div>
        </div>
      </div>

      <div ref="articleRef" tabindex="-1" class="blog-article" v-if="selectedPost">
        <article v-html="activePost?.html"></article>
        <GiscusComments :key="activePost?.url" />
        <div class="eof-marker">
          <span>[{{ t('eof') }}]</span>
          <span class="cursor-blink">█</span>
        </div>
      </div>
    </div>

    <div class="window-statusbar">
      <span aria-live="polite">{{ filteredPosts.length }} {{ t('statusbar.items') }} | {{ SYSINFO.diskUsed }} | {{ SYSINFO.diskPercent }}% {{ t('statusbar.disk') }}</span>
      <span>{{ t('sidebar.permission') }}: {{ SYSINFO.permissions }} | {{ t('sidebar.user') }}: {{ SYSINFO.user }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import GridItem from '../components/GridItem.vue'
import GiscusComments from '../components/GiscusComments.vue'
import ListItem from '../components/ListItem.vue'
import { data as rawPosts } from '../../loaders/posts.data.js'
import { useI18n } from '../i18n/index'
import { SITE_NAME, SYSINFO, LOCALE_EN, LOCALE_PT, PREFIX_EN, PREFIX_PT } from '../constants'

const { t, isPT } = useI18n()

const props = defineProps<{ initialArticle?: string }>()

type RawPost = (typeof rawPosts)[number]

// Seed deep-linked articles during setup so VitePress includes the complete
// article in the server-rendered HTML instead of waiting for hydration.
const initialPost: RawPost | null = props.initialArticle
  ? rawPosts.find((post) => post.slug === props.initialArticle) ?? null
  : null
const isGridView = ref(!initialPost)
const selectedPost = ref<RawPost | null>(initialPost)
const searchQuery = ref('')
const activeTag = ref('')
const gridRef = ref<HTMLElement | null>(null)
const articleRef = ref<HTMLElement | null>(null)

const posts = computed(() =>
  rawPosts.map((p) => ({
    ...p,
    title: isPT.value && p.title_pt ? p.title_pt : p.title,
    description: isPT.value && p.description_pt ? p.description_pt : p.description,
    cover: isPT.value && p.cover_pt ? p.cover_pt : p.cover,
  }))
)

const filteredPosts = computed(() => {
  return posts.value.filter((post) => {
    if (searchQuery.value && !post.title.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
    if (activeTag.value && !post.tags.includes(activeTag.value)) return false
    return true
  })
})

const activePost = computed(() => {
  if (!selectedPost.value) return null
  const p = selectedPost.value
  return {
    ...p,
    html: isPT.value && p.html_pt ? p.html_pt : p.html_en,
    title: isPT.value && p.title_pt ? p.title_pt : p.title,
  }
})

const allTags = computed(() => {
  const tags = new Set<string>()
  rawPosts.forEach((p) => p.tags.forEach((t: string) => tags.add(t)))
  return Array.from(tags)
})

let mermaidLib: Promise<any> | null = null
let themeObserver: MutationObserver | null = null
let diagramObserver: IntersectionObserver | null = null
let diagramScheduleId: number | null = null
let diagramScheduleUsesIdle = false
let diagramGeneration = 0
let renderQueue = Promise.resolve()

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

function cssVar(name: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

async function renderDiagrams(nodes: HTMLElement[], generation: number) {
  if (generation !== diagramGeneration) return
  if (!mermaidLib) mermaidLib = import('mermaid').then((m) => m.default)
  const mermaid = await mermaidLib
  if (generation !== diagramGeneration) return

  // Wait for web fonts so Mermaid measures label size correctly.
  // Without this, nodes are sized against a fallback font and the
  // wrapped text gets clipped (e.g. "compartilhar" -> "comparti").
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try { await document.fonts.ready } catch (e) { /* ignore */ }
  }

  const root = articleRef.value
  const connectedNodes = nodes.filter((node) => node.isConnected && root?.contains(node))
  if (!connectedNodes.length || generation !== diagramGeneration) return

  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'loose',
    themeVariables: {
      primaryColor: cssVar('--surface-container', '#20201f'),
      primaryTextColor: cssVar('--on-surface', '#e5e2e1'),
      primaryBorderColor: cssVar('--primary', '#00ff41'),
      lineColor: cssVar('--secondary', '#3584e4'),
      secondaryColor: cssVar('--surface-container-high', '#2a2a2a'),
      tertiaryColor: cssVar('--surface-container-highest', '#353535'),
      background: 'transparent',
      fontFamily: 'monospace',
    },
  })
  await mermaid.run({ nodes: connectedNodes })
}

function cancelDiagramSchedule() {
  diagramGeneration++
  diagramObserver?.disconnect()
  diagramObserver = null

  if (diagramScheduleId == null) return
  const idleWindow = window as IdleWindow
  if (diagramScheduleUsesIdle) idleWindow.cancelIdleCallback?.(diagramScheduleId)
  else window.clearTimeout(diagramScheduleId)
  diagramScheduleId = null
}

function queueDiagramRender(nodes: HTMLElement[], generation: number) {
  renderQueue = renderQueue
    .then(() => renderDiagrams(nodes, generation))
    .catch((error) => console.error('[mermaid] Failed to render diagram', error))
}

function scheduleDiagrams() {
  cancelDiagramSchedule()
  const root = articleRef.value
  if (!root) return

  const nodes = Array.from(root.querySelectorAll<HTMLElement>('.mermaid'))
  if (!nodes.length) return
  nodes.forEach((node) => {
    if (!node.dataset.mermaidSource) node.dataset.mermaidSource = node.textContent || ''
  })

  const generation = diagramGeneration
  const observeWhenIdle = () => {
    diagramScheduleId = null
    if (generation !== diagramGeneration) return

    if (!('IntersectionObserver' in window)) {
      queueDiagramRender(nodes, generation)
      return
    }

    diagramObserver = new IntersectionObserver(
      (entries, observer) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement)
        if (!visible.length) return
        visible.forEach((node) => observer.unobserve(node))
        queueDiagramRender(visible, generation)
      },
      { root, rootMargin: '240px 0px' },
    )
    nodes.forEach((node) => diagramObserver?.observe(node))
  }

  const idleWindow = window as IdleWindow
  if (idleWindow.requestIdleCallback) {
    diagramScheduleUsesIdle = true
    diagramScheduleId = idleWindow.requestIdleCallback(observeWhenIdle, { timeout: 2000 })
  } else {
    diagramScheduleUsesIdle = false
    diagramScheduleId = window.setTimeout(observeWhenIdle, 200)
  }
}

function recolorDiagrams() {
  if (!selectedPost.value) return
  const generation = diagramGeneration

  // Mermaid sets data-processed before all of its DOM work has necessarily
  // finished. Keep both the reset and the new render in the same queue so a
  // theme change cannot remove an SVG while the previous run still uses it.
  renderQueue = renderQueue
    .then(async () => {
      if (generation !== diagramGeneration || !selectedPost.value) return
      const renderedNodes = Array.from(
        articleRef.value?.querySelectorAll<HTMLElement>('.mermaid[data-processed="true"]') ?? [],
      )
      renderedNodes.forEach((node) => {
        const source = node.dataset.mermaidSource
        if (!source) return
        node.removeAttribute('data-processed')
        node.textContent = source
      })
      if (renderedNodes.length) await renderDiagrams(renderedNodes, generation)
    })
    .catch((error) => console.error('[mermaid] Failed to recolor diagram', error))
}

function setupThemeObserver() {
  if (themeObserver) return
  themeObserver = new MutationObserver(() => recolorDiagrams())
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
}

function formatDate(value: string): string {
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  return new Intl.DateTimeFormat(isPT.value ? LOCALE_PT : LOCALE_EN, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d)
}

async function openPost(post: (typeof rawPosts)[number]) {
  selectedPost.value = post
  isGridView.value = false
  syncUrl(isPT.value ? post.url_pt : post.url_en)
  await nextTick()
  if (articleRef.value) articleRef.value.scrollTop = 0
  articleRef.value?.focus({ preventScroll: true })
}

async function backToGrid() {
  isGridView.value = true
  syncUrl(isPT.value ? `/${PREFIX_PT}/` : `/${PREFIX_EN}/`)
  await nextTick()
  gridRef.value?.focus({ preventScroll: true })
}

function syncUrl(url: string) {
  window.history.replaceState({}, '', url)
}

watch(
  [selectedPost, isPT, isGridView],
  () => {
    if (selectedPost.value && !isGridView.value) {
      document.title = `${activePost.value?.title} | ${SITE_NAME}`
    } else {
      document.title = SITE_NAME
    }
  },
  { flush: 'post' }
)

watch(
  [() => activePost.value?.html, isGridView],
  async () => {
    if (isGridView.value) {
      cancelDiagramSchedule()
      return
    }
    await nextTick()
    scheduleDiagrams()
  }
)

onMounted(async () => {
  setupThemeObserver()
  if (!isGridView.value) {
    await nextTick()
    scheduleDiagrams()
  }
})

onBeforeUnmount(() => {
  cancelDiagramSchedule()
  themeObserver?.disconnect()
  themeObserver = null
})
</script>
