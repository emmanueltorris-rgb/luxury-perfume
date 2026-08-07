import { useRef, useState } from 'react'

import CreateProductForm from './CreateProductForm'
import ProductCard from './ProductCard'

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
  const [editingId, setEditingId] = useState(null)

  const imageInputRefs = useRef({})

  const toggleEdit = (productId) => {
    setEditingId((current) =>
      current === productId
        ? null
        : productId
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

      {/* CREATE */}

      <CreateProductForm
        onCreate={onCreate}
      />

      {/* PRODUCTS */}

      {products.length === 0 ? (

        <div className="liquid-glass p-10 text-center">
          <p className="opacity-70">
            No products found.
          </p>
        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {products.map((product) => (

            <ProductCard
              key={product.id}
              product={product}
              editForms={editForms}
              editingId={editingId}
              onToggleEdit={toggleEdit}
              onFieldChange={onFieldChange}
              onSaveEdit={onSaveEdit}
              onImageUpdate={onImageUpdate}
              onDeleteImage={onDeleteImage}
              onSetMainImage={onSetMainImage}
              onDelete={onDelete}
              onActivate={onActivate}
              imageInputRefs={imageInputRefs}
            />

          ))}

        </div>

      )}

    </section>
  )
}