'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import Navbar from '@/components/Navbar'
import { Plus, Archive, Trash2, LogOut, Download, ChevronRight } from 'lucide-react'
import { exportToCSV } from '@/lib/exports'
import type { CategoryType } from '@/lib/categories'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState<CategoryType>('expense')
  const [categories, setCategories] = useState<any[]>([])
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('📦')
  const [adding, setAdding] = useState(false)
  const supabase = createClient()

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

  const active = categories.filter(c => !c.is_archived)
  const archived = categories.filter(c => c.is_archived)

  return (
    <div className="app-shell">
      <div className="app-content">
        <div className="px-4 pt-6 pb-3">
          <h1 className="text-xl font-bold text-white">Налаштування</h1>
        </div>

        {/* Account */}
        <div className="mx-4 mb-4 bg-[#111] rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium text-sm">{user?.email}</div>
              <div className="text-[#555] text-xs mt-0.5">Ваш акаунт</div>
            </div>
            <button onClick={signOut} className="flex items-center gap-1.5 text-red-400 text-sm">
              <LogOut size={16} /> Вийти
            </button>
          </div>
        </div>

        {/* Export */}
        <button onClick={handleExport}
          className="mx-4 mb-4 w-[calc(100%-32px)] bg-[#111] rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Download size={18} className="text-emerald-400" />
            <span className="text-white text-sm">Експорт CSV</span>
          </div>
          <ChevronRight size={16} className="text-[#444]" />
        </button>

        {/* Categories */}
        <div className="px-4">
          <div className="flex gap-2 mb-3 bg-[#1a1a1a] rounded-2xl p-1">
            {(['expense', 'income'] as CategoryType[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  tab === t ? 'bg-[#2a2a2a] text-white' : 'text-[#555]'
                }`}>
                {t === 'expense' ? 'Витрати' : 'Доходи'}
              </button>
            ))}
          </div>

          <div className="bg-[#111] rounded-2xl overflow-hidden mb-3">
            {active.map(cat => (
              <div key={cat.id} className="flex items-center gap-3 px-4 py-3 border-b border-[#1a1a1a] last:border-0">
                <span className="text-xl">{cat.icon}</span>
                <span className="flex-1 text-white text-sm">{cat.name}</span>
                <button onClick={() => archiveCategory(cat.id)} className="p-1.5 text-[#555] hover:text-[#888]">
                  <Archive size={15} />
                </button>
              </div>
            ))}

            {/* Add new */}
            {adding ? (
              <div className="flex items-center gap-2 px-4 py-3 border-t border-[#1a1a1a]">
                <input value={newIcon} onChange={e => setNewIcon(e.target.value)}
                  className="w-10 bg-[#2a2a2a] rounded-lg p-1 text-center text-lg focus:outline-none" />
                <input value={newName} onChange={e => setNewName(e.target.value)}
                  placeholder="Назва..." autoFocus
                  onKeyDown={e => e.key === 'Enter' && addCategory()}
                  className="flex-1 bg-[#2a2a2a] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none" />
                <button onClick={addCategory} className="text-emerald-400 text-sm font-medium">Додати</button>
                <button onClick={() => setAdding(false)} className="text-[#555] text-sm">✕</button>
              </div>
            ) : (
              <button onClick={() => setAdding(true)}
                className="w-full flex items-center gap-2 px-4 py-3 text-[#555] hover:text-white border-t border-[#1a1a1a] transition-colors">
                <Plus size={16} /> <span className="text-sm">Додати категорію</span>
              </button>
            )}
          </div>

          {archived.length > 0 && (
            <div className="mb-4">
              <p className="text-[#444] text-xs uppercase tracking-wider mb-2">Архів</p>
              <div className="bg-[#111] rounded-2xl overflow-hidden">
                {archived.map(cat => (
                  <div key={cat.id} className="flex items-center gap-3 px-4 py-3 border-b border-[#1a1a1a] last:border-0 opacity-50">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="flex-1 text-white text-sm">{cat.name}</span>
                    <button onClick={() => deleteCategory(cat.id)} className="p-1.5 text-red-500">
                      <Trash2 size={15} />
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
