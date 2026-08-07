import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { formatPrice, calculateDiscountedPrice } from '../lib/utils'

function HeroProductShowcase({ products }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!products || products.length <= 1) return

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % products.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [products])

  useEffect(() => {
    setActiveIndex(0)
  }, [products])

  if (!products || products.length === 0) {
    return null
  }

  const product = products[activeIndex]

  const image =
    product.images?.find((item) => item.is_main)?.image_url ||
    product.images?.[0]?.image_url ||
    null

  const getImageUrl = (url) => {
    if (!url) return null

    if (url.startsWith('/static')) {
      return `http://localhost:8000${url}`
    }

    return url
  }

  const imageUrl = getImageUrl(image)

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

  return (
  <section className="relative -mt-20 min-h-screen overflow-hidden">

    {/* PRODUCT SLIDE */}
    <AnimatePresence mode="wait">
      <motion.div
        key={product.id}
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 1 }}
      >

        {/* FULL-SCREEN IMAGE */}
        {imageUrl ? (
          <motion.img
            src={imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 7,
              ease: 'easeOut',
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-black" />
        )}

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/45" />

        {/* LEFT-SIDE GRADIENT FOR TEXT */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />

        {/* BOTTOM GRADIENT */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

      </motion.div>
    </AnimatePresence>


    {/* CONTENT OVER IMAGE */}
    <div className="relative z-10 min-h-screen container-luxury flex items-center">

      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          className="max-w-xl pt-20"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.7 }}
        >

          {/* LABEL */}
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-4 h-4 text-luxury-gold" />

            <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold">
              {hasDiscount
                ? 'Exclusive Offer'
                : 'Featured Fragrance'}
            </span>
          </div>


          {/* PRODUCT NAME */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9]">
            {product.name}
          </h1>


          {/* BRAND */}
          {product.brand && (
            <p className="mt-4 text-sm uppercase tracking-[0.3em] text-white/60">
              {product.brand}
            </p>
          )}


          {/* DESCRIPTION */}
          <p className="mt-6 text-base md:text-lg text-white/70 leading-relaxed max-w-lg">
            {product.preview_description ||
              product.description ||
              'Discover a fragrance crafted to leave a lasting impression.'}
          </p>


          {/* DETAILS */}
          <div className="flex flex-wrap gap-2 mt-6">

            {product.last && (
              <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-white/70">
                Lasts {product.last}
              </span>
            )}

            {product.scent_strength && (
              <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-white/70">
                {product.scent_strength}
              </span>
            )}

            {product.best_for && (
              <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-white/70">
                {product.best_for}
              </span>
            )}

          </div>


          {/* PRICE */}
          <div className="mt-7">

            {hasDiscount && (
              <p className="text-sm text-white/40 line-through">
                {formatPrice(product.price)}
              </p>
            )}

            <div className="flex items-center gap-3">

              <span className="font-serif text-3xl md:text-4xl font-bold text-luxury-gold">
                {formatPrice(discountedPrice)}
              </span>

              {product.size_ml && (
                <span className="text-xs text-white/40">
                  {product.size_ml}ml
                </span>
              )}

            </div>

          </div>


          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">

            <Link
              to={`/products/${product.id}`}
              className="btn-gold inline-flex items-center justify-center gap-2"
            >
              Discover This Scent
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/products"
              className="btn-glass inline-flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              View Collection
            </Link>

          </div>


          {/* SLIDE INDICATORS */}
          {products.length > 1 && (
            <div className="flex items-center gap-2 mt-10">

              {products.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show ${item.name}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-10 bg-luxury-gold'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}

            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>

  </section>
)}
export default HeroProductShowcase;