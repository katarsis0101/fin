'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')
  const supabase = createClient()

  async function handleSubmit() {
    setError('')
    setIsLoading(true)
    try {
      if (isSignUp) {
        setLoadingText('Реєструємось...')
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setIsLoading(false)
        setError('Перевірте пошту для підтвердження')
      } else {
        setLoadingText('Входимо...')
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        setLoadingText('Завантажуємо профіль...')
        await new Promise(r => setTimeout(r, 500))
        window.location.href = '/'
      }
    } catch (e: any) {
      setError(e.message || 'Помилка')
      setIsLoading(false)
      setLoadingText('')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 4, marginBottom: 12 }}>
            {[0.4, 0.6, 0.8, 1].map((h, i) => (
              <div key={i} style={{
                width: 12, borderRadius: 4,
                height: `${h * 32}px`,
                background: i >= 2 ? '#10b981' : '#2a2a2a',
              }} />
            ))}
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>Fin</h1>
          <p style={{ color: '#666', fontSize: '0.875rem' }}>Особистий фінансовий трекер</p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isLoading}
            style={{
              width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a',
              borderRadius: 16, padding: '14px 16px', color: '#fff',
              fontSize: '1rem', outline: 'none',
            }}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !isLoading && handleSubmit()}
            disabled={isLoading}
            style={{
              width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a',
              borderRadius: 16, padding: '14px 16px', color: '#fff',
              fontSize: '1rem', outline: 'none',
            }}
          />

          {error && (
            <p style={{ fontSize: '0.875rem', textAlign: 'center', color: error.includes('пошту') ? '#10b981' : '#ef4444' }}>
              {error}
            </p>
          )}

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '20px 0' }}>
              <div style={{
                width: 32, height: 32, border: '2px solid #10b981',
                borderTopColor: 'transparent', borderRadius: '50%',
              }} className="animate-spin" />
              <p style={{ fontSize: '0.875rem', color: '#888' }}>{loadingText}</p>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!email || !password}
              style={{
                width: '100%', padding: '16px', background: '#10b981', color: '#000',
                border: 'none', borderRadius: 16, fontSize: '1rem', fontWeight: 600,
                cursor: !email || !password ? 'not-allowed' : 'pointer',
                opacity: !email || !password ? 0.4 : 1,
                transition: 'opacity 0.15s',
              }}>
              {isSignUp ? 'Зареєструватись' : 'Увійти'}
            </button>
          )}

          <button
            onClick={() => { setIsSignUp(!isSignUp); setError('') }}
            disabled={isLoading}
            style={{
              width: '100%', color: '#666', fontSize: '0.875rem',
              padding: '8px', background: 'none', border: 'none',
              cursor: 'pointer',
            }}>
            {isSignUp ? 'Вже є акаунт? Увійти' : 'Немає акаунту? Зареєструватись'}
          </button>
        </div>
      </div>
    </div>
  )
}
