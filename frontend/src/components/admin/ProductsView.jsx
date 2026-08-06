import { useRef, useState } from 'react'

export default function ProductsView({
  products,
  loading,
  editForms,
  onCreate,
  onFieldChange,
  onSaveEdit,
  onImageUpdate,
  onDeleteImage,
  onSetMainImage,
  onDelete,
  onActivate,
}) {
 const [form, setForm] = useState({
  name: '',
  brand: '',
  price: '',
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
  const [editingId, setEditingId] = useState(null)

  const imageInputRefs = useRef({})

  const handleSubmit = async (e) => {
    e.preventDefault()

    await onCreate(form, file)

    setForm({
      name: '',
      brand: '',
      price: '',
      stock: 0,
      category: '',
    })

    setFile(null)
    e.target.reset()
  }

  const handleImageChange = async (productId, e) => {
    const image = e.target.files?.[0]

    if (!image) return

    await onImageUpdate(productId, image)

    e.target.value = ''
  }

  const handleSave = async (productId) => {
    await onSaveEdit(productId)
  }

  const toggleEdit = (productId) => {
    setEditingId((current) =>
      current === productId ? null : productId
    )
  }

  if (loading) {
    return (
      <section>
        <h2 className="heading-luxury text-3xl mb-6 text-espresso">
          Products
        </h2>

        <div className="liquid-glass p-8 text-center">
          Loading products...
        </div>
      </section>
    )
  }

  return (
    <section>
      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="heading-luxury text-3xl text-espresso">
            Products
          </h2>

          <p className="text-sm opacity-70 mt-1">
            Manage your perfume collection
          </p>
        </div>

        <div className="text-sm opacity-70">
          {products.length} products
        </div>
      </div>

      {/* CREATE PRODUCT */}

      <div className="liquid-glass p-6 mb-8">
        <h3 className="font-semibold text-xl mb-4">
          Create Product
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            placeholder="Product name"
            className="p-3 rounded-md text-[#2B1E19]"
            required
          />

          <input
            value={form.brand}
            onChange={(e) =>
              setForm({
                ...form,
                brand: e.target.value,
              })
            }
            placeholder="Brand"
            className="p-3 rounded-md text-[#2B1E19]"
            required
          />

          <input
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value,
              })
            }
            placeholder="Price"
            className="p-3 rounded-md text-[#2B1E19]"
            required
          />

          <input
            type="number"
            value={form.stock}
            onChange={(e) =>
              setForm({
                ...form,
                stock: e.target.value,
              })
            }
            placeholder="Stock"
            className="p-3 rounded-md text-[#2B1E19]"
          />

          <input
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
            placeholder="Category"
            className="p-3 rounded-md text-[#2B1E19]"
          />       
                            <textarea
  value={form.description}
  onChange={(e) =>
    setForm({
      ...form,
      description: e.target.value,
    })
  }
  placeholder="About the Fragrance"
  className="p-3 rounded-md text-[#2B1E19] md:col-span-2"
/>

<input
  type="number"
  value={form.size_ml}
  onChange={(e) =>
    setForm({
      ...form,
      size_ml: e.target.value,
    })
  }
  placeholder="Size (ml)"
  className="p-3 rounded-md text-[#2B1E19]"
/>

<textarea
  value={form.preview_description}
  onChange={(e) =>
    setForm({
      ...form,
      preview_description: e.target.value,
    })
  }
  placeholder="Fragrance Story"
  className="p-3 rounded-md text-[#2B1E19] md:col-span-2"
/>

<input
  value={form.last}
  onChange={(e) =>
    setForm({
      ...form,
      last: e.target.value,
    })
  }
  placeholder="Lasts"
  className="p-3 rounded-md text-[#2B1E19]"
/>

<input
  value={form.scent_strength}
  onChange={(e) =>
    setForm({
      ...form,
      scent_strength: e.target.value,
    })
  }
  placeholder="Scent strength"
  className="p-3 rounded-md text-[#2B1E19]"
/>

<input
  value={form.best_for}
  onChange={(e) =>
    setForm({
      ...form,
      best_for: e.target.value,
    })
  }
  placeholder="Best for"
  className="p-3 rounded-md text-[#2B1E19]"
/>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
            className="p-2 text-[#2B1E19]"
            required
          />

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

      {/* PRODUCTS */}

      {products.length === 0 ? (
        <div className="liquid-glass p-10 text-center">
          <p className="opacity-70">
            No products found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => {
            const images = product.images || []

            const mainImage =
              images.find((image) => image.is_main) ||
              images[0]

            const stock = Number(product.stock || 0)

            const isLowStock =
              stock <=
              Number(product.low_stock_threshold || 5)

            const isEditing =
              editingId === product.id

            return (
              <div
                key={product.id}
                className={`liquid-glass overflow-hidden rounded-2xl transition-all duration-300 ${
                  isEditing
                    ? 'md:col-span-2 xl:col-span-3'
                    : ''
                }`}
              >
                {/* MAIN IMAGE */}

                <div
                  className={`relative bg-black/10 transition-all duration-300 ${
                    isEditing
                      ? 'h-80 md:h-96'
                      : 'h-64'
                  }`}
                >
                  {mainImage?.image_url ? (
                    <img
                      src={mainImage.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-50">
                      No image
                    </div>
                  )}

                  {/* STOCK BADGE */}

                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      isLowStock
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {isLowStock
                      ? 'Low Stock'
                      : 'In Stock'}
                  </div>
                </div>

                {/* PRODUCT INFORMATION */}

                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-espresso">
                        {product.name}
                      </h3>

                      <p className="text-sm opacity-60">
                        {product.brand}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        KSh{' '}
                        {Number(
                          product.price
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* PRODUCT SUMMARY */}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    <div>
                      <p className="text-xs opacity-60">
                        Stock
                      </p>

                      <p
                        className={
                          isLowStock
                            ? 'font-semibold text-red-500'
                            : 'font-semibold'
                        }
                      >
                        {stock}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs opacity-60">
                        Category
                      </p>

                      <p className="font-medium">
                        {product.category || '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs opacity-60">
                        Images
                      </p>

                      <p className="font-medium">
                        {images.length}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs opacity-60">
                        Status
                      </p>

                      <p className="font-medium">
                        {product.is_active
                          ? 'Active'
                          : 'Inactive'}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        toggleEdit(product.id)
                      }
                      className="btn-gold flex-1 px-3 py-2 text-sm"
                    >
                      {isEditing
                        ? 'Close'
                        : 'Edit'}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        imageInputRefs.current[
                          product.id
                        ]?.click()
                      }
                      className="px-3 py-2 text-sm rounded-md border border-white/30 hover:bg-white/10"
                    >
                      Add Images
                    </button>

                    <input
                      ref={(element) => {
                        imageInputRefs.current[
                          product.id
                        ] = element
                      }}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        handleImageChange(
                          product.id,
                          e
                        )
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(product.id)
                      }
                      className="px-3 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                    {!product.is_active && (
                        <button
                          type="button"
                          onClick={() => onActivate(product.id)}
                          className="px-3 py-2 text-sm rounded-md bg-green-500 text-white hover:bg-green-600" >
                            Activate
                        </button>
                    )}
                  </div>

                  {/* EXPANDED EDITOR */}

                  {isEditing && (
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <h4 className="font-semibold text-lg mb-4">
                        Edit Product
                      </h4>

                      {/* PRODUCT FIELDS */}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          value={
                            editForms[
                              product.id
                            ]?.name ?? ''
                          }
                          onChange={(e) =>
                            onFieldChange(
                              product.id,
                              'name',
                              e.target.value
                            )
                          }
                          placeholder="Name"
                          className="p-3 rounded-md text-[#2B1E19]"
                        />

                        <input
                          value={
                            editForms[
                              product.id
                            ]?.brand ?? ''
                          }
                          onChange={(e) =>
                            onFieldChange(
                              product.id,
                              'brand',
                              e.target.value
                            )
                          }
                          placeholder="Brand"
                          className="p-3 rounded-md text-[#2B1E19]"
                        />

                        <input
                          type="number"
                          value={
                            editForms[
                              product.id
                            ]?.price ?? ''
                          }
                          onChange={(e) =>
                            onFieldChange(
                              product.id,
                              'price',
                              e.target.value
                            )
                          }
                          placeholder="Price"
                          className="p-3 rounded-md text-[#2B1E19]"
                        />

                        <input
                          type="number"
                          value={
                            editForms[
                              product.id
                            ]?.stock ?? ''
                          }
                          onChange={(e) =>
                            onFieldChange(
                              product.id,
                              'stock',
                              e.target.value
                            )
                          }
                          placeholder="Stock"
                          className="p-3 rounded-md text-[#2B1E19]"
                        />

                        <input
                          value={
                            editForms[
                              product.id
                            ]?.category ?? ''
                          }
                          onChange={(e) =>
                            onFieldChange(
                              product.id,
                              'category',
                              e.target.value
                            )
                          }
                          placeholder="Category"
                          className="p-3 rounded-md text-[#2B1E19]"
                        />    
                        <textarea
                          value={
                            editForms[product.id]?.description ?? ''
                              }
                          onChange={(e) =>
                          onFieldChange(
                          product.id,
                          'description',
                          e.target.value
                          )}
                          placeholder="Description"
  className="p-3 rounded-md text-[#2B1E19] md:col-span-2"
/>

<input
  type="number"
  value={
    editForms[product.id]?.size_ml ?? ''
  }
  onChange={(e) =>
    onFieldChange(
      product.id,
      'size_ml',
      e.target.value
    )
  }
  placeholder="Size (ml)"
  className="p-3 rounded-md text-[#2B1E19]"
/>

<textarea
  value={
    editForms[product.id]?.preview_description ?? ''
  }
  onChange={(e) =>
    onFieldChange(
      product.id,
      'preview_description',
      e.target.value
    )
  }
  placeholder="Preview description"
  className="p-3 rounded-md text-[#2B1E19] md:col-span-2"
/>

<input
  value={
    editForms[product.id]?.last ?? ''
  }
  onChange={(e) =>
    onFieldChange(
      product.id,
      'last',
      e.target.value
    )
  }
  placeholder="Lasts"
  className="p-3 rounded-md text-[#2B1E19]"
/>

<input
  value={
    editForms[product.id]?.scent_strength ?? ''
  }
  onChange={(e) =>
    onFieldChange(
      product.id,
      'scent_strength',
      e.target.value
    )
  }
  placeholder="Scent strength"
  className="p-3 rounded-md text-[#2B1E19]"
/>

<input
  value={
    editForms[product.id]?.best_for ?? ''
  }
  onChange={(e) =>
    onFieldChange(
      product.id,
      'best_for',
      e.target.value
    )
  }
  placeholder="Best for"
  className="p-3 rounded-md text-[#2B1E19]"
/>

<input
  type="number"
  value={
    editForms[product.id]?.low_stock_threshold ?? 5
  }
  onChange={(e) =>
    onFieldChange(
      product.id,
      'low_stock_threshold',
      e.target.value
    )
  }
  placeholder="Low stock threshold"
  className="p-3 rounded-md text-[#2B1E19]"
/>

                        <button
                          type="button"
                          onClick={() =>
                            handleSave(product.id)
                          }
                          className="btn-gold py-3"
                        >
                          Save Changes
                        </button>
                      </div>

                      {/* IMAGE MANAGEMENT */}

                      <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-lg">
                              Product Images
                            </h4>

                            <p className="text-sm opacity-60">
                              Select a main image or remove images.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              imageInputRefs.current[
                                product.id
                              ]?.click()
                            }
                            className="btn-gold px-4 py-2 text-sm"
                          >
                            + Add Image
                          </button>
                        </div>

                        {images.length === 0 ? (
                          <div className="p-6 rounded-xl border border-white/20 text-center opacity-60">
                            No images uploaded.
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {images.map((image) => {
                              const isMain =
                                image.is_main

                              return (
                                <div
                                  key={image.id}
                                  className={`relative rounded-xl overflow-hidden border-2 ${
                                    isMain
                                      ? 'border-yellow-400'
                                      : 'border-white/10'
                                  }`}
                                >
                                  <img
                                    src={
                                      image.image_url
                                    }
                                    alt={`${product.name} image`}
                                    className="w-full h-40 object-cover"
                                  />

                                  {/* MAIN BADGE */}

                                  {isMain && (
                                    <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-yellow-400 text-black text-xs font-semibold">
                                      Main
                                    </div>
                                  )}

                                  {/* IMAGE ACTIONS */}

                                  <div className="p-2 bg-black/20 space-y-2">
                                    {!isMain && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          onSetMainImage(
                                            product.id,
                                            image.id
                                          )
                                        }
                                        className="w-full px-2 py-2 text-xs rounded-md border border-white/20 hover:bg-white/10"
                                      >
                                        Set as Main
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() =>
                                        onDeleteImage(
                                          product.id,
                                          image.id
                                        )
                                      }
                                      className="w-full px-2 py-2 text-xs rounded-md bg-red-500 text-white hover:bg-red-600"
                                    >
                                      Delete 
                                    </button>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* COLLAPSED THUMBNAILS */}

                  {!isEditing &&
                    images.length > 1 && (
                      <div className="flex gap-2 mt-5 overflow-x-auto">
                        {images.map((image) => (
                          <img
                            key={image.id}
                            src={image.image_url}
                            alt=""
                            className={`w-14 h-14 object-cover rounded-md ${
                              image.is_main
                                ? 'ring-2 ring-yellow-400'
                                : ''
                            }`}
                          />
                        ))}
                      </div>
                    )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}