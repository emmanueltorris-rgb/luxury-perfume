import { useMemo } from 'react'
import { useProducts } from './useProducts'

export function useHeroProducts() {
  const {
    products,
    isLoading,
    error,
  } = useProducts()

  const heroProducts = useMemo(() => {
    if (!products || products.length === 0) {
      return []
    }

    // 1. Discounted products get priority
    const discounted = products.filter(
      (product) =>
        product.discount_active &&
        product.discount_type !== 'none' &&
        Number(product.discount_value) > 0
    )

    // 2. Sort newest products first
    const newest = [...products]
      .sort((a, b) => {
        return (
          new Date(b.created_at || 0) -
          new Date(a.created_at || 0)
        )
      })

    // Combine discounted + newest
    const combined = [
      ...discounted,
      ...newest,
    ]

    // Remove duplicates
    const unique = combined.filter(
      (product, index, array) =>
        array.findIndex(
          (item) => item.id === product.id
        ) === index
    )

    // Take maximum 5 products
    return unique.slice(0, 5)
  }, [products])

  return {
    heroProducts,
    isLoading,
    error,
  }
}