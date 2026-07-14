import { format as fnsFormat, parseISO } from 'date-fns'
import { ms, enUS } from 'date-fns/locale'

export function formatCurrency(amount, locale = 'bm') {
  const num = Number(amount) || 0
  const symbol = locale === 'bm' ? 'RM' : 'RM'
  return `${symbol} ${num.toLocaleString(locale === 'bm' ? 'ms-MY' : 'en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

export function formatDate(dateStr, locale = 'bm') {
  if (!dateStr) return ''
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
    const pattern = locale === 'bm' ? 'd MMMM yyyy' : 'dd MMM yyyy'
    return fnsFormat(date, pattern, { locale: locale === 'bm' ? ms : enUS })
  } catch {
    return String(dateStr)
  }
}

export function formatMonthYear(monthYear, locale = 'bm') {
  if (!monthYear) return ''
  const [year, month] = monthYear.split('-')
  const months = locale === 'bm'
    ? ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return `${months[parseInt(month, 10) - 1]} ${year}`
}

export function getCurrentMonthYear() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function getMonthsAgo(n) {
  const now = new Date()
  now.setMonth(now.getMonth() - n)
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function generateReceiptNumber(prefix = 'TLU2') {
  const num = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  return `${prefix}-${num}`
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function classNames(...args) {
  return args.filter(Boolean).join(' ')
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}
