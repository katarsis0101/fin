'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import Navbar from '@/components/Navbar'
import { Plus, Archive, Trash2, LogOut, Download, ChevronRight, BookOpen } from 'lucide-react'
import { exportToCSV } from '@/lib/exports'
import type { CategoryType } from '@/lib/categories'
import { applyColorScheme, getCurrentScheme, COLOR_SCHEMES, type ColorScheme } from '@/components/ColorSchemeProvider'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState<CategoryType>('expense')
  const [categories, setCategories] = useState<any[]>([])
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('📦')
  const [adding, setAdding] = useState(false)
  const [currentScheme, setCurrentScheme] = useState<ColorScheme>('emerald')
  const supabase = createClient()

  useEffect(() => {
    setCurrentScheme(getCurrentScheme())
  }, [])

  async function loadCategories() {
    if (!user) return
    const { data } = await supabase.from('categories').select('*')
      .eq('user_id', user.id).eq('type', tab).order('sort_order')
    setCategories(data || [])
  }

  useEffect(() => { loadCategories() }, [user, tab])

  async function addCategory() {
    if (!newName.trim() || !user) return
    await supabase.from('categories').insert({
      user_id: user.id, name: newName.trim(), icon: newIcon,
      color: '#6b7280', type: tab, is_archived: false,
      sort_order: categories.length,
    })
    setNewName(''); setAdding(false)
    loadCategories()
  }

  async function archiveCategory(id: string) {
    await supabase.from('categories').update({ is_archived: true }).eq('id', id)
    loadCategories()
  }

  async function deleteCategory(id: string) {
    await supabase.from('categories').delete().eq('id', id)
    loadCategories()
  }

  async function handleExport() {
    if (!user) return
    const { data } = await supabase.from('transactions').select('*')
      .eq('user_id', user.id).order('created_at', { ascending: false })
    if (data) exportToCSV(data)
  }

  function handleScheme(key: ColorScheme) {
    applyColorScheme(key)
    setCurrentScheme(key)
  }

  function resetOnboarding() {
    localStorage.removeItem('fin_onboarding_done')
    window.location.href = '/'
  }

  const active = categories.filter(c => !c.is_archived)
  const archived = categories.filter(c => c.is_archived)

  const sectionTitle: React.CSSProperties = { fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, padding: '0 2px' }
  const cardBase: React.CSSProperties = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 8 }

  return (
    <div className="app-shell">
      <div className="app-content">
        <div style={{ padding: '16px 16px 12px' }}>
          <h1 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Налаштування</h1>
        </div>

        <div style={{ padding: '0 16px' }}>

          {/* Profile */}
          <p style={sectionTitle}>Профіль</p>
          <div style={{ ...cardBase, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 500, fontSize: '0.9rem' }}>{user?.email}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 2 }}>Ваш акаунт</div>
            </div>
            <button onClick={signOut} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--expense-color)', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', minHeight: 'auto' }}>
              <LogOut size={15} /> Вийти
            </button>
          </div>

          {/* Color scheme */}
          <p style={sectionTitle}>Колірна схема</p>
          <div style={{ ...cardBase, padding: '14px 16px', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 14 }}>
              {COLOR_SCHEMES.map(s => (
                <button key={s.key} onClick={() => handleScheme(s.key as ColorScheme)}
                  style={{
                    width: 36, height: 36, borderRadius: '50%', background: s.accent,
                    border: 'none', cursor: 'pointer', minHeight: 'auto',
                    outline: currentScheme === s.key ? '2px solid #fff' : '2px solid transparent',
                    outlineOffset: 2, transition: 'outline 0.15s',
                  }} title={s.label} />
              ))}
            </div>
          </div>

          {/* Onboarding */}
          <p style={sectionTitle}>Навчання</p>
          <button onClick={resetOnboarding}
            style={{ width: '100%', ...cardBase, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <BookOpen size={17} color="var(--accent)" />
            <span style={{ flex: 1, textAlign: 'left', color: '#fff', fontSize: '0.875rem' }}>Запустити онбординг</span>
            <ChevronRight size={15} color="var(--text-muted)" />
          </button>

          {/* Export */}
          <button onClick={handleExport}
            style={{ width: '100%', ...cardBase, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 20 }}>
            <Download size={17} color="var(--accent)" />
            <span style={{ flex: 1, textAlign: 'left', color: '#fff', fontSize: '0.875rem' }}>Експорт CSV</span>
            <ChevronRight size={15} color="var(--text-muted)" />
          </button>

          {/* Categories */}
          <p style={sectionTitle}>Категорії</p>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, background: 'var(--bg-raised)', borderRadius: 12, padding: 4 }}>
            {(['expense', 'income'] as CategoryType[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: '7px', borderRadius: 9, fontSize: '0.875rem',
                  fontWeight: 600, border: 'none', cursor: 'pointer', minHeight: 'auto',
                  background: tab === t ? 'var(--bg-overlay)' : 'transparent',
                  color: tab === t ? '#fff' : 'var(--text-muted)',
                }}>
                {t === 'expense' ? 'Витрати' : 'Доходи'}
              </button>
            ))}
          </div>

          <div style={cardBase}>
            {active.map((cat, i) => (
              <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderBottom: i < active.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                <span style={{ flex: 1, color: '#fff', fontSize: '0.875rem' }}>{cat.name}</span>
                <button onClick={() => archiveCategory(cat.id)} style={{ padding: 6, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', minHeight: 'auto' }}>
                  <Archive size={14} />
                </button>
              </div>
            ))}

            {adding ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderTop: active.length > 0 ? '1px solid var(--border)' : 'none' }}>
                <input value={newIcon} onChange={e => setNewIcon(e.target.value)}
                  style={{ width: 36, background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 8, padding: 4, textAlign: 'center', fontSize: '1.1rem', outline: 'none', color: '#fff' }} />
                <input value={newName} onChange={e => setNewName(e.target.value)}
                  placeholder="Назва..." autoFocus
                  onKeyDown={e => e.key === 'Enter' && addCategory()}
                  style={{ flex: 1, background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', color: '#fff', fontSize: '0.875rem', outline: 'none' }} />
                <button onClick={addCategory} style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', minHeight: 'auto' }}>Додати</button>
                <button onClick={() => setAdding(false)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', minHeight: 'auto' }}>✕</button>
              </div>
            ) : (
              <button onClick={() => setAdding(true)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', color: 'var(--text-muted)', background: 'none', border: 'none', borderTop: active.length > 0 ? '1px solid var(--border)' : 'none', cursor: 'pointer', minHeight: 'auto' }}>
                <Plus size={15} /> <span style={{ fontSize: '0.875rem' }}>Додати категорію</span>
              </button>
            )}
          </div>

          {archived.length > 0 && (
            <div style={{ marginTop: 12, marginBottom: 16 }}>
              <p style={{ ...sectionTitle, marginBottom: 6 }}>Архів</p>
              <div style={cardBase}>
                {archived.map((cat, i) => (
                  <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderBottom: i < archived.length - 1 ? '1px solid var(--border)' : 'none', opacity: 0.5 }}>
                    <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                    <span style={{ flex: 1, color: '#fff', fontSize: '0.875rem' }}>{cat.name}</span>
                    <button onClick={() => deleteCategory(cat.id)} style={{ padding: 6, color: 'var(--expense-color)', background: 'none', border: 'none', cursor: 'pointer', minHeight: 'auto' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Navbar />
    </div>
  )
}
