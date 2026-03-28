import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTheme, usePage } from './contexts'
import { BlurFade, NumberTicker, ShinyBadge, OrganicShapes } from './primitives'

export function Hero() {
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

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Status chip with shimmer */}
        <BlurFade delay={0.1}>
          <div className="flex justify-center mb-8">
            <ShinyBadge className={`gap-2 px-6 py-1.5 text-xs font-medium border ${dark ? 'bg-surface-800/60 border-surface-600/50 text-surface-300'
              : 'bg-white border-surface-200 text-surface-500'
              }`}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-kozi-green opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-kozi-green" />
              </span>
              TOPE_DEEP is live
            </ShinyBadge>
          </div>
        </BlurFade>

        {/* Headline */}
        <BlurFade delay={0.25}>
          <h1 className={`text-[clamp(2.25rem,5.5vw,4.25rem)] font-semibold leading-[1.08] tracking-[-0.03em] ${dark ? 'text-surface-50' : 'text-kozi-navy'
            }`}>
            We build agents that work so scientists can
            <span className="text-brand-gradient"> discover</span>
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
      <motion.button
        onClick={() => document.getElementById('the-gap')?.scrollIntoView({ behavior: 'smooth' })}
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 2 }}
        whileHover={{ opacity: 1, scale: 1.1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer">
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className={`w-4 h-7 rounded-full border flex items-start justify-center pt-1.5 ${dark ? 'border-surface-600' : 'border-surface-300'
            }`}>
          <div className="w-0.5 h-1.5 rounded-full bg-kozi-blue" />
        </motion.div>
      </motion.button>
    </section>
  )
}
