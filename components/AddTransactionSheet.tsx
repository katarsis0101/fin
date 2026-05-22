'use client'
import { useState, useEffect } from 'react'
import { Drawer } from 'vaul'
import { X } from 'lucide-react'
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
  }, [userId, type, open])

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
        <Drawer.Overlay style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }} />
        <Drawer.Content style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          background: '#111', borderRadius: '24px 24px 0 0',
          maxHeight: '85vh', display: 'flex', flexDirection: 'column',
          maxWidth: 480, margin: '0 auto',
        }}>
          <div style={{ width: 40, height: 4, background: '#333', borderRadius: 2, margin: '12px auto 16px' }} />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 12 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
              {amount > 0 ? `${amount.toLocaleString('uk-UA')} ₴` : 'Введіть суму'}
            </div>
            <button onClick={onClose} style={{ padding: 8, color: '#666', background: 'none', border: 'none', cursor: 'pointer', minHeight: 'auto' }}>
              <X size={20} />
            </button>
          </div>

          {/* Type toggle */}
          <div style={{ display: 'flex', margin: '0 20px', marginBottom: 12, background: '#1a1a1a', borderRadius: 16, padding: 4 }}>
            {(['expense', 'income'] as const).map(t => (
              <button key={t} onClick={() => setType(t)}
                style={{
                  flex: 1, padding: '8px', borderRadius: 12, fontSize: '0.875rem',
                  fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                  background: type === t ? (t === 'expense' ? '#ef4444' : '#10b981') : 'transparent',
                  color: type === t ? (t === 'expense' ? '#fff' : '#000') : '#666',
                  minHeight: 'auto',
                }}>
                {t === 'expense' ? 'Витрата' : 'Дохід'}
              </button>
            ))}
          </div>

          {/* Categories */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
            <p style={{ color: '#666', fontSize: '0.75rem', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Категорія
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 12 }}>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '8px 4px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: selectedCategory === cat.id ? '#2a2a2a' : '#1a1a1a',
                    outline: selectedCategory === cat.id ? '2px solid #10b981' : 'none',
                    transition: 'all 0.12s', minHeight: 'auto',
                  }}>
                  <span style={{ fontSize: '1.125rem' }}>{cat.icon}</span>
                  <span style={{ fontSize: '0.6875rem', color: '#aaa', textAlign: 'center', lineHeight: 1.2 }}>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Comment */}
            <p style={{ color: '#666', fontSize: '0.75rem', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Коментар
            </p>
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Необов'язково..."
              style={{
                width: '100%', background: '#1a1a1a', borderRadius: 16, padding: '12px 16px',
                color: '#fff', fontSize: '0.875rem', outline: 'none', border: '1px solid transparent',
                marginBottom: 12,
              }}
            />

            {/* Date */}
            <p style={{ color: '#666', fontSize: '0.75rem', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Дата
            </p>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{
                width: '100%', background: '#1a1a1a', borderRadius: 16, padding: '12px 16px',
                color: '#fff', fontSize: '0.875rem', outline: 'none', border: '1px solid transparent',
                marginBottom: 20,
              }}
            />
          </div>

          {/* Save */}
          <div style={{ padding: '8px 20px 24px' }}>
            <button
              onClick={handleSave}
              disabled={!selectedCategory || amount <= 0 || saving}
              style={{
                width: '100%', padding: '16px', borderRadius: 16, fontWeight: 700,
                fontSize: '1rem', border: 'none', cursor: !selectedCategory || amount <= 0 || saving ? 'not-allowed' : 'pointer',
                opacity: !selectedCategory || amount <= 0 || saving ? 0.4 : 1,
                background: type === 'expense' ? '#ef4444' : '#10b981',
                color: type === 'expense' ? '#fff' : '#000',
                transition: 'opacity 0.15s',
              }}>
              {saving ? 'Збереження...' : type === 'expense' ? 'Додати витрату' : 'Додати дохід'}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
