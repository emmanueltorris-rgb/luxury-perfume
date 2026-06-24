import { useState, useCallback } from 'react'
import { Phone, AlertCircle, Check } from 'lucide-react'
import { cn, formatPhoneNumber, isValidMpesaPhone } from '../lib/utils'

function PhoneInput({ value, onChange, disabled = false, error = null }) {
  const [localValue, setLocalValue] = useState(value || '')
  const [touched, setTouched] = useState(false)

  const handleChange = useCallback((e) => {
    const raw = e.target.value
    const cleaned = raw.replace(/[^\d\s-]/g, '')
    setLocalValue(cleaned)

    const formatted = formatPhoneNumber(cleaned)
    onChange(formatted)
  }, [onChange])

  const handleBlur = () => {
    setTouched(true)
    const formatted = formatPhoneNumber(localValue)
    setLocalValue(formatted)
    onChange(formatted)
  }

  const isValid = isValidMpesaPhone(value)
  const showError = touched && !isValid && localValue.length > 0

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-widest text-white/50 font-medium">
        M-Pesa Phone Number
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Phone className={cn(
            "w-5 h-5 transition-colors",
            disabled ? "text-white/20" : showError ? "text-red-400" : isValid ? "text-emerald-400" : "text-white/30"
          )} />
        </div>

        <input
          type="tel"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder="2547XX XXX XXX"
          maxLength={15}
          className={cn(
            "w-full pl-12 pr-12 py-4 rounded-xl bg-white/5 border text-white placeholder-white/20",
            "focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:border-luxury-gold/50",
            "transition-all duration-300 font-mono text-lg tracking-wider",
            disabled && "opacity-50 cursor-not-allowed",
            showError && "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/20",
            isValid && !disabled && "border-emerald-400/30"
          )}
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {isValid && !disabled && (
            <Check className="w-5 h-5 text-emerald-400" />
          )}
          {showError && (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className={cn(
          "text-xs transition-colors",
          showError ? "text-red-400" : "text-white/30"
        )}>
          {showError 
            ? "Must be 12 digits: 2547XXXXXXXX" 
            : "Format: 2547XX XXX XXX"
          }
        </p>
        {value && (
          <p className="text-xs text-white/30">
            {value.length}/12 digits
          </p>
        )}
      </div>
    </div>
  )
}

export default PhoneInput
