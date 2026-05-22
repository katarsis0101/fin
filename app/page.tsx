'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useCalculator } from '@/hooks/useCalculator'
import Navbar from '@/components/Navbar'
import AddTransactionSheet from '@/components/AddTransactionSheet'
import Onboarding from '@/components/Onboarding'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import { Delete } from 'lucide-react'

type TransactionType = 'income' | 'expense'

const KEYPAD = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '0', '.', '⌫'],
]

export default function HomePage() {
  const { user, loading } = useAuth()
  const calc = useCalculator()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetType, setSheetType] = useState<TransactionType>('expense')
  const [refreshKey, setRefreshKey] = useState(0)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (!loading && user && typeof window !== 'undefined') {
      if (!localStorage.getItem('fin_onboarding_done')) {
        setShowOnboarding(true)
      }
    }
  }, [loading, user])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
    </div>
  )

  if (showOnboarding) return <Onboarding onComplete={() => setShowOnboarding(false)} />

  function openSheet(type: TransactionType) {
    calc.evaluate()
    setSheetType(type)
    setSheetOpen(true)
  }

  function handleKey(key: string) {
    if (key === 'C') { calc.clear(); return }
    if (key === '±') { calc.toggleSign(); return }
    if (key === '%') { calc.percent(); return }
    if (key === '⌫') { calc.backspace(); return }
    if (key === '÷') { calc.pressOp('÷'); return }
    if (key === '×') { calc.pressOp('×'); return }
    if (key === '−') { calc.pressOp('-'); return }
    if (key === '+') { calc.pressOp('+'); return }
    if (key === '.') { calc.pressDigit('.'); return }
    calc.pressDigit(key)
  }

  const isOp = (k: string) => ['÷', '×', '−', '+'].includes(k)
  const isAction = (k: string) => ['C', '±', '%'].includes(k)

  return (
    <div className="app-shell">
      <ServiceWorkerRegistration />
      <div className="app-content" style={{ display: 'flex', flexDirection: 'column' }}>

        {/* Display */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', minHeight: 200 }}>
          <div style={{ textAlign: 'right', width: '100%' }}>
            <div style={{ fontSize: '3rem', fontWeight: 300, color: '#fff', letterSpacing: '-0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {parseFloat(calc.display).toLocaleString('uk-UA', { maximumFractionDigits: 8 })}
            </div>
            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginTop: 4 }}>₴ UAH</div>
          </div>
        </div>

        {/* Keypad */}
        <div style={{ padding: '0 12px 16px' }}>
          {KEYPAD.map((row, ri) => (
            <div key={ri} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 8 }}>
              {row.map((key, ki) => {
                if (ri === 4 && ki === 0) {
                  return (
                    <button key="0-wide" onClick={() => handleKey('0')}
                      className="calc-btn" style={{ gridColumn: 'span 2', background: 'var(--bg-raised)', color: '#fff' }}>
                      0
                    </button>
                  )
                }
                if (ri === 4 && ki === 1) return null

                const isActiveOp = isOp(key) && calc.op === (key === '−' ? '-' : key)
                const bg = isActiveOp ? 'var(--accent)'
                  : isOp(key) ? 'var(--bg-overlay)'
                  : isAction(key) ? 'var(--bg-overlay)'
                  : key === '⌫' ? 'var(--bg-overlay)'
                  : 'var(--bg-raised)'
                const color = isActiveOp ? '#fff'
                  : isOp(key) ? 'var(--accent)'
                  : isAction(key) ? 'var(--text-secondary)'
                  : key === '⌫' ? 'var(--text-secondary)'
                  : '#fff'

                return (
                  <button key={`${ri}-${ki}`} onClick={() => handleKey(key)}
                    className="calc-btn" style={{ background: bg, color }}>
                    {key === '⌫' ? <Delete size={20} /> : key}
                  </button>
                )
              })}
            </div>
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
            <button onClick={() => openSheet('expense')}
              style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--expense-color)', color: '#fff', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer' }}>
              − Витрата
            </button>
            <button onClick={() => openSheet('income')}
              style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--accent)', color: '#000', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer' }}>
              + Дохід
            </button>
          </div>
        </div>
      </div>

      <Navbar />

      <AddTransactionSheet
        open={sheetOpen}
        onClose={() => { setSheetOpen(false); calc.reset() }}
        onSaved={() => { setRefreshKey(k => k + 1); calc.reset() }}
        userId={user?.id ?? ''}
        amount={parseFloat(calc.display) || 0}
        initialType={sheetType}
      />
    </div>
  )
}
