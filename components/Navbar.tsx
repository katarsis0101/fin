'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart2, ArrowLeftRight, Settings } from 'lucide-react'

const tabs = [
  { href: '/', icon: Home, label: 'Головна' },
  { href: '/dashboard', icon: BarChart2, label: 'Аналітика' },
  { href: '/transactions', icon: ArrowLeftRight, label: 'Рух коштів' },
  { href: '/settings', icon: Settings, label: 'Налаштування' },
]

export default function Navbar() {
  const path = usePathname()

  return (
    <nav className="bottom-nav">
      {tabs.map(({ href, icon: Icon, label }) => {
        const active = path === href
        return (
          <Link key={href} href={href}
            className="flex flex-col items-center gap-0.5 px-4 py-1 transition-colors"
            style={{ color: active ? '#10b981' : '#555' }}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
