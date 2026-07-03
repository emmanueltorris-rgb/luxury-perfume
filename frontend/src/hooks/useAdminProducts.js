import { useEffect, useState } from 'react'
import { fetchProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from '../lib/api'

export function useAdminProducts(token, showToast) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editForms, setEditForms] = useState({})

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetchProducts()
        if (!mounted) return
        setProducts(res)
        const seeded = {}
        res.forEach((p) => {
          seeded[p.id] = { name: p.name, brand: p.brand, price: p.price, stock: p.stock, category: p.category }
        })
        setEditForms(seeded)
      } catch (err) {
        showToast('Failed to load products', 'error')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => (mounted = false)
  }, [])

  const createProduct = async (form, file) => {
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('brand', form.brand)
    fd.append('price', form.price)
    fd.append('stock', form.stock)
    fd.append('category', form.category)
    if (file) fd.append('image', file)

    const created = await adminCreateProduct({ token, fields: fd })
    setProducts((p) => [created, ...p])
    setEditForms((f) => ({
      ...f,
      [created.id]: { name: created.name, brand: created.brand, price: created.price, stock: created.stock, category: created.category },
    }))
    return created
  }

  const updateField = (productId, field, value) => {
    setEditForms((f) => ({ ...f, [productId]: { ...f[productId], [field]: value } }))
  }

  const saveEdit = async (productId) => {
    const values = editForms[productId]
    const fd = new FormData()
    Object.entries(values).forEach(([key, val]) => fd.append(key, val))
    const updated = await adminUpdateProduct({ token, productId, fields: fd })
    setProducts((list) => list.map((p) => (p.id === updated.id ? updated : p)))
    return updated
  }

  const updateImage = async (productId, imageFile) => {
    const fd = new FormData()
    fd.append('image', imageFile)
    const updated = await adminUpdateProduct({ token, productId, fields: fd })
    setProducts((list) => list.map((p) => (p.id === updated.id ? updated : p)))
    return updated
  }

  const deleteProduct = async (productId) => {
    await adminDeleteProduct({ token, productId })
    setProducts((list) => list.filter((p) => p.id !== productId))
  }

  return { products, loading, editForms, createProduct, updateField, saveEdit, updateImage, deleteProduct }
}