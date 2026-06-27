import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react'
import { useToast } from '../context/ToastContext'

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

export default function Toast() {
  const { toasts } = useToast()

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col gap-3 max-w-sm">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = iconMap[toast.variant] || iconMap.info
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto rounded-3xl border border-white/10 bg-white/90 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-rose-950">{toast.variant === 'success' ? 'Success' : toast.variant === 'error' ? 'Error' : toast.variant === 'warning' ? 'Warning' : 'Info'}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{toast.message}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
