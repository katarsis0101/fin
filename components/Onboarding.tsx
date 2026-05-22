'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { applyOnboardingResults } from '@/lib/apply-onboarding'
import type { ActivityType } from '@/lib/onboarding-categories'

const ACTIVITIES: { id: ActivityType; label: string; icon: string }[] = [
  { id: 'lawyer',       label: 'Юрист / Адвокат',   icon: '⚖️' },
  { id: 'it',           label: 'IT / Фриланс',       icon: '💻' },
  { id: 'beauty',       label: "Б'юті-бізнес",       icon: '💅' },
  { id: 'accountant',   label: 'Бухгалтер',          icon: '🧮' },
  { id: 'trade',        label: 'Торгівля',           icon: '🛒' },
  { id: 'entrepreneur', label: 'Підприємець',        icon: '💼' },
  { id: 'medical',      label: 'Медицина',           icon: '🏥' },
  { id: 'realestate',   label: 'Нерухомість',        icon: '🏠' },
  { id: 'personal',     label: 'Особисті фінанси',   icon: '👤' },
]

interface Props {
  onComplete: () => void
}

export default function Onboarding({ onComplete }: Props) {
  const [slide, setSlide] = useState(0)
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  const [applyText, setApplyText] = useState('')
  const supabase = createClient()

  const handleFinish = async () => {
    setIsApplying(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && selectedActivity) {
        setApplyText('Налаштовуємо категорії...')
        await applyOnboardingResults(supabase, user.id, selectedActivity)
        setApplyText('Зберігаємо налаштування...')
        await new Promise(r => setTimeout(r, 400))
        setApplyText('Готово! Завантажуємо...')
        await new Promise(r => setTimeout(r, 300))
      }
      localStorage.setItem('fin_onboarding_done', '1')
      onComplete()
    } catch (err) {
      console.error('Onboarding error:', err)
      localStorage.setItem('fin_onboarding_done', '1')
      setIsApplying(false)
      onComplete()
    }
  }

  if (isApplying) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: '#0a0a0a', zIndex: 100,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 16,
      }}>
        <div style={{
          width: 40, height: 40, border: '2px solid #10b981',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: '#888', fontSize: '0.875rem' }}>{applyText}</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0a0a0a', zIndex: 100,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '24px',
    }}>
      {slide === 0 && (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: 400 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>💰</div>
          <h1 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 700, marginBottom: 8 }}>
            Ласкаво просимо до Fin
          </h1>
          <p style={{ color: '#888', fontSize: '0.9375rem', marginBottom: 40, lineHeight: 1.5 }}>
            Особистий фінансовий трекер для контролю доходів і витрат
          </p>
          <button
            onClick={() => setSlide(1)}
            style={{
              width: '100%', padding: '16px', background: '#10b981', color: '#000',
              border: 'none', borderRadius: 16, fontSize: '1rem', fontWeight: 600,
              cursor: 'pointer',
            }}>
            Почати налаштування →
          </button>
        </div>
      )}

      {slide === 1 && (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h2 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>
            Ваша сфера діяльності
          </h2>
          <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: 20, textAlign: 'center' }}>
            Оберіть, щоб отримати відповідні категорії
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, width: '100%', marginBottom: 24 }}>
            {ACTIVITIES.map(a => (
              <button key={a.id} onClick={() => setSelectedActivity(a.id)}
                style={{
                  padding: '12px 8px', borderRadius: 12, textAlign: 'center', cursor: 'pointer',
                  background: selectedActivity === a.id ? 'rgba(16,185,129,0.15)' : '#1a1a1a',
                  border: `1px solid ${selectedActivity === a.id ? '#10b981' : '#2a2a2a'}`,
                  color: '#fff', fontSize: '0.75rem', fontWeight: 500,
                  transition: 'all 0.15s',
                }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{a.icon}</div>
                {a.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setSlide(0)}
              style={{
                flex: 1, padding: '14px', background: '#1a1a1a', color: '#888',
                border: '1px solid #2a2a2a', borderRadius: 14, fontSize: '0.9375rem',
                fontWeight: 600, cursor: 'pointer',
              }}>
              ← Назад
            </button>
            <button
              onClick={handleFinish}
              disabled={!selectedActivity}
              style={{
                flex: 2, padding: '14px', background: selectedActivity ? '#10b981' : '#1a1a1a',
                color: selectedActivity ? '#000' : '#555',
                border: 'none', borderRadius: 14, fontSize: '0.9375rem',
                fontWeight: 600, cursor: selectedActivity ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
              }}>
              Розпочати
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
