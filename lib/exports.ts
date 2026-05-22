import { ukDate } from './format'

export function exportToCSV(transactions: any[]): void {
  const BOM = '\uFEFF'
  const headers = ['Дата', 'Тип', 'Категорія', 'Сума (₴)', 'Коментар']
  const rows = transactions.map(t => [
    ukDate(t.created_at),
    t.type === 'income' ? 'Дохід' : 'Витрата',
    t.category || '',
    String(t.amount),
    t.comment || '',
  ])
  const csv = BOM + [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `fin_export_${Date.now()}.csv`
  a.click(); URL.revokeObjectURL(url)
}
