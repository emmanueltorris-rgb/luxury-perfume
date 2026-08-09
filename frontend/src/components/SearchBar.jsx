import { Search, X } from 'lucide-react'

function SearchBar({ value, onChange, placeholder = 'Search fragrances...' }) {
  const handleClear = () => {
    onChange('')
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-10">
      <div className="relative">

        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none"
        />

        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-label="Search fragrances"
          className="
            w-full
            h-14
            pl-14
            pr-12
            rounded-2xl
            bg-white/5
            backdrop-blur-md
            border
            border-white/10
            text-white
            placeholder:text-white/30
            outline-none
            transition-all
            duration-300
            focus:border-luxury-gold/50
            focus:bg-white/10
            focus:ring-1
            focus:ring-luxury-gold/20
          "
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              p-2
              rounded-full
              text-white/40
              hover:text-white
              hover:bg-white/10
              transition-all
            "
          >
            <X className="w-4 h-4" />
          </button>
        )}

      </div>

      {value && (
        <p className="mt-3 text-center text-xs text-white/30">
          Searching for "{value}"
        </p>
      )}
    </div>
  )
}

export default SearchBar