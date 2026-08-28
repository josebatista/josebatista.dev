import { computed } from 'vue'
import { useData } from 'vitepress'
import en from './locales/en'
import pt from './locales/pt'
import { LOCALE_EN, LOCALE_PT, PREFIX_EN, PREFIX_PT } from '../constants'

export type AppLocale = typeof LOCALE_EN | typeof LOCALE_PT

type Dict = Record<string, any>

function get(obj: Dict, path: string): any {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj)
}

const locales: Record<AppLocale, Dict> = {
  [LOCALE_EN]: en as Dict,
  [LOCALE_PT]: pt as Dict,
}

export function useI18n() {
  const { lang } = useData()

  const locale = computed<AppLocale>(() =>
    (lang.value || '').toLowerCase().startsWith('pt') ? LOCALE_PT : LOCALE_EN,
  )
  const isPT = computed(() => locale.value === LOCALE_PT)

  function t(key: string): string {
    const current = get(locales[locale.value], key)
    if (current !== undefined) return current
    const fallback = get(locales[LOCALE_EN], key)
    return fallback !== undefined ? fallback : key
  }

  function toggleLocale() {
    if (typeof window === 'undefined') return
    const path = window.location.pathname
    const target = isPT.value ? PREFIX_EN : PREFIX_PT
    const next = path.replace(/^\/(en|pt)(?=\/|$)/, `/${target}`)
    window.location.href = next
  }

  return { locale, isPT, t, toggleLocale }
}
