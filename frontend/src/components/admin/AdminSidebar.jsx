import { LayoutDashboard, Package, ShoppingBag, BarChart3 } from 'lucide-react'

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'products', label: 'Products', icon: Package },
  { key: 'orders', label: 'Orders', icon: ShoppingBag },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
]

export default function AdminSidebar({ activeView, onChange }) {
  return (
    <aside className="w-56 shrink-0">
      <h1 className="heading-luxury text-2xl mb-6 text-espresso">Admin</h1>
      <nav className="space-y-1">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeView === key ? 'bg-[#FF7F62] text-white' : 'text-espresso/70 hover:bg-[#FDFBF7]'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  )
}