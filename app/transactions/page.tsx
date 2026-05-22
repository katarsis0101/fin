'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import Navbar from '@/components/Navbar'
import TransactionModal from '@/components/TransactionModal'
import { ukDate, formatUAH } from '@/lib/format'

export default function TransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const supabase = createClient()

  async function load() {
    if (!user) return
    setLoading(true)
    const [{ data: txs }, { data: cats }] = await Promise.all([
      supabase.from('transactions').select('*').eq('user_id', user.id)
        .order('created_at', { ascending: false }).limit(200),
      supabase.from('categories').select('*').eq('user_id', user.id),
    ])
    setTransactions(txs || [])
    setCategories(cats || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [user])

  const catMap = Object.fromEntries((categories || []).map(c => [c.name, c]))

  // Group by date
  const grouped: Record<string, any[]> = {}
  transactions.forEach(tx => {
    const d = ukDate(tx.created_at)
    if (!grouped[d]) grouped[d] = []
    grouped[d].push(tx)
  })

  return (
    <div className="app-shell">
      <div className="app-content">
        <div className="px-4 pt-6 pb-3">
          <h1 className="text-xl font-bold text-white">Рух коштів</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16 text-[#444]">
            <div className="text-4xl mb-3">💸</div>
            <p>Транзакцій ще немає</p>
          </div>
        ) : (
          <div className="px-4 space-y-4 pb-4">
            {Object.entries(grouped).map(([date, txs]) => (
              <div key={date}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#555] font-medium">{date}</span>
                  <span className="text-xs text-[#444]">
                    {(() => {
                      const net = txs.reduce((s, t) => s + (t.type === 'income' ? 1 : -1) * Number(t.amount), 0)
                      return (net >= 0 ? '+' : '') + formatUAH(net)
                    })()}
                  </span>
                </div>
                <div className="bg-[#111] rounded-2xl overflow-hidden">
                  {txs.map((tx, i) => {
                    const cat = catMap[tx.category]
                    return (
                      <button key={tx.id} onClick={() => setSelected(tx)}
                        className="w-full flex items-center gap-3 px-4 py-3 border-b border-[#1a1a1a] last:border-0 hover:bg-[#1a1a1a] transition-colors text-left">
                        <span className="text-xl w-8 text-center">{cat?.icon || '📦'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium">{tx.category || 'Без категорії'}</div>
                          {tx.comment && <div className="text-[#555] text-xs truncate">{tx.comment}</div>}
                        </div>
                        <div className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {tx.type === 'income' ? '+' : '-'}{formatUAH(Number(tx.amount))}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Navbar />

      <TransactionModal
        tx={selected}
        onClose={() => setSelected(null)}
        onSaved={load}
      />
    </div>
  )
}
