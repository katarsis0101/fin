'use client'
import { useState, useEffect, useRef } from 'react'
import { Drawer } from 'vaul'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/categories'
import { toISODate, formatUAH } from '@/lib/format'
import { TAX_PROFILES, calculateTax, getTaxProfileLabel, type TaxProfileId } from '@/lib/tax-profiles'

type TransactionType = 'income' | 'expense'

interface Props {
  open: boolean
  onClose: () => void
  onSaved: () => void
  userId: string
  amount: number
  initialType?: TransactionType
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div style={{
      position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
      background: 'var(--bg-overlay)', border: '1px solid var(--border-mid)',
      borderRadius: 12, padding: '10px 16px', fontSize: '0.8125rem',
      color: 'var(--text-primary)', zIndex: 100, whiteSpace: 'nowrap',
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
    }}>{message}</div>
  )
}

export default function AddTransactionSheet({ open, onClose, onSaved, userId, amount, initialType = 'expense' }: Props) {
  const [type, setType] = useState<TransactionType>(initialType)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [comment, setComment] = useState('')
  const [date, setDate] = useState(toISODate(new Date()))
  const [saving, setSaving] = useState(false)
  const [taxProfileId, setTaxProfileId] = useState<TaxProfileId>(0)
  const [taxDisabled, setTaxDisabled] = useState(false)
  const [toast, setToast] = useState('')
  const supabase = createClient()

  useEffect(() => {
    if (open) {
      setType(initialType)
      setComment('')
      setSelectedCategory('')
      setDate(toISODate(new Date()))
      setTaxDisabled(false)
      const saved = localStorage.getItem('fin_tax_profile_id')
      if (saved !== null) setTaxProfileId(Number(saved) as TaxProfileId)
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

  const taxCalc = type === 'income' && !taxDisabled ? calculateTax(taxProfileId, amount) : { total: 0, breakdown: [] }
  const profile = TAX_PROFILES.find(p => p.id === taxProfileId)

  async function handleSave() {
    if (!selectedCategory || amount <= 0) return
    setSaving(true)
    const cat = categories.find(c => c.id === selectedCategory)
    const isoDate = new Date(date).toISOString()

    await supabase.from('transactions').insert({
      user_id: userId, amount, type,
      category: cat?.name || '',
      category_id: selectedCategory,
      comment, created_at: isoDate,
    })

    if (type === 'income' && taxCalc.total > 0 && !(profile as any)?.isFixed) {
      const taxComment = `${getTaxProfileLabel(taxProfileId)}: ${taxCalc.breakdown.map(b => `${b.name} ${(b.rate * 100).toFixed(0)}%`).join(', ')} з ${formatUAH(amount)}`
      await supabase.from('transactions').insert({
        user_id: userId, amount: taxCalc.total, type: 'expense',
        category: 'Податки', category_id: null,
        comment: taxComment, created_at: isoDate,
      })
      setToast(`Дохід збережено. Витрата на податки −${formatUAH(taxCalc.total)} записана автоматично`)
    }

    setSaving(false)
    onSaved()
    onClose()
  }

  const labelStyle: React.CSSProperties = {
    color: 'var(--text-tertiary)', fontSize: '0.6875rem', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
  }

  return (
    <>
      {toast && <Toast message={toast} onDone={() => setToast('')} />}
      <Drawer.Root open={open} onOpenChange={v => !v && onClose()} shouldScaleBackground>
        <Drawer.Portal>
          <Drawer.Overlay style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 40 }} />
          <Drawer.Content style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
            background: 'var(--bg-card)', borderRadius: '24px 24px 0 0',
            maxHeight: '88vh', display: 'flex', flexDirection: 'column',
            maxWidth: 480, margin: '0 auto',
            border: '1px solid var(--border-mid)', borderBottom: 'none',
          }}>
            <div style={{ width: 36, height: 4, background: 'var(--border-high)', borderRadius: 2, margin: '12px auto 16px' }} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 12 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
                {amount > 0 ? `${amount.toLocaleString('uk-UA')} ₴` : 'Введіть суму'}
              </div>
              <button onClick={onClose} style={{ padding: 8, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', minHeight: 'auto' }}>
                <X size={20} />
              </button>
            </div>

            {/* Type toggle */}
            <div style={{ display: 'flex', margin: '0 20px 12px', background: 'var(--bg-raised)', borderRadius: 14, padding: 4 }}>
              {(['expense', 'income'] as const).map(t => (
                <button key={t} onClick={() => setType(t)}
                  style={{
                    flex: 1, padding: '8px', borderRadius: 10, fontSize: '0.875rem',
                    fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                    background: type === t ? (t === 'expense' ? 'var(--expense-color)' : 'var(--accent)') : 'transparent',
                    color: type === t ? (t === 'expense' ? '#fff' : '#000') : 'var(--text-tertiary)',
                    minHeight: 'auto',
                  }}>
                  {t === 'expense' ? 'Витрата' : 'Дохід'}
                </button>
              ))}
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>

              {/* Categories */}
              <p style={labelStyle}>Категорія</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 16 }}>
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      padding: '8px 4px', borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: selectedCategory === cat.id ? 'var(--bg-overlay)' : 'var(--bg-raised)',
                      outline: selectedCategory === cat.id ? '2px solid var(--accent)' : 'none',
                      transition: 'all 0.12s', minHeight: 'auto',
                    }}>
                    <span style={{ fontSize: '1.125rem' }}>{cat.icon}</span>
                    <span style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.2 }}>{cat.name}</span>
                  </button>
                ))}
                {categories.length === 0 && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.8125rem', padding: '16px 0' }}>
                    Категорії відсутні. Додайте їх у Налаштуваннях.
                  </div>
                )}
              </div>

              {/* Tax profile (income only) */}
              {type === 'income' && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <p style={{ ...labelStyle, marginBottom: 0 }}>Податковий профіль</p>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', minHeight: 'auto' }}>
                      <input type="checkbox" checked={taxDisabled} onChange={e => setTaxDisabled(e.target.checked)}
                        style={{ accentColor: 'var(--accent)', width: 14, height: 14 }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Без податків</span>
                    </label>
                  </div>
                  {!taxDisabled && (
                    <>
                      <select
                        value={taxProfileId}
                        onChange={e => { const id = Number(e.target.value) as TaxProfileId; setTaxProfileId(id); localStorage.setItem('fin_tax_profile_id', String(id)) }}
                        style={{
                          width: '100%', background: 'var(--bg-raised)', border: '1px solid var(--border)',
                          borderRadius: 12, padding: '10px 14px', color: 'var(--text-primary)',
                          fontSize: '0.8125rem', outline: 'none', marginBottom: 8, appearance: 'none',
                          minHeight: 'auto',
                        }}>
                        {TAX_PROFILES.map(p => (
                          <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                      </select>

                      {(profile as any)?.isFixed && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-raised)', borderRadius: 8, padding: '6px 10px' }}>
                          {(profile as any).fixedHint}
                        </p>
                      )}

                      {taxCalc.total > 0 && (
                        <div style={{ background: 'var(--expense-dim)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: 10, padding: '8px 12px' }}>
                          {taxCalc.breakdown.map(b => (
                            <div key={b.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 2 }}>
                              <span style={{ color: 'var(--text-secondary)' }}>{b.name} ({(b.rate * 100).toFixed(0)}%)</span>
                              <span style={{ color: 'var(--expense-color)' }}>−{formatUAH(b.amount)}</span>
                            </div>
                          ))}
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, marginTop: 4, paddingTop: 4, borderTop: '1px solid rgba(244,63,94,0.15)' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Буде утримано:</span>
                            <span style={{ color: 'var(--expense-color)' }}>−{formatUAH(taxCalc.total)}</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Comment */}
              <p style={labelStyle}>Коментар</p>
              <input
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Необов'язково..."
                style={{
                  width: '100%', background: 'var(--bg-raised)', borderRadius: 12, padding: '12px 14px',
                  color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none',
                  border: '1px solid var(--border)', marginBottom: 14,
                }}
              />

              {/* Date */}
              <p style={labelStyle}>Дата</p>
              <input
                type="date" value={date}
                onChange={e => setDate(e.target.value)}
                style={{
                  width: '100%', background: 'var(--bg-raised)', borderRadius: 12, padding: '12px 14px',
                  color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none',
                  border: '1px solid var(--border)', marginBottom: 20,
                }}
              />
            </div>

            {/* Save */}
            <div style={{ padding: '8px 20px 24px' }}>
              <button
                onClick={handleSave}
                disabled={!selectedCategory || amount <= 0 || saving}
                style={{
                  width: '100%', padding: '16px', borderRadius: 'var(--radius-lg)', fontWeight: 700,
                  fontSize: '1rem', border: 'none', cursor: !selectedCategory || amount <= 0 || saving ? 'not-allowed' : 'pointer',
                  opacity: !selectedCategory || amount <= 0 || saving ? 0.4 : 1,
                  background: type === 'expense' ? 'var(--expense-color)' : 'var(--accent)',
                  color: type === 'expense' ? '#fff' : '#000',
                  transition: 'opacity 0.15s',
                }}>
                {saving ? 'Збереження...' : type === 'expense' ? 'Додати витрату' : 'Додати дохід'}
              </button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  )
}
