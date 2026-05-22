export const TAX_PROFILES = [
  {
    id: 0,
    label: 'Без податків (готівка, повернення тощо)',
    taxes: [] as { name: string; rate: number; type: string }[],
  },
  {
    id: 1,
    label: 'Фізособа / Найманий / ФОП (загальна)',
    taxes: [
      { name: 'ПДФО', rate: 0.18, type: 'percent' },
      { name: 'ВЗ',   rate: 0.05, type: 'percent' },
    ],
  },
  {
    id: 2,
    label: 'ФОП 3 група (ЄП 5%)',
    taxes: [
      { name: 'Єдиний податок', rate: 0.05, type: 'percent' },
      { name: 'ВЗ',             rate: 0.01, type: 'percent' },
    ],
  },
  {
    id: 3,
    label: 'ФОП 3 група (ЄП 3% + ПДВ)',
    taxes: [
      { name: 'Єдиний податок', rate: 0.03, type: 'percent' },
      { name: 'ВЗ',             rate: 0.01, type: 'percent' },
    ],
  },
  {
    id: 4,
    label: 'ФОП 1 або 2 група (фіксовані щомісячно)',
    taxes: [] as { name: string; rate: number; type: string }[],
    isFixed: true,
    fixedHint: 'ЄП + ВЗ (≈800 ₴) + ЄСВ (≈1760 ₴) — фіксовані щомісячні витрати',
  },
] as const

export type TaxProfileId = 0 | 1 | 2 | 3 | 4

export function calculateTax(profileId: TaxProfileId, amount: number) {
  const profile = TAX_PROFILES.find(p => p.id === profileId)
  if (!profile || (profile as any).isFixed || !profile.taxes.length) {
    return { total: 0, breakdown: [] as { name: string; amount: number; rate: number }[] }
  }
  const breakdown = profile.taxes.map(t => ({
    name: t.name,
    amount: amount * t.rate,
    rate: t.rate,
  }))
  return { total: breakdown.reduce((s, t) => s + t.amount, 0), breakdown }
}

export function getTaxProfileLabel(profileId: TaxProfileId): string {
  return TAX_PROFILES.find(p => p.id === profileId)?.label ?? ''
}
