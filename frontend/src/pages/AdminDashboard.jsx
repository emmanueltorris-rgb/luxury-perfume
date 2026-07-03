import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useAdminProducts } from '../hooks/useAdminProducts'
import { useAdminOrders, STATUS_OPTIONS } from '../hooks/useAdminOrders'
import AdminSidebar from '../components/admin/AdminSidebar'
import OverviewView from '../components/admin/OverviewView'
import ProductsView from '../components/admin/ProductsView'
import OrdersView from '../components/admin/OrdersView'
import AnalyticsView from '../components/admin/AnalyticsView'

export default function AdminDashboard() {
  const { token } = useAuth()
  const { showToast } = useToast()
  const [activeView, setActiveView] = useState('overview')

  const productsApi = useAdminProducts(token, showToast)
  const ordersApi = useAdminOrders(token, showToast)

  const withToast = (fn, successMsg) => async (...args) => {
    try {
      await fn(...args)
      if (successMsg) showToast(successMsg, 'success')
    } catch (err) {
      showToast(err.message || 'Action failed', 'error')
    }
  }

  const stats = useMemo(() => {
    const totalRevenue = ordersApi.orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0)
    const totalOrders = ordersApi.orders.length
    const pendingOrders = ordersApi.orders.filter((o) => o.status === 'pending').length
    const lowStock = productsApi.products.filter((p) => p.stock <= 5).length
    const statusCounts = STATUS_OPTIONS.reduce((acc, s) => {
      acc[s] = ordersApi.orders.filter((o) => o.status === s).length
      return acc
    }, {})
    return { totalRevenue, totalOrders, pendingOrders, lowStock, statusCounts, totalProducts: productsApi.products.length }
  }, [ordersApi.orders, productsApi.products])

  return (
    <div className="container-luxury py-16 flex gap-8">
      <AdminSidebar activeView={activeView} onChange={setActiveView} />

      <main className="flex-1 min-w-0">
        {activeView === 'overview' && <OverviewView stats={stats} />}

        {activeView === 'products' && (
          <ProductsView
            products={productsApi.products}
            loading={productsApi.loading}
            editForms={productsApi.editForms}
            onCreate={withToast(productsApi.createProduct, 'Product created')}
            onFieldChange={productsApi.updateField}
            onSaveEdit={withToast(productsApi.saveEdit, 'Product updated')}
            onImageUpdate={withToast(productsApi.updateImage, 'Image updated')}
            onDelete={withToast(productsApi.deleteProduct, 'Product deleted')}
          />
        )}

        {activeView === 'orders' && (
          <OrdersView
            orders={ordersApi.orders}
            loading={ordersApi.loading}
            onStatusChange={withToast(ordersApi.changeStatus, 'Order status updated')}
          />
        )}

        {activeView === 'analytics' && <AnalyticsView stats={stats} />}
      </main>
    </div>
  )
}