import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  Check,
  Eye,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatPrice, calculateDiscountedPrice } from '../lib/utils'

function ProductCard({ product, index }) {
  const { addItem } = useCart()

  const [added, setAdded] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  /*
   * ---------------------------------------------------------
   * IMAGE URL
   * ---------------------------------------------------------
   */

  const getImageUrl = (url) => {
    if (!url) return null

    if (url.startsWith('/static')) {
      return `http://localhost:8000${url}`
    }

    return url
  }

  /*
   * ---------------------------------------------------------
   * PRODUCT IMAGES
   * ---------------------------------------------------------
   *
   * Main image + additional images
   */

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

  const uniqueImages = [...new Set(productImages)]

  const imageUrls = uniqueImages.map(getImageUrl)

  const mainImage = imageUrls[0] || null

  /*
   * ---------------------------------------------------------
   * AUTO IMAGE ROTATION
   * ---------------------------------------------------------
   *
   * Images change every 4 seconds while preview is open.
   */

  useEffect(() => {
    if (!showPreview || imageUrls.length <= 1) {
      return
    }

    const interval = setInterval(() => {
      setActiveImage((current) => {
        return (current + 1) % imageUrls.length
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [showPreview, imageUrls.length])

  /*
   * Reset image when preview opens
   */

  useEffect(() => {
    if (showPreview) {
      setActiveImage(0)
    }
  }, [showPreview])

  /*
   * ---------------------------------------------------------
   * ADD TO CART
   * ---------------------------------------------------------
   */

  const handleAdd = () => {
    addItem(product)

    setAdded(true)

    setTimeout(() => {
      setAdded(false)
    }, 2000)
  }

  const handlePreviewAdd = () => {
    addItem(product)

    setAdded(true)

    setTimeout(() => {
      setAdded(false)
    }, 2000)
  }

  /*
   * ---------------------------------------------------------
   * CARD
   * ---------------------------------------------------------
   */

  return (
    <>
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

          {/* =================================================
              PRODUCT IMAGE
          ================================================= */}

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

                <span className="absolute font-serif text-5xl text-white/10 select-none">
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

          {/* =================================================
              PRODUCT CONTENT
          ================================================= */}

          <div className="p-4 flex-1 flex flex-col">

            {/* PRODUCT NAME */}

            <h3 className="font-serif text-lg font-bold text-white mb-4 group-hover:text-luxury-gold transition-colors">
              {product.name}
            </h3>

            {/* =================================================
                DETAILS
            ================================================= */}

            <div className="grid grid-cols-3 gap-1.5 mb-4">

              {/* LASTS */}

              <div className="min-h-[62px] rounded-lg bg-white/5 border border-white/5 p-2 flex flex-col">

                <span className="text-[8px] uppercase tracking-wider text-white/40 mb-1">
                  Lasts
                </span>

                <span className="text-[10px] text-white/70 leading-tight mt-auto break-words">
                  {product.last || '—'}
                </span>

              </div>

              {/* STRENGTH */}

              <div className="min-h-[62px] rounded-lg bg-white/5 border border-white/5 p-2 flex flex-col">

                <span className="text-[8px] uppercase tracking-wider text-white/40 mb-1">
                  Strength
                </span>

                <span className="text-[10px] text-white/70 leading-tight mt-auto break-words">
                  {product.scent_strength || '—'}
                </span>

              </div>

              {/* BEST FOR */}

              <div className="min-h-[62px] rounded-lg bg-white/5 border border-white/5 p-2 flex flex-col">

                <span className="text-[8px] uppercase tracking-wider text-white/40 mb-1">
                  Best For
                </span>

                <span className="text-[10px] text-white/70 leading-tight mt-auto break-words">
                  {product.best_for || '—'}
                </span>

              </div>

            </div>

            {/* =================================================
                BOTTOM SECTION
            ================================================= */}

            <div className="mt-auto pt-3 border-t border-white/10">

              {/* ---------------------------------------------
                  PRICE
              --------------------------------------------- */}
              <div>

  {product.discount_active &&
  product.discount_type !== 'none' &&
  Number(product.discount_value) > 0 ? (
    <>

      {/* ORIGINAL PRICE */}

      <p className="text-sm text-white/40 line-through">
        {formatPrice(product.price)}
      </p>

      {/* DISCOUNTED PRICE */}

      <p className="font-serif text-3xl font-bold text-luxury-gold whitespace-nowrap">
        {formatPrice(
          calculateDiscountedPrice(
            product.price,
            product.discount_type,
            product.discount_value,
            product.discount_active
          )
        )}
      </p>

      {/* DISCOUNT LABEL */}

      <p className="text-xs font-semibold text-emerald-400 mt-1">
        {product.discount_type === 'percentage'
          ? `${product.discount_value}% OFF`
          : `${formatPrice(
              product.discount_value
            )} OFF`}
      </p>

    </>
  ) : (

    /* NORMAL PRICE */

    <p className="font-serif text-3xl font-bold text-luxury-gold whitespace-nowrap">
      {formatPrice(product.price)}
    </p>

  )}

  <p className="text-xs text-white/30 mt-1">
    {product.size_ml
      ? `${product.size_ml}ml`
      : '100ml'}
  </p>

</div>

              {/* ---------------------------------------------
                  ACTION BUTTONS
              --------------------------------------------- */}

              <div className="grid grid-cols-2 gap-2">

                {/* PREVIEW */}

                <motion.button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="w-full flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium bg-white/10 text-white border border-white/10 hover:bg-luxury-gold/20 hover:text-luxury-gold hover:border-luxury-gold/30 transition-all whitespace-nowrap"
                  whileTap={{
                    scale: 0.95,
                  }}
                >
                  <Eye className="w-3.5 h-3.5 shrink-0" />

                  <span>
                    Preview
                  </span>
                </motion.button>

                {/* ADD */}

                <motion.button
                  type="button"
                  onClick={handleAdd}
                  className={`w-full flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    added
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/10 text-white hover:bg-luxury-gold/20 hover:text-luxury-gold border border-white/10 hover:border-luxury-gold/30'
                  }`}
                  whileTap={{
                    scale: 0.95,
                  }}
                >

                  {added ? (
                    <>
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                      <span>Add</span>
                    </>
                  )}

                </motion.button>

              </div>

            </div>

          </div>
        </div>
      </motion.div>

      {/* =====================================================
          PREVIEW MODAL
      ===================================================== */}

      <AnimatePresence>

        {showPreview && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() => setShowPreview(false)}
          >

            {/* =================================================
                MODAL
            ================================================= */}

            <motion.div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl liquid-glass border border-white/10 shadow-2xl"
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 30,
              }}
              transition={{
                duration: 0.25,
              }}
              onClick={(event) => event.stopPropagation()}
            >

              {/* CLOSE */}

              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* =================================================
                  ROTATING MAIN IMAGE
              ================================================= */}

              <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-3xl bg-black/20">

                {imageUrls.length > 0 ? (

                  <AnimatePresence mode="wait">

                    <motion.img
                      key={activeImage}
                      src={imageUrls[activeImage]}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{
                        opacity: 0,
                        scale: 1.02,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.98,
                      }}
                      transition={{
                        duration: 0.6,
                      }}
                    />

                  </AnimatePresence>

                ) : (

                  <div className="w-full h-full flex items-center justify-center">

                    <span className="font-serif text-8xl text-white/10">
                      {product.name?.charAt(0) || '?'}
                    </span>

                  </div>

                )}

                {/* IMAGE INDICATORS */}

                {imageUrls.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">

                    {imageUrls.map((_, imageIndex) => (
                      <button
                        key={imageIndex}
                        type="button"
                        onClick={() =>
                          setActiveImage(imageIndex)
                        }
                        className={`h-1.5 rounded-full transition-all ${
                          activeImage === imageIndex
                            ? 'w-6 bg-luxury-gold'
                            : 'w-1.5 bg-white/40'
                        }`}
                        aria-label={`View image ${imageIndex + 1}`}
                      />
                    ))}

                  </div>
                )}

              </div>

              {/* =================================================
                  ADDITIONAL IMAGES
              ================================================= */}

              {imageUrls.length > 1 && (
                <div className="px-6 pt-4">

                  <div className="flex gap-2 overflow-x-auto pb-1">

                    {imageUrls.map((url, imageIndex) => (
                      <button
                        key={`${url}-${imageIndex}`}
                        type="button"
                        onClick={() =>
                          setActiveImage(imageIndex)
                        }
                        className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          activeImage === imageIndex
                            ? 'border-luxury-gold'
                            : 'border-white/10 opacity-60 hover:opacity-100'
                        }`}
                      >

                        <img
                          src={url}
                          alt={`${product.name} ${imageIndex + 1}`}
                          className="w-full h-full object-cover"
                        />

                      </button>
                    ))}

                  </div>

                </div>
              )}

              {/* =================================================
                  PREVIEW CONTENT
              ================================================= */}

              <div className="p-6 sm:p-8">

                {/* NAME */}

                <h2 className="font-serif text-3xl font-bold text-white mb-2">
                  {product.name}
                </h2>

                {/* BADGE */}

                {product.badge && (
                  <p className="text-xs uppercase tracking-[0.2em] text-luxury-gold mb-3">
                    {product.badge}
                  </p>
                )}

                {/* CATEGORY */}

                {product.category && (
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-5">
                    {product.category}
                  </p>
                )}

                {/* =================================================
                    SHORT DESCRIPTION
                ================================================= */}

                {product.description && (
                  <div className="mb-5">

                    <h3 className="text-xs uppercase tracking-widest text-luxury-gold/80 mb-2">
                      About the fragrance
                    </h3>

                    <p className="text-sm text-white/60 leading-relaxed">
                      {product.description}
                    </p>

                  </div>
                )}

                {/* =================================================
                    DETAILED PREVIEW DESCRIPTION
                ================================================= */}

                {product.preview_description && (
                  <div className="mb-6">

                    <h3 className="text-xs uppercase tracking-widest text-luxury-gold/80 mb-2">
                      Fragrance story
                    </h3>

                    <p className="text-sm text-white/60 leading-relaxed">
                      {product.preview_description}
                    </p>

                  </div>
                )}

                {/* =================================================
                    FRAGRANCE DETAILS
                ================================================= */}

                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">

                  {/* LASTS */}

                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">

                    <p className="text-[9px] uppercase tracking-wider text-white/40 mb-2">
                      Lasts
                    </p>

                    <p className="text-sm text-white/80 break-words">
                      {product.last || '—'}
                    </p>

                  </div>

                  {/* STRENGTH */}

                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">

                    <p className="text-[9px] uppercase tracking-wider text-white/40 mb-2">
                      Strength
                    </p>

                    <p className="text-sm text-white/80 break-words">
                      {product.scent_strength || '—'}
                    </p>

                  </div>

                  {/* BEST FOR */}

                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">

                    <p className="text-[9px] uppercase tracking-wider text-white/40 mb-2">
                      Best For
                    </p>

                    <p className="text-sm text-white/80 break-words">
                      {product.best_for || '—'}
                    </p>

                  </div>

                </div>

                {/* =================================================
                    NOTES
                ================================================= */}

                {product.notes &&
                  Object.keys(product.notes).length > 0 && (
                    <div className="mb-6">

                      <h3 className="text-xs uppercase tracking-widest text-luxury-gold/80 mb-3">
                        Fragrance notes
                      </h3>

                      <div className="flex flex-wrap gap-2">

                        {Object.entries(product.notes).map(
                          ([key, note]) => (
                            <span
                              key={key}
                              className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60"
                            >
                              {note}
                            </span>
                          )
                        )}

                      </div>

                    </div>
                  )}

                {/* =================================================
                    PRICE + ADD TO CART
                ================================================= */}

                <div className="pt-5 border-t border-white/10">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    {/* PRICE */}
<div>
  {product.discount_active &&
  product.discount_type !== 'none' &&
  Number(product.discount_value) > 0 ? (
    <>
      {/* ORIGINAL PRICE */}

      <p className="text-sm text-white/40 line-through">
        {formatPrice(product.price)}
      </p>

      {/* DISCOUNTED PRICE */}

      <p className="font-serif text-3xl font-bold text-luxury-gold whitespace-nowrap">
        {formatPrice(
          calculateDiscountedPrice(
            product.price,
            product.discount_type,
            product.discount_value,
            product.discount_active
          )
        )}
      </p>

      {/* DISCOUNT LABEL */}

      <p className="text-xs font-semibold text-emerald-400 mt-1">
        {product.discount_type === 'percentage'
          ? `${product.discount_value}% OFF`
          : `${formatPrice(
              product.discount_value
            )} OFF`}
      </p>
    </>
  ) : (
    <p className="font-serif text-3xl font-bold text-luxury-gold whitespace-nowrap">
      {formatPrice(product.price)}
    </p>
  )}

  <p className="text-xs text-white/30 mt-1">
    {product.size_ml
      ? `${product.size_ml}ml`
      : '100ml'}
  </p>
</div>
                   
                    {/* ADD */}

                    <motion.button
                      type="button"
                      onClick={handlePreviewAdd}
                      className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                        added
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30 hover:bg-luxury-gold/30'
                      }`}
                      whileTap={{
                        scale: 0.95,
                      }}
                    >

                      {added ? (
                        <>
                          <Check className="w-4 h-4" />
                          Added
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          Add to Cart
                        </>
                      )}

                    </motion.button>

                  </div>

                </div>

              </div>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>
    </>
  )
}

export default ProductCard