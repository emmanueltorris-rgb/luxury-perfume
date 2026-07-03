import StatCard from './StatCard'

export default function OverviewView({ stats }) {
  return (
    <section>
      <h2 className="heading-luxury text-3xl mb-6 text-espresso">Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`KES ${stats.totalRevenue.toLocaleString()}`} />
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Pending Orders" value={stats.pendingOrders} />
        <StatCard label="Total Products" value={stats.totalProducts} />
      </div>
      {stats.lowStock > 0 && (
        <div className="mt-6 liquid-glass p-4 text-sm text-espresso">
          {stats.lowStock} product(s) low on stock (5 or fewer units left).
        </div>
      )}
    </section>
  )
}