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
import { getRangeForPreset, getPrevRangeForPreset, buildChartData } from '@/lib/analytics'
import type { Preset, GroupBy } from '@/lib/analytics'
import { toISODate } from '@/lib/format'

export default function DashboardPage() {
  const { user } = useAuth()
  const [preset, setPreset] = useState<Preset>('thisMonth')
  const [groupBy, setGroupBy] = useState<GroupBy>('day')
  const [customFrom, setCustomFrom] = useState(toISODate(new Date()))
  const [customTo, setCustomTo] = useState(toISODate(new Date()))
  const [transactions, setTransactions] = useState<any[]>([])
  const [prevTransactions, setPrevTransactions] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    if (!user) return
    const { from, to } = getRangeForPreset(preset, new Date(customFrom), new Date(customTo))

    supabase.from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', from.toISOString())
      .lte('created_at', to.toISOString())
      .order('created_at', { ascending: true })
      .then(({ data }) => setTransactions(data || []))

    const prevRange = getPrevRangeForPreset(preset, new Date(customFrom), new Date(customTo))
    if (prevRange) {
      supabase.from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', prevRange.from.toISOString())
        .lte('created_at', prevRange.to.toISOString())
        .then(({ data }) => setPrevTransactions(data || []))
    } else {
      setPrevTransactions([])
    }

    supabase.from('categories').select('*').eq('user_id', user.id)
      .then(({ data }) => setCategories(data || []))
  }, [user, preset, customFrom, customTo])

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const prevIncome = prevTransactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const prevExpense = prevTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const showDelta = !['allTime', 'custom'].includes(preset)

  const { from, to } = getRangeForPreset(preset, new Date(customFrom), new Date(customTo))
  const chartData = buildChartData(transactions, from, to, groupBy)

  // Breakdown
  const catMap = Object.fromEntries(categories.map(c => [c.id, c]))
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
    return Object.entries(byCategory)
      .map(([category, { amount, count }]) => {
        const cat = categories.find(c => c.name === category)
        return { category, icon: cat?.icon, amount, count, percent: total ? (amount / total) * 100 : 0 }
      })
      .sort((a, b) => b.amount - a.amount)
  }

  return (
    <div className="app-shell">
      <div className="app-content">
        <div className="px-4 pt-6 pb-3">
          <h1 className="text-xl font-bold text-white">Аналітика</h1>
        </div>

        <DateRangePicker
          preset={preset} onPreset={setPreset}
          customFrom={customFrom} customTo={customTo}
          onCustomFrom={setCustomFrom} onCustomTo={setCustomTo}
        />

        <SummaryCards
          income={income} expense={expense}
          prevIncome={prevIncome} prevExpense={prevExpense}
          showDelta={showDelta}
        />

        <GroupingSelector value={groupBy} onChange={setGroupBy} />

        <MainChart data={chartData} />

        <BreakdownTable expense={buildBreakdown('expense')} income={buildBreakdown('income')} />
      </div>
      <Navbar />
    </div>
  )
}
