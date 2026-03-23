import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'
import {
  motion, useInView, AnimatePresence, useMotionValue,
  useTransform, useSpring, useScroll, useMotionTemplate
} from 'framer-motion'
import {
  Sun, Moon, ArrowRight, ArrowUpRight, FlaskConical,
  Shield, Globe2, Microscope, Activity, ChevronRight,
  Play, Pause, SlidersHorizontal, FileText, Lock,
  Layers, Users, Sparkles, Menu, X, Github, Mail,
  Dna, Search, CheckCircle2, Zap, Eye, BarChart3, Bot,
  MapPin, Send, Linkedin
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════
   PAGE CONTEXT (simple state-based routing)
   ═══════════════════════════════════════════════════════ */
const PageCtx = createContext()

function PageProvider({ children }) {
  const [page, setPage] = useState('home')
  const navigate = useCallback((p) => {
    setPage(p)
    window.scrollTo(0, 0)
  }, [])
  return (
    <PageCtx.Provider value={{ page, navigate }}>
      {children}
    </PageCtx.Provider>
  )
}

const usePage = () => useContext(PageCtx)

/* ═══════════════════════════════════════════════════════
   THEME CONTEXT
   ═══════════════════════════════════════════════════════ */
const ThemeCtx = createContext()

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true)
  useEffect(() => {
    document.body.className = dark ? 'dark' : 'light'
  }, [dark])
  return (
    <ThemeCtx.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      {children}
    </ThemeCtx.Provider>
  )
}

const useTheme = () => useContext(ThemeCtx)

/* ═══════════════════════════════════════════════════════
   21st.dev-INSPIRED PRIMITIVES
   ═══════════════════════════════════════════════════════ */

