import { motion } from 'framer-motion'
import {
  ArrowRight, BarChart3, Dna, Activity, Globe2,
  Shield, FlaskConical, FileText, CheckCircle2
} from 'lucide-react'
import { useTheme, usePage } from './contexts'
import { BlurFade, MagneticCard, BorderBeam } from './primitives'

export function TopeDeep() {
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

export function TopeDeepPage() {
  return (
    <div className="pt-16">
      <TopeDeep />
    </div>
  )
}
