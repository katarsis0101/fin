import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  startOfYear, endOfYear, subDays, subMonths, subYears, format, eachDayOfInterval,
  eachWeekOfInterval, eachMonthOfInterval } from 'date-fns'
import { uk } from 'date-fns/locale'

export type Preset = 'today' | 'thisWeek' | 'thisMonth' | 'lastMonth' |
  'last3m' | 'last6m' | 'thisYear' | 'lastYear' | 'allTime' | 'custom'

export type GroupBy = 'day' | 'week' | 'month' | 'year'

export function getRangeForPreset(preset: Preset, customFrom?: Date, customTo?: Date): { from: Date; to: Date } {
  const now = new Date()
  switch (preset) {
    case 'today': return { from: startOfDay(now), to: endOfDay(now) }
    case 'thisWeek': return { from: startOfWeek(now, { locale: uk }), to: endOfWeek(now, { locale: uk }) }
    case 'thisMonth': return { from: startOfMonth(now), to: endOfMonth(now) }
    case 'lastMonth': { const lm = subMonths(now, 1); return { from: startOfMonth(lm), to: endOfMonth(lm) } }
    case 'last3m': return { from: startOfMonth(subMonths(now, 2)), to: endOfMonth(now) }
    case 'last6m': return { from: startOfMonth(subMonths(now, 5)), to: endOfMonth(now) }
    case 'thisYear': return { from: startOfYear(now), to: endOfYear(now) }
    case 'lastYear': { const ly = subYears(now, 1); return { from: startOfYear(ly), to: endOfYear(ly) } }
    case 'allTime': return { from: new Date('2020-01-01'), to: endOfDay(now) }
    case 'custom': return { from: customFrom ?? startOfMonth(now), to: customTo ?? endOfDay(now) }
  }
}

export function getPrevRangeForPreset(preset: Preset, customFrom?: Date, customTo?: Date): { from: Date; to: Date } | null {
  const now = new Date()
  switch (preset) {
    case 'today': return { from: startOfDay(subDays(now, 1)), to: endOfDay(subDays(now, 1)) }
    case 'thisWeek': { const pw = subDays(startOfWeek(now, { locale: uk }), 1); return { from: startOfWeek(pw, { locale: uk }), to: endOfWeek(pw, { locale: uk }) } }
    case 'thisMonth': { const lm = subMonths(now, 1); return { from: startOfMonth(lm), to: endOfMonth(lm) } }
    case 'lastMonth': { const llm = subMonths(now, 2); return { from: startOfMonth(llm), to: endOfMonth(llm) } }
    case 'last3m': return { from: startOfMonth(subMonths(now, 5)), to: endOfMonth(subMonths(now, 3)) }
    case 'last6m': return { from: startOfMonth(subMonths(now, 11)), to: endOfMonth(subMonths(now, 6)) }
    case 'thisYear': { const ly = subYears(now, 1); return { from: startOfYear(ly), to: endOfYear(ly) } }
    case 'lastYear': { const lly = subYears(now, 2); return { from: startOfYear(lly), to: endOfYear(lly) } }
    default: return null
  }
}

export interface ChartPoint { label: string; income: number; expense: number }

export function buildChartData(
  transactions: { created_at: string; type: string; amount: number }[],
  from: Date, to: Date, groupBy: GroupBy
): ChartPoint[] {
  const points: ChartPoint[] = []

  if (groupBy === 'day') {
    eachDayOfInterval({ start: from, end: to }).forEach(day => {
      const label = format(day, 'd MMM', { locale: uk })
      const dayStr = format(day, 'yyyy-MM-dd')
      const txs = transactions.filter(t => t.created_at.startsWith(dayStr))
      points.push({
        label,
        income: txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
        expense: txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
      })
    })
  } else if (groupBy === 'month') {
    eachMonthOfInterval({ start: from, end: to }).forEach(month => {
      const label = format(month, 'MMM yyyy', { locale: uk })
      const monthStr = format(month, 'yyyy-MM')
      const txs = transactions.filter(t => t.created_at.startsWith(monthStr))
      points.push({
        label,
        income: txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
        expense: txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
      })
    })
  } else if (groupBy === 'year') {
    const years = new Set(transactions.map(t => t.created_at.substring(0, 4)))
    Array.from(years).sort().forEach(yr => {
      const txs = transactions.filter(t => t.created_at.startsWith(yr))
      points.push({
        label: yr,
        income: txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
        expense: txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
      })
    })
  }

  return points
}
