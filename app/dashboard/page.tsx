'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import Navbar from '@/components/Navbar'
import DateRangePicker from '@/components/analytics/DateRangePicker'
import SummaryCards from '@/components/analytics/SummaryCards'
import GroupingSelector from '@/components/analytics/GroupingSelector'
import MainChart from '@/components/analytics/MainChart'
import BreakdownTable from '@/components/analytics/BreakdownTable'
import { getRangeForPreset, getPrevRangeForPreset, buildChartData, getDefaultGroupBy } from '@/lib/analytics'
import type { Preset, GroupBy } from '@/lib/analytics'
import { toISODate } from '@/lib/format'
import { loadAnalyticsState, saveAnalyticsState } from '@/lib/analyticsState'

export default function DashboardPage() {
  const { user } = useAuth()
  const supabase = createClient()

  const init = typeof window !== 'undefined' ? loadAnalyticsState() : { preset: 'thisMonth' as Preset, groupBy: 'day' as GroupBy }
  const [preset, setPreset] = useState<Preset>(init.preset)
  const [groupBy, setGroupBy] = useState<GroupBy>(init.groupBy)
  const [customFrom, setCustomFrom] = useState(toISODate(new Date()))
  const [customTo, setCustomTo] = useState(toISODate(new Date()))
  const [transactions, setTransactions] = useState<any[]>([])
  const [prevTransactions, setPrevTransactions] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  function handlePreset(p: Preset) {
    setPreset(p)
    const { from, to } = getRangeForPreset(p, new Date(customFrom), new Date(customTo))
    const auto = getDefaultGroupBy(from, to)
    setGroupBy(auto)
    saveAnalyticsState({ preset: p, groupBy: auto })
  }

  function handleGroupBy(g: GroupBy) {
    setGroupBy(g)
    saveAnalyticsState({ groupBy: g })
  }

  useEffect(() => {
    if (!user) return
    const { from, to } = getRangeForPreset(preset, new Date(customFrom), new Date(customTo))

    let q = supabase.from('transactions').select('*').eq('user_id', user.id)
    if (from) q = q.gte('created_at', from.toISOString())
    if (to)   q = q.lte('created_at', to.toISOString())
    q.order('created_at', { ascending: true })
      .then(({ data }) => setTransactions(data || []))

    const prevRange = getPrevRangeForPreset(preset, new Date(customFrom), new Date(customTo))
    if (prevRange) {
      supabase.from('transactions').select('*').eq('user_id', user.id)
        .gte('created_at', prevRange.from.toISOString())
        .lte('created_at', prevRange.to.toISOString())
        .then(({ data }) => setPrevTransactions(data || []))
    } else {
      setPrevTransactions([])
    }

    supabase.from('categories').select('*').eq('user_id', user.id)
      .then(({ data }) => setCategories(data || []))
  }, [user, preset, customFrom, customTo])

  const income  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const prevIncome  = prevTransactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const prevExpense = prevTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const showDelta = !['allTime', 'custom'].includes(preset)

  const { from, to } = getRangeForPreset(preset, new Date(customFrom), new Date(customTo))
  const chartData = buildChartData(transactions, from, to, groupBy)

  function buildBreakdown(type: 'income' | 'expense') {
    const txs = transactions.filter(t => t.type === type)
    const total = txs.reduce((s, t) => s + Number(t.amount), 0)
    const byCategory: Record<string, { amount: number; count: number }> = {}
    txs.forEach(t => {
      const key = t.category || 'Інше'
      if (!byCategory[key]) byCategory[key] = { amount: 0, count: 0 }
      byCategory[key].amount += Number(t.amount)
      byCategory[key].count++
    })
    return Object.entries(byCategory).map(([category, { amount, count }]) => {
      const cat = categories.find((c: any) => c.name === category)
      return { category, icon: cat?.icon, amount, count, percent: total ? (amount / total) * 100 : 0 }
    }).sort((a, b) => b.amount - a.amount)
  }

  return (
    <div className="app-shell">
      <div className="app-content">
        <div style={{ padding: '16px 16px 12px' }}>
          <h1 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Аналітика</h1>
        </div>

        <DateRangePicker
          preset={preset} onPreset={handlePreset}
          customFrom={customFrom} customTo={customTo}
          onCustomFrom={setCustomFrom} onCustomTo={setCustomTo}
        />

        <SummaryCards
          income={income} expense={expense}
          prevIncome={prevIncome} prevExpense={prevExpense}
          showDelta={showDelta}
        />

        <GroupingSelector value={groupBy} onChange={handleGroupBy} />

        <MainChart data={chartData} />

        <BreakdownTable expense={buildBreakdown('expense')} income={buildBreakdown('income')} />
      </div>
      <Navbar />
    </div>
  )
}
