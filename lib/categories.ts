export type CategoryType = 'income' | 'expense'

export interface Category {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  type: CategoryType
  is_archived: boolean
  sort_order: number
}

export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Їжа', icon: '🍔', color: '#f97316' },
  { name: 'Транспорт', icon: '🚗', color: '#3b82f6' },
  { name: 'Житло', icon: '🏠', color: '#8b5cf6' },
  { name: 'Здоров\'я', icon: '💊', color: '#ef4444' },
  { name: 'Розваги', icon: '🎮', color: '#ec4899' },
  { name: 'Одяг', icon: '👕', color: '#f59e0b' },
  { name: 'Зв\'язок', icon: '📱', color: '#06b6d4' },
  { name: 'Освіта', icon: '📚', color: '#10b981' },
  { name: 'Ресторани', icon: '🍽️', color: '#f97316' },
  { name: 'Кафе', icon: '☕', color: '#92400e' },
  { name: 'Продукти', icon: '🛒', color: '#16a34a' },
  { name: 'Комунальні', icon: '💡', color: '#eab308' },
  { name: 'Спорт', icon: '🏋️', color: '#22c55e' },
  { name: 'Краса', icon: '💅', color: '#f43f5e' },
  { name: 'Подарунки', icon: '🎁', color: '#a855f7' },
  { name: 'Ліки', icon: '🩺', color: '#dc2626' },
  { name: 'Техніка', icon: '💻', color: '#6366f1' },
  { name: 'Подорожі', icon: '✈️', color: '#0ea5e9' },
  { name: 'Домашні тварини', icon: '🐾', color: '#d97706' },
  { name: 'Страхування', icon: '🛡️', color: '#64748b' },
  { name: 'Податки', icon: '📋', color: '#475569' },
  { name: 'Бізнес', icon: '💼', color: '#1d4ed8' },
  { name: 'Інше', icon: '📦', color: '#6b7280' },
]

export const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Зарплата', icon: '💰', color: '#10b981' },
  { name: 'Фріланс', icon: '💻', color: '#3b82f6' },
  { name: 'Інвестиції', icon: '📈', color: '#8b5cf6' },
  { name: 'Подарунок', icon: '🎁', color: '#f59e0b' },
  { name: 'Повернення', icon: '🔄', color: '#06b6d4' },
  { name: 'Бізнес', icon: '🏢', color: '#1d4ed8' },
  { name: 'Дивіденди', icon: '💹', color: '#16a34a' },
  { name: 'Оренда', icon: '🏠', color: '#7c3aed' },
  { name: 'Бонус', icon: '⭐', color: '#f97316' },
  { name: 'Інше', icon: '📦', color: '#6b7280' },
]
