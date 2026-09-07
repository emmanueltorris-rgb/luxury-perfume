export default function StatCard({ label, value }) {
  return (
    <div className="liquid-glass p-4 sm:p-5 min-w-0">
      <div className="text-sm text-espresso/60 mb-1">{label}</div>
      <div className="break-words text-xl font-semibold text-espresso sm:text-2xl">{value}</div>
    </div>
  )
}
