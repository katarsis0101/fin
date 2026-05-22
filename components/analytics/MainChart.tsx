'use client'
import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { ChartPoint } from '@/lib/analytics'
import { formatUAH } from '@/lib/format'

type ChartType = 'bar' | 'line' | 'area'

interface Props { data: ChartPoint[] }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-mid)', borderRadius: 10, padding: '8px 12px', fontSize: '0.75rem' }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {formatUAH(p.value)}</p>
      ))}
    </div>
  )
}

export default function MainChart({ data }: Props) {
  const [chartType, setChartType] = useState<ChartType>('bar')

  const commonProps = { data, margin: { top: 4, right: 4, left: 0, bottom: 0 } }
  const axisProps = { tick: { fill: 'var(--text-muted)', fontSize: 10 }, axisLine: false, tickLine: false }

  return (
    <div style={{ padding: '0 16px', marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {(['bar', 'line', 'area'] as ChartType[]).map(t => (
          <button key={t} onClick={() => setChartType(t)}
            style={{
              padding: '4px 10px', borderRadius: 7, fontSize: '0.75rem', fontWeight: 500,
              border: 'none', cursor: 'pointer', minHeight: 'auto',
              background: chartType === t ? 'var(--accent)' : 'var(--bg-raised)',
              color: chartType === t ? '#fff' : 'var(--text-secondary)',
            }}>
            {t === 'bar' ? 'Стовпці' : t === 'line' ? 'Лінія' : 'Площина'}
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 12, height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="label" {...axisProps} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" name="Дохід" fill="var(--income-color)" radius={[3,3,0,0]} />
              <Bar dataKey="expense" name="Витрати" fill="var(--expense-color)" radius={[3,3,0,0]} />
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="label" {...axisProps} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="income" name="Дохід" stroke="var(--income-color)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expense" name="Витрати" stroke="var(--expense-color)" strokeWidth={2} dot={false} />
            </LineChart>
          ) : (
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="label" {...axisProps} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" name="Дохід" stroke="var(--income-color)" fill="var(--income-dim)" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" name="Витрати" stroke="var(--expense-color)" fill="var(--expense-dim)" strokeWidth={2} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
