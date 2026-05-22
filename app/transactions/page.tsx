'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import Navbar from '@/components/Navbar'
import TransactionModal from '@/components/TransactionModal'
import { ukDate, formatUAH } from '@/lib/format'

const PAGE_SIZE = 20

export default function TransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [selected, setSelected] = useState<any | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const supabase = createClient()

  async function load(reset = false) {
    if (!user) return
    setLoading(true)
    const offset = reset ? 0 : page * PAGE_SIZE
    const [{ data: txs }, { data: cats }] = await Promise.all([
      supabase.from('transactions').select('*').eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1),
      supabase.from('categories').select('*').eq('user_id', user.id),
    ])
    const newTxs = txs || []
    setTransactions(prev => reset ? newTxs : [...prev, ...newTxs])
    setCategories(cats || [])
    setHasMore(newTxs.length === PAGE_SIZE)
    if (reset) setPage(1)
    else setPage(p => p + 1)
    setLoading(false)
  }

  useEffect(() => { load(true) }, [user])

  const catMap = Object.fromEntries((categories || []).map((c: any) => [c.name, c]))

  const grouped: Record<string, any[]> = {}
  transactions.forEach(tx => {
    const d = ukDate(tx.created_at)
    if (!grouped[d]) grouped[d] = []
    grouped[d].push(tx)
  })

  return (
    <div className="app-shell">
      <div className="app-content">
        <div style={{ padding: '16px 16px 12px' }}>
          <h1 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Рух коштів</h1>
        </div>

        {loading && transactions.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
            <div style={{ width: 28, height: 28, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>💸</div>
            <p style={{ fontSize: '0.9375rem' }}>Транзакцій ще немає</p>
          </div>
        ) : (
          <div style={{ padding: '0 16px' }}>
            {Object.entries(grouped).map(([date, txs]) => {
              const net = txs.reduce((s: number, t: any) => s + (t.type === 'income' ? 1 : -1) * Number(t.amount), 0)
              return (
                <div key={date} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, padding: '0 2px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{date}</span>
                    <span style={{ fontSize: '0.75rem', color: net >= 0 ? 'var(--income-color)' : 'var(--expense-color)', fontWeight: 600 }}>
                      {net >= 0 ? '+' : ''}{formatUAH(net)}
                    </span>
                  </div>
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    {txs.map((tx: any, i: number) => {
                      const cat = catMap[tx.category]
                      return (
                        <button key={tx.id} onClick={() => setSelected(tx)}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                            padding: '11px 14px', borderBottom: i < txs.length - 1 ? '1px solid var(--border)' : 'none',
                            background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                            transition: 'background 0.1s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-raised)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                          <span style={{ fontSize: '1.25rem', width: 28, textAlign: 'center', flexShrink: 0 }}>{cat?.icon || '📦'}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 500 }}>{tx.category || 'Без категорії'}</div>
                            {tx.comment && <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.comment}</div>}
                          </div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, flexShrink: 0, color: tx.type === 'income' ? 'var(--income-color)' : 'var(--expense-color)' }}>
                            {tx.type === 'income' ? '+' : '−'}{formatUAH(Number(tx.amount))}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {hasMore && (
              <button onClick={() => load()}
                disabled={loading}
                style={{
                  width: '100%', padding: '12px', background: 'var(--bg-raised)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '0.875rem',
                  cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 8,
                }}>
                {loading ? 'Завантаження...' : 'Завантажити ще'}
              </button>
            )}
          </div>
        )}
      </div>

      <Navbar />

      <TransactionModal tx={selected} onClose={() => setSelected(null)} onSaved={() => load(true)} />
    </div>
  )
}
