'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useCalculator } from '@/hooks/useCalculator'
import Navbar from '@/components/Navbar'
import AddTransactionSheet from '@/components/AddTransactionSheet'
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

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  function openSheet(type: TransactionType) {
    const val = calc.evaluate()
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

  const isOp = (k: string) => ['÷','×','−','+'].includes(k)
  const isAction = (k: string) => ['C','±','%'].includes(k)

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
            <div className="text-[#444] text-sm mt-1">₴ UAH</div>
          </div>
        </div>

        {/* Keypad */}
        <div className="px-3 pb-4">
          {KEYPAD.map((row, ri) => (
            <div key={ri} className="grid grid-cols-4 gap-2 mb-2">
              {row.map((key, ki) => {
                // '0' appears twice in last row → span 2 on first occurrence
                if (ri === 4 && ki === 0) {
                  return (
                    <button key="0-wide"
                      onClick={() => handleKey('0')}
                      className="calc-btn col-span-2 bg-[#1c1c1e] text-white">
                      0
                    </button>
                  )
                }
                if (ri === 4 && ki === 1) return null // skip duplicate 0

                const bg = isOp(key) && calc.op === (key === '−' ? '-' : key)
                  ? 'bg-emerald-500 text-white'
                  : isOp(key) ? 'bg-[#2a2a2a] text-emerald-400'
                  : isAction(key) ? 'bg-[#2a2a2a] text-[#aaa]'
                  : key === '⌫' ? 'bg-[#2a2a2a] text-[#aaa]'
                  : 'bg-[#1c1c1e] text-white'

                return (
                  <button key={`${ri}-${ki}`}
                    onClick={() => handleKey(key)}
                    className={`calc-btn ${bg}`}>
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
              className="py-4 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-bold text-base transition-colors">
              − Витрата
            </button>
            <button
              onClick={() => openSheet('income')}
              className="py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-base transition-colors">
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
