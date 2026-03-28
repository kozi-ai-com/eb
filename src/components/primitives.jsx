import { useState, useEffect, useRef, useCallback } from 'react'
import {
  motion, useInView, useMotionValue, useSpring,
  useScroll, useMotionTemplate
} from 'framer-motion'
import { useTheme } from './contexts'

// ── BlurFade (scroll-triggered entrance with blur) ──
export function BlurFade({ children, delay = 0, className = '', direction = 'up' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const yMap = { up: 24, down: -24, none: 0 }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yMap[direction], filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── NumberTicker (animated counter on scroll) ──
export function NumberTicker({ value, suffix = '', prefix = '', duration = 1.5 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / (duration * 1000), 1)
      setDisplay(Math.floor(value * (1 - Math.pow(1 - p, 4))))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, value, duration])

  return <span ref={ref}>{prefix}{display}{suffix}</span>
}

// ── ShinyBadge (animated shimmer across badge) ──
export function ShinyBadge({ children, className = '' }) {
  return (
    <div className={`relative inline-flex items-center overflow-hidden rounded-full ${className}`}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <motion.div
        className="absolute inset-0 -skew-x-12 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
          width: '50%',
        }}
        animate={{ x: ['-100%', '250%'] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
      />
    </div>
  )
}

// ── BorderBeam (orbiting glow on card edges) ──
export function BorderBeam({ size = 80, duration = 6 }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
      <motion.div
        className="absolute"
        style={{
          width: size, height: size,
          background: 'linear-gradient(135deg, #4366B0, #44B75E)',
          borderRadius: '50%',
          filter: `blur(${size / 2}px)`,
          opacity: 0.5,
        }}
        animate={{
          top: ['0%', '0%', '100%', '100%', '0%'],
          left: ['0%', '100%', '100%', '0%', '0%'],
        }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

// ── MagneticCard (subtle magnetic hover effect) ──
export function MagneticCard({ children, className = '' }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const smoothX = useSpring(x, { stiffness: 200, damping: 20 })
  const smoothY = useSpring(y, { stiffness: 200, damping: 20 })

  const handleMouse = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = e.clientX - rect.left - rect.width / 2
    const cy = e.clientY - rect.top - rect.height / 2
    x.set(cx * 0.04)
    y.set(cy * 0.04)
  }, [x, y])

  const reset = useCallback(() => { x.set(0); y.set(0) }, [x, y])

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: smoothX, y: smoothY }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── CursorSpotlight (gradient that follows mouse in section) ──
export function CursorSpotlight({ children, className = '' }) {
  const { dark } = useTheme()
  const ref = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouse = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }, [mouseX, mouseY])

  const bg = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${dark ? 'rgba(67,102,176,0.06)' : 'rgba(67,102,176,0.04)'
    }, transparent 80%)`

  return (
    <div ref={ref} onMouseMove={handleMouse} className={`relative ${className}`}>
      <motion.div className="absolute inset-0 pointer-events-none rounded-[inherit]" style={{ background: bg }} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ── ScrollProgress (thin bar at top of page) ──
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: 'linear-gradient(90deg, #4366B0, #44B75E)',
      }}
    />
  )
}

// ── Marquee (infinite scroll of items) ──
export function Marquee({ children, speed = 30, className = '' }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  )
}

// ── Organic floating shapes (biology-feel background) ──
export function OrganicShapes({ count = 6 }) {
  const { dark } = useTheme()
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => {
        const size = 200 + Math.random() * 400
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size, height: size,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: 'translate(-50%, -50%)',
              background: i % 2 === 0
                ? `radial-gradient(circle, ${dark ? 'rgba(67,102,176,0.06)' : 'rgba(67,102,176,0.04)'} 0%, transparent 70%)`
                : `radial-gradient(circle, ${dark ? 'rgba(68,183,94,0.05)' : 'rgba(68,183,94,0.03)'} 0%, transparent 70%)`,
            }}
            animate={{
              x: [0, 20 + Math.random() * 30, -10, 0],
              y: [0, -15 + Math.random() * 20, 10, 0],
              scale: [1, 1.05, 0.98, 1],
            }}
            transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        )
      })}
    </div>
  )
}
