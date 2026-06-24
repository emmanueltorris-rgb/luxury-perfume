import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.startsWith('0')) {
    return `254${cleaned.slice(1)}`
  }

  if (cleaned.startsWith('7') && cleaned.length === 9) {
    return `254${cleaned}`
  }

  if (cleaned.startsWith('254') && cleaned.length === 12) {
    return cleaned
  }

  return cleaned
}

export function isValidMpesaPhone(phone) {
  return /^2547\d{8}$/.test(phone)
}

export function generateId() {
  return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function debounce(fn, ms) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

export function scrollToElement(elementId) {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
