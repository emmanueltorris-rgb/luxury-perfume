import { formatPrice, calculateDiscountedPrice } from '../../lib/utils'

export default function ProductPrice({
  product,
  preview = false,
}) {
  const hasDiscount =
    product.discount_active &&
    product.discount_type !== 'none' &&
    Number(product.discount_value) > 0

  const discountedPrice = hasDiscount
    ? calculateDiscountedPrice(
        product.price,
        product.discount_type,
        product.discount_value,
        product.discount_active
      )
    : product.price

  return (
    <div>
      {hasDiscount ? (
        <>
          <p
            className={
              preview
                ? 'text-sm text-white/40 line-through'
                : 'text-sm text-white/40 line-through'
            }
          >
            {formatPrice(product.price)}
          </p>

          <p
            className={
              preview
                ? 'font-serif text-3xl font-bold text-luxury-gold whitespace-nowrap'
                : 'font-serif text-3xl font-bold text-luxury-gold whitespace-nowrap'
            }
          >
            {formatPrice(discountedPrice)}
          </p>

          <p className="text-xs font-semibold text-emerald-400 mt-1">
            {product.discount_type === 'percentage'
              ? `${product.discount_value}% OFF`
              : `${formatPrice(product.discount_value)} OFF`}
          </p>
        </>
      ) : (
        <p className="font-serif text-3xl font-bold text-luxury-gold whitespace-nowrap">
          {formatPrice(product.price)}
        </p>
      )}

      <p className="text-xs text-white/30 mt-1">
        {product.size_ml
          ? `${product.size_ml}ml`
          : '100ml'}
      </p>
    </div>
  )
}