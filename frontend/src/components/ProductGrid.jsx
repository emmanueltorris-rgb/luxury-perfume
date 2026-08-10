import { AnimatePresence, motion } from 'framer-motion'
import { Search, Sparkles, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import ProductCard from './products/ProductCard'
import ProductSearch from './ProductSearch'
import { useProducts } from '../hooks/useProducts'

function ProductGrid({ featuredOnly = false }) {
  const {
    products,
    categories,
    featuredProducts,
    isLoading,
    error,
  } = useProducts()

  /*
   * =========================================================
   * STATE
   * =========================================================
   */

  const [activeCategory, setActiveCategory] = useState('All')

  const [searchQuery, setSearchQuery] = useState('')

  const [sortBy, setSortBy] = useState('featured')

  const [visibleCount, setVisibleCount] = useState(12)

  const [showFinder, setShowFinder] = useState(false)

  const [finderStrength, setFinderStrength] = useState('')

  const [finderUsage, setFinderUsage] = useState('')

  /*
   * =========================================================
   * RESET PAGINATION WHEN FILTERS CHANGE
   * =========================================================
   */

  const resetVisibleProducts = () => {
    setVisibleCount(12)
  }

  /*
   * =========================================================
   * CATEGORIES
   * =========================================================
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
   * =========================================================
   * SOURCE PRODUCTS
   * =========================================================
   */

  const sourceProducts = useMemo(() => {
    if (featuredOnly) {
      return featuredProducts || []
    }

    return products || []
  }, [
    featuredOnly,
    featuredProducts,
    products,
  ])

  /*
   * =========================================================
   * FILTER + SEARCH + SORT
   * =========================================================
   */

  const filtered = useMemo(() => {
    let result = [...sourceProducts]

    /*
     * CATEGORY
     */

    if (
      !featuredOnly &&
      activeCategory !== 'All'
    ) {
      result = result.filter(
        (product) =>
          product.category?.toLowerCase() ===
          activeCategory.toLowerCase()
      )
    }

    /*
     * SEARCH
     */

    const query = searchQuery
      .trim()
      .toLowerCase()

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

    /*
     * FRAGRANCE FINDER
     */

    if (finderStrength) {
      result = result.filter((product) => {
        const strength =
          product.scent_strength
            ?.toLowerCase()
            .trim()

        return (
          strength ===
          finderStrength.toLowerCase()
        )
      })
    }

    if (finderUsage) {
      result = result.filter((product) => {
        const bestFor =
          product.best_for
            ?.toLowerCase()
            .trim()

        return (
          bestFor?.includes(
            finderUsage.toLowerCase()
          )
        )
      })
    }

    /*
     * SORT
     */

    if (sortBy === 'price-low') {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      )
    }

    if (sortBy === 'price-high') {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      )
    }

    if (sortBy === 'name') {
      result.sort((a, b) =>
        (a.name || '').localeCompare(
          b.name || ''
        )
      )
    }

    return result
  }, [
    sourceProducts,
    activeCategory,
    searchQuery,
    sortBy,
    featuredOnly,
    finderStrength,
    finderUsage,
  ])

  /*
   * =========================================================
   * VISIBLE PRODUCTS
   * =========================================================
   */

  const visibleProducts = useMemo(() => {
    return filtered.slice(0, visibleCount)
  }, [filtered, visibleCount])

  const hasMore =
    visibleCount < filtered.length

  /*
   * =========================================================
   * FINDER
   * =========================================================
   */

  const applyFinder = () => {
    setVisibleCount(12)
    setShowFinder(false)
  }

  const clearFinder = () => {
    setFinderStrength('')
    setFinderUsage('')
    setVisibleCount(12)
  }

  /*
   * =========================================================
   * LOADING
   * =========================================================
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
   * =========================================================
   * ERROR
   * =========================================================
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
   * =========================================================
   * MAIN
   * =========================================================
   */

  return (
    <div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      {!featuredOnly && (
        <ProductSearch
          searchQuery={searchQuery}
          setSearchQuery={(value) => {
            setSearchQuery(value)
            resetVisibleProducts()
          }}
          sortBy={sortBy}
          setSortBy={(value) => {
            setSortBy(value)
            resetVisibleProducts()
          }}
          onClear={() => {
            setSearchQuery('')
            resetVisibleProducts()
          }}
        />
      )}

      {/* =====================================================
          FIND MY FRAGRANCE
      ===================================================== */}

      {!featuredOnly && (
        <div className="mb-8">

          <button
            type="button"
            onClick={() => setShowFinder(true)}
            className="w-full rounded-2xl border border-luxury-gold/20 bg-luxury-gold/5 hover:bg-luxury-gold/10 transition-all duration-300 p-5 text-left"
          >

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-luxury-gold" />
                </div>

                <div>

                  <p className="text-sm text-luxury-gold uppercase tracking-[0.2em]">
                    Not sure what to choose?
                  </p>

                  <p className="text-white/70 text-sm mt-1">
                    Find a fragrance that matches you.
                  </p>

                </div>

              </div>

              <span className="hidden sm:block text-sm text-luxury-gold">
                Find My Fragrance →
              </span>

            </div>

          </button>

        </div>
      )}

      {/* =====================================================
          ACTIVE FINDER FILTERS
      ===================================================== */}

      {(finderStrength || finderUsage) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">

          <span className="text-xs text-white/40">
            Your preferences:
          </span>

          {finderStrength && (
            <button
              type="button"
              onClick={() => {
                setFinderStrength('')
                resetVisibleProducts()
              }}
              className="px-3 py-1.5 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 text-xs text-luxury-gold flex items-center gap-2"
            >
              {finderStrength}
              <X className="w-3 h-3" />
            </button>
          )}

          {finderUsage && (
            <button
              type="button"
              onClick={() => {
                setFinderUsage('')
                resetVisibleProducts()
              }}
              className="px-3 py-1.5 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 text-xs text-luxury-gold flex items-center gap-2"
            >
              {finderUsage}
              <X className="w-3 h-3" />
            </button>
          )}

          <button
            type="button"
            onClick={clearFinder}
            className="text-xs text-white/40 hover:text-white transition-colors ml-1"
          >
            Clear
          </button>

        </div>
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

          <div className="text-center mb-5">

            <p className="text-xs uppercase tracking-[0.3em] text-luxury-gold/80">
              Explore by fragrance family
            </p>

          </div>

          <div className="flex flex-wrap justify-center gap-3">

            {filterCategories.map((category) => {

              const isActive =
                activeCategory === category

              return (
                <motion.button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category)
                    resetVisibleProducts()
                  }}
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
          RESULT COUNT
      ===================================================== */}

      {!featuredOnly && (
        <div className="mb-6">

          <p className="text-sm text-white/40">

            Showing{' '}

            <span className="text-white/70 font-medium">
              {visibleProducts.length}
            </span>

            {' '}of{' '}

            <span className="text-white/70 font-medium">
              {filtered.length}
            </span>

            {' '}

            {filtered.length === 1
              ? 'fragrance'
              : 'fragrances'}

          </p>

        </div>
      )}

      {/* =====================================================
          PRODUCT GRID
      ===================================================== */}

      <motion.div
        layout
        className="
          grid
          grid-cols-2
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-3
          sm:gap-5
          md:gap-6
          lg:gap-8
        "
      >

        <AnimatePresence mode="popLayout">

          {visibleProducts.map(
            (product, index) => (

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

            )
          )}

        </AnimatePresence>

      </motion.div>

      {/* =====================================================
          LOAD MORE
      ===================================================== */}

      {hasMore && (
        <div className="flex justify-center mt-10">

          <button
            type="button"
            onClick={() =>
              setVisibleCount(
                (current) => current + 12
              )
            }
            className="px-7 py-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300"
          >
            Load More
          </button>

        </div>
      )}

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

            <Search className="w-8 h-8 text-luxury-gold mx-auto mb-5" />

            <p className="font-serif text-2xl text-white/80 mb-2">
              No fragrances found
            </p>

            <p className="text-sm text-white/40">
              Try another fragrance name,
              category, or preference.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('All')
                setFinderStrength('')
                setFinderUsage('')
                setSortBy('featured')
                setVisibleCount(12)
              }}
              className="mt-5 px-5 py-2 rounded-full bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30 hover:bg-luxury-gold/30 transition-all text-sm"
            >
              Reset filters
            </button>

          </div>

        </motion.div>
      )}

      {/* =====================================================
          FIND MY FRAGRANCE MODAL
      ===================================================== */}

      <AnimatePresence>

        {showFinder && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFinder(false)}
          >

            <motion.div
              onClick={(event) =>
                event.stopPropagation()
              }
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.96,
              }}
              className="w-full max-w-lg rounded-3xl liquid-glass border border-white/10 p-6 sm:p-8"
            >

              {/* HEADER */}

              <div className="flex items-start justify-between gap-4">

                <div>

                  <div className="flex items-center gap-2 mb-3">

                    <Sparkles className="w-4 h-4 text-luxury-gold" />

                    <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold">
                      Fragrance Finder
                    </span>

                  </div>

                  <h2 className="font-serif text-3xl text-white">
                    Find your scent
                  </h2>

                  <p className="text-sm text-white/40 mt-2">
                    Tell us a little about what you want.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowFinder(false)
                  }
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>

              </div>

              {/* STRENGTH */}

              <div className="mt-8">

                <p className="text-sm text-white/70 mb-3">
                  How strong should it be?
                </p>

                <div className="grid grid-cols-3 gap-2">

                  {['mild', 'medium', 'strong'].map(
                    (strength) => (
                      <button
                        key={strength}
                        type="button"
                        onClick={() =>
                          setFinderStrength(
                            strength
                          )
                        }
                        className={`py-3 rounded-xl border text-sm capitalize transition-all ${
                          finderStrength ===
                          strength
                            ? 'bg-luxury-gold/20 border-luxury-gold/40 text-luxury-gold'
                            : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                        }`}
                      >
                        {strength}
                      </button>
                    )
                  )}

                </div>

              </div>

              {/* USAGE */}

              <div className="mt-7">

                <p className="text-sm text-white/70 mb-3">
                  When will you mostly wear it?
                </p>

                <div className="grid grid-cols-2 gap-2">

                  {[
                    'morning',
                    'evening',
                    'daily',
                    'special',
                  ].map((usage) => (
                    <button
                      key={usage}
                      type="button"
                      onClick={() =>
                        setFinderUsage(usage)
                      }
                      className={`py-3 rounded-xl border text-sm capitalize transition-all ${
                        finderUsage === usage
                          ? 'bg-luxury-gold/20 border-luxury-gold/40 text-luxury-gold'
                          : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                      }`}
                    >
                      {usage}
                    </button>
                  ))}

                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex gap-3 mt-8">

                <button
                  type="button"
                  onClick={clearFinder}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all"
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={applyFinder}
                  className="flex-1 py-3 rounded-xl bg-luxury-gold text-black font-medium hover:opacity-90 transition-all"
                >
                  Show My Fragrances
                </button>

              </div>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  )
}

export default ProductGrid