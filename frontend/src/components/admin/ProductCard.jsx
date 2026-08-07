import { calculateDiscountedPrice } from '../../lib/utils'
import ProductEditForm from './ProductEditForm'

export default function ProductCard({
  product,
  editForms,
  editingId,
  onToggleEdit,
  onFieldChange,
  onSaveEdit,
  onImageUpdate,
  onDeleteImage,
  onSetMainImage,
  onDelete,
  onActivate,
  imageInputRefs,
}) {
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
  const hasDiscount =
    product.discount_active &&
    product.discount_type !== 'none' &&
    Number(product.discount_value) > 0
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discount_type,
    product.discount_value,
    product.discount_active
  )

  return (
    <div
      className={`liquid-glass overflow-hidden rounded-2xl transition-all duration-300 ${
        isEditing
          ? 'md:col-span-2 xl:col-span-3'
          : ''
      }`}
    >
      {/* IMAGE */}
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
        {/* STOCK */}
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
      {/* INFORMATION */}
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

          {/* PRICE */}

          <div className="text-right">

            {hasDiscount ? (
              <>
                <p className="text-xs line-through opacity-50">
                  KSh{' '}
                  {Number(
                    product.price
                  ).toLocaleString()}
                </p>

                <p className="font-semibold text-green-600">
                  KSh{' '}
                  {discountedPrice.toLocaleString()}
                </p>

                <p className="text-xs font-semibold text-green-600">
                  {product.discount_type ===
                  'percentage'
                    ? `${product.discount_value}% OFF`
                    : `KSh ${Number(
                        product.discount_value
                      ).toLocaleString()} OFF`}
                </p>
              </>
            ) : (
              <p className="font-semibold">
                KSh{' '}
                {Number(
                  product.price
                ).toLocaleString()}
              </p>
            )}

          </div>

        </div>

        {/* SUMMARY */}

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
              onToggleEdit(product.id)
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
              onClick={() =>
                onActivate(product.id)
              }
              className="px-3 py-2 text-sm rounded-md bg-green-500 text-white hover:bg-green-600"
            >
              Activate
            </button>
          )}

        </div>

        {/* EDITOR */}

        {isEditing && (
          <ProductEditForm
            product={product}
            editForms={editForms}
            onFieldChange={onFieldChange}
            onSaveEdit={onSaveEdit}
            onImageUpdate={onImageUpdate}
            onDeleteImage={onDeleteImage}
            onSetMainImage={onSetMainImage}
            imageInputRefs={imageInputRefs}
          />
        )}

        {/* THUMBNAILS */}

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
}