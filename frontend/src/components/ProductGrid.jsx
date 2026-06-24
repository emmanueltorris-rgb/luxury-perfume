import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from './ProductCard'
import { products, categories } from '../data/products'

function ProductGrid({ featuredOnly = false }) {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = featuredOnly
    ? products.filter((p) => p.featured)
    : activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory)

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
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/40'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      )}

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-white/40">
          No fragrances found in this collection.
        </div>
      )}
    </div>
  )
}

export default ProductGrid
