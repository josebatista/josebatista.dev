import { ref, computed, watch } from 'vue'

export type AppTheme = 'dark' | 'light'

const STORAGE_KEY = 'josebatista-theme'

const state = ref<AppTheme>('dark')

function apply() {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', state.value)
  }
}

function resolvePersisted(): AppTheme {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') return saved
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }
  return 'dark'
}

export function initTheme() {
  state.value = resolvePersisted()
  apply()
}

watch(state, () => {
  apply()
  if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, state.value)
})

export function useTheme() {
  const theme = computed(() => state.value)

  function toggleTheme() {
    state.value = state.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggleTheme }
}
