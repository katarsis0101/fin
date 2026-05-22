'use client'
import type { GroupBy } from '@/lib/analytics'

const OPTIONS: { key: GroupBy; label: string }[] = [
  { key: 'day', label: 'По днях' },
  { key: 'week', label: 'По тижнях' },
  { key: 'month', label: 'По місяцях' },
  { key: 'year', label: 'По роках' },
]

interface Props { value: GroupBy; onChange: (g: GroupBy) => void }

export default function GroupingSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-2 px-4 mb-4 overflow-x-auto scrollbar-hide">
      {OPTIONS.map(o => (
        <button key={o.key} onClick={() => onChange(o.key)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            value === o.key ? 'bg-[#2a2a2a] text-white' : 'text-[#555]'
          }`}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
