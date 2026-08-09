import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'

import ProductCard from './products/ProductCard'
import SearchBar from './SearchBar'
import { useProducts } from '../hooks/useProducts'

function ProductGrid({ featuredOnly = false }) {
  const {
    products,
    categories,
    featuredProducts,
    isLoading,
    error,
  } = useProducts()

  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  /*
   * ---------------------------------------------------------
   * FILTER CATEGORIES
   * ---------------------------------------------------------
   */

  const filterCategories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        (categories || []).filter(
          (category) =>
            category &&
            category.toLowerCase() !== 'all'
        )
      ),
    ]

    return ['All', ...uniqueCategories]
  }, [categories])

  /*
   * ---------------------------------------------------------
   * FILTER PRODUCTS
   * ---------------------------------------------------------
   *
   * Search and category filters work together.
   * ---------------------------------------------------------
   */

  const filtered = useMemo(() => {
    if (isLoading || error) {
      return []
    }

    /*
     * Featured collection
     */

    if (featuredOnly) {
      return featuredProducts || []
    }

    /*
     * Start with all products
     */

    let result = products || []

    /*
     * CATEGORY FILTER
     */

    if (activeCategory !== 'All') {
      result = result.filter(
        (product) =>
          product.category === activeCategory
      )
    }

    /*
     * SEARCH FILTER
     */

    const query = searchQuery.trim().toLowerCase()

    if (query) {
      result = result.filter((product) => {

        const searchableText = [
          product.name,
          product.brand,
          product.category,
          product.description,
          product.preview_description,
          product.scent_strength,
          product.best_for,
          product.last,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return searchableText.includes(query)
      })
    }

    return result
  }, [
    activeCategory,
    error,
    featuredOnly,
    featuredProducts,
    isLoading,
    products,
    searchQuery,
  ])

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (isLoading) {
    return (
      <div className="space-y-6">

        <div className="rounded-3xl p-8 liquid-glass text-center">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-white/70 text-lg">
              Loading fragrant treasures...
            </p>
          </motion.div>

        </div>

      </div>
    )
  }

  /*
   * ---------------------------------------------------------
   * ERROR
   * ---------------------------------------------------------
   */

  if (error) {
    return (
      <div className="rounded-3xl p-8 liquid-glass text-center text-white/80">

        <p className="text-xl font-semibold">
          Unable to load products
        </p>

        <p className="mt-2 text-sm text-white/50">
          {error}
        </p>

      </div>
    )
  }

  /*
   * ---------------------------------------------------------
   * MAIN
   * ---------------------------------------------------------
   */

  return (
    <div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      {!featuredOnly && (
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.4,
          }}
        >

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search perfumes, brands, fragrance families..."
          />

        </motion.div>
      )}

      {/* =====================================================
          CATEGORY FILTER
      ===================================================== */}

      {!featuredOnly && (
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.4,
          }}
        >

          {/* TITLE */}

          <div className="text-center mb-5">

            <p className="text-xs uppercase tracking-[0.3em] text-luxury-gold/80">
              Explore by fragrance family
            </p>

          </div>

          {/* FILTER BUTTONS */}

          <div className="flex flex-wrap justify-center gap-3">

            {filterCategories.map((category) => {

              const isActive =
                activeCategory === category

              return (
                <motion.button
                  key={category}
                  type="button"
                  onClick={() =>
                    setActiveCategory(category)
                  }
                  whileTap={{
                    scale: 0.95,
                  }}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/40 shadow-lg'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  {category}
                </motion.button>
              )
            })}

          </div>

        </motion.div>
      )}

      {/* =====================================================
          ACTIVE FILTER SUMMARY
      ===================================================== */}

      {!featuredOnly && (
        <div className="mb-6 flex flex-wrap items-center gap-2">

          <p className="text-sm text-white/40">
            Showing{' '}
            <span className="text-white/70 font-medium">
              {filtered.length}
            </span>{' '}
            {filtered.length === 1
              ? 'fragrance'
              : 'fragrances'}
          </p>

          {searchQuery.trim() && (
            <span className="text-xs px-3 py-1 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold/80">
              Search: "{searchQuery}"
            </span>
          )}

          {activeCategory !== 'All' && (
            <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50">
              {activeCategory}
            </span>
          )}

        </div>
      )}

      {/* =====================================================
          PRODUCT GRID
      ===================================================== */}

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
      >

        <AnimatePresence mode="popLayout">

          {filtered.map((product, index) => (

            <motion.div
              key={product.id}
              layout
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
              }}
              transition={{
                duration: 0.25,
              }}
            >

              <ProductCard
                product={product}
                index={index}
              />

            </motion.div>

          ))}

        </AnimatePresence>

      </motion.div>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {filtered.length === 0 && (
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center py-20"
        >

          <div className="liquid-glass rounded-3xl p-10 max-w-lg mx-auto">

            <p className="font-serif text-2xl text-white/80 mb-2">
              No fragrances found
            </p>

            <p className="text-sm text-white/40">
              {searchQuery.trim()
                ? `We couldn't find any fragrances matching "${searchQuery}".`
                : 'No fragrances are currently available for this selection.'}
            </p>

            {/* RESET SEARCH */}

            {searchQuery.trim() && (
              <button
                type="button"
                onClick={() =>
                  setSearchQuery('')
                }
                className="mt-5 px-5 py-2 rounded-full bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30 hover:bg-luxury-gold/30 transition-all text-sm"
              >
                Clear search
              </button>
            )}

            {/* RESET CATEGORY */}

            {activeCategory !== 'All' && (
              <button
                type="button"
                onClick={() =>
                  setActiveCategory('All')
                }
                className="mt-5 ml-2 px-5 py-2 rounded-full bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white transition-all text-sm"
              >
                View all fragrances
              </button>
            )}
          </div>
        </motion.div>
      )}

    </div>
  )
}

export default ProductGrid