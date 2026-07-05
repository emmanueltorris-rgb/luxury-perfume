import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { usePayment } from '../hooks/usePayment'
import { formatPrice, isValidMpesaPhone } from '../lib/utils'
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import PhoneInput from '../components/PhoneInput'
import PaymentStatus from '../components/PaymentStatus'
import CartSummary from '../components/CartSummary'
import { useToast } from '../context/ToastContext'
import {useAuth} from "../context/AuthContext"
function CheckoutPage() {
  const { items, total, count } = useCart()
  const {token}= useAuth()
  const {
    status,
    receipt,
    error,
    message,
    isLoading,
    isPending,
    isSuccess,
    isFailed,
    initiatePayment,
    reset,
  } = usePayment(token)
  const { showToast } = useToast()
  const [phone, setPhone] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [creatingOrder, setCreatingOrder] = useState(false)
  const canSubmit = items.length > 0 && isValidMpesaPhone(phone) && agreed && !isLoading && !isPending && !creatingOrder

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return

    try {
      setCreatingOrder(true)
      const orderRes = await fetch(`${import.meta.env.VITE_API_URL || '/api/v1'}/orders/`,{
        method: "POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`,
        },
        body: JSON.stringify({
          items:items.map((i) =>({product_id: i.id, quantity:i.quantity})),
        }),
      })
      const orderData = await orderRes.json()
      if(!orderRes.ok){
        throw new Error(orderData.detail || "Failed to create order")
      }
      const newOrderId = orderData.order_id 
      await initiatePayment(phone, orderData.total, newOrderId)
    } catch (err) {
      console.error('Checkout error:', err)
      showToast(err.message || "Checkout failed", "error")
    }finally{
      setCreatingOrder(false)
    }
  }

  useEffect(() => {
    if (!message) return
    if (status === 'success') {
      showToast(message, 'success')
    }
    if (status === 'failed' || status === 'cancelled' || status === 'timeout') {
      showToast(message || error || 'Payment did not complete.', 'error')
    }
  }, [status, message, error, showToast])

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-32 pb-20"
      >
        <div className="container-luxury max-w-2xl mx-auto">
          <PaymentStatus
            status="success"
            message={message}
            receipt={receipt}
            onReset={() => {
              reset()
            }}
          />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-32 pb-20"
    >
      <div className="container-luxury max-w-6xl mx-auto">
        <div className="mb-12">
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collection
          </Link>
          <h1 className="heading-luxury text-4xl md:text-5xl mb-2">Secure Checkout</h1>
          <p className="text-white/50">Complete your purchase with M-Pesa</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {(isLoading || isPending || isFailed) && (
              <PaymentStatus
                status={status}
                message={message}
                receipt={receipt}
                onReset={reset}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="liquid-glass rounded-xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 
                                flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-white">M-Pesa Payment</h2>
                    <p className="text-xs text-white/40">Safaricom STK Push</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    disabled={isLoading || isPending}
                    error={error}
                  />

                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/50">Amount to Pay</span>
                      <span className="font-mono text-2xl text-luxury-gold font-bold">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        disabled={isLoading || isPending}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 rounded border border-white/20 peer-checked:bg-luxury-gold/20 
                                    peer-checked:border-luxury-gold/50 transition-all flex items-center justify-center">
                        {agreed && <div className="w-2 h-2 rounded-full bg-luxury-gold" />}
                      </div>
                    </div>
                    <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                      I authorize L'Essence Parfumerie to charge my M-Pesa account for this purchase.
                      I understand this will trigger an STK Push to my phone.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full py-4 rounded-xl font-sans font-semibold text-sm uppercase tracking-wider
                             transition-all duration-300 relative overflow-hidden
                             disabled:opacity-40 disabled:cursor-not-allowed
                             btn-gold"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-emerald-950/30 border-t-emerald-950 rounded-full"
                        />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Pay {formatPrice(total)} with M-Pesa
                      </span>
                    )}
                  </button>

                  <p className="text-center text-xs text-white/30">
                    You will receive an STK Push on your phone. Enter your M-Pesa PIN to complete.
                  </p>
                </div>
              </div>
            </form>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/5">
              <ShieldCheck className="w-5 h-5 text-emerald-400/60 flex-shrink-0" />
              <p className="text-xs text-white/40 leading-relaxed">
                Your payment is secured via Safaricom's M-Pesa Daraja API. We never store your PIN or M-Pesa credentials. 
                All transactions are encrypted end-to-end.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-32">
              <CartSummary />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CheckoutPage
