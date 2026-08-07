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

  /*
   * ---------------------------------------------------------
   * CATEGORIES
   * ---------------------------------------------------------
   */

  const categories = useMemo(() => {
    const unique = new Set(
      products.map((item) => item.category || 'Other')
    )

    return [
      'All',
      ...Array.from(unique).filter(Boolean),
    ]
  }, [products])

  /*
   * ---------------------------------------------------------
   * FEATURED PRODUCTS
   * ---------------------------------------------------------
   */

  const featuredProducts = useMemo(() => {
    const featured = products.filter(
      (product) => product.featured
    )

    return featured.length > 0
      ? featured.slice(0, 4)
      : products.slice(0, 4)
  }, [products])

  /*
   * ---------------------------------------------------------
   * HERO PRODUCTS
   * ---------------------------------------------------------
   *
   * Priority:
   *
   * 1. Products with active discounts
   * 2. Recently created products
   * 3. Random products
   *
   * Restocked products are intentionally NOT included yet.
   */

  const heroProducts = useMemo(() => {
    if (!products.length) {
      return []
    }

    /*
     * 1. ACTIVE DISCOUNTS
     */

    const discounted = products.filter(
      (product) =>
        product.discount_active &&
        product.discount_type !== 'none' &&
        Number(product.discount_value) > 0
    )

    /*
     * 2. RECENT PRODUCTS
     *
     * Sort newest first.
     */

    const recent = [...products]
      .filter((product) => product.created_at)
      .sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      )

    /*
     * Combine them.
     *
     * Set prevents the same product from appearing twice.
     */

    const combined = [
      ...discounted,
      ...recent,
    ]

    const unique = Array.from(
      new Map(
        combined.map((product) => [
          product.id,
          product,
        ])
      ).values()
    )

    /*
     * If we have enough products, use them.
     */

    if (unique.length > 0) {
      return unique.slice(0, 6)
    }

    /*
     * 3. FALLBACK — RANDOM PRODUCTS
     */

    return [...products]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6)
  }, [products])

  return {
    products,
    categories,
    featuredProducts,
    heroProducts,
    isLoading,
    error,
  }
}