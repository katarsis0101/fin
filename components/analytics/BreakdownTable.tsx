'use client'
import { formatUAH } from '@/lib/format'

interface Row { category: string; icon?: string; amount: number; count: number; percent: number }
interface Props { income: Row[]; expense: Row[] }

function Section({ rows, type }: { rows: Row[]; type: 'income' | 'expense' }) {
  const total = rows.reduce((s, r) => s + r.amount, 0)
  const totalCount = rows.reduce((s, r) => s + r.count, 0)
  if (!rows.length) return null

  const color = type === 'income' ? 'var(--income-color)' : 'var(--expense-color)'

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: '0 16px' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
        <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          {type === 'income' ? 'Доходи' : 'Витрати'}
        </span>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', margin: '0 16px', overflow: 'hidden' }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ fontSize: '1.1rem', width: 26, textAlign: 'center', flexShrink: 0 }}>{row.icon || '📦'}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 500, marginBottom: 3 }}>{row.category}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ height: 3, background: 'var(--bg-overlay)', borderRadius: 2, flex: 1 }}>
                  <div style={{ height: 3, borderRadius: 2, background: color, width: `${row.percent}%` }} />
                </div>
                <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', flexShrink: 0 }}>{row.percent.toFixed(0)}%</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color }}>{formatUAH(row.amount)}</div>
              <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>{row.count} оп.</div>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg-raised)' }}>
          <span style={{ fontSize: '1rem', width: 26, textAlign: 'center' }}>∑</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Разом</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color }}>{formatUAH(total)}</div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>{totalCount} оп.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BreakdownTable({ income, expense }: Props) {
  return (
    <div style={{ paddingBottom: 8 }}>
      <Section rows={expense} type="expense" />
      <Section rows={income} type="income" />
    </div>
  )
}
