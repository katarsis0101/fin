'use client'
import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { ChartPoint } from '@/lib/analytics'
import { formatUAH } from '@/lib/format'

type ChartType = 'bar' | 'line' | 'area'

interface Props { data: ChartPoint[] }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 text-xs">
      <p className="text-[#888] mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {formatUAH(p.value)}</p>
      ))}
    </div>
  )
}

export default function MainChart({ data }: Props) {
  const [chartType, setChartType] = useState<ChartType>('bar')

  const commonProps = {
    data,
    margin: { top: 4, right: 4, left: 0, bottom: 0 },
  }

  return (
    <div className="px-4 mb-4">
      {/* Type switch */}
      <div className="flex gap-2 mb-3">
        {(['bar', 'line', 'area'] as ChartType[]).map(t => (
          <button key={t} onClick={() => setChartType(t)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              chartType === t ? 'bg-emerald-500 text-white' : 'bg-[#1a1a1a] text-[#666]'
            }`}>
            {t === 'bar' ? 'Стовпці' : t === 'line' ? 'Лінія' : 'Площина'}
          </button>
        ))}
      </div>

      <div className="bg-[#111] rounded-2xl p-3" style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis dataKey="label" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" name="Дохід" fill="#10b981" radius={[4,4,0,0]} />
              <Bar dataKey="expense" name="Витрати" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis dataKey="label" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="income" name="Дохід" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expense" name="Витрати" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          ) : (
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis dataKey="label" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" name="Дохід" stroke="#10b981" fill="#10b98120" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" name="Витрати" stroke="#ef4444" fill="#ef444420" strokeWidth={2} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
