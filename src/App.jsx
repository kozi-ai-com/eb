import { ThemeProvider, PageProvider, usePage } from './components/contexts'
import { ScrollProgress } from './components/primitives'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { TheGap } from './components/TheGap'
import { HowItWorks } from './components/HowItWorks'
import { TopeDeepPage } from './components/TopeDeep'
import { Domains } from './components/Domains'
import { ContactPage } from './components/ContactPage'
import { Footer } from './components/Footer'

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
