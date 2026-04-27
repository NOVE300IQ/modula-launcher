<template>
  <div class="absolute z-0 h-full w-full modula-bg-root">
    <!-- Animated gradient bg -->
    <div class="modula-gradient-bg" />

    <!-- Fluid waves canvas -->
    <canvas ref="canvasRef" class="waves-canvas" />

    <!-- User-selected background layers (image/video) -->
    <transition name="fade-transition">
      <img
        v-if="backgroundImage?.type === 'image' && backgroundType === BackgroundType.IMAGE"
        :key="backgroundImage.url"
        :src="backgroundImage.url"
        class="absolute z-10 h-full w-full"
        :style="{ filter: `blur(${blur}px)`, 'object-fit': backgroundImageFit }"
      >
      <video
        v-else-if="backgroundImage?.type === 'video' && backgroundType === BackgroundType.VIDEO"
        ref="videoRef"
        :key="`video-${backgroundImage.url}`"
        class="absolute z-10 h-full w-full object-cover"
        :style="{ filter: `blur(${blur}px)`, 'object-fit': backgroundImageFit }"
        :src="backgroundImage.url"
        autoplay
        loop
      />
    </transition>

    <!-- Optional overlay -->
    <transition name="fade-transition">
      <div
        v-if="(backgroundColorOverlay && !isHome) || backgroundType === BackgroundType.NONE"
        class="z-20 absolute h-full w-full"
        :style="{ 'background': backgroundColor }"
      />
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { injection } from '@/util/inject'
import { kTheme, BackgroundType } from '@/composables/theme'
import { kInstanceLaunch } from '@/composables/instanceLaunch'

const { backgroundColorOverlay, backgroundColor, blur, backgroundImage, backgroundType, backgroundImageFit, volume } = injection(kTheme)
const videoRef = ref(null as null | HTMLVideoElement)
const canvasRef = ref(null as null | HTMLCanvasElement)

const route = useRoute()
const isHome = computed(() => route.path === '/')

// ── Video volume sync ──────────────────────────────────────────────────────
watch(volume, (v) => { if (videoRef.value) videoRef.value.volume = v })
watch(videoRef, (v) => { if (v) v.volume = volume.value })
onMounted(() => { if (videoRef.value) videoRef.value.volume = volume.value })

const { gameProcesses } = injection(kInstanceLaunch)
const isPlaying = computed(() => gameProcesses.value.length > 0)

watch(isPlaying, (playing) => {
  if (playing) {
    videoRef.value?.pause()
    if (animFrame) {
      cancelAnimationFrame(animFrame)
      animFrame = 0
    }
  } else {
    videoRef.value?.play()
    const canvas = canvasRef.value
    if (canvas && !animFrame) {
      loop(canvas)
    }
  }
})

// ── Highly Interactive Golden Particle Network ───────────────────────────
const mouse = { x: -1000, y: -1000, clicks: [] as {x: number, y: number, r: number, alpha: number}[] }

function onMouseMove(e: MouseEvent) {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

function onMouseClick(e: MouseEvent) {
  mouse.clicks.push({ x: e.clientX, y: e.clientY, r: 0, alpha: 1 })
  // Add an explosion of a few dots at cursor
  for (let i = 0; i < 5; i++) {
    particles.push(createParticle(e.clientX, e.clientY, true))
  }
}

// Attach a window listener instead of waiting for the element
import { onUnmounted } from 'vue'

window.addEventListener('click', onMouseClick)
onUnmounted(() => {
  window.removeEventListener('click', onMouseClick)
})

let animFrame = 0

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  baseR: number
  r: number
  color: string
}

let particles: Particle[] = []
let width = 0
let height = 0

const colors = ['#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed']

function createParticle(startX?: number, startY?: number, isExplosion = false): Particle {
  const angle = Math.random() * Math.PI * 2
  // Double the default particle idle speed so they move noticeably faster
  const speed = isExplosion ? (Math.random() * 3 + 2) : (Math.random() * 0.8 + 0.6)
  return {
    x: startX !== undefined ? startX : Math.random() * (width || window.innerWidth),
    y: startY !== undefined ? startY : Math.random() * (height || window.innerHeight),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    baseR: Math.random() * 2 + 1,
    r: Math.random() * 2 + 1,
    color: colors[Math.floor(Math.random() * colors.length)]
  }
}

