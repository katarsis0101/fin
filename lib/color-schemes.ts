export const COLOR_SCHEMES = [
  { key: 'emerald', label: 'Смарагд', accent: '#10b981' },
  { key: 'blue',    label: 'Синій',   accent: '#3b82f6' },
  { key: 'violet',  label: 'Фіолет',  accent: '#8b5cf6' },
  { key: 'rose',    label: 'Рожевий', accent: '#f43f5e' },
  { key: 'amber',   label: 'Бурштин', accent: '#f59e0b' },
] as const

export type ColorScheme = typeof COLOR_SCHEMES[number]['key']
