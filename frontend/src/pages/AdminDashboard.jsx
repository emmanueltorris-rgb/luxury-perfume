import { useEffect, useState } from 'react'
import { fetchProducts, adminCreateProduct, adminUpdateProduct } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function AdminDashboard() {
  const { token } = useAuth()
  const { showToast } = useToast()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', brand: '', price: '', stock: 0, category: '' })
  const [file, setFile] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetchProducts()
        if (!mounted) return
        setProducts(res)
      } catch (err) {
        showToast('Failed to load products', 'error')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => (mounted = false)
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('brand', form.brand)
      fd.append('price', form.price)
      fd.append('stock', form.stock)
      fd.append('category', form.category)
      if (file) fd.append('image', file)

      const created = await adminCreateProduct({ token, fields: fd })
      setProducts((p) => [created, ...p])
      showToast('Product created', 'success')
      setForm({ name: '', brand: '', price: '', stock: 0, category: '' })
      setFile(null)
    } catch (err) {
      showToast(err.message || 'Create failed', 'error')
    }
  }

  const handlePriceUpdate = async (productId, newPrice) => {
    try {
      const fd = new FormData()
      fd.append('price', newPrice)
      const updated = await adminUpdateProduct({ token, productId, fields: fd })
      setProducts((list) => list.map((p) => (p.id === updated.id ? updated : p)))
      showToast('Price updated', 'success')
    } catch (err) {
      showToast(err.message || 'Update failed', 'error')
    }
  }

  const handleImageUpdate = async (productId, imageFile) => {
    try {
      const fd = new FormData()
      fd.append('image', imageFile)
      const updated = await adminUpdateProduct({ token, productId, fields: fd })
      setProducts((list) => list.map((p) => (p.id === updated.id ? updated : p)))
      showToast('Image updated', 'success')
    } catch (err) {
      showToast(err.message || 'Image upload failed', 'error')
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="container-luxury py-16">
      <h1 className="heading-luxury text-3xl mb-6 text-espresso">Admin Dashboard</h1>

      <section className="liquid-glass p-6 mb-8">
        <h2 className="font-semibold mb-4">Create Product</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="p-2 rounded-md text-[#2B1E19]" required />
          <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Brand" className="p-2 rounded-md text-[#2B1E19]" required />
          <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" className="p-2 rounded-md text-[#2B1E19]" required />
          <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock" className="p-2 rounded-md text-[#2B1E19]" />
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="p-2 rounded-md text-[#2B1E19]" />
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="p-2 text-[#2B1E19]" />

          <div className="md:col-span-3">
            <button className="btn-gold" type="submit">Create Product</button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        {products.map((p) => (
          <div key={p.id} className="liquid-glass p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={p.image_url || '/static/uploads/placeholder.png'} alt={p.name} className="w-20 h-20 object-cover rounded-md" />
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-espresso/60">{p.brand} • {p.category}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input defaultValue={p.price} onBlur={(e) => handlePriceUpdate(p.id, parseFloat(e.target.value || p.price))} className="p-2 rounded-md w-28 text-[#2B1E19]" />
              <input type="file" onChange={(e) => handleImageUpdate(p.id, e.target.files?.[0])} className="text-[#2B1E19]" />
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
