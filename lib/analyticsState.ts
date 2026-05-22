import type { Preset, GroupBy } from './analytics'

export type { Preset, GroupBy }
export type ChartType = 'bar' | 'line' | 'area'

interface AnalyticsState {
  preset: Preset
  chartType: ChartType
  groupBy: GroupBy
  customFrom?: string
  customTo?: string
}

const KEY = 'fin_analytics_state'

export function loadAnalyticsState(): AnalyticsState {
  try {
    if (typeof window === 'undefined') return defaultState()
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...defaultState(), ...JSON.parse(raw) }
  } catch {}
  return defaultState()
}

export function saveAnalyticsState(s: Partial<AnalyticsState>) {
  try {
    const current = loadAnalyticsState()
    localStorage.setItem(KEY, JSON.stringify({ ...current, ...s }))
  } catch {}
}

function defaultState(): AnalyticsState {
  return { preset: 'thisMonth', chartType: 'bar', groupBy: 'day' }
}
