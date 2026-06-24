import { motion } from 'framer-motion'
import SectionHeader from '../components/SectionHeader'
import ProductGrid from '../components/ProductGrid'

function ProductsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/50 to-transparent" />
        <div className="container-luxury relative z-10">
          <SectionHeader
            subtitle="The Complete Collection"
            title="Every Fragrance Tells a Story"
          />
          <p className="text-center text-white/50 max-w-2xl mx-auto -mt-8 mb-4">
            Browse our full range of artisan fragrances. Filter by family to find your perfect scent.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-luxury">
          <ProductGrid />
        </div>
      </section>
    </motion.div>
  )
}

export default ProductsPage
