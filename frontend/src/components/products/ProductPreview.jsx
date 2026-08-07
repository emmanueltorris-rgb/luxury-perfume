import { AnimatePresence, motion } from 'framer-motion'
import {
  ShoppingBag,
  Check,
  X,
} from 'lucide-react'
import { useEffect } from 'react'
import ProductPrice from './ProductPrice'

export default function ProductPreview({
  product,
  showPreview,
  setShowPreview,
  imageUrls,
  activeImage,
  setActiveImage,
  added,
  handlePreviewAdd,
}) {

  /*
   * LOCK BACKGROUND SCROLL
   *
   * When preview opens, the page behind the modal
   * cannot scroll.
   */

  useEffect(() => {
    if (!showPreview) return

    const originalOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [showPreview])

  /*
   * AUTO IMAGE ROTATION
   */

  useEffect(() => {
    if (!showPreview || imageUrls.length <= 1) {
      return
    }

    const interval = setInterval(() => {
      setActiveImage(
        (current) =>
          (current + 1) % imageUrls.length
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [
    showPreview,
    imageUrls.length,
    setActiveImage,
  ])

  /*
   * RESET IMAGE
   */

  useEffect(() => {
    if (showPreview) {
      setActiveImage(0)
    }
  }, [showPreview, setActiveImage])

  return (
    <AnimatePresence>
      {showPreview && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowPreview(false)}
        >

          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-3xl liquid-glass border border-white/10 shadow-2xl"
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
            transition={{ duration: 0.25 }}
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              type="button"
              onClick={() =>
                setShowPreview(false)
              }
              className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* MAIN IMAGE */}

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
                    transition={{ duration: 0.6 }}
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
                    />
                  ))}

                </div>
              )}

            </div>

            {/* THUMBNAILS */}

            {imageUrls.length > 1 && (
              <div className="px-6 pt-4">

                <div className="flex gap-2 overflow-x-auto pb-1">

                  {imageUrls.map(
                    (url, imageIndex) => (
                      <button
                        key={`${url}-${imageIndex}`}
                        type="button"
                        onClick={() =>
                          setActiveImage(imageIndex)
                        }
                        className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 ${
                          activeImage === imageIndex
                            ? 'border-luxury-gold'
                            : 'border-white/10 opacity-60'
                        }`}
                      >
                        <img
                          src={url}
                          alt={`${product.name} ${imageIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    )
                  )}

                </div>

              </div>
            )}

            {/* CONTENT */}

            <div className="p-6 sm:p-8">

              <h2 className="font-serif text-3xl font-bold text-white mb-2">
                {product.name}
              </h2>

              {product.badge && (
                <p className="text-xs uppercase tracking-[0.2em] text-luxury-gold mb-3">
                  {product.badge}
                </p>
              )}

              {product.category && (
                <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-5">
                  {product.category}
                </p>
              )}

              {/* DESCRIPTION */}

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

              {/* STORY */}

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

              {/* DETAILS */}

              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">

                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <p className="text-[9px] uppercase tracking-wider text-white/40 mb-2">
                    Lasts
                  </p>

                  <p className="text-sm text-white/80 break-words">
                    {product.last || '—'}
                  </p>
                </div>

                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <p className="text-[9px] uppercase tracking-wider text-white/40 mb-2">
                    Strength
                  </p>

                  <p className="text-sm text-white/80 break-words">
                    {product.scent_strength || '—'}
                  </p>
                </div>

                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <p className="text-[9px] uppercase tracking-wider text-white/40 mb-2">
                    Best For
                  </p>

                  <p className="text-sm text-white/80 break-words">
                    {product.best_for || '—'}
                  </p>
                </div>

              </div>

              {/* NOTES */}

              {product.notes &&
                Object.keys(product.notes).length > 0 && (
                  <div className="mb-6">

                    <h3 className="text-xs uppercase tracking-widest text-luxury-gold/80 mb-3">
                      Fragrance notes
                    </h3>

                    <div className="flex flex-wrap gap-2">

                      {Object.entries(
                        product.notes
                      ).map(([key, note]) => (
                        <span
                          key={key}
                          className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60"
                        >
                          {note}
                        </span>
                      ))}

                    </div>

                  </div>
                )}

              {/* PRICE */}

              <div className="pt-5 border-t border-white/10">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <ProductPrice
                    product={product}
                    preview
                  />

                  <motion.button
                    type="button"
                    onClick={handlePreviewAdd}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium ${
                      added
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30 hover:bg-luxury-gold/30'
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
  )
}