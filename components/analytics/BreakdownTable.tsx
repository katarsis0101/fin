'use client'
import { formatUAH } from '@/lib/format'

interface Row { category: string; icon?: string; amount: number; count: number; percent: number }

interface Props {
  income: Row[]
  expense: Row[]
}

function Section({ rows, type }: { rows: Row[]; type: 'income' | 'expense' }) {
  const total = rows.reduce((s, r) => s + r.amount, 0)
  const totalCount = rows.reduce((s, r) => s + r.count, 0)

  if (!rows.length) return null

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2 px-4">
        <div className={`w-2 h-2 rounded-full ${type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`} />
        <span className="text-xs text-[#666] uppercase tracking-wider font-medium">
          {type === 'income' ? 'Доходи' : 'Витрати'}
        </span>
      </div>
      <div className="bg-[#111] rounded-2xl mx-4 overflow-hidden">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-[#1a1a1a] last:border-0">
            <span className="text-lg w-7 text-center">{row.icon || '📦'}</span>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium">{row.category}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="h-1 bg-[#2a2a2a] rounded-full flex-1">
                  <div className={`h-1 rounded-full ${type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${row.percent}%` }} />
                </div>
                <span className="text-[10px] text-[#555]">{row.percent.toFixed(0)}%</span>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-semibold ${type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatUAH(row.amount)}
              </div>
              <div className="text-[10px] text-[#555]">{row.count} оп.</div>
            </div>
          </div>
        ))}
        {/* Разом */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a]">
          <span className="text-lg w-7 text-center">∑</span>
          <div className="flex-1">
            <div className="text-[#888] text-sm font-medium">Разом</div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-bold ${type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatUAH(total)}
            </div>
            <div className="text-[10px] text-[#555]">{totalCount} оп.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BreakdownTable({ income, expense }: Props) {
  return (
    <div>
      <Section rows={expense} type="expense" />
      <Section rows={income} type="income" />
    </div>
  )
}
