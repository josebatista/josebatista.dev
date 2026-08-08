<template>
  <div class="blog-window">
    <div class="blog-toolbar">
      <template v-if="isGridView">
        <div class="toolbar-breadcrumb">
          <span class="crumb">~</span>
          <span class="crumb-sep">/</span>
          <span class="crumb">Documents</span>
          <span class="crumb-sep">/</span>
          <span class="crumb active">Blog</span>
        </div>
      </template>
      <template v-else>
        <button class="toolbar-back" @click="backToGrid">
          ← Back
        </button>
        <div class="toolbar-breadcrumb">
          <button type="button" class="ui-button crumb clickable" @click="backToGrid">Blog</button>
          <span class="crumb-sep">/</span>
          <span class="crumb active">{{ selectedPost?.title }}</span>
        </div>
      </template>
      <div class="toolbar-search">
        <input type="text" placeholder="Search posts..." v-model="searchQuery" />
      </div>
    </div>

    <div v-if="isGridView" class="blog-grid">
      <GridItem
        v-for="post in filteredPosts"
        :key="post.url"
        :title="post.title"
        :date="post.date"
        @select="openPost(post)"
      />
    </div>

    <div v-else class="blog-split">
      <div class="blog-sidebar">
        <div class="sidebar-directory">
          <div class="sidebar-label">DIRECTORY</div>
          <ListItem
            v-for="post in filteredPosts"
            :key="post.url"
            :title="post.title"
            :description="post.description"
            :active="selectedPost?.url === post.url"
            @select="openPost(post)"
          >
            <template #meta>
              <div class="list-item-date">{{ post.date }}</div>
              <div class="list-item-tags">
                <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </template>
          </ListItem>
        </div>

        <div class="sidebar-footer">
          <div class="sidebar-section">
            <div class="sidebar-label">TAGS</div>
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
            <div class="storage-label">Disk Usage</div>
            <div class="storage-bar"><div class="storage-fill" /></div>
            <span class="storage-text">82% — 2.4 MB / 3.0 MB</span>
          </div>
        </div>
      </div>

      <div class="blog-article" v-if="selectedPost">
        <article v-html="selectedPost.html" />
        <div class="eof-marker">
          <span>[EOF]</span>
          <span class="cursor-blink">█</span>
        </div>
      </div>
    </div>

    <div class="window-statusbar">
      <span>{{ filteredPosts.length }} items | 2.4 MB | 82% Disk Space Used</span>
      <span>Permission: rwxr-xr-x | User: josebatista</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import GridItem from '../components/GridItem.vue'
import ListItem from '../components/ListItem.vue'
import { data as posts } from '../../loaders/posts.data.js'

const props = defineProps<{ initialArticle?: string }>()

const isGridView = ref(true)
const selectedPost = ref<(typeof posts)[number] | null>(null)
const searchQuery = ref('')
const activeTag = ref('')

const filteredPosts = computed(() => {
  return posts.filter(post => {
    if (searchQuery.value && !post.title.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
    if (activeTag.value && !post.tags.includes(activeTag.value)) return false
    return true
  })
})

const allTags = computed(() => {
  const tags = new Set<string>()
  posts.forEach(p => p.tags.forEach(t => tags.add(t)))
  return Array.from(tags)
})

function openPost(post: (typeof posts)[number]) {
  selectedPost.value = post
  isGridView.value = false
  syncUrl(post.url)
}

function backToGrid() {
  isGridView.value = true
  syncUrl('/')
}

function syncUrl(url: string) {
  if (url.startsWith('/posts/')) {
    window.history.replaceState({}, '', url)
  } else {
    window.history.replaceState({}, '', '/')
  }
}

onMounted(() => {
  if (props.initialArticle) {
    const post = posts.find(p => p.url.endsWith(`/${props.initialArticle}`))
    if (post) {
      selectedPost.value = post
      isGridView.value = false
    }
  }
})
</script>
