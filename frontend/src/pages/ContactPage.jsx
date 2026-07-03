import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '../components/SectionHeader'

function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Integrate API or backend form endpoints here
    setIsSubmitted(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-zinc-950 text-white min-h-screen"
    >
      {/* Header Banner */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 to-transparent" />
        <div className="container-luxury relative z-10">
          <SectionHeader
            subtitle="Get In Touch"
            title="Let's Converse"
          />
          <p className="text-center text-zinc-400 max-w-2xl mx-auto -mt-8 mb-4 font-light">
            Have questions about specific notes, custom sourcing, or wedding scent consultations? Reach our atelier experts below.
          </p>
        </div>
      </section>

      {/* Contact Layout */}
      <section className="pb-24">
        <div className="container-luxury grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Informational Column */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <h3 className="text-xl font-serif text-emerald-400 mb-3">Concierge Desk</h3>
              <p className="text-zinc-400 font-light leading-relaxed">
                Response window: Within 24 Hours<br />
                <span className="text-zinc-500 block mt-1">Available for worldwide consultations</span>
              </p>
              <a 
                href="mailto:abdulrazaqmahmud88@gmail.com"
                className="text-emerald-400/80 mt-2 hover:text-emerald-400 transition-colors inline-block text-sm font-medium tracking-wide"
              >
                abdulrazaqmahmud88@gmail.com
              </a>
            </div>

            <div>
              <h3 className="text-xl font-serif text-emerald-400 mb-3">Instant Messaging & Socials</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-zinc-500 block uppercase tracking-wider mb-1">WhatsApp Channels</span>
                  <a 
                    href="https://wa.me/254794145502" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-zinc-300 hover:text-emerald-400 transition-colors font-light text-sm flex items-center gap-2"
                  >
                    +254 794 145 502
                  </a>
                </div>
                <div>
                  <span className="text-xs text-zinc-500 block uppercase tracking-wider mb-1">Instagram Studio</span>
                  <a 
                    href="https://instagram.com/a.b.u.h.a.f.s.a" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-zinc-300 hover:text-emerald-400 transition-colors font-light text-sm"
                  >
                    @a.b.u.h.a.f.s.a
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 bg-zinc-900/40 border border-zinc-900 rounded-sm">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">Complimentary Samples</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every full-bottle fragrance purchase comes enclosed with an identical 2ml tester vial. Sample the vial first; if it isn't your true match, return the unopened full bottle within 30 days for a full refund.
              </p>
            </div>
          </div>

          {/* Interactive Form Column */}
          <div className="lg:col-span-7 bg-zinc-900/20 border border-zinc-900 p-8 md:p-10 rounded-sm relative">
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-12 h-12 bg-emerald-950 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-xl font-serif">
                  ✓
                </div>
                <h3 className="text-2xl font-serif text-white">Message Transmitted</h3>
                <p className="text-zinc-400 max-w-sm mx-auto text-sm font-light leading-relaxed">
                  Your message has been logged securely into our system. An expert from our olfactory care team will follow up via email shortly.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-emerald-400 text-xs underline uppercase tracking-widest pt-4 block mx-auto hover:text-emerald-300"
                >
                  Send another transmission
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-400 block font-medium">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/60 rounded-none px-4 py-3 text-white text-sm outline-none transition-all duration-300 font-light"
                      placeholder="Alexander Wright"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-400 block font-medium">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/60 rounded-none px-4 py-3 text-white text-sm outline-none transition-all duration-300 font-light"
                      placeholder="alex@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-400 block font-medium">How can we assist you?</label>
                  <textarea 
                    rows={5}
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/60 rounded-none px-4 py-3 text-white text-sm outline-none transition-all duration-300 font-light resize-none"
                    placeholder="Describe your preference or query..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-emerald-900/60 hover:bg-emerald-600 border border-emerald-700/50 hover:border-emerald-500 text-white font-medium transition-all duration-300 tracking-widest text-xs uppercase"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </motion.div>
  )
}

export default ContactPage