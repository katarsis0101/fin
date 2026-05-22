'use client'
import type { Preset } from '@/lib/analytics'

const PRESETS: { key: Preset; label: string }[] = [
  { key: 'today',     label: 'Сьогодні' },
  { key: 'thisWeek',  label: 'Тиждень' },
  { key: 'thisMonth', label: 'Місяць' },
  { key: 'lastMonth', label: 'Мин. місяць' },
  { key: 'last3m',    label: '3 місяці' },
  { key: 'last6m',    label: '6 місяців' },
  { key: 'thisYear',  label: 'Рік' },
  { key: 'lastYear',  label: 'Мин. рік' },
  { key: 'allTime',   label: 'Весь час' },
  { key: 'custom',    label: 'Свій' },
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
    <div style={{ padding: '0 16px', marginBottom: 14 }}>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }} className="scrollbar-hide">
        {PRESETS.map(p => (
          <button key={p.key} onClick={() => onPreset(p.key)}
            style={{
              flexShrink: 0, padding: '6px 12px', borderRadius: 10,
              fontSize: '0.75rem', fontWeight: 500, border: 'none', cursor: 'pointer',
              background: preset === p.key ? 'var(--accent)' : 'var(--bg-raised)',
              color: preset === p.key ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.15s', minHeight: 'auto',
            }}>
            {p.label}
          </button>
        ))}
      </div>
      {preset === 'custom' && (
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <input type="date" value={customFrom} onChange={e => onCustomFrom(e.target.value)}
            style={{ flex: 1, background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px', color: '#fff', fontSize: '0.8125rem', outline: 'none' }} />
          <input type="date" value={customTo} onChange={e => onCustomTo(e.target.value)}
            style={{ flex: 1, background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px', color: '#fff', fontSize: '0.8125rem', outline: 'none' }} />
        </div>
      )}
    </div>
  )
}
