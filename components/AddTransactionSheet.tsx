'use client'
import { useState, useEffect } from 'react'
import { Drawer } from 'vaul'
import { X, Camera } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/categories'
import { toISODate } from '@/lib/format'

type TransactionType = 'income' | 'expense'

interface Props {
  open: boolean
  onClose: () => void
  onSaved: () => void
  userId: string
  amount: number
  initialType?: TransactionType
}

export default function AddTransactionSheet({ open, onClose, onSaved, userId, amount, initialType = 'expense' }: Props) {
  const [type, setType] = useState<TransactionType>(initialType)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [comment, setComment] = useState('')
  const [date, setDate] = useState(toISODate(new Date()))
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (open) {
      setType(initialType)
      setComment('')
      setSelectedCategory('')
      setDate(toISODate(new Date()))
    }
  }, [open, initialType])

  useEffect(() => {
    if (!userId) return
    supabase.from('categories')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .eq('is_archived', false)
      .order('sort_order')
      .then(({ data }) => {
        setCategories(data || [])
        setSelectedCategory('')
      })
  }, [userId, type])

  async function handleSave() {
    if (!selectedCategory || amount <= 0) return
    setSaving(true)
    const cat = categories.find(c => c.id === selectedCategory)
    await supabase.from('transactions').insert({
      user_id: userId,
      amount,
      type,
      category: cat?.name || '',
      category_id: selectedCategory,
      comment,
      created_at: new Date(date).toISOString(),
    })
    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <Drawer.Root open={open} onOpenChange={v => !v && onClose()} shouldScaleBackground>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-[#111] rounded-t-3xl max-h-[85vh] flex flex-col max-w-[480px] mx-auto">
          <div className="w-10 h-1 bg-[#333] rounded-full mx-auto mt-3 mb-4" />

          {/* Header */}
          <div className="flex items-center justify-between px-5 mb-4">
            <div className="text-2xl font-bold text-white">
              {amount > 0 ? `${amount.toLocaleString('uk-UA')} ₴` : 'Введіть суму'}
            </div>
            <button onClick={onClose} className="p-2 text-[#666] hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Type toggle */}
          <div className="flex mx-5 mb-4 bg-[#1a1a1a] rounded-2xl p-1">
            {(['expense', 'income'] as const).map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  type === t
                    ? t === 'expense' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                    : 'text-[#666]'
                }`}>
                {t === 'expense' ? 'Витрата' : 'Дохід'}
              </button>
            ))}
          </div>

          {/* Categories */}
          <div className="flex-1 overflow-y-auto px-5">
            <p className="text-[#666] text-xs font-medium mb-2 uppercase tracking-wider">Категорія</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-colors ${
                    selectedCategory === cat.id ? 'bg-[#2a2a2a] ring-2 ring-emerald-500' : 'bg-[#1a1a1a]'
                  }`}>
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-[10px] text-[#aaa] text-center leading-tight">{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Comment */}
            <p className="text-[#666] text-xs font-medium mb-2 uppercase tracking-wider">Коментар</p>
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Необов'язково..."
              className="w-full bg-[#1a1a1a] rounded-2xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:ring-1 focus:ring-emerald-500 mb-4 text-sm"
            />

            {/* Date */}
            <p className="text-[#666] text-xs font-medium mb-2 uppercase tracking-wider">Дата</p>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-[#1a1a1a] rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 mb-6 text-sm"
            />
          </div>

          {/* Save */}
          <div className="px-5 pb-6 pt-2">
            <button
              onClick={handleSave}
              disabled={!selectedCategory || amount <= 0 || saving}
              className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-colors disabled:opacity-40 ${
                type === 'expense' ? 'bg-red-500 hover:bg-red-400' : 'bg-emerald-500 hover:bg-emerald-400'
              }`}>
              {saving ? 'Збереження...' : type === 'expense' ? 'Додати витрату' : 'Додати дохід'}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
