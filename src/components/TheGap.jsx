import { useTheme } from './contexts'
import { BlurFade, Marquee } from './primitives'

export function TheGap() {
  const { dark } = useTheme()

  const tools = [
    'UniProt', 'PSORTb', 'TMHMM', 'VaxiJen', 'NetMHCpan',
    'MHCflurry', 'BepiPred', 'AlphaFold', 'PDB', 'AllerTOP',
    'ToxinPred', 'MAFFT', 'IEDB', 'PubMed', 'ColabFold'
  ]

  return (
    <section id="the-gap" className="py-28 sm:py-36 px-6">
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
