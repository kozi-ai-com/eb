import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme, usePage } from './contexts'
import { KoziLogo } from './KoziLogo'

export function Nav() {
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
