import { motion, AnimatePresence } from 'framer-motion'
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Smartphone,
  Receipt,
  RotateCcw
} from 'lucide-react'
import { cn } from '../lib/utils'

const statusConfig = {
  idle: {
    icon: Smartphone,
    color: 'text-white/50',
    bg: 'bg-white/5',
    title: 'Ready to Pay',
    description: 'Enter your M-Pesa number to begin',
  },
  loading: {
    icon: Loader2,
    color: 'text-luxury-gold',
    bg: 'bg-luxury-gold/10',
    title: 'Initiating...',
    description: 'Connecting to Safaricom...',
    animate: true,
  },
  pending: {
    icon: Clock,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    title: 'Awaiting Payment',
    description: 'Check your phone and enter M-Pesa PIN',
    animate: true,
  },
  success: {
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    title: 'Payment Successful',
    description: 'Your order has been confirmed',
  },
  failed: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    title: 'Payment Failed',
    description: 'Something went wrong',
  },
  cancelled: {
    icon: XCircle,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    title: 'Payment Cancelled',
    description: 'You cancelled the transaction',
  },
  timeout: {
    icon: Clock,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    title: 'Request Timed Out',
    description: 'Please try again',
  },
}

function PaymentStatus({ status, message, receipt, onReset }) {
  const config = statusConfig[status] || statusConfig.idle
  const Icon = config.icon

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="liquid-glass rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            config.bg
          )}>
            <Icon className={cn(
              "w-6 h-6",
              config.color,
              config.animate && "animate-spin"
            )} />
          </div>
          <div>
            <h3 className={cn("font-serif text-lg font-bold", config.color)}>
              {config.title}
            </h3>
            <p className="text-sm text-white/50">{message || config.description}</p>
          </div>
        </div>

        {receipt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-medium">
                M-Pesa Receipt
              </span>
            </div>
            <p className="font-mono text-lg text-emerald-300 tracking-wider">
              {receipt}
            </p>
          </motion.div>
        )}

        {(status === 'success' || status === 'failed' || status === 'cancelled' || status === 'timeout') && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={onReset}
            className="w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 
                     text-white/70 hover:text-white text-sm font-medium transition-all
                     flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {status === 'success' ? 'Make Another Purchase' : 'Try Again'}
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default PaymentStatus
