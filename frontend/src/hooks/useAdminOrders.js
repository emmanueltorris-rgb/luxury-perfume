import { useEffect, useState } from 'react'
import { fetchAllOrders, updateOrderStatus } from '../lib/api'

export const STATUS_OPTIONS = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

export function useAdminOrders(token, showToast) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetchAllOrders({ token })
        if (mounted) setOrders(res)
      } catch (err) {
        showToast('Failed to load orders', 'error')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => (mounted = false)
  }, [])

  const changeStatus = async (orderId, newStatus) => {
    await updateOrderStatus({ token, orderId, status: newStatus })
    setOrders((list) => list.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
  }

  return { orders, loading, changeStatus }
}