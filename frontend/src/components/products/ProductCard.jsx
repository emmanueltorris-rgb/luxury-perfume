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

  /*
   * ==========================================
   * IMAGE URL
   * ==========================================
   */

  const getImageUrl = (url) => {
    if (!url) return null

    if (url.startsWith('/static')) {
      return `http://localhost:8000${url}`
    }

    return url
  }

  /*
   * ==========================================
   * PRODUCT IMAGES
   * ==========================================
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

  const uniqueImages = [
    ...new Set(productImages),
  ]

  const imageUrls = uniqueImages.map(getImageUrl)

  const mainImage = imageUrls[0] || null

  /*
   * ==========================================
   * ADD TO CART
   * ==========================================
   */

  const handleAdd = async () => {
    try {
      await addItem(product)

      setAdded(true)

      setTimeout(() => {
        setAdded(false)
      }, 2000)
    } catch (error) {
      console.error('Unable to add product:', error)
    }
  }

  /*
   * ==========================================
   * ADD TO CART FROM PREVIEW
   * ==========================================
   */

  const handlePreviewAdd = async () => {
    try {
      await addItem(product)

      setAdded(true)

      setTimeout(() => {
        setAdded(false)
      }, 2000)
    } catch (error) {
      console.error('Unable to add product:', error)
    }
  }

  /*
   * ==========================================
   * CARD
   * ==========================================
   */

  return (
    <>
      <motion.div
        className="group relative h-full min-w-0"
        initial={{
          opacity: 0,
          y: 25,
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
          delay: Math.min(index * 0.04, 0.2),
        }}
      >

        <div
          className="
            liquid-glass
            rounded-2xl
            overflow-hidden
            h-full
            flex
            flex-col
            border
            border-white/10
            transition-all
            duration-500
            group-hover:glow-gold
          "
        >

          {/* =================================================
              PRODUCT IMAGE
          ================================================= */}

          <div
            className="
              relative
              aspect-[4/3]
              sm:aspect-square
              shrink-0
              overflow-hidden
              bg-gradient-to-br
              from-emerald-950/70
              via-black/20
              to-amber-950/40
            "
          >

            {mainImage ? (

              <motion.img
                src={mainImage}
                alt={product.name || 'Fragrance'}
                loading={index < 4 ? 'eager' : 'lazy'}
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-[1.03]
                "
              />

            ) : (

              <div className="absolute inset-0 flex items-center justify-center">

                <motion.div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full opacity-40"
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

                <span className="absolute font-serif text-5xl sm:text-6xl text-white/10">
                  {product.name?.charAt(0) || '?'}
                </span>

              </div>

            )}

            {/* IMAGE DARK OVERLAY */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/30
                via-transparent
                to-black/10
                pointer-events-none
              "
            />

            {/* =================================================
                CATEGORY
            ================================================= */}

            {product.category && (
              <div
                className="
                  absolute
                  top-2
                  right-2
                  sm:top-3
                  sm:right-3
                  max-w-[65%]
                  px-2
                  sm:px-2.5
                  py-1
                  rounded-full
                  bg-black/30
                  border
                  border-white/10
                  backdrop-blur-md
                "
              >
                <span className="block truncate text-[8px] sm:text-[10px] text-white/75">
                  {product.category}
                </span>
              </div>
            )}

            {/* =================================================
                BADGE
            ================================================= */}

            {product.badge && (
              <div
                className="
                  absolute
                  top-2
                  left-2
                  sm:top-3
                  sm:left-3
                  max-w-[55%]
                  px-2
                  sm:px-2.5
                  py-1
                  rounded-full
                  bg-luxury-gold/20
                  border
                  border-luxury-gold/30
                  backdrop-blur-md
                "
              >
                <span className="block truncate text-[8px] sm:text-[10px] font-semibold text-luxury-gold-light uppercase tracking-wider">
                  {product.badge}
                </span>
              </div>
            )}

          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div
            className="
              p-2.5
              sm:p-4
              flex-1
              flex
              flex-col
              min-w-0
            "
          >

            {/* PRODUCT NAME */}

            <h3
              className="
                font-serif
                text-sm
                sm:text-lg
                font-bold
                text-white
                mb-2
                sm:mb-4
                truncate
                group-hover:text-luxury-gold
                transition-colors
              "
              title={product.name}
            >
              {product.name}
            </h3>

            {/* =================================================
                DETAILS
            ================================================= */}

            <div
              className="
                grid
                grid-cols-3
                gap-1
                sm:gap-1.5
                mb-3
                sm:mb-4
              "
            >

              {/* LASTS */}

              <div
                className="
                  min-w-0
                  min-h-[54px]
                  sm:min-h-[62px]
                  rounded-lg
                  bg-white/5
                  border
                  border-white/5
                  p-1.5
                  sm:p-2
                  flex
                  flex-col
                "
              >

                <span
                  className="
                    text-[7px]
                    sm:text-[8px]
                    uppercase
                    tracking-wide
                    sm:tracking-wider
                    text-white/40
                    mb-1
                    truncate
                  "
                >
                  Lasts
                </span>

                <span
                  className="
                    text-[8px]
                    sm:text-[10px]
                    leading-tight
                    text-white/70
                    mt-auto
                    break-words
                    line-clamp-2
                  "
                >
                  {product.last || '—'}
                </span>

              </div>

              {/* STRENGTH */}

              <div
                className="
                  min-w-0
                  min-h-[54px]
                  sm:min-h-[62px]
                  rounded-lg
                  bg-white/5
                  border
                  border-white/5
                  p-1.5
                  sm:p-2
                  flex
                  flex-col
                "
              >

                <span
                  className="
                    text-[7px]
                    sm:text-[8px]
                    uppercase
                    tracking-wide
                    sm:tracking-wider
                    text-white/40
                    mb-1
                    truncate
                  "
                >
                  Strength
                </span>

                <span
                  className="
                    text-[8px]
                    sm:text-[10px]
                    leading-tight
                    text-white/70
                    mt-auto
                    break-words
                    line-clamp-2
                  "
                >
                  {product.scent_strength || '—'}
                </span>

              </div>

              {/* BEST FOR */}

              <div
                className="
                  min-w-0
                  min-h-[54px]
                  sm:min-h-[62px]
                  rounded-lg
                  bg-white/5
                  border
                  border-white/5
                  p-1.5
                  sm:p-2
                  flex
                  flex-col
                "
              >

                <span
                  className="
                    text-[7px]
                    sm:text-[8px]
                    uppercase
                    tracking-wide
                    sm:tracking-wider
                    text-white/40
                    mb-1
                    truncate
                  "
                >
                  Best for
                </span>

                <span
                  className="
                    text-[8px]
                    sm:text-[10px]
                    leading-tight
                    text-white/70
                    mt-auto
                    break-words
                    line-clamp-2
                  "
                >
                  {product.best_for || '—'}
                </span>

              </div>

            </div>

            {/* =================================================
                PRICE
            ================================================= */}

            <div
              className="
                mt-auto
                pt-2
                sm:pt-3
                border-t
                border-white/10
              "
            >

              <div className="mb-2 sm:mb-3 min-w-0">
                <ProductPrice product={product} />
              </div>

              {/* =================================================
                  ACTION BUTTONS
              ================================================= */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-1.5
                  sm:gap-2
                "
              >

                {/* PREVIEW */}

                <motion.button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="
                    w-full
                    min-w-0
                    flex
                    items-center
                    justify-center
                    gap-1
                    sm:gap-1.5
                    px-1.5
                    sm:px-2.5
                    py-2
                    rounded-lg
                    text-[9px]
                    sm:text-xs
                    font-medium
                    bg-white/10
                    text-white
                    border
                    border-white/10
                    hover:bg-luxury-gold/20
                    hover:text-luxury-gold
                    transition-colors
                  "
                  whileTap={{
                    scale: 0.95,
                  }}
                >

                  <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />

                  <span className="truncate">
                    Preview
                  </span>

                </motion.button>

                {/* ADD */}

                <motion.button
                  type="button"
                  onClick={handleAdd}
                  className={`
                    w-full
                    min-w-0
                    flex
                    items-center
                    justify-center
                    gap-1
                    sm:gap-1.5
                    px-1.5
                    sm:px-2.5
                    py-2
                    rounded-lg
                    text-[9px]
                    sm:text-xs
                    font-medium
                    transition-colors
                    ${
                      added
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/10 text-white border border-white/10 hover:bg-luxury-gold/20 hover:text-luxury-gold'
                    }
                  `}
                  whileTap={{
                    scale: 0.95,
                  }}
                >

                  {added ? (
                    <>
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />

                      <span className="truncate">
                        Added
                      </span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />

                      <span className="truncate">
                        Add
                      </span>
                    </>
                  )}

                </motion.button>

              </div>

            </div>

          </div>

        </div>

      </motion.div>

      {/* =======================================================
          PRODUCT PREVIEW
      ======================================================= */}

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