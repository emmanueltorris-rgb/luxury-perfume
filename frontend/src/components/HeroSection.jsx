import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <motion.div
        className="absolute top-1/4 left-10 md:left-20 w-64 h-64 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)',
        }}
        animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-10 md:right-20 w-48 h-48 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
        }}
        animate={{ y: [0, 20, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <div className="container-luxury relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-4 h-4 text-luxury-gold" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/70">
              Artisan Crafted in Nairobi
            </span>
          </motion.div>

          <motion.h1
            className="heading-luxury-gold text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 leading-[0.95]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            L'Essence
            <br />
            <span className="font-serif italic text-white/90 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              Parfumerie
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover fragrances that transcend the ordinary. Each bottle is a masterpiece 
            of rare ingredients, distilled for the discerning connoisseur.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/products" className="btn-gold group">
              <span className="flex items-center gap-2">
                Explore Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link to="/checkout" className="btn-glass">
              Quick Purchase
            </Link>
          </motion.div>

          <motion.div
            className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {[
              { value: '12', label: 'Signature Scents' },
              { value: '100%', label: 'Authentic Oils' },
              { value: 'M-Pesa', label: 'Instant Checkout' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-serif text-2xl md:text-3xl text-luxury-gold font-bold">
                  {stat.value}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-luxury-gold/60" />
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection
