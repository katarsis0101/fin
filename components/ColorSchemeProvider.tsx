'use client'
import { useEffect } from 'react'
import type { ColorScheme } from '@/lib/color-schemes'
import { COLOR_SCHEMES } from '@/lib/color-schemes'

export type { ColorScheme }
export { COLOR_SCHEMES }

export function applyColorScheme(scheme: ColorScheme) {
  document.documentElement.setAttribute('data-scheme', scheme)
  localStorage.setItem('fin_color_scheme', scheme)
}

export function getCurrentScheme(): ColorScheme {
  if (typeof window === 'undefined') return 'emerald'
  const stored = localStorage.getItem('fin_color_scheme') as ColorScheme | null
  if (stored && COLOR_SCHEMES.some(s => s.key === stored)) return stored
  return 'emerald'
}

export default function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem('fin_color_scheme') as ColorScheme | null
    if (saved && COLOR_SCHEMES.some(s => s.key === saved)) {
      document.documentElement.setAttribute('data-scheme', saved)
    }
  }, [])
  return <>{children}</>
}
