import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SectionHeader from './SectionHeader'
import ProductGrid from './ProductGrid'

function FeaturedCollection() {
  return (
    <section className="section-padding relative">
      <div className="container-luxury">
        <SectionHeader
          subtitle="Curated Selection"
          title="The Signature Collection"
        />

        <ProductGrid featuredOnly={true} />

        <div className="text-center mt-16">
          <Link
            to="/products"
            className="btn-glass inline-flex items-center gap-2 group"
          >
            View Full Collection
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollection
