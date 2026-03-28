import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Microscope, Dna, FlaskConical, Activity, Search } from 'lucide-react'
import { useTheme } from './contexts'
import { BlurFade } from './primitives'

export function Domains() {
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
