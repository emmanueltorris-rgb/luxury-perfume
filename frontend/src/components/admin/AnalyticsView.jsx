import { STATUS_OPTIONS } from '../../hooks/useAdminOrders'

export default function AnalyticsView({ stats }) {
  return (
    <section>
      <h2 className="heading-luxury text-3xl mb-6 text-espresso">Analytics</h2>
      <div className="liquid-glass p-6">
        <h3 className="font-semibold mb-4">Orders by Status</h3>
        <div className="space-y-2">
          {STATUS_OPTIONS.map((s) => {
            const count = stats.statusCounts[s]
            const pct = stats.totalOrders ? Math.round((count / stats.totalOrders) * 100) : 0
            return (
              <div key={s} className="flex items-center gap-3">
                <span className="w-24 text-sm capitalize text-espresso/70">{s}</span>
                <div className="flex-1 h-3 rounded-full bg-[#FDFBF7] overflow-hidden">
                  <div className="h-full bg-[#FF7F62]" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-10 text-sm text-right text-espresso/70">{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}