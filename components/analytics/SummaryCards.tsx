'use client'
import { formatUAH } from '@/lib/format'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface Props {
  income: number
  expense: number
  prevIncome?: number
  prevExpense?: number
  showDelta?: boolean
}

function Delta({ curr, prev }: { curr: number; prev: number }) {
  if (!prev) return null
  const pct = ((curr - prev) / prev) * 100
  const up = pct >= 0
  return (
    <span className={`text-xs font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
      {up ? '+' : ''}{pct.toFixed(1)}%
    </span>
  )
}

export default function SummaryCards({ income, expense, prevIncome, prevExpense, showDelta }: Props) {
  const balance = income - expense

  return (
    <div className="grid grid-cols-3 gap-2 px-4 mb-4">
      <div className="bg-[#1a1a1a] rounded-2xl p-3">
        <div className="flex items-center gap-1 mb-1">
          <TrendingUp size={12} className="text-emerald-400" />
          <span className="text-[10px] text-[#666] uppercase tracking-wider">Дохід</span>
        </div>
        <div className="text-emerald-400 font-bold text-sm">{formatUAH(income)}</div>
        {showDelta && prevIncome !== undefined && <Delta curr={income} prev={prevIncome} />}
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl p-3">
        <div className="flex items-center gap-1 mb-1">
          <TrendingDown size={12} className="text-red-400" />
          <span className="text-[10px] text-[#666] uppercase tracking-wider">Витрати</span>
        </div>
        <div className="text-red-400 font-bold text-sm">{formatUAH(expense)}</div>
        {showDelta && prevExpense !== undefined && <Delta curr={expense} prev={prevExpense} />}
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl p-3">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[10px] text-[#666] uppercase tracking-wider">Баланс</span>
        </div>
        <div className={`font-bold text-sm ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>
          {formatUAH(balance)}
        </div>
      </div>
    </div>
  )
}
