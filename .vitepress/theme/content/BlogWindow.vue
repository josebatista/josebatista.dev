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
            :key="post.url"
            :title="post.title"
            :description="post.description"
            :active="selectedPost?.url === post.url"
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
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import GridItem from '../components/GridItem.vue'
import GiscusComments from '../components/GiscusComments.vue'
import ListItem from '../components/ListItem.vue'
import { data as rawPosts } from '../../loaders/posts.data.js'
import { useI18n } from '../i18n/index'
import { SITE_NAME, SYSINFO, LOCALE_EN, LOCALE_PT, SECTIONS } from '../constants'

const { t, isPT } = useI18n()

const props = defineProps<{ initialArticle?: string }>()

const isGridView = ref(true)
const selectedPost = ref<(typeof rawPosts)[number] | null>(null)
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
const mermaidSources = new Map<HTMLElement, string>()
let themeObserver: MutationObserver | null = null

function cssVar(name: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

async function renderDiagrams() {
  const root = articleRef.value
  if (!root) return
  const nodes = Array.from(root.querySelectorAll<HTMLElement>('.mermaid'))
  if (!nodes.length) return
  if (!mermaidLib) mermaidLib = import('mermaid').then((m) => m.default)
  const mermaid = await mermaidLib
  // Wait for web fonts so Mermaid measures label size correctly.
  // Without this, nodes are sized against a fallback font and the
  // wrapped text gets clipped (e.g. "compartilhar" -> "comparti").
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try { await document.fonts.ready } catch (e) { /* ignore */ }
  }
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
  mermaidSources.clear()
  nodes.forEach((n) => mermaidSources.set(n, n.textContent || ''))
  mermaid.run({ nodes })
}

function recolorDiagrams() {
  if (!selectedPost.value) return
  const nodes = Array.from(mermaidSources.keys())
  if (!nodes.length) return
  nodes.forEach((node) => {
    const src = mermaidSources.get(node)
    if (src == null) return
    const fresh = document.createElement('div')
    fresh.className = 'mermaid'
    fresh.textContent = src
    node.replaceWith(fresh)
    mermaidSources.set(fresh, src)
    mermaidSources.delete(node)
  })
  renderDiagrams()
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
  }).format(d)
}

async function openPost(post: (typeof rawPosts)[number]) {
  selectedPost.value = post
  isGridView.value = false
  syncUrl(post.url)
  await nextTick()
  if (articleRef.value) articleRef.value.scrollTop = 0
  articleRef.value?.focus({ preventScroll: true })
}

async function backToGrid() {
  isGridView.value = true
  syncUrl('/')
  await nextTick()
  gridRef.value?.focus({ preventScroll: true })
}

function syncUrl(url: string) {
  if (url.startsWith(`/${SECTIONS.POSTS}/`)) {
    window.history.replaceState({}, '', url)
  } else {
    window.history.replaceState({}, '', '/')
  }
}

watch(
  [selectedPost, isPT],
  () => {
    if (selectedPost.value) {
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
    if (isGridView.value) return
    await nextTick()
    renderDiagrams()
  }
)

onMounted(() => {
  setupThemeObserver()
  if (props.initialArticle) {
    const post = rawPosts.find((p) => p.url.endsWith(`/${props.initialArticle}`))
    if (post) {
      selectedPost.value = post
      isGridView.value = false
    }
  }
})
</script>
