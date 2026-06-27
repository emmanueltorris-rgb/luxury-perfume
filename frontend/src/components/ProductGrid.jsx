import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import ProductCard from './ProductCard'
import { useProducts } from '../hooks/useProducts'

function ProductGrid({ featuredOnly = false }) {
  const { products, categories, featuredProducts, isLoading, error } = useProducts()
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = useMemo(() => {
    if (isLoading || error) return []
    if (featuredOnly) {
      return featuredProducts
    }

    if (activeCategory === 'All') {
      return products
    }

    return products.filter((product) => product.category === activeCategory)
  }, [activeCategory, error, featuredOnly, featuredProducts, isLoading, products])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl p-8 liquid-glass text-center">
          <p className="text-white/70 text-lg">Loading fragrant treasures...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-3xl p-8 liquid-glass text-center text-white/80">
        <p className="text-xl font-semibold">Unable to load products</p>
        <p className="mt-2 text-sm text-white/50">{error}</p>
      </div>
    )
  }

  return (
    <div>
      {!featuredOnly && (
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-rose-100/25 text-rose-900 border border-rose-200'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      )}

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        <AnimatePresence mode="popLayout">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-white/40">
          No fragrances found for this selection.
        </div>
      )}
    </div>
  )
}

export default ProductGrid
