import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  startOfYear, endOfYear, subDays, subMonths, subYears, format,
  eachDayOfInterval, eachMonthOfInterval, differenceInDays } from 'date-fns'
import { uk } from 'date-fns/locale'

export type Preset = 'today' | 'thisWeek' | 'thisMonth' | 'lastMonth' |
  'last3m' | 'last6m' | 'thisYear' | 'lastYear' | 'allTime' | 'custom'

export type GroupBy = 'day' | 'week' | 'month' | 'year'

export function getRangeForPreset(preset: Preset, customFrom?: Date, customTo?: Date): { from: Date | null; to: Date | null } {
  const now = new Date()
  switch (preset) {
    case 'today':     return { from: startOfDay(now), to: endOfDay(now) }
    case 'thisWeek':  return { from: startOfWeek(now, { locale: uk }), to: endOfWeek(now, { locale: uk }) }
    case 'thisMonth': return { from: startOfMonth(now), to: endOfMonth(now) }
    case 'lastMonth': { const lm = subMonths(now, 1); return { from: startOfMonth(lm), to: endOfMonth(lm) } }
    case 'last3m':    return { from: startOfMonth(subMonths(now, 2)), to: endOfMonth(now) }
    case 'last6m':    return { from: startOfMonth(subMonths(now, 5)), to: endOfMonth(now) }
    case 'thisYear':  return { from: startOfYear(now), to: endOfYear(now) }
    case 'lastYear':  { const ly = subYears(now, 1); return { from: startOfYear(ly), to: endOfYear(ly) } }
    case 'allTime':   return { from: null, to: null }
    case 'custom':    return { from: customFrom ?? startOfMonth(now), to: customTo ?? endOfDay(now) }
  }
}

export function getPrevRangeForPreset(preset: Preset, customFrom?: Date, customTo?: Date): { from: Date; to: Date } | null {
  const now = new Date()
  switch (preset) {
    case 'today':     return { from: startOfDay(subDays(now, 1)), to: endOfDay(subDays(now, 1)) }
    case 'thisWeek':  { const pw = subDays(startOfWeek(now, { locale: uk }), 1); return { from: startOfWeek(pw, { locale: uk }), to: endOfWeek(pw, { locale: uk }) } }
    case 'thisMonth': { const lm = subMonths(now, 1); return { from: startOfMonth(lm), to: endOfMonth(lm) } }
    case 'lastMonth': { const llm = subMonths(now, 2); return { from: startOfMonth(llm), to: endOfMonth(llm) } }
    case 'last3m':    return { from: startOfMonth(subMonths(now, 5)), to: endOfMonth(subMonths(now, 3)) }
    case 'last6m':    return { from: startOfMonth(subMonths(now, 11)), to: endOfMonth(subMonths(now, 6)) }
    case 'thisYear':  { const ly = subYears(now, 1); return { from: startOfYear(ly), to: endOfYear(ly) } }
    case 'lastYear':  { const lly = subYears(now, 2); return { from: startOfYear(lly), to: endOfYear(lly) } }
    default:          return null
  }
}

export function getDefaultGroupBy(from: Date | null, to: Date | null): GroupBy {
  if (!from || !to) return 'month'
  const days = differenceInDays(to, from)
  if (days <= 14)  return 'day'
  if (days <= 90)  return 'week'
  return 'month'
}

export interface ChartPoint { label: string; income: number; expense: number }

export function buildChartData(
  transactions: { created_at: string; type: string; amount: number }[],
  from: Date | null, to: Date | null, groupBy: GroupBy
): ChartPoint[] {
  if (!from || !to) {
    const monthMap = new Map<string, ChartPoint>()
    transactions.forEach(t => {
      const monthStr = t.created_at.substring(0, 7)
      if (!monthMap.has(monthStr)) {
        const d = new Date(monthStr + '-01')
        monthMap.set(monthStr, { label: format(d, 'MMM yyyy', { locale: uk }), income: 0, expense: 0 })
      }
      const pt = monthMap.get(monthStr)!
      if (t.type === 'income') pt.income += Number(t.amount)
      else pt.expense += Number(t.amount)
    })
    return Array.from(monthMap.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v)
  }

  const points: ChartPoint[] = []

  if (groupBy === 'day') {
    eachDayOfInterval({ start: from, end: to }).forEach(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const txs = transactions.filter(t => t.created_at.startsWith(dayStr))
      points.push({
        label: format(day, 'd MMM', { locale: uk }),
        income:  txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
        expense: txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
      })
    })
  } else if (groupBy === 'week') {
    const weekMap = new Map<string, ChartPoint>()
    transactions.forEach(t => {
      const d = new Date(t.created_at)
      const weekStart = startOfWeek(d, { locale: uk })
      const key = format(weekStart, 'yyyy-MM-dd')
      if (!weekMap.has(key)) weekMap.set(key, { label: format(weekStart, 'd MMM', { locale: uk }), income: 0, expense: 0 })
      const pt = weekMap.get(key)!
      if (t.type === 'income') pt.income += Number(t.amount)
      else pt.expense += Number(t.amount)
    })
    points.push(...Array.from(weekMap.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v))
  } else if (groupBy === 'month') {
    eachMonthOfInterval({ start: from, end: to }).forEach(month => {
      const monthStr = format(month, 'yyyy-MM')
      const txs = transactions.filter(t => t.created_at.startsWith(monthStr))
      points.push({
        label: format(month, 'MMM yyyy', { locale: uk }),
        income:  txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
        expense: txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
      })
    })
  } else {
    const years = new Set(transactions.map(t => t.created_at.substring(0, 4)))
    Array.from(years).sort().forEach(yr => {
      const txs = transactions.filter(t => t.created_at.startsWith(yr))
      points.push({
        label: yr,
        income:  txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
        expense: txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
      })
    })
  }

  return points
}
