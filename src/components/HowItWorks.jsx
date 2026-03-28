import { motion } from 'framer-motion'
import { Search, Layers, Eye, FileText, Play, SlidersHorizontal, Pause } from 'lucide-react'
import { useTheme } from './contexts'
import { BlurFade, MagneticCard, CursorSpotlight } from './primitives'

export function HowItWorks() {
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
