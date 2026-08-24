import { ref } from 'vue'

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
  if (typeof window !== 'undefined' && !bound) {
    mql = window.matchMedia(QUERY)
    apply()
    mql.addEventListener('change', apply)
    bound = true
  }
  return { isPhone }
}
