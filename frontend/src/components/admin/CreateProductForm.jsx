import { useState } from 'react'

export default function CreateProductForm({
  onCreate,
}) {
  const [form, setForm] = useState({
    name: '',
    brand: '',
    price: '',
    discount_type: 'none',
    discount_value: 0,
    discount_active: false,
    stock: 0,
    category: '',
    description: '',
    size_ml: '',
    preview_description: '',
    last: '',
    scent_strength: '',
    best_for: '',
  })

  const [file, setFile] = useState(null)

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await onCreate(form, file)

    setForm({
      name: '',
      brand: '',
      price: '',
      discount_type: 'none',
      discount_value: 0,
      discount_active: false,
      stock: 0,
      category: '',
      description: '',
      size_ml: '',
      preview_description: '',
      last: '',
      scent_strength: '',
      best_for: '',
    })

    setFile(null)
    e.target.reset()
  }

  return (
    <div className="liquid-glass p-6 mb-8">
      <h3 className="font-semibold text-xl mb-4">
        Create Product
      </h3>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* NAME */}

        <input
          value={form.name}
          onChange={(e) =>
            updateField('name', e.target.value)
          }
          placeholder="Product name"
          className="p-3 rounded-md text-[#2B1E19]"
          required
        />

        {/* BRAND */}

        <input
          value={form.brand}
          onChange={(e) =>
            updateField('brand', e.target.value)
          }
          placeholder="Brand"
          className="p-3 rounded-md text-[#2B1E19]"
          required
        />

        {/* PRICE */}

        <input
          type="number"
          min="0"
          value={form.price}
          onChange={(e) =>
            updateField('price', e.target.value)
          }
          placeholder="Price"
          className="p-3 rounded-md text-[#2B1E19]"
          required
        />

        {/* STOCK */}

        <input
          type="number"
          min="0"
          value={form.stock}
          onChange={(e) =>
            updateField('stock', e.target.value)
          }
          placeholder="Stock"
          className="p-3 rounded-md text-[#2B1E19]"
        />

        {/* CATEGORY */}

        <input
          value={form.category}
          onChange={(e) =>
            updateField('category', e.target.value)
          }
          placeholder="Category"
          className="p-3 rounded-md text-[#2B1E19]"
        />

        {/* DESCRIPTION */}

        <textarea
          value={form.description}
          onChange={(e) =>
            updateField('description', e.target.value)
          }
          placeholder="About the Fragrance"
          className="p-3 rounded-md text-[#2B1E19] md:col-span-2"
        />

        {/* SIZE */}

        <input
          type="number"
          min="0"
          value={form.size_ml}
          onChange={(e) =>
            updateField('size_ml', e.target.value)
          }
          placeholder="Size (ml)"
          className="p-3 rounded-md text-[#2B1E19]"
        />

        {/* PREVIEW DESCRIPTION */}

        <textarea
          value={form.preview_description}
          onChange={(e) =>
            updateField(
              'preview_description',
              e.target.value
            )
          }
          placeholder="Fragrance Story"
          className="p-3 rounded-md text-[#2B1E19] md:col-span-2"
        />

        {/* LASTS */}

        <input
          value={form.last}
          onChange={(e) =>
            updateField('last', e.target.value)
          }
          placeholder="Lasts"
          className="p-3 rounded-md text-[#2B1E19]"
        />

        {/* STRENGTH */}

        <input
          value={form.scent_strength}
          onChange={(e) =>
            updateField(
              'scent_strength',
              e.target.value
            )
          }
          placeholder="Scent strength"
          className="p-3 rounded-md text-[#2B1E19]"
        />

        {/* BEST FOR */}

        <input
          value={form.best_for}
          onChange={(e) =>
            updateField('best_for', e.target.value)
          }
          placeholder="Best for"
          className="p-3 rounded-md text-[#2B1E19]"
        />

        {/* DISCOUNT TYPE */}

        <select
          value={form.discount_type}
          onChange={(e) =>
            updateField(
              'discount_type',
              e.target.value
            )
          }
          className="p-3 rounded-md text-[#2B1E19]"
        >
          <option value="none">
            No Discount
          </option>

          <option value="percentage">
            Percentage (%)
          </option>

          <option value="fixed">
            Fixed Amount (KSh)
          </option>
        </select>

        {/* DISCOUNT VALUE */}

        {form.discount_type !== 'none' && (
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.discount_value}
            onChange={(e) =>
              updateField(
                'discount_value',
                e.target.value
              )
            }
            placeholder={
              form.discount_type === 'percentage'
                ? 'Discount percentage e.g. 20'
                : 'Discount amount e.g. 500'
            }
            className="p-3 rounded-md text-[#2B1E19]"
          />
        )}

        {/* ACTIVATE DISCOUNT */}

        {form.discount_type !== 'none' && (
          <label className="flex items-center gap-3 p-3 rounded-md border border-white/20">
            <input
              type="checkbox"
              checked={form.discount_active}
              onChange={(e) =>
                updateField(
                  'discount_active',
                  e.target.checked
                )
              }
              className="w-4 h-4"
            />

            <span className="text-sm">
              Activate discount
            </span>
          </label>
        )}

        {/* IMAGE */}

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFile(
              e.target.files?.[0] || null
            )
          }
          className="p-2 text-[#2B1E19]"
          required
        />

        {/* SUBMIT */}

        <div className="md:col-span-3">
          <button
            className="btn-gold px-6 py-3"
            type="submit"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  )
}