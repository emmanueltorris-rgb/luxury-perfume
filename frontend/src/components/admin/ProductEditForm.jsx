export default function ProductEditForm({
  product,
  editForms,
  onFieldChange,
  onSaveEdit,
  onImageUpdate,
  onDeleteImage,
  onSetMainImage,
  imageInputRefs,
}) {
  const values = editForms[product.id] || {}
  const images = product.images || []

  const handleSave = async () => {
    await onSaveEdit(product.id)
  }

  const handleImageChange = async (e) => {
    const image = e.target.files?.[0]

    if (!image) return

    await onImageUpdate(product.id, image)

    e.target.value = ''
  }

  return (
    <div className="mt-6 pt-6 border-t border-white/20">

      <h4 className="font-semibold text-lg mb-4">
        Edit Product
      </h4>

      {/* PRODUCT FIELDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        {/* NAME */}

        <input
          value={values.name ?? ''}
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

        {/* BRAND */}

        <input
          value={values.brand ?? ''}
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

        {/* PRICE */}

        <input
          type="number"
          min="0"
          value={values.price ?? ''}
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

        {/* STOCK */}

        <input
          type="number"
          min="0"
          value={values.stock ?? ''}
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

        {/* CATEGORY */}

        <input
          value={values.category ?? ''}
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

        {/* DESCRIPTION */}

        <textarea
          value={values.description ?? ''}
          onChange={(e) =>
            onFieldChange(
              product.id,
              'description',
              e.target.value
            )
          }
          placeholder="Description"
          className="p-3 rounded-md text-[#2B1E19] md:col-span-2"
        />

        {/* SIZE */}

        <input
          type="number"
          min="0"
          value={values.size_ml ?? ''}
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

        {/* PREVIEW DESCRIPTION */}

        <textarea
          value={values.preview_description ?? ''}
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

        {/* LASTS */}

        <input
          value={values.last ?? ''}
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

        {/* STRENGTH */}

        <input
          value={values.scent_strength ?? ''}
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

        {/* BEST FOR */}

        <input
          value={values.best_for ?? ''}
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

        {/* DISCOUNT TYPE */}

        <select
          value={values.discount_type ?? 'none'}
          onChange={(e) =>
            onFieldChange(
              product.id,
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

        {values.discount_type !== 'none' && (
          <input
            type="number"
            min="0"
            step="0.01"
            value={values.discount_value ?? ''}
            onChange={(e) =>
              onFieldChange(
                product.id,
                'discount_value',
                e.target.value
              )
            }
            placeholder={
              values.discount_type === 'percentage'
                ? 'Discount percentage e.g. 20'
                : 'Discount amount e.g. 500'
            }
            className="p-3 rounded-md text-[#2B1E19]"
          />
        )}

        {/* ACTIVATE DISCOUNT */}

        {values.discount_type !== 'none' && (
          <label className="flex items-center gap-3 p-3 rounded-md border border-white/20">
            <input
              type="checkbox"
              checked={
                values.discount_active ?? false
              }
              onChange={(e) =>
                onFieldChange(
                  product.id,
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

        {/* LOW STOCK */}

        <input
          type="number"
          min="0"
          value={
            values.low_stock_threshold ?? 5
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

        {/* SAVE */}

        <button
          type="button"
          onClick={handleSave}
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

        {/* HIDDEN IMAGE INPUT */}

        <input
          ref={(element) => {
            imageInputRefs.current[
              product.id
            ] = element
          }}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />

        {/* IMAGES */}

        {images.length === 0 ? (
          <div className="p-6 rounded-xl border border-white/20 text-center opacity-60">
            No images uploaded.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

            {images.map((image) => {
              const isMain = image.is_main

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
                    src={image.image_url}
                    alt={`${product.name} image`}
                    className="w-full h-40 object-cover"
                  />

                  {/* MAIN BADGE */}

                  {isMain && (
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-yellow-400 text-black text-xs font-semibold">
                      Main
                    </div>
                  )}

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
  )
}