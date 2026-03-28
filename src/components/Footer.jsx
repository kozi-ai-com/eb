import { Linkedin, Github } from 'lucide-react'
import { useTheme } from './contexts'
import { KoziLogo } from './KoziLogo'

export function Footer() {
  const { dark } = useTheme()
  return (
    <footer className={`py-8 px-6 border-t ${dark ? 'border-surface-800' : 'border-surface-200'}`}>
      <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <KoziLogo height={18} />
          <span className={`text-xs ${dark ? 'text-surface-500' : 'text-surface-400'}`}>
            · Kigali, Rwanda
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://www.linkedin.com/company/kozi-ai" target="_blank" rel="noopener noreferrer"
            className={`transition-colors ${dark ? 'text-surface-500 hover:text-surface-200' : 'text-surface-400 hover:text-kozi-navy'}`}>
            <Linkedin size={16} />
          </a>
          <a href="https://github.com/kozi-ai-com" target="_blank" rel="noopener noreferrer"
            className={`transition-colors ${dark ? 'text-surface-500 hover:text-surface-200' : 'text-surface-400 hover:text-kozi-navy'}`}>
            <Github size={16} />
          </a>
        </div>
      </div>
    </footer>
  )
}
