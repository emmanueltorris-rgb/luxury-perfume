import { motion } from 'framer-motion'
import SectionHeader from '../components/SectionHeader'

function AboutPage() {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.25 } }
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
      {/* Hero Header */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 to-transparent" />
        <div className="container-luxury relative z-10">
          <SectionHeader
            subtitle="Our Narrative"
            title="Architects of Essence"
          />
        </div>
      </section>

      {/* Main Narrative Layout */}
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
                Founded in 2021, our house began as a private studio devoted to matching historic architectural concepts with natural olfactive raw ingredients. We believe that a true luxury fragrance should never overpower; instead, it should linger like a quiet memory, shifting dynamically with your skin's natural chemistry over hours of wear.
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
                <span className="font-serif italic text-emerald-500/60 text-xs tracking-widest uppercase">Est. 2021</span>
                <p className="font-serif text-zinc-400 text-lg leading-relaxed text-center max-w-xs mx-auto">
                  "To wear a scent is to carry an invisible poetry everywhere you step."
                </p>
                <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 text-center">The Artisan House</span>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default AboutPage