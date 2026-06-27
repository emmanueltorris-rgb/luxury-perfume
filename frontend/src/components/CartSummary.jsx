import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/utils'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function CartSummary() {
  const { items, removeItem, updateItemQuantity, clearCart, total, count } = useCart()

  if (items.length === 0) {
    return (
      <div className="liquid-glass rounded-xl p-8 text-center">
        <ShoppingBag className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <p className="text-white/40 text-sm">Your collection is empty</p>
        <p className="text-white/20 text-xs mt-1">Add fragrances to begin checkout</p>
      </div>
    )
  }

  return (
    <div className="liquid-glass rounded-xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-luxury-gold" />
          Your Collection ({count})
        </h3>
      </div>

      <div className="max-h-64 overflow-y-auto">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 flex items-center gap-4 border-b border-white/5 last:border-0"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-800/50 to-amber-800/30 
                            flex items-center justify-center flex-shrink-0">
                <span className="font-serif text-lg text-white/30">{item.name.charAt(0)}</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{item.name}</p>
                <p className="text-xs text-white/40">{item.volume}</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-mono text-luxury-gold">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <div className="mt-2 flex items-center justify-end gap-2 text-xs text-white/40">
                  <button
                    type="button"
                    onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                    className="h-7 w-7 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                    className="h-7 w-7 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-6 border-t border-white/10 bg-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/50">Subtotal</span>
          <span className="text-sm font-mono text-white/70">{formatPrice(total)}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/50">Shipping</span>
          <span className="text-sm font-mono text-emerald-400">Free</span>
        </div>
        <div className="h-px bg-white/10 my-3" />
        <div className="flex items-center justify-between">
          <span className="font-serif text-lg font-bold text-white">Total</span>
          <span className="font-mono text-xl text-luxury-gold font-bold">
            {formatPrice(total)}
          </span>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="mt-5 w-full rounded-xl bg-white/5 py-3 text-sm text-white/60 hover:bg-white/10 transition-colors"
        >
          Clear Cart
        </button>
      </div>
    </div>
  )
}

export default CartSummary
