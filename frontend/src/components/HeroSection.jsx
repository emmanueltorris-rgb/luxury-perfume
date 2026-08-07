import { useMemo } from 'react'
import { motion } from 'framer-motion'
import HeroProductShowcase from './HeroProductShowcase'
import { useProducts } from '../hooks/useProducts'

function HeroSection() {
  const { products, isLoading, error } = useProducts()

  const heroProducts = useMemo(() => {
    if (!products || products.length === 0) {
      return []
    }

    // 1. Products currently on discount
    const discounted = products.filter(
      (product) =>
        product.discount_active &&
        product.discount_type !== 'none' &&
        Number(product.discount_value) > 0
    )

    // 2. Recently added products
    const recent = [...products]
      .filter((product) => product.created_at)
      .sort(
        (a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
      )

    // 3. Random products
    const shuffled = [...products].sort(() => Math.random() - 0.5)

    // Combine the different types
    const combined = [
      ...discounted,
      ...recent,
      ...shuffled,
    ]

    // Remove duplicates
    const uniqueProducts = Array.from(
      new Map(
        combined.map((product) => [product.id, product])
      ).values()
    )

    // Hero will rotate through up to 5 products
    return uniqueProducts.slice(0, 5)
  }, [products])

  return (
    <section className="relative overflow-hidden">

      {/* ================================
          AMBIENT BACKGROUND
      ================================= */}

      <motion.div
        className="absolute top-1/4 left-10 md:left-20 w-72 h-72 rounded-full opacity-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,55,0.35) 0%, transparent 70%)',
        }}
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-10 md:right-20 w-64 h-64 rounded-full opacity-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
        }}
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* ================================
          BRAND INTRO
      ================================= */}

      <div className="relative z-10 pt-28 md:pt-36 pb-4">
        <div className="container-luxury text-center">

          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />

            <span className="text-xs uppercase tracking-[0.25em] text-white/60">
              Arwaah Parfumerie
            </span>
          </motion.div>

          <motion.h1
            className="mt-6 font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            A fragrance for
            <span className="block text-luxury-gold italic">
              your story.
            </span>
          </motion.h1>

          <motion.p
            className="max-w-xl mx-auto mt-5 text-sm md:text-base text-white/50 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Discover carefully selected fragrances crafted to
            express individuality, elegance, and character.
          </motion.p>

        </div>
      </div>

      {/* ================================
          PRODUCT SHOWCASE
      ================================= */}

      <div className="relative z-10">

        {isLoading && (
          <div className="container-luxury py-20 text-center">
            <p className="text-white/50">
              Discovering your next signature scent...
            </p>
          </div>
        )}

        {error && (
          <div className="container-luxury py-20 text-center">
            <p className="text-white/50">
              Unable to load our fragrances right now.
            </p>
          </div>
        )}

        {!isLoading && !error && heroProducts.length > 0 && (
          <HeroProductShowcase products={heroProducts} />
        )}

      </div>

      {/* ================================
          FALLBACK
      ================================= */}

      {!isLoading && !error && heroProducts.length === 0 && (
        <div className="container-luxury py-20 text-center">
          <p className="text-white/50">
            Our fragrance collection is being prepared.
          </p>
        </div>
      )}

    </section>
  )
}

export default HeroSection