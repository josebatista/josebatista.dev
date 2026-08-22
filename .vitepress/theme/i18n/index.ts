import { ref, computed, watch } from 'vue'
import en from './locales/en'
import pt from './locales/pt'
import { LOCALE_EN, LOCALE_PT } from '../constants'

export type AppLocale = typeof LOCALE_EN | typeof LOCALE_PT

const STORAGE_KEY = 'josebatista-locale'

type Dict = Record<string, any>

function get(obj: Dict, path: string): any {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj)
}

function resolvePersistedLocale(): AppLocale {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === LOCALE_EN || saved === LOCALE_PT) return saved as AppLocale
  }
  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('pt')) {
    return LOCALE_PT
  }
  return LOCALE_EN
}

const state = ref<AppLocale>(LOCALE_EN)

function syncLang() {
  if (typeof document !== 'undefined') document.documentElement.lang = state.value
}

watch(state, syncLang)

export function initI18n() {
  const next = resolvePersistedLocale()
  state.value = next
  syncLang()
}

const locales: Record<AppLocale, Dict> = {
  [LOCALE_EN]: en as Dict,
  [LOCALE_PT]: pt as Dict,
}

export function useI18n() {
  const locale = computed(() => state.value)
  const isPT = computed(() => state.value === LOCALE_PT)

  function t(key: string): string {
    const current = get(locales[state.value], key)
    if (current !== undefined) return current
    const fallback = get(locales[LOCALE_EN], key)
    return fallback !== undefined ? fallback : key
  }

  function setLocale(next: AppLocale) {
    state.value = next
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, next)
    if (typeof document !== 'undefined') document.documentElement.lang = next
  }

  function toggleLocale() {
    setLocale(state.value === LOCALE_EN ? LOCALE_PT : LOCALE_EN)
  }

  return { locale, isPT, t, toggleLocale }
}
