import { useEffect, useState } from 'react'

import {
  fetchAdminProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminDeleteProductImage,
  adminSetMainProductImage,
  adminActivateProduct,
} from '../lib/api'

export function useAdminProducts(token, showToast) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editForms, setEditForms] = useState({})

  useEffect(() => {
    if (!token) return
    let mounted = true
    async function loadProducts() {
      try {
        setLoading(true)
        const res = await fetchAdminProducts({ token })
        if (!mounted) return
        setProducts(res)
        const seeded = {}
        res.forEach((product) => {
        seeded[product.id] = {
        name: product.name ?? '',
        brand: product.brand ?? '',
        price: product.price ?? '',
        discount_type: product.discount_type ?? 'none',
        discount_value: product.discount_value ?? 0,
        discount_active: product.discount_active ?? false,
        stock: product.stock ?? 0,
        category: product.category ?? '',
        description: product.description ?? '',
        size_ml: product.size_ml ?? '',
        preview_description: product.preview_description ?? '',
        last: product.last ?? '',
        scent_strength: product.scent_strength ?? '',
        best_for: product.best_for ?? '',
        low_stock_threshold: product.low_stock_threshold ?? 5,
        }})

        setEditForms(seeded)
      } catch (err) {
        if (mounted) {
          showToast(
            err.message || 'Failed to load products',
            'error'
          )
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadProducts()
    return () => {
      mounted = false
    }
  }, [token])

  // CREATE PRODUCT
  const createProduct = async (form, file) => {
    const fd = new FormData()

    fd.append('name', form.name)
    fd.append('brand', form.brand)
    fd.append('price', form.price)
    fd.append('discount_type', form.discount_type || 'none')
    fd.append('discount_value', form.discount_value || 0 )
    fd.append('discount_active', String(Boolean(form.discount_active)))
    fd.append('stock', form.stock || 0)
    fd.append('category', form.category || '')

    // Send the optional fragrance details entered in the create form.
    ;[
      'description',
      'size_ml',
      'preview_description',
      'last',
      'scent_strength',
      'best_for',
    ].forEach((field) => {
      const value = form[field]
      if (value !== undefined && value !== null && value !== '') {
        fd.append(field, value)
      }
    })

    // Backend expects "images"
    if (file) {
      fd.append('images', file)
    }
    const created = await adminCreateProduct({
      token,
      fields: fd,
    })

    setProducts((current) => [
      created,
      ...current,
    ])
    setEditForms((current) => ({
      ...current,
      [created.id]: {
      name: created.name ?? '',
      brand: created.brand ?? '',
      price: created.price ?? '',
      discount_type: created.discount_type ?? 'none',
      discount_value: created.discount_value ?? 0,
      discount_active: created.discount_active ?? false,
      stock: created.stock ?? 0,
      category: created.category ?? '',
      description: created.description ?? '',
      size_ml: created.size_ml ?? '',
      preview_description: created.preview_description ?? '',
      last: created.last ?? '',
      scent_strength: created.scent_strength ?? '',
      best_for: created.best_for ?? '',
      low_stock_threshold: created.low_stock_threshold ?? 5,
    },
      }))

    
  

    return created
  }

  // EDIT FIELD
  const updateField = (
    productId,
    field,
    value
  ) => {
    setEditForms((current) => ({
      ...current,

      [productId]: {
        ...current[productId],
        [field]: value,
      },
    }))
  }

  // SAVE PRODUCT DETAILS
  const saveEdit = async (productId) => {
    const values = editForms[productId]

    if (!values) {
      throw new Error('Product data not found')
    }

    const fd = new FormData()

    Object.entries(values).forEach(
      ([key, value]) => {
        fd.append(key, value ?? '')
      }
    )

    const updated =
      await adminUpdateProduct({
        token,
        productId,
        fields: fd,
      })

    setProducts((current) =>
      current.map((product) =>
        product.id === updated.id
          ? updated
          : product
      )
    )

    return updated
  }

  // ADD IMAGE
  const updateImage = async (
    productId,
    imageFile
  ) => {
    if (!imageFile) {
      throw new Error('Please select an image')
    }
    const fd = new FormData()
    // Backend expects "images"
    fd.append('images', imageFile)
    const updated =
      await adminUpdateProduct({
        token,
        productId,
        fields: fd,
      })
    setProducts((current) =>
      current.map((product) =>
        product.id === updated.id
          ? updated
          : product
      )
    )

    return updated
  }
  // DELETE PRODUCT IMAGE
const deleteImage = async (productId, imageId) => {
  if (!imageId) {
    throw new Error('Image not found')
  }

  await adminDeleteProductImage({
    token,
    productId,
    imageId,
  })

    setProducts((current) =>
      current.map((product) => {
        if (product.id !== productId) {
          return product
        }

        const remainingImages = (product.images || []).filter(
          (image) => image.id !== imageId
        )

        return {
          ...product,
          images: remainingImages,
        }
      })
    )
  }
  // SET MAIN PRODUCT IMAGE
const setMainImage = async (productId, imageId) => {
  if (!imageId) {
    throw new Error('Image not found')
  }

  await adminSetMainProductImage({
    token,
    productId,
    imageId,
  })

  setProducts((current) =>
    current.map((product) => {
      if (product.id !== productId) {
        return product
      }

      return {
        ...product,
        images: (product.images || []).map((image) => ({
          ...image,
          is_main: image.id === imageId,
        })),
      }
      })
    )
  }

  // ACTIVATE PRODUCT
const activateProduct = async (productId) => {
  await adminActivateProduct({
    token,
    productId,
  })

  setProducts((current) =>
    current.map((product) =>
      product.id === productId
        ? {
            ...product,
            is_active: true,
          }
        : product
    )
  )
}

  // DELETE PRODUCT
  const deleteProduct = async (productId) => {
    await adminDeleteProduct({
      token,
      productId,
    })

    setProducts((current) =>
      current.filter(
        (product) =>
          product.id !== productId
      )
    )

    setEditForms((current) => {
      const copy = { ...current }

      delete copy[productId]

      return copy
    })
  }

  return {
    products,
    loading,
    editForms,
    createProduct,
    updateField,
    saveEdit,
    updateImage,
    deleteImage,
    setMainImage,
    activateProduct,
    deleteProduct,
  }
}
