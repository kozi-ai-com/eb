import { useState, useEffect, useCallback, createContext, useContext } from 'react'

/* ═══════════════════════════════════════════════════════
   PAGE CONTEXT (simple state-based routing)
   ═══════════════════════════════════════════════════════ */
const PageCtx = createContext()

export function PageProvider({ children }) {
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

export const usePage = () => useContext(PageCtx)

/* ═══════════════════════════════════════════════════════
   THEME CONTEXT
   ═══════════════════════════════════════════════════════ */
const ThemeCtx = createContext()

export function ThemeProvider({ children }) {
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

export const useTheme = () => useContext(ThemeCtx)
