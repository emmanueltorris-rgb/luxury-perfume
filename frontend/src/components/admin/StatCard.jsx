export default function StatCard({ label, value }) {
  return (
    <div className="liquid-glass p-5">
      <div className="text-sm text-espresso/60 mb-1">{label}</div>
      <div className="text-2xl font-semibold text-espresso">{value}</div>
    </div>
  )
}