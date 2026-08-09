import { motion } from 'framer-motion'
import {
  ShoppingBag,
  Check,
  Eye,
} from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import ProductPrice from './ProductPrice'
import ProductPreview from './ProductPreview'

function ProductCard({ product, index }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const getImageUrl = (url) => {
    if (!url) return null
    if (url.startsWith('/static')) {
      return `http://localhost:8000${url}`
    }
    return url
  }
  const productImages = [
    ...(product.images || [])
      .sort((a, b) => {
        if (a.is_main) return -1
        if (b.is_main) return 1
        return 0
      })
      .map((image) => image.image_url)
      .filter(Boolean),
    product.image_url,
  ].filter(Boolean)
  const uniqueImages = [
    ...new Set(productImages),
  ]
  const imageUrls = uniqueImages.map(getImageUrl)
  const mainImage = imageUrls[0] || null
  const handleAdd = async () => {
    const addedToCart = await addItem(product)
    if (!addedToCart) return
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
    }, 2000)
  }

  const handlePreviewAdd = async () => {
    const addedToCart = await addItem(product)
    if (!addedToCart) return
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
    }, 2000)
  }

  return (
    <>
      {/* PRODUCT CARD */}

      <motion.div
        className="group relative h-full"
        initial={{
          opacity: 0,
          y: 30,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          margin: '-30px',
        }}
        transition={{
          duration: 0.4,
          delay: index * 0.05,
        }}
      >

        <div className="liquid-glass rounded-2xl overflow-hidden transition-all duration-500 group-hover:glow-gold h-full flex flex-col">
          {/* IMAGE */}

          <div className="relative h-52 sm:h-56 shrink-0 overflow-hidden bg-gradient-to-br from-emerald-900/50 to-amber-900/30">

            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">

                <motion.div
                  className="w-24 h-24 rounded-full opacity-40"
                  style={{
                    background:
                      `radial-gradient(circle, ${
                        product.category === 'Oriental'
                          ? 'rgba(212,175,55,0.4)'
                          : product.category === 'Woody'
                          ? 'rgba(120,53,15,0.5)'
                          : 'rgba(16,185,129,0.3)'
                      } 0%, transparent 70%)`,
                  }}
                  whileHover={{
                    scale: 1.15,
                  }}
                />

                <span className="absolute font-serif text-5xl text-white/10">
                  {product.name?.charAt(0) || '?'}
                </span>

              </div>
            )}

            {/* CATEGORY */}

            {product.category && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-[10px] text-white/70">
                  {product.category}
                </span>
              </div>
            )}

            {/* BADGE */}

            {product.badge && (
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-luxury-gold/20 border border-luxury-gold/30 backdrop-blur-md">
                <span className="text-[10px] font-semibold text-luxury-gold-light uppercase tracking-wider">
                  {product.badge}
                </span>
              </div>
            )}

          </div>

          {/* CONTENT */}

          <div className="p-4 flex-1 flex flex-col">

            <h3 className="font-serif text-lg font-bold text-white mb-4 group-hover:text-luxury-gold transition-colors">
              {product.name}
            </h3>

            {/* DETAILS */}

            <div className="grid grid-cols-3 gap-1.5 mb-4">

              <div className="min-h-[62px] rounded-lg bg-white/5 border border-white/5 p-2 flex flex-col">
                <span className="text-[8px] uppercase tracking-wider text-white/40 mb-1">
                  Lasts
                </span>

                <span className="text-[10px] text-white/70 mt-auto break-words">
                  {product.last || '—'}
                </span>
              </div>

              <div className="min-h-[62px] rounded-lg bg-white/5 border border-white/5 p-2 flex flex-col">
                <span className="text-[8px] uppercase tracking-wider text-white/40 mb-1">
                  Strength
                </span>

                <span className="text-[10px] text-white/70 mt-auto break-words">
                  {product.scent_strength || '—'}
                </span>
              </div>

              <div className="min-h-[62px] rounded-lg bg-white/5 border border-white/5 p-2 flex flex-col">
                <span className="text-[8px] uppercase tracking-wider text-white/40 mb-1">
                  Best For
                </span>

                <span className="text-[10px] text-white/70 mt-auto break-words">
                  {product.best_for || '—'}
                </span>
              </div>

            </div>

            {/* PRICE */}

            <div className="mt-auto pt-3 border-t border-white/10">

              <div className="mb-3">
                <ProductPrice product={product} />
              </div>

              {/* BUTTONS */}

              <div className="grid grid-cols-2 gap-2">

                <motion.button
                  type="button"
                  onClick={() =>
                    setShowPreview(true)
                  }
                  className="w-full flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium bg-white/10 text-white border border-white/10 hover:bg-luxury-gold/20 hover:text-luxury-gold"
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleAdd}
                  className={`w-full flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium ${
                    added
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/10 text-white border border-white/10 hover:bg-luxury-gold/20 hover:text-luxury-gold'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {added ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Added
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add
                    </>
                  )}
                </motion.button>

              </div>

            </div>

          </div>
        </div>

      </motion.div>

      {/* PREVIEW */}

      <ProductPreview
        product={product}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        imageUrls={imageUrls}
        activeImage={activeImage}
        setActiveImage={setActiveImage}
        added={added}
        handlePreviewAdd={handlePreviewAdd}
      />
    </>
  )
}

export default ProductCard
