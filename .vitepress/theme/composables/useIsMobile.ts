import { onMounted, ref } from 'vue'

// Phones get the mobile layout (forced maximized, no maximize button) below
// this viewport width. This is width-based (not pointer-based) on purpose:
// it's the standard responsive breakpoint and it also kicks in when a desktop
// browser is narrowed, which is the expected behavior.
const QUERY = '(max-width: 768px)'

const isPhone = ref(false)
let mql: MediaQueryList | null = null
let bound = false

function apply() {
  isPhone.value = mql ? mql.matches : false
}

export function useIsMobile() {
  // Keep SSR and the client's first render identical. The media query is
  // applied after hydration, before responsive window state is adjusted.
  onMounted(() => {
    if (typeof window === 'undefined') return
    if (!mql) mql = window.matchMedia(QUERY)
    apply()
    if (!bound) {
      mql.addEventListener('change', apply)
      bound = true
    }
  })
  return { isPhone }
}
