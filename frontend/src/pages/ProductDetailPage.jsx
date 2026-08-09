import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Check,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { fetchProduct } from '../lib/api'
import { formatPrice, calculateDiscountedPrice } from '../lib/utils'
import { useCart } from '../context/CartContext'

function ProductDetailPage() {
  const { productId } = useParams()

  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  /*
   * ==========================================
   * LOAD PRODUCT
   * ==========================================
   */

  useEffect(() => {
    let active = true

    async function loadProduct() {
      setIsLoading(true)
      setError(null)
      setProduct(null)
      setActiveImage(0)
      setAddedToCart(false)

      try {
        const result = await fetchProduct(productId)

        if (!active) return

        setProduct(result)
      } catch (err) {
        if (!active) return

        setError(
          err.message || 'Unable to load this fragrance'
        )
      } finally {
        if (!active) return

        setIsLoading(false)
      }
    }

    loadProduct()

    return () => {
      active = false
    }
  }, [productId])

  /*
   * ==========================================
   * AUTOMATIC IMAGE ROTATION
   *
   * IMPORTANT:
   * This hook stays ABOVE all conditional
   * returns. This prevents the React hook error.
   * ==========================================
   */

  useEffect(() => {
    const images = product?.images || []

    if (images.length <= 1) {
      return undefined
    }

    const interval = setInterval(() => {
      setActiveImage((current) => {
        return (current + 1) % images.length
      })
    }, 4000)

    return () => {
      clearInterval(interval)
    }
  }, [product])

  /*
   * ==========================================
   * LOADING STATE
   * ==========================================
   */

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center">

          <div className="w-10 h-10 border-2 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm uppercase tracking-[0.2em] text-white/40">
            Loading fragrance
          </p>

        </div>
      </section>
    )
  }

  /*
   * ==========================================
   * ERROR STATE
   * ==========================================
   */

  if (error || !product) {
    return (
      <section className="min-h-screen flex items-center justify-center px-6">

        <div className="text-center max-w-md">

          <Sparkles className="w-8 h-8 text-luxury-gold mx-auto mb-6" />

          <h1 className="font-serif text-4xl text-white mb-4">
            Fragrance unavailable
          </h1>

          <p className="text-white/50 mb-8">
            {error || 'This fragrance could not be found.'}
          </p>

          <Link
            to="/products"
            className="btn-gold inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Collection
          </Link>

        </div>

      </section>
    )
  }

  /*
   * ==========================================
   * PRODUCT DATA
   * ==========================================
   */

  const images = product.images || []

  const getImageUrl = (url) => {
    if (!url) return null

    if (url.startsWith('/static')) {
      return `http://localhost:8000${url}`
    }

    return url
  }

  const image =
    images[activeImage]?.image_url ||
    images.find((item) => item.is_main)?.image_url ||
    images[0]?.image_url ||
    null

  const imageUrl = getImageUrl(image)

  /*
   * ==========================================
   * DISCOUNT
   * ==========================================
   */

  const hasDiscount =
    product.discount_active &&
    product.discount_type !== 'none' &&
    Number(product.discount_value) > 0

  const discountedPrice = hasDiscount
    ? calculateDiscountedPrice(
        product.price,
        product.discount_type,
        product.discount_value,
        product.discount_active
      )
    : product.price

  /*
   * ==========================================
   * ADD TO CART
   * ==========================================
   */

  const handleAddToCart = async () => {
    if (product.stock <= 0 || isAddingToCart) {
      return
    }

    setIsAddingToCart(true)
    setAddedToCart(false)

    try {
      await addItem(product)

      setAddedToCart(true)

      setTimeout(() => {
        setAddedToCart(false)
      }, 2500)
    } catch (err) {
      console.error('Failed to add product to cart:', err)
    } finally {
      setIsAddingToCart(false)
    }
  }

  /*
   * ==========================================
   * PAGE
   * ==========================================
   */

  return (
    <section className="relative min-h-screen overflow-hidden pt-28 pb-20">

      {/* Background glow */}

      <div className="absolute top-1/4 left-0 w-96 h-96 bg-luxury-gold/10 blur-3xl rounded-full pointer-events-none" />

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="container-luxury relative z-10">

        {/* =====================================
            BACK BUTTON
        ====================================== */}

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* =====================================
              PRODUCT IMAGES
          ====================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >

            {/* MAIN IMAGE */}

            <div className="relative aspect-square rounded-3xl overflow-hidden liquid-glass border border-white/10">

              {imageUrl ? (

                <AnimatePresence mode="wait">

                  <motion.img
                    key={imageUrl}
                    src={imageUrl}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain p-8 md:p-12"
                    initial={{
                      opacity: 0,
                      scale: 0.94,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 1.04,
                    }}
                    transition={{
                      duration: 0.7,
                      ease: 'easeInOut',
                    }}
                  />

                </AnimatePresence>

              ) : (

                <div className="w-full h-full flex items-center justify-center">

                  <span className="font-serif text-9xl text-white/10">
                    {product.name?.charAt(0) || '?'}
                  </span>

                </div>

              )}

              {/* =================================
                  DISCOUNT
              ================================== */}

              {hasDiscount && (
                <div className="absolute top-5 left-5 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 z-10">

                  <span className="text-xs font-semibold text-emerald-300">

                    {product.discount_type === 'percentage'
                      ? `${product.discount_value}% OFF`
                      : `${formatPrice(product.discount_value)} OFF`}

                  </span>

                </div>
              )}

              {/* =================================
                  CATEGORY
              ================================== */}

              {product.category && (
                <div className="absolute top-5 right-5 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 z-10">

                  <span className="text-[10px] uppercase tracking-widest text-white/60">
                    {product.category}
                  </span>

                </div>
              )}

              {/* =================================
                  IMAGE INDICATORS
              ================================== */}

              {images.length > 1 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">

                  {images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`View image ${index + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        index === activeImage
                          ? 'w-8 bg-luxury-gold'
                          : 'w-1.5 bg-white/30 hover:bg-white/60'
                      }`}
                    />
                  ))}

                </div>
              )}

            </div>

            {/* =================================
                THUMBNAILS
            ================================== */}

            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">

                {images.map((item, index) => (

                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      index === activeImage
                        ? 'border-luxury-gold scale-105'
                        : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
                    }`}
                  >

                    <img
                      src={getImageUrl(item.image_url)}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {index === activeImage && (
                      <div className="absolute inset-0 bg-luxury-gold/10" />
                    )}

                  </button>

                ))}

              </div>
            )}

          </motion.div>

          {/* =====================================
              PRODUCT INFORMATION
          ====================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
          >

            {/* LABEL */}

            <div className="inline-flex items-center gap-2 mb-5">

              <Sparkles className="w-4 h-4 text-luxury-gold" />

              <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold">
                {hasDiscount
                  ? 'Exclusive Offer'
                  : 'Signature Fragrance'}
              </span>

            </div>

            {/* NAME */}

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-tight">
              {product.name}
            </h1>

            {/* BRAND */}

            {product.brand && (
              <p className="mt-3 text-sm uppercase tracking-[0.3em] text-white/40">
                {product.brand}
              </p>
            )}

            <div className="mt-8 h-px bg-white/10" />

            {/* DESCRIPTION */}

            <p className="mt-8 text-base md:text-lg text-white/60 leading-relaxed">
              {product.preview_description ||
                product.description ||
                'Discover a fragrance crafted to leave a lasting impression.'}
            </p>

            {/* DETAILS */}

            <div className="flex flex-wrap gap-3 mt-7">

              {product.last && (
                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                  Lasts {product.last}
                </span>
              )}

              {product.scent_strength && (
                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                  {product.scent_strength}
                </span>
              )}

              {product.best_for && (
                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                  {product.best_for}
                </span>
              )}

              {product.size_ml && (
                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                  {product.size_ml}ml
                </span>
              )}

            </div>

            {/* PRICE */}

            <div className="mt-10">

              {hasDiscount && (
                <p className="text-sm text-white/30 line-through mb-1">
                  {formatPrice(product.price)}
                </p>
              )}

              <div className="flex items-center gap-3">

                <span className="font-serif text-4xl font-bold text-luxury-gold">
                  {formatPrice(discountedPrice)}
                </span>

                {product.size_ml && (
                  <span className="text-xs text-white/30">
                    {product.size_ml}ml
                  </span>
                )}

              </div>

            </div>

            {/* STOCK */}

            <div className="mt-5">

              {product.stock > 0 ? (
                <p className="text-xs text-emerald-400">
                  ● In stock
                </p>
              ) : (
                <p className="text-xs text-red-400">
                  ● Currently unavailable
                </p>
              )}

            </div>

            {/* =================================
                ACTIONS
            ================================== */}

            <div className="flex flex-col sm:flex-row gap-3 mt-8">

              {/* ADD TO CART */}

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={
                  product.stock <= 0 ||
                  isAddingToCart ||
                  addedToCart
                }
                className="btn-gold inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >

                {addedToCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Cart
                  </>
                ) : isAddingToCart ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </>
                )}

              </button>

              {/* CONTINUE SHOPPING */}

              <Link
                to="/products"
                className="btn-glass inline-flex items-center justify-center gap-2"
              >
                Continue Shopping
              </Link>

            </div>

          </motion.div>

        </div>

      </div>

    </section>
  )
}

export default ProductDetailPage