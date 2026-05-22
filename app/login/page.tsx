'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit() {
    setError('')
    setLoading(true)
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setError('Перевірте пошту для підтвердження')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        window.location.href = '/'
      }
    } catch (e: any) {
      setError(e.message || 'Помилка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-end gap-1 mb-3">
            {[0.4, 0.6, 0.8, 1].map((h, i) => (
              <div key={i} className={`w-3 rounded-sm ${i >= 2 ? 'bg-emerald-500' : 'bg-[#2a2a2a]'}`}
                style={{ height: `${h * 32}px` }} />
            ))}
          </div>
          <h1 className="text-3xl font-bold text-white">Fin</h1>
          <p className="text-[#666] mt-1 text-sm">Особистий фінансовий трекер</p>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-3.5 text-white placeholder-[#555] focus:outline-none focus:border-emerald-500 text-base"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-3.5 text-white placeholder-[#555] focus:outline-none focus:border-emerald-500 text-base"
          />

          {error && (
            <p className="text-sm text-center px-2" style={{ color: error.includes('пошту') ? '#10b981' : '#ef4444' }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white font-semibold rounded-2xl py-3.5 text-base transition-colors"
          >
            {loading ? '...' : isSignUp ? 'Зареєструватись' : 'Увійти'}
          </button>

          <button
            onClick={() => { setIsSignUp(!isSignUp); setError('') }}
            className="w-full text-[#666] text-sm py-2 hover:text-white transition-colors"
          >
            {isSignUp ? 'Вже є акаунт? Увійти' : 'Немає акаунту? Зареєструватись'}
          </button>
        </div>
      </div>
    </div>
  )
}
