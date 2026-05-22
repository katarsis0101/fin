'use client'
import { useState, useEffect } from 'react'
import { Drawer } from 'vaul'
import { X, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/categories'
import { ukDate, toISODate } from '@/lib/format'

interface Transaction {
  id: string; user_id: string; amount: number; type: 'income' | 'expense'
  category: string; category_id?: string; comment?: string
  created_at: string; file_url?: string
}

interface Props {
  tx: Transaction | null
  onClose: () => void
  onSaved: () => void
}

export default function TransactionModal({ tx, onClose, onSaved }: Props) {
  const [amount, setAmount] = useState('')
  const [comment, setComment] = useState('')
  const [date, setDate] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!tx) return
    setAmount(String(tx.amount))
    setComment(tx.comment || '')
    setDate(toISODate(new Date(tx.created_at)))
    setCategoryId(tx.category_id || '')
    setConfirmDelete(false)

    supabase.from('categories').select('*')
      .eq('user_id', tx.user_id)
      .eq('type', tx.type)
      .eq('is_archived', false)
      .order('sort_order')
      .then(({ data }) => setCategories(data || []))
  }, [tx?.id])

  async function handleSave() {
    if (!tx) return
    setSaving(true)
    await supabase.from('transactions').update({
      amount: parseFloat(amount),
      comment,
      created_at: new Date(date).toISOString(),
      category_id: categoryId,
      category: categories.find(c => c.id === categoryId)?.name || tx.category,
    }).eq('id', tx.id)
    setSaving(false)
    onSaved(); onClose()
  }

  async function handleDelete() {
    if (!tx) return
    await supabase.from('transactions').delete().eq('id', tx.id)
    onSaved(); onClose()
  }

  return (
    <Drawer.Root open={!!tx} onOpenChange={v => !v && onClose()} shouldScaleBackground>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-[#111] rounded-t-3xl max-h-[85vh] flex flex-col max-w-[480px] mx-auto">
          <div className="w-10 h-1 bg-[#333] rounded-full mx-auto mt-3 mb-4" />

          <div className="flex items-center justify-between px-5 mb-4">
            <h2 className="text-lg font-bold text-white">Редагувати</h2>
            <button onClick={onClose} className="p-2 text-[#666]"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 space-y-4">
            <div>
              <p className="text-[#666] text-xs mb-1.5 uppercase tracking-wider">Сума (₴)</p>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                className="w-full bg-[#1a1a1a] rounded-2xl px-4 py-3 text-white text-base focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>

            <div>
              <p className="text-[#666] text-xs mb-1.5 uppercase tracking-wider">Категорія</p>
              <div className="grid grid-cols-4 gap-2">
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => setCategoryId(cat.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-2xl ${
                      categoryId === cat.id ? 'bg-[#2a2a2a] ring-2 ring-emerald-500' : 'bg-[#1a1a1a]'
                    }`}>
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-[10px] text-[#aaa] text-center leading-tight">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[#666] text-xs mb-1.5 uppercase tracking-wider">Коментар</p>
              <input value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Необов'язково..."
                className="w-full bg-[#1a1a1a] rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>

            <div>
              <p className="text-[#666] text-xs mb-1.5 uppercase tracking-wider">Дата</p>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full bg-[#1a1a1a] rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
          </div>

          <div className="px-5 pb-6 pt-3 space-y-2">
            <button onClick={handleSave} disabled={saving}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white font-bold">
              {saving ? 'Збереження...' : 'Зберегти'}
            </button>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)}
                className="w-full py-3 rounded-2xl bg-[#1a1a1a] text-red-400 font-medium flex items-center justify-center gap-2">
                <Trash2 size={16} /> Видалити
              </button>
            ) : (
              <button onClick={handleDelete}
                className="w-full py-3 rounded-2xl bg-red-500 text-white font-bold">
                Підтвердити видалення
              </button>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
