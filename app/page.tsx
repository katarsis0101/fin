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
    if (user && typeof window !== 'undefined') {
      const done = localStorage.getItem('fin_onboarding_done')
      if (!done) setShowOnboarding(true)
    }
  }, [user])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '2px solid #10b981', borderTopColor: 'transparent', borderRadius: '50%' }}
        className="animate-spin" />
    </div>
  )

  if (showOnboarding) return (
    <Onboarding onComplete={() => {
      setShowOnboarding(false)
      window.location.reload()
    }} />
  )

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
      <div className="app-content flex flex-col">

        {/* Display */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 min-h-[200px]">
          <div className="text-right w-full">
            <div className="text-5xl font-light text-white tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">
              {parseFloat(calc.display).toLocaleString('uk-UA', { maximumFractionDigits: 8 })}
            </div>
            <div className="text-sm mt-1" style={{ color: '#444' }}>₴ UAH</div>
          </div>
        </div>

        {/* Keypad */}
        <div className="px-3 pb-4">
          {KEYPAD.map((row, ri) => (
            <div key={ri} className="grid grid-cols-4 gap-2 mb-2">
              {row.map((key, ki) => {
                if (ri === 4 && ki === 0) {
                  return (
                    <button key="0-wide"
                      onClick={() => handleKey('0')}
                      className="calc-btn col-span-2"
                      style={{ background: '#1c1c1e', color: '#fff' }}>
                      0
                    </button>
                  )
                }
                if (ri === 4 && ki === 1) return null

                const isActiveOp = isOp(key) && calc.op === (key === '−' ? '-' : key)
                const bg = isActiveOp ? '#10b981'
                  : isOp(key) ? '#2a2a2a'
                  : isAction(key) ? '#2a2a2a'
                  : key === '⌫' ? '#2a2a2a'
                  : '#1c1c1e'
                const color = isActiveOp ? '#fff'
                  : isOp(key) ? '#10b981'
                  : isAction(key) ? '#aaa'
                  : key === '⌫' ? '#aaa'
                  : '#fff'

                return (
                  <button key={`${ri}-${ki}`}
                    onClick={() => handleKey(key)}
                    className="calc-btn"
                    style={{ background: bg, color }}>
                    {key === '⌫' ? <Delete size={20} /> : key}
                  </button>
                )
              })}
            </div>
          ))}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <button
              onClick={() => openSheet('expense')}
              style={{ padding: '16px', borderRadius: 16, background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer' }}>
              − Витрата
            </button>
            <button
              onClick={() => openSheet('income')}
              style={{ padding: '16px', borderRadius: 16, background: '#10b981', color: '#000', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer' }}>
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
