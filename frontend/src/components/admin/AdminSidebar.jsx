import { LayoutDashboard, Package, ShoppingBag, BarChart3 } from 'lucide-react'

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'products', label: 'Products', icon: Package },
  { key: 'orders', label: 'Orders', icon: ShoppingBag },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
]

export default function AdminSidebar({ activeView, onChange }) {
  return (
    <aside className="w-full shrink-0 lg:w-56">
      <h1 className="heading-luxury text-2xl mb-4 lg:mb-6 text-espresso">Admin</h1>
      <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:flex-col lg:space-y-1 lg:overflow-visible lg:pb-0">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition lg:w-full lg:gap-3 ${
              activeView === key ? 'bg-[#FFE9DE] text-black' : 'text-espresso/70 hover:bg-[#E8F0E3]'
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
