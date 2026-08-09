import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { formatPrice, calculateDiscountedPrice } from '../lib/utils'

function HeroProductShowcase({ products }) {
  const [activeIndex, setActiveIndex] = useState(0)

  /*
   * Automatically change perfume every 6 seconds
   */
  useEffect(() => {
    if (!products || products.length <= 1) return

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % products.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [products])

  /*
   * Reset to first perfume whenever the product list changes
   */
  useEffect(() => {
    setActiveIndex(0)
  }, [products])

  if (!products || products.length === 0) {
    return null
  }

  const product = products[activeIndex]

  /*
   * Get main product image
   */
  const image =
    product.images?.find((item) => item.is_main)?.image_url ||
    product.images?.[0]?.image_url ||
    null

  /*
   * Convert local backend image paths
   */
  const getImageUrl = (url) => {
    if (!url) return null

    if (url.startsWith('/static')) {
      return `http://localhost:8000${url}`
    }

    return url
  }

  const imageUrl = getImageUrl(image)

  /*
   * Discount
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

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">

      {/* =========================================================
          FULL SCREEN PRODUCT IMAGE
      ========================================================= */}

      <AnimatePresence mode="wait">

        <motion.div
          key={product.id}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >

          {imageUrl ? (
            <motion.img
              key={imageUrl}
              src={imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover object-[65%_center]"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 7,
                ease: 'easeOut',
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <span className="font-serif text-8xl text-white/10">
                {product.name?.charAt(0) || '?'}
              </span>
            </div>
          )}

        </motion.div>

      </AnimatePresence>


      {/* =========================================================
          CINEMATIC DARK OVERLAYS
      ========================================================= */}

      {/* Left side darkening for text */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-black/55 to-black/15" />

      {/* Bottom darkening */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/20 to-black/25" />

      {/* Subtle overall dark layer */}
      <div className="absolute inset-0 z-10 bg-black/10" />


      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <div className="relative z-20 min-h-screen w-full">


        {/* =======================================================
            ARWAAH BRANDING
        ======================================================= */}

        <motion.div
          className="
            absolute
            left-6
            md:left-10
            lg:left-16
            top-28
            md:top-32
            max-w-xs
          "
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
        >

          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-luxury-gold mb-2">
            Arwaah
          </p>

          <h1 className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-white/90 leading-none">
            Parfumerie
          </h1>

          <div className="mt-4 h-px w-20 bg-luxury-gold/60" />

        </motion.div>


        {/* =======================================================
            PRODUCT INFORMATION
        ======================================================= */}

        <AnimatePresence mode="wait">

          <motion.div
            key={product.id}
            className="
              absolute
              left-6
              md:left-10
              lg:left-16
              bottom-16
              md:bottom-20
              lg:bottom-20
              max-w-xl
              pr-6
            "
            initial={{
              opacity: 0,
              x: -60,
              y: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              x: -40,
              y: -10,
            }}
            transition={{
              duration: 0.7,
              ease: 'easeOut',
            }}
          >

            {/* =================================================
                LABEL
            ================================================= */}

            <div className="flex items-center gap-2 mb-4">

              <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />

              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-luxury-gold">
                {hasDiscount
                  ? 'Exclusive Offer'
                  : 'Featured Fragrance'}
              </span>

            </div>


            {/* =================================================
                PRODUCT NAME
            ================================================= */}

            <h2
              className="
                font-serif
                text-5xl
                sm:text-6xl
                md:text-7xl
                lg:text-8xl
                font-bold
                text-white
                leading-[0.85]
                tracking-tight
              "
            >
              {product.name}
            </h2>


            {/* =================================================
                BRAND
            ================================================= */}

            {product.brand && (
              <p className="mt-3 text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/50">
                {product.brand}
              </p>
            )}


            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <p className="mt-5 max-w-lg text-sm md:text-base lg:text-lg text-white/65 leading-relaxed">
              {product.preview_description ||
                product.description ||
                'Discover a fragrance crafted to leave a lasting impression.'}
            </p>


            {/* =================================================
                PRODUCT DETAILS
            ================================================= */}

            <div className="flex flex-wrap gap-2 mt-5">

              {product.last && (
                <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] md:text-xs text-white/70">
                  Lasts {product.last}
                </span>
              )}

              {product.scent_strength && (
                <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] md:text-xs text-white/70">
                  {product.scent_strength}
                </span>
              )}

              {product.best_for && (
                <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] md:text-xs text-white/70">
                  {product.best_for}
                </span>
              )}

            </div>


            {/* =================================================
                PRICE
            ================================================= */}

            <div className="mt-6">

              {hasDiscount && (
                <p className="text-xs md:text-sm text-white/40 line-through mb-1">
                  {formatPrice(product.price)}
                </p>
              )}

              <div className="flex items-baseline gap-3">

                <span className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-luxury-gold">
                  {formatPrice(discountedPrice)}
                </span>

                {product.size_ml && (
                  <span className="text-[10px] md:text-xs text-white/40">
                    {product.size_ml}ml
                  </span>
                )}

              </div>

            </div>


            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div className="flex flex-col sm:flex-row gap-3 mt-6">

              <Link
                to={`/products/${product.id}`}
                className="
                  btn-gold
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  text-xs
                  md:text-sm
                "
              >
                Discover This Scent

                <ArrowRight className="w-4 h-4" />
              </Link>


              <Link
                to="/products"
                className="
                  btn-glass
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  text-xs
                  md:text-sm
                "
              >
                <ShoppingBag className="w-4 h-4" />

                View Collection
              </Link>

            </div>


            {/* =================================================
                SLIDE INDICATORS
            ================================================= */}

            {products.length > 1 && (

              <div className="flex items-center gap-2 mt-7">

                {products.map((item, index) => (

                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show ${item.name}`}
                    className={`
                      h-1.5
                      rounded-full
                      transition-all
                      duration-300

                      ${
                        index === activeIndex
                          ? 'w-10 bg-luxury-gold'
                          : 'w-2 bg-white/30 hover:bg-white/60'
                      }
                    `}
                  />

                ))}

              </div>

            )}

          </motion.div>

        </AnimatePresence>


        {/* =======================================================
            CATEGORY / DISCOUNT BADGES
        ======================================================= */}

        <AnimatePresence mode="wait">

          <motion.div
            key={`${product.id}-badges`}
            className="
              absolute
              top-28
              right-6
              md:right-10
              lg:right-16
              flex
              flex-col
              items-end
              gap-2
            "
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: 30,
            }}
            transition={{
              duration: 0.6,
            }}
          >

            {/* CATEGORY */}

            {product.category && (
              <div className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-white/70">
                  {product.category}
                </span>
              </div>
            )}


            {/* DISCOUNT */}

            {hasDiscount && (
              <div className="px-3 py-1.5 rounded-full bg-emerald-500/15 backdrop-blur-md border border-emerald-300/20">
                <span className="text-[10px] md:text-xs font-semibold text-emerald-300">
                  {product.discount_type === 'percentage'
                    ? `${product.discount_value}% OFF`
                    : `${formatPrice(product.discount_value)} OFF`}
                </span>
              </div>
            )}

          </motion.div>

        </AnimatePresence>


        {/* =======================================================
            SCROLL INDICATOR
        ======================================================= */}

        <motion.div
          className="
            absolute
            right-6
            md:right-10
            bottom-8
            z-20
            hidden
            md:flex
            flex-col
            items-center
            gap-3
          "
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >

          <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 [writing-mode:vertical-rl]">
            Scroll
          </span>

          <div className="w-px h-12 bg-gradient-to-b from-luxury-gold/70 to-transparent" />

        </motion.div>

      </div>

    </section>
  )
}

export default HeroProductShowcase