// ── BlurFade (scroll-triggered entrance with blur) ──
function BlurFade({ children, delay = 0, className = '', direction = 'up' }) {
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
function NumberTicker({ value, suffix = '', prefix = '', duration = 1.5 }) {
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
function ShinyBadge({ children, className = '' }) {
  const { dark } = useTheme()
  return (
    <div className={`relative inline-flex items-center overflow-hidden rounded-full ${className}`}>
      <span className="relative z-10">{children}</span>
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
function BorderBeam({ size = 80, duration = 6 }) {
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
function MagneticCard({ children, className = '' }) {
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
function CursorSpotlight({ children, className = '' }) {
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
function ScrollProgress() {
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
function Marquee({ children, speed = 30, className = '' }) {
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
function OrganicShapes({ count = 6 }) {
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

/* ═══════════════════════════════════════════════════════
   KOZI LOGO (inline SVG — adapts to dark/light)
   ═══════════════════════════════════════════════════════ */
function KoziLogo({ height = 28 }) {
  const { dark } = useTheme()
  return (
    <svg height={height} viewBox="0 0 346.36 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="kg1" x1="19.32" y1="98.35" x2="82.52" y2="-11.12" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4366b0" /><stop offset=".36" stopColor="#438095" /><stop offset="1" stopColor="#44b75e" />
        </linearGradient>
        <linearGradient id="kg2" x1="36.12" y1="114.36" x2="99.32" y2="4.89" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4366b0" /><stop offset=".19" stopColor="#437b9a" /><stop offset=".53" stopColor="#439b79" /><stop offset=".81" stopColor="#43af65" /><stop offset="1" stopColor="#44b75e" />
        </linearGradient>
      </defs>
      <path opacity=".3" fill="url(#kg1)" d="m97.29,72.41l-88.99,11.52c-4.4.57-8.3-2.86-8.3-7.3V18.88c0-3.7,2.75-6.82,6.42-7.3L95.4.06c4.4-.57,8.3,2.86,8.3,7.3v57.75c0,3.7-2.75,6.82-6.42,7.3Z" />
      <path fill="url(#kg2)" d="m114.09,88.42l-88.99,11.52c-4.4.57-8.3-2.86-8.3-7.3v-57.75c0-3.7,2.75-6.82,6.42-7.3l88.99-11.52c4.4-.57,8.3,2.86,8.3,7.3v57.75c0,3.7-2.75,6.82-6.42,7.3Z" />
      <g fill={dark ? '#E2E8F0' : '#10182A'}>
        <path d="m145.48,89.34V11.22h9.61v36.02h11.49l25.52-36.02h11.05l-28.07,38.78,28.29,39.34h-11.38l-24.53-33.37h-12.38v33.37h-9.61Z" />
        <path d="m237.74,90c-6.12,0-11.23-1.27-15.36-3.81-4.13-2.54-7.2-6.06-9.23-10.55-2.03-4.49-3.04-9.61-3.04-15.36s1.03-10.96,3.09-15.41c2.06-4.46,5.16-7.97,9.28-10.55,4.13-2.58,9.28-3.87,15.47-3.87s11.22,1.29,15.3,3.87c4.09,2.58,7.14,6.1,9.17,10.55,2.03,4.46,3.04,9.6,3.04,15.41s-1.03,10.87-3.09,15.36c-2.06,4.49-5.14,8.01-9.23,10.55-4.09,2.54-9.23,3.81-15.41,3.81Zm0-8.29c4.27,0,7.75-.96,10.44-2.87,2.69-1.91,4.68-4.49,5.97-7.74,1.29-3.24,1.93-6.85,1.93-10.83s-.65-7.59-1.93-10.83c-1.29-3.24-3.28-5.82-5.97-7.74-2.69-1.91-6.17-2.87-10.44-2.87s-7.64.96-10.33,2.87c-2.69,1.92-4.68,4.49-5.97,7.74-1.29,3.24-1.93,6.85-1.93,10.83s.64,7.59,1.93,10.83c1.29,3.24,3.28,5.82,5.97,7.74,2.69,1.92,6.13,2.87,10.33,2.87Z" />
        <path d="m275.86,89.34v-7.96l34.81-41.99h-34.81v-8.29h46.85v7.85l-35.14,42.21h35.14v8.18h-46.85Z" />
        <path d="m339.95,22.49c-1.92,0-3.44-.59-4.59-1.77-1.14-1.18-1.71-2.69-1.71-4.53s.59-3.33,1.77-4.48c1.18-1.14,2.69-1.71,4.53-1.71,1.69,0,3.19.59,4.48,1.77,1.29,1.18,1.93,2.65,1.93,4.42s-.63,3.35-1.88,4.53c-1.25,1.18-2.76,1.77-4.53,1.77Zm-4.64,66.85V31.11h9.39v58.23h-9.39Z" />
      </g>
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════ */
function Nav() {
  const { dark, toggle } = useTheme()
  const { page, navigate } = usePage()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { label: 'TOPE_DEEP', page: 'tope-deep' },
  ]

  return (
    <motion.nav
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled
          ? dark
            ? 'bg-surface-950/70 backdrop-blur-2xl border-b border-surface-700/40'
            : 'bg-white/70 backdrop-blur-2xl border-b border-surface-200/60'
          : ''
        }`}
    >
      <div className="max-w-[1120px] mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => navigate('home')} className="shrink-0">
          <KoziLogo height={26} />
        </button>

        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <button key={l.page} onClick={() => navigate(l.page)}
              className={`text-[13px] font-medium px-3.5 py-1.5 rounded-lg transition-colors ${page === l.page
                  ? 'text-kozi-blue'
                  : dark ? 'text-surface-400 hover:text-surface-100 hover:bg-surface-800/60'
                    : 'text-surface-500 hover:text-kozi-navy hover:bg-surface-100'
                }`}>
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button onClick={toggle}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${dark ? 'text-surface-400 hover:text-surface-100 hover:bg-surface-800'
                : 'text-surface-500 hover:text-kozi-navy hover:bg-surface-100'
              }`}>
            <AnimatePresence mode="wait">
              <motion.div key={dark ? 'sun' : 'moon'}
                initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                {dark ? <Sun size={15} /> : <Moon size={15} />}
              </motion.div>
            </AnimatePresence>
          </button>
          <button onClick={() => navigate('contact')}
            className="text-[13px] font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-kozi-blue to-kozi-green text-white transition-all hover:shadow-lg hover:shadow-kozi-blue/20 active:scale-[0.98]">
            Contact
          </button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={toggle} className={dark ? 'text-surface-300' : 'text-surface-500'}>
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => setOpen(!open)} className={dark ? 'text-surface-200' : 'text-kozi-navy'}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`md:hidden overflow-hidden border-b ${dark ? 'bg-surface-950/95 backdrop-blur-xl border-surface-700/40' : 'bg-white/95 backdrop-blur-xl border-surface-200'
              }`}>
            <div className="px-6 py-4 flex flex-col gap-2">
              {links.map(l => (
                <button key={l.page} onClick={() => { navigate(l.page); setOpen(false) }}
                  className={`text-sm py-2 text-left ${dark ? 'text-surface-300' : 'text-surface-600'}`}>{l.label}</button>
              ))}
              <button onClick={() => { navigate('contact'); setOpen(false) }}
                className="text-sm font-semibold mt-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-kozi-blue to-kozi-green text-white text-center">
                Contact
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

/* ═══════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════ */
function Hero() {
  const { dark } = useTheme()
  const { navigate } = usePage()

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-16">
      <OrganicShapes count={6} />

      <div className="absolute inset-0 pointer-events-none" style={{
        background: dark
          ? 'radial-gradient(ellipse 50% 40% at 50% 45%, rgba(67,102,176,0.1) 0%, transparent 70%)'
          : 'radial-gradient(ellipse 50% 40% at 50% 45%, rgba(67,102,176,0.05) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Status chip with shimmer */}
        <BlurFade delay={0.1}>
          <div className="flex justify-center mb-8">
            <ShinyBadge className={`gap-2 px-4 py-1.5 text-xs font-medium border ${dark ? 'bg-surface-800/60 border-surface-600/50 text-surface-300'
                : 'bg-white border-surface-200 text-surface-500'
              }`}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-kozi-green opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-kozi-green" />
              </span>
              TOPE_DEEP is live and operational
            </ShinyBadge>
          </div>
        </BlurFade>

        {/* Headline */}
        <BlurFade delay={0.25}>
          <h1 className={`text-[clamp(2.25rem,5.5vw,4.25rem)] font-semibold leading-[1.08] tracking-[-0.03em] ${dark ? 'text-surface-50' : 'text-kozi-navy'
            }`}>
            We build agents that work
            <br className="hidden sm:block" />
            {' '}so scientists can{' '}
            <span className="text-brand-gradient">discover</span>
          </h1>
        </BlurFade>

        {/* Sub */}
        <BlurFade delay={0.4}>
          <p className={`mt-5 text-[clamp(1rem,1.8vw,1.15rem)] leading-relaxed max-w-xl mx-auto ${dark ? 'text-surface-400' : 'text-surface-500'
            }`}>
            Kozi orchestrates the fragmented tools of life sciences R&D into
            unified, auditable pipelines. You keep full authority over every decision.
          </p>
        </BlurFade>

        {/* CTAs */}
        <BlurFade delay={0.55}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9">
            <motion.a href="#how" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-kozi-blue to-kozi-green text-white text-sm font-semibold transition-shadow hover:shadow-lg hover:shadow-kozi-blue/20">
              See how it works
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </motion.a>
            <motion.button onClick={() => navigate('contact')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border transition-all ${dark ? 'bg-surface-800/50 border-surface-600/50 text-surface-200 hover:bg-surface-800 hover:border-surface-500'
                  : 'bg-white border-surface-200 text-kozi-navy hover:bg-surface-50 hover:border-surface-300'
                }`}>
              Request access
            </motion.button>
          </div>
        </BlurFade>

        {/* Stats row */}
        <BlurFade delay={0.7}>
          <div className={`mt-16 flex items-center justify-center gap-px rounded-xl overflow-hidden border ${dark ? 'border-surface-700/50' : 'border-surface-200'
            }`}>
            {[
              { val: 6, suffix: ' wk → 1 day', label: 'Workflow compression' },
              { val: 15, suffix: '+', label: 'Bio tools unified' },
              { val: 35, suffix: 'M', label: 'Articles indexed' },
            ].map((s, i) => (
              <div key={i} className={`flex-1 py-4 px-3 text-center ${i > 0 ? dark ? 'border-l border-surface-700/50' : 'border-l border-surface-200' : ''
                } ${dark ? 'bg-surface-800/30' : 'bg-white/60'}`}>
                <div className="text-lg sm:text-xl font-bold font-mono text-brand-gradient">
                  <NumberTicker value={s.val} suffix={s.suffix} />
                </div>
                <div className={`text-[10px] sm:text-xs mt-0.5 ${dark ? 'text-surface-500' : 'text-surface-400'}`}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </BlurFade>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className={`w-4 h-7 rounded-full border flex items-start justify-center pt-1.5 ${dark ? 'border-surface-600' : 'border-surface-300'
            }`}>
          <div className="w-0.5 h-1.5 rounded-full bg-kozi-blue" />
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   THE GAP — Problem
   ═══════════════════════════════════════════════════════ */
function TheGap() {
  const { dark } = useTheme()

  const tools = [
    'UniProt', 'PSORTb', 'TMHMM', 'VaxiJen', 'NetMHCpan',
    'MHCflurry', 'BepiPred', 'AlphaFold', 'PDB', 'AllerTOP',
    'ToxinPred', 'MAFFT', 'IEDB', 'PubMed', 'ColabFold'
  ]

  return (
    <section className="py-28 sm:py-36 px-6">
      <div className="max-w-[1120px] mx-auto">
        <div className="max-w-2xl">
          <BlurFade>
            <span className="text-xs font-mono font-semibold tracking-widest uppercase text-kozi-blue">
              The gap
            </span>
          </BlurFade>
          <BlurFade delay={0.1}>
            <h2 className={`text-3xl sm:text-[2.5rem] font-semibold tracking-tight leading-[1.12] mt-3 ${dark ? 'text-surface-50' : 'text-kozi-navy'
              }`}>
              The tools exist.
              <br />
              <span className={dark ? 'text-surface-400' : 'text-surface-500'}>
                The connections don't.
              </span>
            </h2>
          </BlurFade>
          <BlurFade delay={0.2}>
            <p className={`mt-4 text-base leading-relaxed max-w-lg ${dark ? 'text-surface-400' : 'text-surface-500'}`}>
              A computational immunologist identifying vaccine candidates navigates
              10–15 disconnected tools, each with different formats, interfaces,
              and access requirements. That takes 2–6 weeks per pathogen.
            </p>
          </BlurFade>
        </div>

        {/* Tool marquee — fragmented feel */}
        <BlurFade delay={0.35}>
          <div className="mt-12">
            <Marquee speed={40}>
              {tools.map(t => (
                <span key={t} className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium border whitespace-nowrap ${dark ? 'bg-surface-800/50 border-surface-600/40 text-surface-400'
                    : 'bg-white border-surface-200 text-surface-500'
                  }`}>
                  {t}
                </span>
              ))}
            </Marquee>
          </div>
        </BlurFade>

        {/* Impact stat */}
        <BlurFade delay={0.5}>
          <div className={`mt-12 p-6 rounded-xl border-l-2 border-l-kozi-blue ${dark ? 'bg-surface-800/20 border border-surface-700/30 border-l-kozi-blue'
              : 'bg-kozi-blue/[0.03] border border-kozi-blue/10 border-l-kozi-blue'
            }`}>
            <p className={`text-sm leading-relaxed ${dark ? 'text-surface-300' : 'text-surface-600'}`}>
              If a safe COVID-19 vaccine had been available 100 days after pathogen
              recognition, an estimated <strong className={dark ? 'text-surface-100' : 'text-kozi-navy'}>
                8.33 million additional lives</strong> could have been saved by the end of 2021.
              <span className={`block mt-1.5 text-xs ${dark ? 'text-surface-500' : 'text-surface-400'}`}>
                — CEPI's 100 Days Mission
              </span>
            </p>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   HOW KOZI WORKS — Scientist's journey
   ═══════════════════════════════════════════════════════ */
function HowItWorks() {
  const { dark } = useTheme()

  const steps = [
    {
      num: '01', icon: Search, title: 'Define your question',
      desc: 'Specify a pathogen and target population. Set parameters or let Kozi suggest defaults calibrated for global HLA diversity.',
      detail: 'Input'
    },
    {
      num: '02', icon: Layers, title: 'Kozi orchestrates',
      desc: 'Autonomous agents connect databases, prediction tools, and literature — converting formats, resolving conflicts, running validations.',
      detail: 'Process'
    },
    {
      num: '03', icon: Eye, title: 'Review and direct',
      desc: 'At defined checkpoints, inspect results, override decisions, and redirect analysis. Every decision logged with biological justification.',
      detail: 'Control'
    },
    {
      num: '04', icon: FileText, title: 'Same-day report',
      desc: 'Structured scientific report with ranked candidates, population coverage, safety screening, and full provenance. Every claim traced.',
      detail: 'Output'
    },
  ]

  const modes = [
    { icon: Play, label: 'Autopilot', desc: 'Full automation with post-hoc review' },
    { icon: SlidersHorizontal, label: 'Standard', desc: 'Pauses at critical checkpoints' },
    { icon: Pause, label: 'Expert', desc: 'Pauses at every decision point' },
  ]

  return (
    <CursorSpotlight>
      <section id="how" className="py-28 sm:py-36 px-6">
        <div className="max-w-[1120px] mx-auto">
          <div className="max-w-2xl">
            <BlurFade>
              <span className="text-xs font-mono font-semibold tracking-widest uppercase text-kozi-green">
                How it works
              </span>
            </BlurFade>
            <BlurFade delay={0.1}>
              <h2 className={`text-3xl sm:text-[2.5rem] font-semibold tracking-tight leading-[1.12] mt-3 ${dark ? 'text-surface-50' : 'text-kozi-navy'
                }`}>
                You bring the question.
                <br />
                <span className={dark ? 'text-surface-400' : 'text-surface-500'}>
                  Kozi orchestrates the answer.
                </span>
              </h2>
            </BlurFade>
          </div>

          {/* Steps — magnetic hover cards */}
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <BlurFade key={i} delay={0.15 + i * 0.1}>
                <MagneticCard className="h-full">
                  <div className={`group relative h-full p-5 rounded-2xl border transition-all duration-300 ${dark ? 'bg-surface-800/30 border-surface-700/40 hover:border-kozi-blue/30 hover:bg-surface-800/60'
                      : 'bg-white border-surface-200 hover:border-kozi-blue/30 hover:shadow-sm'
                    }`}>
                    <span className={`text-[10px] font-mono font-semibold tracking-wider ${dark ? 'text-surface-600' : 'text-surface-300'
                      }`}>{s.num}</span>

                    <div className={`mt-3 w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-kozi-blue/10' : 'bg-kozi-blue/[0.06]'
                      }`}>
                      <s.icon size={18} className="text-kozi-blue" />
                    </div>

                    <h3 className={`mt-4 text-sm font-semibold ${dark ? 'text-surface-100' : 'text-kozi-navy'}`}>
                      {s.title}
                    </h3>
                    <p className={`mt-2 text-xs leading-relaxed ${dark ? 'text-surface-400' : 'text-surface-500'}`}>
                      {s.desc}
                    </p>

                    <span className={`inline-block mt-4 text-[10px] font-mono font-medium px-2 py-0.5 rounded ${dark ? 'bg-surface-700/60 text-surface-400' : 'bg-surface-100 text-surface-500'
                      }`}>{s.detail}</span>
                  </div>
                </MagneticCard>
              </BlurFade>
            ))}
          </div>

          {/* Operating modes */}
          <BlurFade delay={0.6}>
            <div className={`mt-8 p-5 rounded-2xl border ${dark ? 'bg-surface-800/20 border-surface-700/40' : 'bg-white border-surface-200'
              }`}>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${dark ? 'text-surface-500' : 'text-surface-400'
                }`}>Choose your level of control</p>

              <div className="grid sm:grid-cols-3 gap-3">
                {modes.map((m, i) => (
                  <motion.div key={i} whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300 }}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-default transition-colors ${dark ? 'border-surface-700/40 hover:border-kozi-green/20 bg-surface-800/30'
                        : 'border-surface-200 hover:border-kozi-green/30 bg-surface-50/50'
                      }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${dark ? 'bg-kozi-green/10' : 'bg-kozi-green/[0.06]'
                      }`}>
                      <m.icon size={14} className="text-kozi-green" />
                    </div>
                    <div>
                      <span className={`text-sm font-semibold ${dark ? 'text-surface-100' : 'text-kozi-navy'}`}>
                        {m.label}
                      </span>
                      <p className={`text-xs mt-0.5 ${dark ? 'text-surface-500' : 'text-surface-400'}`}>{m.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </BlurFade>
        </div>
      </section>
    </CursorSpotlight>
  )
}

/* ═══════════════════════════════════════════════════════
   TOPE_DEEP — Product showcase
   ═══════════════════════════════════════════════════════ */
function TopeDeep() {
  const { dark } = useTheme()
  const { navigate } = usePage()

  const reportSections = [
    { label: 'Executive Summary', icon: BarChart3, lines: 3 },
    { label: 'Antigen Selection', icon: Dna, lines: 2 },
    { label: 'Epitope Profiles', icon: Activity, lines: 4 },
    { label: 'Population Coverage', icon: Globe2, lines: 2 },
    { label: 'Safety Screening', icon: Shield, lines: 2 },
    { label: 'Validation Roadmap', icon: FlaskConical, lines: 2 },
  ]

  return (
    <section id="tope-deep" className="py-28 sm:py-36 px-6">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <BlurFade>
              <span className="text-xs font-mono font-semibold tracking-widest uppercase text-kozi-blue">
                Flagship pipeline
              </span>
            </BlurFade>
            <BlurFade delay={0.1}>
              <h2 className={`text-3xl sm:text-[2.5rem] font-semibold tracking-tight leading-[1.12] mt-3 ${dark ? 'text-surface-50' : 'text-kozi-navy'
                }`}>TOPE_DEEP</h2>
            </BlurFade>
            <BlurFade delay={0.2}>
              <p className={`mt-4 text-base leading-relaxed ${dark ? 'text-surface-400' : 'text-surface-500'}`}>
                Autonomous epitope-based vaccine target discovery. From pathogen genome
                to a ranked, evidence-graded candidate report - delivered same day.
              </p>
            </BlurFade>
            <BlurFade delay={0.3}>
              <div className="mt-6 flex flex-col gap-2.5">
                {[
                  'Proteome analysis through safety screening in one pass',
                  'T-cell and B-cell epitope prediction across 27 HLA alleles',
                  'Structural validation via PDB, AlphaFold, and ColabFold',
                  'Population coverage with automatic rebalancing',
                  'Full literature grounding through 35M PubMed articles',
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-kozi-green mt-0.5 shrink-0" />
                    <span className={`text-sm ${dark ? 'text-surface-300' : 'text-surface-600'}`}>{item}</span>
                  </motion.div>
                ))}
              </div>
            </BlurFade>
            <BlurFade delay={0.5}>
              <motion.button onClick={() => navigate('contact')} whileHover={{ x: 4 }}
                className="group inline-flex items-center gap-2 mt-8 text-sm font-semibold text-kozi-blue hover:text-kozi-green transition-colors">
                Request access to TOPE_DEEP
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </BlurFade>
          </div>

          {/* Right — report preview with border beam */}
          <BlurFade delay={0.3}>
            <MagneticCard>
              <div className={`relative rounded-2xl border overflow-hidden ${dark ? 'bg-surface-800/40 border-surface-700/40' : 'bg-white border-surface-200'
                }`}>
                <BorderBeam size={100} duration={8} />

                {/* Report header */}
                <div className={`px-6 py-4 border-b flex items-center justify-between ${dark ? 'border-surface-700/40 bg-surface-800/60' : 'border-surface-200 bg-surface-50'
                  }`}>
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-kozi-blue" />
                    <span className={`text-xs font-mono font-semibold ${dark ? 'text-surface-200' : 'text-kozi-navy'}`}>
                      TOPE_DEEP_Report_SARS-CoV-2.pdf
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-kozi-green">
                    <span className="w-1.5 h-1.5 rounded-full bg-kozi-green" />Complete
                  </span>
                </div>

                {/* Report body */}
                <div className="p-6 space-y-4">
                  {reportSections.map((s, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.08 }}
                      className={`flex items-start gap-3 pb-4 ${i < reportSections.length - 1 ? dark ? 'border-b border-surface-700/30' : 'border-b border-surface-100' : ''
                        }`}>
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${dark ? 'bg-surface-700/50' : 'bg-surface-100'
                        }`}>
                        <s.icon size={13} className={dark ? 'text-surface-400' : 'text-surface-500'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-xs font-semibold ${dark ? 'text-surface-200' : 'text-kozi-navy'}`}>
                          {s.label}
                        </span>
                        <div className="mt-2 space-y-1.5">
                          {Array.from({ length: s.lines }).map((_, j) => (
                            <div key={j}
                              className={`h-1.5 rounded-full ${dark ? 'bg-surface-700/50' : 'bg-surface-100'}`}
                              style={{ width: `${55 + Math.random() * 40}%` }} />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </MagneticCard>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PRINCIPLES — Bento grid
   ═══════════════════════════════════════════════════════ */
function Domains() {
  const { dark } = useTheme()
  const [active, setActive] = useState(0)
  const timerRef = useRef(null)

  const items = [
    {
      title: 'Computational Vaccinology',
      desc: 'Accelerating vaccine candidate discovery from pathogen genome to ranked epitope targets with population-aware coverage analysis.',
      icon: Microscope
    },
    {
      title: 'Genomic Surveillance & Variant Tracking',
      desc: 'Monitoring pathogen evolution and identifying variants of concern through automated genomic analysis pipelines.',
      icon: Dna
    },
    {
      title: 'Drug Target Identification & Prioritisation',
      desc: 'Systematic identification and ranking of therapeutic targets using multi-source biological evidence integration.',
      icon: FlaskConical
    },
    {
      title: 'Clinical Trial Design',
      desc: 'Optimising trial parameters through population stratification, biomarker selection, and endpoint analysis.',
      icon: Activity
    },
    {
      title: 'Diagnostics & Biomarker Discovery',
      desc: 'Discovering and validating diagnostic biomarkers through integrated multi-omics analysis workflows.',
      icon: Search
    },
  ]

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % items.length)
    }, 4000)
  }, [items.length])

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [startTimer])

  const goTo = useCallback((i) => {
    setActive(i)
    startTimer()
  }, [startTimer])

  const current = items[active]
  const Icon = current.icon

  return (
    <section id="domains" className="py-28 sm:py-36 px-6">
      <div className="max-w-[1120px] mx-auto">
        <div className="max-w-2xl mb-14">
          <BlurFade>
            <span className="text-xs font-mono font-semibold tracking-widest uppercase text-kozi-green">
              Domains
            </span>
          </BlurFade>
          <BlurFade delay={0.1}>
            <h2 className={`text-3xl sm:text-[2.5rem] font-semibold tracking-tight leading-[1.12] mt-3 ${dark ? 'text-surface-50' : 'text-kozi-navy'
              }`}>
              Where Kozi works
              <br />
              <span className={dark ? 'text-surface-400' : 'text-surface-500'}>
                across life sciences
              </span>
            </h2>
          </BlurFade>
        </div>

        {/* Animated card showcase */}
        <BlurFade delay={0.2}>
          <div className="relative overflow-hidden" style={{ minHeight: 180 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className={`group relative p-8 sm:p-10 rounded-2xl border transition-all duration-300 overflow-hidden ${dark ? 'bg-surface-800/30 border-surface-700/40 hover:border-kozi-blue/20'
                    : 'bg-white border-surface-200 hover:border-kozi-blue/20 hover:shadow-sm'
                  }`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 ${dark ? 'bg-kozi-blue/10' : 'bg-kozi-blue/[0.06]'
                    }`}>
                    <Icon size={22} className="text-kozi-blue" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-3 ${dark ? 'text-surface-100' : 'text-kozi-navy'}`}>
                    {current.title}
                  </h3>
                  <p className={`text-sm leading-relaxed max-w-2xl ${dark ? 'text-surface-400' : 'text-surface-500'}`}>
                    {current.desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {items.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === active ? 'bg-kozi-blue' : dark ? 'bg-surface-600' : 'bg-surface-300'
                  }`} />
            ))}
          </div>

          {/* Text labels (hidden on mobile) */}
          <div className="hidden sm:flex items-center justify-center gap-4 mt-4">
            {items.map((item, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`text-xs font-mono transition-colors ${i === active
                    ? 'text-kozi-blue font-semibold'
                    : dark ? 'text-surface-500 hover:text-surface-300' : 'text-surface-400 hover:text-surface-600'
                  }`}>
                {item.title}
              </button>
            ))}
          </div>
        </BlurFade>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   CONTACT PAGE
   ═══════════════════════════════════════════════════════ */
function ContactPage() {
  const { dark } = useTheme()
  const [activeTab, setActiveTab] = useState('beta')
  const [form, setForm] = useState({ name: '', email: '', organization: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const tabs = [
    { key: 'beta', label: 'Beta Partner' },
    { key: 'investor', label: 'Investor' },
    { key: 'collaborator', label: 'Collaborator' },
  ]

  const tabContent = {
    beta: {
      title: 'Request Beta Access',
      subtitle: 'Are you a research lab or institution interested in piloting TOPE_DEEP? Tell us about your work.',
    },
    investor: {
      title: 'Investment Inquiry',
      subtitle: 'Interested in supporting AI-driven life sciences infrastructure? We\'d love to hear from you.',
    },
    collaborator: {
      title: 'Collaborate With Us',
      subtitle: 'Building in life sciences R&D? Let\'s explore how Kozi can work with your team.',
    },
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const body = new URLSearchParams({
      'form-name': 'contact',
      'inquiry-type': activeTab,
      name: form.name,
      email: form.email,
      organization: form.organization,
      message: form.message,
    })
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
      .then(() => {
        setSubmitted(true)
        setForm({ name: '', email: '', organization: '', message: '' })
      })
      .catch(() => alert('Something went wrong. Please try again.'))
  }

  const inputClass = `w-full px-4 py-2.5 rounded-lg text-sm border outline-none transition-colors ${dark
      ? 'bg-surface-800/50 border-surface-700/50 text-surface-100 placeholder:text-surface-500 focus:border-kozi-blue/50'
      : 'bg-white border-surface-200 text-kozi-navy placeholder:text-surface-400 focus:border-kozi-blue/50'
    }`

  return (
    <section className="pt-28 pb-20 px-6 min-h-screen">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_340px] gap-10 lg:gap-14">
          {/* Left: Form */}
          <BlurFade>
            <div className={`rounded-2xl border p-6 sm:p-8 ${dark ? 'bg-surface-800/20 border-surface-700/40' : 'bg-white border-surface-200'
              }`}>
              {/* Tabs */}
              <div className={`flex rounded-lg p-1 mb-8 ${dark ? 'bg-surface-800/60' : 'bg-surface-100'
                }`}>
                {tabs.map(t => (
                  <button key={t.key} onClick={() => setActiveTab(t.key)}
                    className={`flex-1 text-[13px] font-medium py-2 px-3 rounded-md transition-all ${activeTab === t.key
                        ? 'bg-gradient-to-r from-kozi-blue to-kozi-green text-white shadow-sm'
                        : dark ? 'text-surface-400 hover:text-surface-200' : 'text-surface-500 hover:text-kozi-navy'
                      }`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Title + subtitle */}
              <h2 className={`text-2xl sm:text-3xl font-semibold tracking-tight ${dark ? 'text-surface-50' : 'text-kozi-navy'
                }`}>
                {tabContent[activeTab].title}
              </h2>
              <p className={`mt-2 text-sm leading-relaxed ${dark ? 'text-surface-400' : 'text-surface-500'}`}>
                {tabContent[activeTab].subtitle}
              </p>

              {/* Form */}
              {submitted && (
                <div className={`mt-6 p-4 rounded-lg text-sm ${dark ? 'bg-kozi-green/10 text-kozi-green' : 'bg-kozi-green/10 text-kozi-green'}`}>
                  Thank you! Your message has been sent. We'll get back to you soon.
                </div>
              )}
              <form name="contact" method="POST" data-netlify="true" onSubmit={handleSubmit} className="mt-8 space-y-4">
                <input type="hidden" name="form-name" value="contact" />
                <input type="hidden" name="inquiry-type" value={activeTab} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-xs font-medium mb-1.5 block ${dark ? 'text-surface-300' : 'text-surface-600'}`}>
                      Name <span className="text-kozi-blue">*</span>
                    </label>
                    <input type="text" required placeholder="Your name"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className={inputClass} />
                  </div>
                  <div>
                    <label className={`text-xs font-medium mb-1.5 block ${dark ? 'text-surface-300' : 'text-surface-600'}`}>
                      Email <span className="text-kozi-blue">*</span>
                    </label>
                    <input type="email" required placeholder="you@example.com"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${dark ? 'text-surface-300' : 'text-surface-600'}`}>
                    Organization
                  </label>
                  <input type="text" placeholder="Your organization"
                    value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })}
                    className={inputClass} />
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${dark ? 'text-surface-300' : 'text-surface-600'}`}>
                    Message <span className="text-kozi-blue">*</span>
                  </label>
                  <textarea required rows={5} placeholder="Tell us about your work or interest..."
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    className={`${inputClass} resize-none`} />
                </div>

                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="group flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-kozi-blue to-kozi-green text-white text-sm font-semibold transition-shadow hover:shadow-lg hover:shadow-kozi-blue/20">
                  <Send size={15} />
                  Send Message
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
              </form>
            </div>
          </BlurFade>

          {/* Right: Sidebar */}
          <BlurFade delay={0.2}>
            <div className={`rounded-2xl border p-6 h-fit sticky top-24 ${dark ? 'bg-surface-800/20 border-surface-700/40' : 'bg-white border-surface-200'
              }`}>
              <h3 className={`text-sm font-semibold mb-4 ${dark ? 'text-surface-100' : 'text-kozi-navy'}`}>
                Contact Info
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${dark ? 'bg-kozi-blue/10' : 'bg-kozi-blue/[0.06]'
                    }`}>
                    <Mail size={14} className="text-kozi-blue" />
                  </div>
                  <div>
                    <span className={`text-xs block ${dark ? 'text-surface-500' : 'text-surface-400'}`}>Email</span>
                    <span className={`text-sm ${dark ? 'text-surface-200' : 'text-kozi-navy'}`}>ask@kozi-ai.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${dark ? 'bg-kozi-blue/10' : 'bg-kozi-blue/[0.06]'
                    }`}>
                    <MapPin size={14} className="text-kozi-blue" />
                  </div>
                  <div>
                    <span className={`text-xs block ${dark ? 'text-surface-500' : 'text-surface-400'}`}>Location</span>
                    <span className={`text-sm ${dark ? 'text-surface-200' : 'text-kozi-navy'}`}>Kigali, Rwanda</span>
                  </div>
                </div>
              </div>

              <div className={`my-5 h-px ${dark ? 'bg-surface-700/40' : 'bg-surface-200'}`} />

              <h3 className={`text-sm font-semibold mb-2 ${dark ? 'text-surface-100' : 'text-kozi-navy'}`}>
                Response Time
              </h3>
              <p className={`text-xs leading-relaxed ${dark ? 'text-surface-400' : 'text-surface-500'}`}>
                We typically respond within 2 business days. Beta partner applications are reviewed weekly.
              </p>

              <div className={`my-5 h-px ${dark ? 'bg-surface-700/40' : 'bg-surface-200'}`} />

              <h3 className={`text-sm font-semibold mb-2 ${dark ? 'text-surface-100' : 'text-kozi-navy'}`}>
                For Developers
              </h3>
              <p className={`text-xs leading-relaxed ${dark ? 'text-surface-400' : 'text-surface-500'}`}>
                Interested in the ADK or contributing to open source? Check out our GitHub or reach out via the collaborator form.
              </p>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   TOPE_DEEP FULL PAGE
   ═══════════════════════════════════════════════════════ */
function TopeDeepPage() {
  return (
    <div className="pt-16">
      <TopeDeep />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════ */
function Footer() {
  const { dark } = useTheme()
  return (
    <footer className={`py-8 px-6 border-t ${dark ? 'border-surface-800' : 'border-surface-200'}`}>
      <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <KoziLogo height={18} />
          <span className={`text-xs ${dark ? 'text-surface-500' : 'text-surface-400'}`}>
            · Kigali, Rwanda · Founded 2025
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://www.linkedin.com/company/kozi-ai" target="_blank" rel="noopener noreferrer"
            className={`transition-colors ${dark ? 'text-surface-500 hover:text-surface-200' : 'text-surface-400 hover:text-kozi-navy'}`}>
            <Linkedin size={16} />
          </a>
          <a href="https://github.com/kozi-ai" target="_blank" rel="noopener noreferrer"
            className={`transition-colors ${dark ? 'text-surface-500 hover:text-surface-200' : 'text-surface-400 hover:text-kozi-navy'}`}>
            <Github size={16} />
          </a>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════ */
function PageContent() {
  const { page } = usePage()

  return (
    <>
      {page === 'home' && (
        <>
          <Hero />
          <TheGap />
          <HowItWorks />
          <Domains />
        </>
      )}
      {page === 'tope-deep' && <TopeDeepPage />}
      {page === 'contact' && <ContactPage />}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <PageProvider>
        <ScrollProgress />
        <div className="noise-overlay" />
        <div className="bio-grid min-h-screen">
          <Nav />
          <PageContent />
        </div>
      </PageProvider>
    </ThemeProvider>
  )
}
