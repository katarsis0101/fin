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
    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: up ? '#10b981' : '#ef4444' }}>
      {up ? '+' : ''}{pct.toFixed(1)}%
    </span>
  )
}

const cardStyle: React.CSSProperties = {
  background: '#1a1a1a',
  borderRadius: 16,
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
}

export default function SummaryCards({ income, expense, prevIncome, prevExpense, showDelta }: Props) {
  const balance = income - expense
  const margin = income > 0 ? ((income - expense) / income) * 100 : null

  const marginColor =
    margin === null  ? '#555' :
    margin >= 50     ? '#10b981' :
    margin >= 20     ? '#f59e0b' :
    margin >= 0      ? '#f97316' :
                       '#ef4444'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '0 16px', marginBottom: 12 }}>
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
          <TrendingUp size={12} color="#10b981" />
          <span style={{ fontSize: '0.625rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Дохід</span>
        </div>
        <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>{formatUAH(income)}</div>
        {showDelta && prevIncome !== undefined && <Delta curr={income} prev={prevIncome} />}
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
          <TrendingDown size={12} color="#ef4444" />
          <span style={{ fontSize: '0.625rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Витрати</span>
        </div>
        <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>{formatUAH(expense)}</div>
        {showDelta && prevExpense !== undefined && <Delta curr={expense} prev={prevExpense} />}
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
          <span style={{ fontSize: '0.625rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Баланс</span>
        </div>
        <div style={{ color: balance >= 0 ? '#fff' : '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>
          {formatUAH(balance)}
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
          <span style={{ fontSize: '0.625rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Маржа</span>
        </div>
        {margin === null ? (
          <span style={{ color: '#555', fontWeight: 700, fontSize: '0.9rem' }}>—</span>
        ) : (
          <span style={{ color: marginColor, fontWeight: 700, fontSize: '0.9rem' }}>
            {margin >= 0 ? '+' : ''}{margin.toFixed(1)}%
          </span>
        )}
        <span style={{ fontSize: '0.6875rem', color: '#555' }}>від доходу</span>
      </div>
    </div>
  )
}
