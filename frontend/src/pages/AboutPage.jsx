import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '../components/SectionHeader'

function AboutContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="bg-zinc-950 text-white min-h-screen"
    >
      {/* Header Banner */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 to-transparent" />
        <div className="container-luxury relative z-10">
          <SectionHeader
            subtitle="Our Narrative & Atelier"
            title="Architects of Essence"
          />
        </div>
      </section>

      {/* Main Narrative Layout (About Section) */}
      <section className="pb-24">
        <div className="container-luxury">
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
          >
            {/* Written Story Block */}
            <div className="lg:col-span-7 space-y-6 text-zinc-300 font-light leading-relaxed">
              <motion.h3 variants={itemVariants} className="text-2xl font-serif text-white tracking-wide">
                Born out of a desire to capture fleeting emotions in glass vessels.
              </motion.h3>
              
              <motion.p variants={itemVariants}>
                Founded in 2026, our house began as a private studio devoted to matching historic architectural concepts with natural olfactive raw ingredients. We believe that a true luxury fragrance should never overpower; instead, it should linger like a quiet memory, shifting dynamically with your skin's natural chemistry over hours of wear.
              </motion.p>

              <motion.p variants={itemVariants}>
                Every extraction goes through months of maceration inside our temperature-controlled dark labs, allowing raw resins, cold-pressed citrus distillates, and concrete floral absolutes to mature into a cohesive sensory landscape.
              </motion.p>

              {/* Philosophical pillars */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-zinc-900">
                <div>
                  <h4 className="font-serif text-emerald-400 mb-1 text-base">Ethical Extraction</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">We source rare materials like real Mysore Sandalwood and Damascus Rose directly from sustainable farming communes.</p>
                </div>
                <div>
                  <h4 className="font-serif text-emerald-400 mb-1 text-base">Uncompromised Quality</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">Every bottle is poured at a minimum of 22% concentration (Extrait de Parfum) for exceptional structural longevity.</p>
                </div>
              </motion.div>
            </div>

            {/* Visual Block */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-5 relative aspect-[4/5] bg-gradient-to-tr from-emerald-950 to-zinc-900 border border-emerald-900/20 p-4 rounded-sm flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-emerald-900/10 mix-blend-color-dump" />
              <div className="border border-emerald-800/20 w-full h-full flex flex-col justify-between p-8 z-10">
                <span className="font-serif italic text-emerald-500/60 text-xs tracking-widest uppercase">Est. 2026</span>
                <p className="font-serif text-zinc-400 text-lg leading-relaxed text-center max-w-xs mx-auto">
                  "To wear a scent is to carry an invisible poetry everywhere you step."
                </p>
                <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 text-center">The Artisan House</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Layout (Contact Section) */}
      <section className="pb-24 pt-16 border-t border-zinc-900/60 bg-gradient-to-b from-zinc-950 to-emerald-950/20">
        <div className="container-luxury grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Informational Column with Your Verified Contacts */}
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

export default AboutContactPage