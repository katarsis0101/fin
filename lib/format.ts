import { format, parseISO } from 'date-fns'
import { uk } from 'date-fns/locale'

export function formatUAH(amount: number): string {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function ukDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'dd.MM.yyyy', { locale: uk })
}

export function ukDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'dd.MM.yyyy HH:mm', { locale: uk })
}

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function formatAmount(amount: number, type: 'income' | 'expense'): string {
  const sign = type === 'income' ? '+' : '-'
  return `${sign}${formatUAH(Math.abs(amount))}`
}
