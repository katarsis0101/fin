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

const labelStyle: React.CSSProperties = {
  color: 'var(--text-tertiary)', fontSize: '0.6875rem', fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
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
      .eq('user_id', tx.user_id).eq('type', tx.type)
      .eq('is_archived', false).order('sort_order')
      .then(({ data }) => setCategories(data || []))
  }, [tx?.id])

  async function handleSave() {
    if (!tx) return
    setSaving(true)
    await supabase.from('transactions').update({
      amount: parseFloat(amount), comment,
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
        <Drawer.Overlay style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 40 }} />
        <Drawer.Content style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          background: 'var(--bg-card)', borderRadius: '24px 24px 0 0',
          maxHeight: '85vh', display: 'flex', flexDirection: 'column',
          maxWidth: 480, margin: '0 auto',
          border: '1px solid var(--border-mid)', borderBottom: 'none',
        }}>
          <div style={{ width: 36, height: 4, background: 'var(--border-high)', borderRadius: 2, margin: '12px auto 16px' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff' }}>Редагувати</h2>
            <button onClick={onClose} style={{ padding: 8, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', minHeight: 'auto' }}><X size={20} /></button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
            <div style={{ marginBottom: 14 }}>
              <p style={labelStyle}>Сума (₴)</p>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', color: '#fff', fontSize: '1rem', outline: 'none' }} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <p style={labelStyle}>Категорія</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => setCategoryId(cat.id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      padding: '8px 4px', borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: categoryId === cat.id ? 'var(--bg-overlay)' : 'var(--bg-raised)',
                      outline: categoryId === cat.id ? '2px solid var(--accent)' : 'none',
                      minHeight: 'auto',
                    }}>
                    <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
                    <span style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.2 }}>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <p style={labelStyle}>Коментар</p>
              <input value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Необов'язково..."
                style={{ width: '100%', background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', color: '#fff', fontSize: '0.875rem', outline: 'none' }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={labelStyle}>Дата</p>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', color: '#fff', fontSize: '0.875rem', outline: 'none' }} />
            </div>
          </div>

          <div style={{ padding: '8px 20px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={handleSave} disabled={saving}
              style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--accent)', color: '#000', fontWeight: 700, fontSize: '0.9375rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.5 : 1 }}>
              {saving ? 'Збереження...' : 'Зберегти'}
            </button>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)}
                style={{ width: '100%', padding: '13px', borderRadius: 'var(--radius-md)', background: 'var(--bg-raised)', color: 'var(--expense-color)', fontWeight: 500, fontSize: '0.9rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Trash2 size={15} /> Видалити
              </button>
            ) : (
              <button onClick={handleDelete}
                style={{ width: '100%', padding: '13px', borderRadius: 'var(--radius-md)', background: 'var(--expense-color)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}>
                Підтвердити видалення
              </button>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
