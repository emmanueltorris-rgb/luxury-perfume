import { Search, SlidersHorizontal, X } from 'lucide-react'
import { motion } from 'framer-motion'

function ProductSearch({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  onClear,
}) {
  const hasSearch = searchQuery.trim().length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div className="flex flex-col md:flex-row gap-3">
        {/* SEARCH */}

        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search fragrances..."
            className="w-full h-12 pl-12 pr-12 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none transition-all focus:border-luxury-gold/50 focus:bg-white/10"
          />

          {hasSearch && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* SORT */}

        <div className="relative md:w-52">
          <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value)
            }
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none appearance-none cursor-pointer focus:border-luxury-gold/50"
          >
            <option value="featured" className="bg-[#102b25]">
              Featured
            </option>

            <option value="price-low" className="bg-[#102b25]">
              Price: Low to High
            </option>

            <option value="price-high" className="bg-[#102b25]">
              Price: High to Low
            </option>

            <option value="name" className="bg-[#102b25]">
              Name: A–Z
            </option>
          </select>
        </div>
      </div>

      {hasSearch && (
        <p className="mt-3 text-xs text-white/40">
          Searching for{' '}
          <span className="text-luxury-gold">
            "{searchQuery}"
          </span>
        </p>
      )}
    </motion.div>
  )
}

export default ProductSearch