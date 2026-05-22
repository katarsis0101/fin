'use client'
import type { Preset } from '@/lib/analytics'

const PRESETS: { key: Preset; label: string }[] = [
  { key: 'today', label: 'Сьогодні' },
  { key: 'thisWeek', label: 'Тиждень' },
  { key: 'thisMonth', label: 'Місяць' },
  { key: 'lastMonth', label: 'Мин. місяць' },
  { key: 'last3m', label: '3 місяці' },
  { key: 'last6m', label: '6 місяців' },
  { key: 'thisYear', label: 'Рік' },
  { key: 'lastYear', label: 'Мин. рік' },
  { key: 'allTime', label: 'Весь час' },
  { key: 'custom', label: 'Свій' },
]

interface Props {
  preset: Preset
  onPreset: (p: Preset) => void
  customFrom: string
  customTo: string
  onCustomFrom: (s: string) => void
  onCustomTo: (s: string) => void
}

export default function DateRangePicker({ preset, onPreset, customFrom, customTo, onCustomFrom, onCustomTo }: Props) {
  return (
    <div className="px-4 mb-4">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {PRESETS.map(p => (
          <button key={p.key} onClick={() => onPreset(p.key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              preset === p.key ? 'bg-emerald-500 text-white' : 'bg-[#1a1a1a] text-[#888]'
            }`}>
            {p.label}
          </button>
        ))}
      </div>
      {preset === 'custom' && (
        <div className="flex gap-2 mt-3">
          <input type="date" value={customFrom} onChange={e => onCustomFrom(e.target.value)}
            className="flex-1 bg-[#1a1a1a] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          <input type="date" value={customTo} onChange={e => onCustomTo(e.target.value)}
            className="flex-1 bg-[#1a1a1a] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
        </div>
      )}
    </div>
  )
}
