export type ActivityType =
  'entrepreneur' | 'lawyer' | 'accountant' | 'trade' |
  'it' | 'personal' | 'medical' | 'realestate' | 'beauty'

export interface CategoryTemplate {
  name: string
  type: 'income' | 'expense'
  icon: string
  group?: string
}

export const CATEGORY_DATABASE: Record<ActivityType, CategoryTemplate[]> = {
  lawyer: [
    { name: 'Гонорар', type: 'income', icon: '⚖️', group: 'Послуги' },
    { name: 'Абонентське', type: 'income', icon: '📋', group: 'Послуги' },
    { name: 'Консультація', type: 'income', icon: '💬', group: 'Послуги' },
    { name: 'Представництво в суді', type: 'income', icon: '🏛️', group: 'Послуги' },
    { name: 'Складання документів', type: 'income', icon: '📝', group: 'Послуги' },
    { name: 'Медіація', type: 'income', icon: '🤝', group: 'Послуги' },
    { name: 'Аванс', type: 'income', icon: '💰', group: 'Послуги' },
    { name: 'Відшкодування витрат', type: 'income', icon: '🔄', group: 'Інше' },
    { name: 'Судовий збір', type: 'expense', icon: '🏛️', group: 'Бізнес' },
    { name: 'Оренда офісу', type: 'expense', icon: '🏢', group: 'Бізнес' },
    { name: 'Канцтовари', type: 'expense', icon: '✏️', group: 'Бізнес' },
    { name: 'Юридична літ-ра', type: 'expense', icon: '📚', group: 'Бізнес' },
    { name: 'Нотаріус', type: 'expense', icon: '🖊️', group: 'Бізнес' },
    { name: 'Відрядження', type: 'expense', icon: '✈️', group: 'Бізнес' },
    { name: 'Транспорт', type: 'expense', icon: '🚗', group: 'Бізнес' },
    { name: "Зв'язок", type: 'expense', icon: '📱', group: 'Бізнес' },
    { name: 'Реклама', type: 'expense', icon: '📣', group: 'Бізнес' },
    { name: 'Бухгалтерія', type: 'expense', icon: '🧮', group: 'Бізнес' },
    { name: 'Підвищення кваліфікації', type: 'expense', icon: '🎓', group: 'Бізнес' },
    { name: 'Податки', type: 'expense', icon: '📋', group: 'Бізнес' },
  ],
  it: [
    { name: 'Розробка', type: 'income', icon: '💻', group: 'Послуги' },
    { name: 'Консалтинг', type: 'income', icon: '🧠', group: 'Послуги' },
    { name: 'Підтримка', type: 'income', icon: '🔧', group: 'Послуги' },
    { name: 'Дизайн', type: 'income', icon: '🎨', group: 'Послуги' },
    { name: 'Хостинг', type: 'expense', icon: '☁️', group: 'Бізнес' },
    { name: 'Домени', type: 'expense', icon: '🌐', group: 'Бізнес' },
    { name: 'Ліцензії ПЗ', type: 'expense', icon: '🔑', group: 'Бізнес' },
    { name: 'Обладнання', type: 'expense', icon: '🖥️', group: 'Бізнес' },
    { name: 'Підписки (SaaS)', type: 'expense', icon: '💳', group: 'Бізнес' },
    { name: 'Навчання', type: 'expense', icon: '📖', group: 'Бізнес' },
    { name: 'Реклама', type: 'expense', icon: '📣', group: 'Бізнес' },
    { name: 'Комісії платіжних систем', type: 'expense', icon: '💸', group: 'Бізнес' },
  ],
  beauty: [
    { name: 'Стрижка', type: 'income', icon: '✂️', group: 'Послуги' },
    { name: 'Фарбування', type: 'income', icon: '🎨', group: 'Послуги' },
    { name: 'Манікюр', type: 'income', icon: '💅', group: 'Послуги' },
    { name: 'Масаж', type: 'income', icon: '💆', group: 'Послуги' },
    { name: 'Брови/вії', type: 'income', icon: '👁️', group: 'Послуги' },
    { name: 'Косметологія', type: 'income', icon: '✨', group: 'Послуги' },
    { name: 'Матеріали', type: 'expense', icon: '🧴', group: 'Бізнес' },
    { name: 'Інструменти', type: 'expense', icon: '🔧', group: 'Бізнес' },
    { name: 'Оренда місця', type: 'expense', icon: '🏠', group: 'Бізнес' },
    { name: 'Навчання', type: 'expense', icon: '📚', group: 'Бізнес' },
    { name: 'Реклама', type: 'expense', icon: '📣', group: 'Бізнес' },
  ],
  personal: [
    { name: 'Зарплата', type: 'income', icon: '💰', group: 'Доходи' },
    { name: 'Фриланс', type: 'income', icon: '💻', group: 'Доходи' },
    { name: 'Підробіток', type: 'income', icon: '💼', group: 'Доходи' },
    { name: 'Інвестиції', type: 'income', icon: '📈', group: 'Доходи' },
    { name: 'Повернення боргу', type: 'income', icon: '🔄', group: 'Доходи' },
    { name: 'Їжа', type: 'expense', icon: '🍔', group: 'Особисті' },
    { name: 'Транспорт', type: 'expense', icon: '🚌', group: 'Особисті' },
    { name: 'Комунальні', type: 'expense', icon: '💡', group: 'Особисті' },
    { name: 'Оренда', type: 'expense', icon: '🏠', group: 'Особисті' },
    { name: "Здоров'я", type: 'expense', icon: '💊', group: 'Особисті' },
    { name: 'Розваги', type: 'expense', icon: '🎮', group: 'Особисті' },
    { name: 'Одяг', type: 'expense', icon: '👕', group: 'Особисті' },
    { name: 'Спорт', type: 'expense', icon: '🏋️', group: 'Особисті' },
    { name: 'Кафе/Ресторани', type: 'expense', icon: '☕', group: 'Особисті' },
  ],
  entrepreneur: [
    { name: 'Продаж товарів', type: 'income', icon: '🛍️', group: 'Доходи' },
    { name: 'Послуги', type: 'income', icon: '💼', group: 'Доходи' },
    { name: 'Оптовий продаж', type: 'income', icon: '📦', group: 'Доходи' },
    { name: 'Закупівля товару', type: 'expense', icon: '🏭', group: 'Бізнес' },
    { name: 'Оренда', type: 'expense', icon: '🏢', group: 'Бізнес' },
    { name: 'Зарплати', type: 'expense', icon: '👥', group: 'Бізнес' },
    { name: 'Реклама', type: 'expense', icon: '📣', group: 'Бізнес' },
    { name: 'Логістика', type: 'expense', icon: '🚚', group: 'Бізнес' },
    { name: 'Комунальні', type: 'expense', icon: '💡', group: 'Бізнес' },
    { name: 'Податки', type: 'expense', icon: '📋', group: 'Бізнес' },
  ],
  accountant: [
    { name: 'Бухгалтерське обслуговування', type: 'income', icon: '🧮', group: 'Послуги' },
    { name: 'Звітність', type: 'income', icon: '📊', group: 'Послуги' },
    { name: 'Аудит', type: 'income', icon: '🔍', group: 'Послуги' },
    { name: 'Консультація', type: 'income', icon: '💬', group: 'Послуги' },
    { name: 'Програмне забезпечення', type: 'expense', icon: '💻', group: 'Бізнес' },
    { name: 'Підвищення кваліфікації', type: 'expense', icon: '🎓', group: 'Бізнес' },
    { name: 'Оренда', type: 'expense', icon: '🏢', group: 'Бізнес' },
    { name: "Зв'язок", type: 'expense', icon: '📱', group: 'Бізнес' },
  ],
  trade: [
    { name: 'Роздрібний продаж', type: 'income', icon: '🛒', group: 'Доходи' },
    { name: 'Оптовий продаж', type: 'income', icon: '📦', group: 'Доходи' },
    { name: 'Повернення постачальнику', type: 'income', icon: '🔄', group: 'Доходи' },
    { name: 'Закупівля', type: 'expense', icon: '🏭', group: 'Бізнес' },
    { name: 'Логістика', type: 'expense', icon: '🚚', group: 'Бізнес' },
    { name: 'Оренда складу', type: 'expense', icon: '🏗️', group: 'Бізнес' },
    { name: 'Пакування', type: 'expense', icon: '📦', group: 'Бізнес' },
    { name: 'Маркетплейс комісії', type: 'expense', icon: '💸', group: 'Бізнес' },
  ],
  medical: [
    { name: 'Прийом пацієнта', type: 'income', icon: '🏥', group: 'Послуги' },
    { name: 'Процедура', type: 'income', icon: '💉', group: 'Послуги' },
    { name: 'Аналізи', type: 'income', icon: '🔬', group: 'Послуги' },
    { name: 'Медикаменти', type: 'expense', icon: '💊', group: 'Бізнес' },
    { name: 'Обладнання', type: 'expense', icon: '🩺', group: 'Бізнес' },
    { name: 'Оренда кабінету', type: 'expense', icon: '🏢', group: 'Бізнес' },
    { name: 'Сертифікація', type: 'expense', icon: '🎓', group: 'Бізнес' },
  ],
  realestate: [
    { name: 'Оренда (отримано)', type: 'income', icon: '🏠', group: 'Доходи' },
    { name: 'Продаж нерухомості', type: 'income', icon: '🏘️', group: 'Доходи' },
    { name: 'Комісійні', type: 'income', icon: '💼', group: 'Доходи' },
    { name: 'Ремонт', type: 'expense', icon: '🔨', group: 'Бізнес' },
    { name: 'Комунальні', type: 'expense', icon: '💡', group: 'Бізнес' },
    { name: 'Реклама', type: 'expense', icon: '📣', group: 'Бізнес' },
    { name: 'Податок на нерухомість', type: 'expense', icon: '📋', group: 'Бізнес' },
    { name: 'Управляюча компанія', type: 'expense', icon: '🏢', group: 'Бізнес' },
  ],
}

