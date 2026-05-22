'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart2, ArrowLeftRight, Settings } from 'lucide-react'

const TABS = [
  { href: '/', icon: Home, label: 'Головна' },
  { href: '/dashboard', icon: BarChart2, label: 'Аналітика' },
  { href: '/transactions', icon: ArrowLeftRight, label: 'Рух коштів' },
  { href: '/settings', icon: Settings, label: 'Налаштування' },
]

export default function Navbar() {
  const path = usePathname()
  return (
    <nav className="bottom-nav">
      {TABS.map(({ href, icon: Icon, label }) => {
        const active = path === href
        return (
          <Link key={href} href={href}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 2, padding: '6px 12px', borderRadius: 16, minHeight: 'auto',
              color: active ? 'var(--accent)' : 'var(--text-muted)',
              background: active ? 'var(--accent-dim)' : 'transparent',
              textDecoration: 'none', transition: 'all 0.15s',
            }}>
            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.04em' }}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
