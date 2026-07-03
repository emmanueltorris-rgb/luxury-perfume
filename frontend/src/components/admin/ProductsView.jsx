import { useState } from 'react'

export default function ProductsView({ products, loading, editForms, onCreate, onFieldChange, onSaveEdit, onImageUpdate, onDelete }) {
  const [form, setForm] = useState({ name: '', brand: '', price: '', stock: 0, category: '' })
  const [file, setFile] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onCreate(form, file)
    setForm({ name: '', brand: '', price: '', stock: 0, category: '' })
    setFile(null)
  }

  return (
    <section>
      <h2 className="heading-luxury text-3xl mb-6 text-espresso">Products</h2>

      <div className="liquid-glass p-6 mb-8">
        <h3 className="font-semibold mb-4">Create Product</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      {loading ? (
        <div>Loading products...</div>
      ) : (
        <div className="space-y-4">
          {products.map((p) => (
            <div key={p.id} className="liquid-glass p-4">
              <div className="flex items-center gap-4 mb-3">
                <img src={p.image_url || '/static/uploads/placeholder.png'} alt={p.name} className="w-20 h-20 object-cover rounded-md" />
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 flex-1">
                  <input value={editForms[p.id]?.name ?? ''} onChange={(e) => onFieldChange(p.id, 'name', e.target.value)} placeholder="Name" className="p-2 rounded-md text-[#2B1E19]" />
                  <input value={editForms[p.id]?.brand ?? ''} onChange={(e) => onFieldChange(p.id, 'brand', e.target.value)} placeholder="Brand" className="p-2 rounded-md text-[#2B1E19]" />
                  <input value={editForms[p.id]?.price ?? ''} onChange={(e) => onFieldChange(p.id, 'price', e.target.value)} placeholder="Price" className="p-2 rounded-md text-[#2B1E19]" />
                  <input value={editForms[p.id]?.stock ?? ''} onChange={(e) => onFieldChange(p.id, 'stock', e.target.value)} placeholder="Stock" className="p-2 rounded-md text-[#2B1E19]" />
                  <input value={editForms[p.id]?.category ?? ''} onChange={(e) => onFieldChange(p.id, 'category', e.target.value)} placeholder="Category" className="p-2 rounded-md text-[#2B1E19]" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => onSaveEdit(p.id)} className="btn-gold px-4 py-2 text-sm">Save Changes</button>
                <input type="file" onChange={(e) => onImageUpdate(p.id, e.target.files?.[0])} className="text-[#2B1E19] text-sm" />
                <button onClick={() => onDelete(p.id)} className="ml-auto px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}