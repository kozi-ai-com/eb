import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, MapPin, Send } from 'lucide-react'
import { useTheme } from './contexts'
import { BlurFade } from './primitives'

export function ContactPage() {
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