function initParticles(canvas: HTMLCanvasElement) {
  width = canvas.width
  height = canvas.height
  // Significantly increase the total number of particles (Max 180) to feel denser
  const numParticles = Math.min(180, Math.floor((width * height) / 10000))
  if (particles.length === 0 || width !== canvas.width) {
    particles = []
    for (let i = 0; i < numParticles; i++) {
      particles.push(createParticle())
    }
  }
}

function drawInteractiveNetwork(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // Create trailing effect by not fully clearing
  ctx.fillStyle = 'rgba(3, 3, 2, 0.15)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  initParticles(canvas)

  // Draw click ripples
  for (let i = mouse.clicks.length - 1; i >= 0; i--) {
    const click = mouse.clicks[i]
    click.r += 6
    click.alpha -= 0.025
    
    if (click.alpha <= 0) {
      mouse.clicks.splice(i, 1)
      continue
    }

    ctx.beginPath()
    ctx.arc(click.x, click.y, click.r, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(139, 92, 246, ${click.alpha})`
    ctx.lineWidth = 3
    ctx.stroke()
  }

  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    
    // Mouse interaction (Repel and enlarge)
    const dx = mouse.x - p.x
    const dy = mouse.y - p.y
    const distSq = dx * dx + dy * dy
    const mouseRadius = 250 // Increased interaction radius

    if (distSq < mouseRadius * mouseRadius) {
      const dist = Math.sqrt(distSq)
      const force = (mouseRadius - dist) / mouseRadius
      
      // Smooth push away
      p.vx -= (dx / dist) * force * 0.4
      p.vy -= (dy / dist) * force * 0.4
      
      // Enlarge and glow
      p.r = p.baseR + (force * 6)
    } else {
      p.r = p.baseR
      // Return to base speed organically
      p.vx *= 0.99
      p.vy *= 0.99
      if (Math.abs(p.vx) < 0.3) p.vx += (Math.random() - 0.5) * 0.05
      if (Math.abs(p.vy) < 0.3) p.vy += (Math.random() - 0.5) * 0.05
    }

    // Move
    p.x += p.vx
    p.y += p.vy

    // Bounce off edges with damping
    if (p.x < 0 || p.x > canvas.width) p.vx *= -0.9
    if (p.y < 0 || p.y > canvas.height) p.vy *= -0.9
    
    p.x = Math.max(0, Math.min(canvas.width, p.x))
    p.y = Math.max(0, Math.min(canvas.height, p.y))

    // Draw particle with glow
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.shadowBlur = p.r * 2
    ctx.shadowColor = p.color
    ctx.fill()
    ctx.shadowBlur = 0 // Reset for lines

    // Draw connections
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j]
      const dX = p.x - p2.x
      const dY = p.y - p2.y
      const distanceSq = dX * dX + dY * dY
      const connectDist = 150

      if (distanceSq < connectDist * connectDist) {
        const dist = Math.sqrt(distanceSq)
        let opacity = 1 - dist / connectDist
        
        // Intensity boost near mouse
        const mX = (p.x + p2.x) / 2
        const mY = (p.y + p2.y) / 2
        const mDx = mouse.x - mX
        const mDy = mouse.y - mY
        const mDistSq = mDx * mDx + mDy * mDy
        if (mDistSq < 200 * 200) {
            opacity *= 1.5
        }

        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.35})`
        ctx.lineWidth = 0.5 + opacity
        ctx.stroke()
      }
    }
  }
}

function loop(canvas: HTMLCanvasElement) {
  drawInteractiveNetwork(canvas)
  animFrame = requestAnimationFrame(() => loop(canvas))
}

function resize(canvas: HTMLCanvasElement) {
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  resize(canvas)
  loop(canvas)
  window.addEventListener('resize', () => resize(canvas))
  window.addEventListener('mousemove', onMouseMove)
})

onUnmounted(() => {
  cancelAnimationFrame(animFrame)
  window.removeEventListener('mousemove', onMouseMove)
})
</script>

<style scoped>
.modula-bg-root {
  overflow: hidden;
  background: #030302; /* Extremely deep, premium black backdrop */
}

.modula-gradient-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 15% 15%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 85% 20%, rgba(124, 58, 237, 0.06) 0%, transparent 40%),
    radial-gradient(circle at 50% 80%, rgba(99, 102, 241, 0.04) 0%, transparent 60%);
  animation: breathing 15s ease-in-out infinite;
}

@keyframes breathing {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

.waves-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* Optional overlay and transitions remain */
.fade-transition-enter-active,
.fade-transition-leave-active {
  transition: opacity 0.6s ease;
}
.fade-transition-enter-from,
.fade-transition-leave-to {
  opacity: 0;
}
</style>
