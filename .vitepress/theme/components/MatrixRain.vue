<template>
  <canvas
    ref="canvasRef"
    class="matrix-rain"
    :style="{ opacity: config.cssOpacity }"
    aria-hidden="true"
  ></canvas>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from '../theme/index'

/**
 * Tunable parameters for the Matrix rain wallpaper.
 * Adjust any of these to change the look without touching the logic below.
 */
const config = {
  fontSize: 14, // glyph size in CSS pixels
  fps: 22, // animation frame rate (lower = lighter on CPU)
  fadeAlpha: 0.1, // trail fade speed (higher = shorter trails)
  glyphAlpha: 0.45, // opacity of a normal falling glyph
  headAlpha: 0.75, // opacity of the brighter "head" glyph
  headChance: 0.025, // probability a glyph is drawn as the bright head
  resetChance: 0.025, // probability a column restarts at the top once off-screen
  cssOpacity: 0.6, // overall canvas opacity (subtlety of the whole effect)
  maxDpr: 1.5, // cap device pixel ratio for performance
}

const { theme } = useTheme()

// Colors are supplied at runtime from CSS custom properties via readColors()
// (--matrix-glyph / --matrix-head / --shadow-rgb); no hardcoded values here.
// readColors() always runs in onMounted before any drawing, so empty defaults
// are safe (the canvas never renders during SSR).
const colors = ref({ glyph: '', head: '' })
const shadowRgb = ref('')

function readColors() {
  if (typeof document === 'undefined') return
  const cs = getComputedStyle(document.documentElement)
  const glyph = cs.getPropertyValue('--matrix-glyph').trim()
  const head = cs.getPropertyValue('--matrix-head').trim()
  const sr = cs.getPropertyValue('--shadow-rgb').trim()
  if (glyph) colors.value.glyph = glyph
  if (head) colors.value.head = head
  if (sr) shadowRgb.value = sr
}

const canvasRef = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let rafId = 0
let running = false
let drops: number[] = []
let width = 0
let height = 0
let lastTime = 0
let resizeObserver: ResizeObserver | null = null

const chars =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$+-*/=#%@&'.split(
    ''
  )

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function setupCanvas() {
  const canvas = canvasRef.value
  const parent = canvas?.parentElement
  if (!canvas || !parent) return
  const rect = parent.getBoundingClientRect()
  width = Math.max(1, rect.width)
  height = Math.max(1, rect.height)
  const dpr = Math.min(window.devicePixelRatio || 1, config.maxDpr)
  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.textBaseline = 'top'
  const colCount = Math.ceil(width / config.fontSize)
  drops = new Array(colCount)
    .fill(0)
    .map(() => Math.floor((Math.random() * height) / config.fontSize))
}

function drawFrame() {
  if (!ctx) return
  // Fade previous frame toward transparent so the wallpaper gradient shows through
  ctx.globalCompositeOperation = 'destination-out'
  ctx.fillStyle = `rgba(${shadowRgb.value},${config.fadeAlpha})`
  ctx.fillRect(0, 0, width, height)
  ctx.globalCompositeOperation = 'source-over'

  ctx.font = config.fontSize + 'px monospace'
  for (let i = 0; i < drops.length; i++) {
    const x = i * config.fontSize
    const y = drops[i] * config.fontSize
    const char = chars[(Math.random() * chars.length) | 0]
    ctx.fillStyle =
      Math.random() > 1 - config.headChance
        ? colors.value.head
        : colors.value.glyph
    ctx.fillText(char, x, y)
    if (y > height && Math.random() > 1 - config.resetChance) {
      drops[i] = 0
    } else {
      drops[i]++
    }
  }
}

function loop(time: number) {
  if (!running) return
  rafId = requestAnimationFrame(loop)
  if (time - lastTime < 1000 / config.fps) return
  lastTime = time
  drawFrame()
}

function start() {
  if (running || !canvasRef.value) return
  setupCanvas()
  if (reduceMotion) {
    drawFrame()
    return
  }
  running = true
  lastTime = 0
  rafId = requestAnimationFrame(loop)
}

function stop() {
  running = false
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
}

function onVisibility() {
  if (document.hidden) stop()
  else start()
}

onMounted(() => {
  readColors()
  watch(theme, () => {
    readColors()
    if (reduceMotion && !running && ctx) drawFrame()
  })
  start()
  document.addEventListener('visibilitychange', onVisibility)
  const parent = canvasRef.value?.parentElement
  if (parent && 'ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => {
      const wasRunning = running
      stop()
      setupCanvas()
      if (wasRunning) start()
    })
    resizeObserver.observe(parent)
  }
})

onBeforeUnmount(() => {
  stop()
  document.removeEventListener('visibilitychange', onVisibility)
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.matrix-rain {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
</style>
