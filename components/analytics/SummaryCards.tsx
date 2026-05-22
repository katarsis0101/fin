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

function Delta({ curr, prev, invert }: { curr: number; prev: number; invert?: boolean }) {
  if (!prev) return null
  const pct = ((curr - prev) / prev) * 100
  const positive = invert ? pct <= 0 : pct >= 0
  return (
    <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: positive ? 'var(--income-color)' : 'var(--expense-color)' }}>
      {pct >= 0 ? '↑' : '↓'} {Math.abs(pct).toFixed(1)}%
    </span>
  )
}

const card: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  padding: '12px 14px',
  display: 'flex', flexDirection: 'column', gap: 2,
}

export default function SummaryCards({ income, expense, prevIncome, prevExpense, showDelta }: Props) {
  const balance = income - expense
  const margin = income > 0 ? ((income - expense) / income) * 100 : null
  const marginColor = margin === null ? 'var(--text-muted)' : margin >= 50 ? 'var(--income-color)' : margin >= 20 ? '#f59e0b' : margin >= 0 ? '#f97316' : 'var(--expense-color)'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '0 16px', marginBottom: 12 }}>
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
          <TrendingUp size={11} color="var(--income-color)" />
          <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Дохід</span>
        </div>
        <div style={{ color: 'var(--income-color)', fontWeight: 700, fontSize: '0.9rem' }}>{formatUAH(income)}</div>
        {showDelta && prevIncome !== undefined && <Delta curr={income} prev={prevIncome} />}
      </div>

      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
          <TrendingDown size={11} color="var(--expense-color)" />
          <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Витрати</span>
        </div>
        <div style={{ color: 'var(--expense-color)', fontWeight: 700, fontSize: '0.9rem' }}>{formatUAH(expense)}</div>
        {showDelta && prevExpense !== undefined && <Delta curr={expense} prev={prevExpense} invert />}
      </div>

      <div style={card}>
        <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>Баланс</span>
        <div style={{ color: balance >= 0 ? '#fff' : 'var(--expense-color)', fontWeight: 700, fontSize: '0.9rem' }}>{formatUAH(balance)}</div>
      </div>

      <div style={card}>
        <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>Маржа</span>
        {margin === null ? (
          <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem' }}>—</span>
        ) : (
          <span style={{ color: marginColor, fontWeight: 700, fontSize: '0.9rem' }}>
            {margin >= 0 ? '+' : ''}{margin.toFixed(1)}%
          </span>
        )}
        <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>від доходу</span>
      </div>
    </div>
  )
}
