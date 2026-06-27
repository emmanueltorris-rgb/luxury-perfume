import { motion } from 'framer-motion'
import { ShoppingBag, Check } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/utils'

function ProductCard({ product, index }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const getImageUrl = (url) => {
    if (!url) return null
    if (url.startsWith('/static')) return `http://localhost:8000${url}`
    return url
  }

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="liquid-glass rounded-2xl overflow-hidden transition-all duration-500 group-hover:glow-gold">
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-emerald-900/50 to-amber-900/30">
          <div className="absolute inset-0 flex items-center justify-center">
            {getImageUrl(product.image_url) ? (
              <img
                src={getImageUrl(product.image_url)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <motion.div
                  className="w-32 h-32 rounded-full opacity-40"
                  style={{
                    background: `radial-gradient(circle, ${
                      product.category === 'Oriental'
                        ? 'rgba(212,175,55,0.4)'
                        : product.category === 'Woody'
                        ? 'rgba(120,53,15,0.5)'
                        : 'rgba(16,185,129,0.3)'
                    } 0%, transparent 70%)`,
                  }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.4 }}
                />
                <span className="absolute font-serif text-6xl text-white/10 select-none">
                  {product.name.charAt(0)}
                </span>
              </>
            )}
          </div>

          {product.badge && (
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-luxury-gold/20 border border-luxury-gold/30 backdrop-blur-md">
              <span className="text-xs font-semibold text-luxury-gold-light uppercase tracking-wider">
                {product.badge}
              </span>
            </div>
          )}

          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-xs text-white/60">{product.category}</span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-serif text-xl font-bold text-white mb-1 group-hover:text-luxury-gold transition-colors">
            {product.name}
          </h3>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-3">
            {product.tagline || product.brand || 'Signature Scent'}
          </p>
          <p className="text-sm text-white/50 leading-relaxed mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {Object.entries(product.notes || {}).map(([key, note]) => (
              <span
                key={key}
                className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-white/40 border border-white/5"
              >
                {note.split(',')[0]}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div>
              <span className="font-serif text-2xl text-luxury-gold font-bold">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-white/30 ml-2">/ {product.volume || product.size_ml ? `${product.size_ml}ml` : '100ml'}</span>
            </div>

            <motion.button
              onClick={handleAdd}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                added
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/10 text-white hover:bg-luxury-gold/20 hover:text-luxury-gold border border-white/10 hover:border-luxury-gold/30'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Add
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard