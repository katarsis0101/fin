'use client'
import type { GroupBy } from '@/lib/analytics'

const OPTIONS: { key: GroupBy; label: string }[] = [
  { key: 'day',   label: 'По днях' },
  { key: 'week',  label: 'По тижнях' },
  { key: 'month', label: 'По місяцях' },
  { key: 'year',  label: 'По роках' },
]

interface Props { value: GroupBy; onChange: (g: GroupBy) => void }

export default function GroupingSelector({ value, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '0 16px', marginBottom: 12, overflowX: 'auto' }} className="scrollbar-hide">
      {OPTIONS.map(o => (
        <button key={o.key} onClick={() => onChange(o.key)}
          style={{
            flexShrink: 0, padding: '5px 12px', borderRadius: 8,
            fontSize: '0.75rem', fontWeight: 500, border: 'none', cursor: 'pointer',
            background: value === o.key ? 'var(--bg-overlay)' : 'transparent',
            color: value === o.key ? '#fff' : 'var(--text-tertiary)',
            minHeight: 'auto', transition: 'all 0.15s',
          }}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
