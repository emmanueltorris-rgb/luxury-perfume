import HeroProductShowcase from '../components/HeroProductShowcase'
import FeaturedCollection from '../components/FeaturedCollection'
import BrandStory from '../components/BrandStory'
import { useProducts } from '../hooks/useProducts'

function HomePage() {
  const { products, isLoading, error } = useProducts()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/60">Loading fragrances...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/60">
          Unable to load fragrances.
        </p>
      </div>
    )
  }

  return (
    <div>
      <HeroProductShowcase products={products} />

      <FeaturedCollection />

      <BrandStory />
    </div>
  )
}

export default HomePage