export const COMMON_CATEGORIES: CategoryTemplate[] = [
  { name: 'Інший дохід', type: 'income', icon: '📦', group: 'Загальне' },
  { name: 'Готівка', type: 'income', icon: '💵', group: 'Загальне' },
  { name: 'Повернення', type: 'income', icon: '🔄', group: 'Загальне' },
  { name: 'Їжа', type: 'expense', icon: '🍔', group: 'Особисті' },
  { name: 'Транспорт', type: 'expense', icon: '🚗', group: 'Особисті' },
  { name: "Здоров'я", type: 'expense', icon: '💊', group: 'Особисті' },
  { name: 'Комунальні', type: 'expense', icon: '💡', group: 'Особисті' },
  { name: "Зв'язок", type: 'expense', icon: '📱', group: 'Особисті' },
  { name: 'Податки', type: 'expense', icon: '📋', group: 'Загальне' },
  { name: 'Інше', type: 'expense', icon: '📦', group: 'Загальне' },
]

export function getCategoriesForActivity(activity: ActivityType): CategoryTemplate[] {
  const specific = CATEGORY_DATABASE[activity] || []
  const all = [...specific, ...COMMON_CATEGORIES]
  const seen = new Set<string>()
  return all.filter(c => {
    const key = `${c.name}_${c.type}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
