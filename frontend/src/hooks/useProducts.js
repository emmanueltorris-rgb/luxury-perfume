import { useEffect, useMemo, useState } from 'react'
import { fetchProducts } from '../lib/api'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function loadProducts() {
      setIsLoading(true)
      setError(null)

      try {
        const results = await fetchProducts()
        if (!active) return

        setProducts(Array.isArray(results) ? results : [])
      } catch (err) {
        if (!active) return
        setError(err.message || 'Unable to load products')
      } finally {
        if (!active) return
        setIsLoading(false)
      }
    }

    loadProducts()
    return () => {
      active = false
    }
  }, [])

  const categories = useMemo(() => {
    const unique = new Set(products.map((item) => item.category || 'Other'))
    return ['All', ...Array.from(unique).filter(Boolean)]
  }, [products])

  const featuredProducts = useMemo(() => {
    const featured = products.filter((product) => product.featured)
    return featured.length > 0 ? featured.slice(0, 4) : products.slice(0, 4)
  }, [products])

  return {
    products,
    categories,
    featuredProducts,
    isLoading,
    error,
  }
}
