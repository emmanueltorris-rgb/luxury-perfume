import { useState, useCallback, useRef, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1'

export function usePayment(token) {
  const [status, setStatus] = useState('idle')
  const [transactionId, setTransactionId] = useState(null)
  const [checkoutRequestId, setCheckoutRequestId] = useState(null)
  const [receipt, setReceipt] = useState(null)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState('')

  const pollInterval = useRef(null)
  const pollAttempts = useRef(0)
  const MAX_POLL_ATTEMPTS = 30

  const clearPoll = useCallback(() => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current)
      pollInterval.current = null
    }
    pollAttempts.current = 0
  }, [])

  useEffect(() => {
    return () => clearPoll()
  }, [clearPoll])

  const startPolling = useCallback((txId) => {
    pollInterval.current = setInterval(async () => {
      pollAttempts.current += 1

      if (pollAttempts.current > MAX_POLL_ATTEMPTS) {
        clearPoll()
        setStatus('timeout')
        setMessage('Payment request timed out. Please try again.')
        return
      }

      try {
        const response = await fetch(`${API_BASE}/payments/status/${txId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()

        if (!response.ok) {
          console.warn('Status poll failed:', data)
          return
        }

        const txStatus = data.status?.toUpperCase()

        switch (txStatus) {
          case 'SUCCESS':
            clearPoll()
            setStatus('success')
            setReceipt(data.mpesa_receipt_number)
            setMessage(`Payment successful! Receipt: ${data.mpesa_receipt_number}`)
            break

          case 'FAILED':
            clearPoll()
            setStatus('failed')
            setError('Payment failed. Please check your M-Pesa balance and try again.')
            setMessage('Payment failed')
            break

          case 'CANCELLED':
            clearPoll()
            setStatus('cancelled')
            setError('Payment was cancelled.')
            setMessage('You cancelled the payment request.')
            break

          case 'TIMEOUT':
            clearPoll()
            setStatus('timeout')
            setError('Payment request timed out.')
            setMessage('The payment request timed out.')
            break

          case 'PENDING':
          case 'PROCESSING':
          default:
            setMessage(`Waiting for payment confirmation... (${pollAttempts.current}/${MAX_POLL_ATTEMPTS})`)
            break
        }

      } catch (err) {
        console.error('Polling error:', err)
      }
    }, 3000)
  }, [clearPoll, token])

  const initiatePayment = useCallback(async (phoneNumber, amount, orderId = null) => {
    clearPoll()
    setStatus('loading')
    setError(null)
    setReceipt(null)
    setMessage('Initiating payment...')

    try {
      console.log("TOKEN:", token)
      const response = await fetch(`${API_BASE}/payments/stk-push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          Authorization:`Bearer ${token}`,
         },
        body: JSON.stringify({
          phone_number: phoneNumber, 
          order_id: orderId,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        const detail = Array.isArray(data.detail)
          ? data.detail.map((d) => d.msg).join(', ')
          : data.detail
        throw new Error(detail || data.message || 'Payment initiation failed')
      }

      setTransactionId(data.transaction_id)
      setCheckoutRequestId(data.checkout_request_id)
      setStatus('pending')
      setMessage(data.customer_message || 'Check your phone for the M-Pesa prompt')

      startPolling(data.transaction_id)

      return data

    } catch (err) {
      setStatus('failed')
      setError(err.message)
      setMessage(err.message)
      throw err
    }
  }, [clearPoll, startPolling,token])

  const reset = useCallback(() => {
    clearPoll()
    setStatus('idle')
    setTransactionId(null)
    setCheckoutRequestId(null)
    setReceipt(null)
    setError(null)
    setMessage('')
  }, [clearPoll])

  return {
    status,
    transactionId,
    checkoutRequestId,
    receipt,
    error,
    message,
    isLoading: status === 'loading',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isFailed: status === 'failed' || status === 'cancelled' || status === 'timeout',
    initiatePayment,
    reset,
  }
}