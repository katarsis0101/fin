import { createClient } from './supabase/client'
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from './categories'

const SEED_LOCK_KEY = 'fin_categories_seeded_v3'

export async function seedCategoriesIfNeeded(userId: string) {
  if (typeof window === 'undefined') return
  const lockKey = `${SEED_LOCK_KEY}_${userId}`
  if (localStorage.getItem(lockKey)) return
  localStorage.setItem(lockKey, '1')

  const supabase = createClient()
  const { data: existing } = await supabase
    .from('categories').select('id').eq('user_id', userId).limit(1)

  if (existing && existing.length > 0) return

  const now = new Date().toISOString()
  const expenseRows = DEFAULT_EXPENSE_CATEGORIES.map((c, i) => ({
    user_id: userId, name: c.name, icon: c.icon, color: c.color,
    type: 'expense', is_archived: false, sort_order: i, created_at: now,
  }))
  const incomeRows = DEFAULT_INCOME_CATEGORIES.map((c, i) => ({
    user_id: userId, name: c.name, icon: c.icon, color: c.color,
    type: 'income', is_archived: false, sort_order: i, created_at: now,
  }))

  await supabase.from('categories').insert([...expenseRows, ...incomeRows])
}
