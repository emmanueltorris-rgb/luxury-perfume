import { motion } from 'framer-motion'
import { Sparkles, ArrowDown } from 'lucide-react'

import SectionHeader from '../components/SectionHeader'
import ProductGrid from '../components/ProductGrid'

function ProductsPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >

      {/* =====================================================
          HERO / COLLECTION HEADER
      ===================================================== */}

      <section className="relative pt-32 pb-20 overflow-hidden">

        {/* Background */}

        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-emerald-900/30 to-transparent" />

        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-luxury-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute top-40 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute top-40 right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />


        {/* Content */}

        <div className="container-luxury relative z-10">

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          >

            {/* Small label */}

            <div className="flex justify-center mb-5">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">

                <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />

                <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-gold">
                  Our Collection
                </span>

              </div>

            </div>


            {/* Main heading */}

            <SectionHeader
              subtitle="The Complete Collection"
              title="Every Fragrance Tells a Story"
            />


            {/* Description */}

            <motion.p
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.15,
              }}
              className="text-center text-white/50 max-w-2xl mx-auto -mt-6 mb-8 leading-relaxed"
            >
              Discover our curated collection of artisan fragrances,
              crafted to express individuality, elegance, and character.
              Find the scent that tells your story.
            </motion.p>


            {/* Scroll indicator */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.8,
                delay: 0.4,
              }}
              className="flex justify-center"
            >

              <motion.div
                animate={{
                  y: [0, 6, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="flex flex-col items-center gap-2 text-white/30"
              >

                <span className="text-[9px] uppercase tracking-[0.25em]">
                  Explore
                </span>

                <ArrowDown className="w-4 h-4" />

              </motion.div>

            </motion.div>

          </motion.div>

        </div>

      </section>


      {/* =====================================================
          PRODUCT COLLECTION
      ===================================================== */}

      <section className="relative pb-28">

        {/* Subtle background */}

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-emerald-950/10 to-black/20" />

        <div className="container-luxury relative z-10">

          <ProductGrid />

        </div>

      </section>

    </motion.main>
  )
}

export default ProductsPage