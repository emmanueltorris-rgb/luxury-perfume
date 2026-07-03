import { STATUS_OPTIONS } from '../../hooks/useAdminOrders'

export default function OrdersView({ orders, loading, onStatusChange }) {
  return (
    <section>
      <h2 className="heading-luxury text-3xl mb-6 text-espresso">Orders</h2>
      {loading ? (
        <div>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-espresso/60">No orders yet.</div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="liquid-glass p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">Order #{o.id}</div>
                <div className="text-sm text-espresso/60">
                  Total: KES {parseFloat(o.total).toLocaleString()} • {new Date(o.created_at).toLocaleDateString()}
                </div>
              </div>
              <select value={o.status} onChange={(e) => onStatusChange(o.id, e.target.value)} className="p-2 rounded-md text-[#2B1E19]">
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}