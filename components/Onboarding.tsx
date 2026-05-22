'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { applyColorScheme, type ColorScheme } from './ColorSchemeProvider'

const SLIDES = [
  {
    id: 1, visual: 'logo',
    title: 'Ласкаво просимо до Fin',
    subtitle: 'Ваш особистий фінансовий трекер.\nВносьте доходи, контролюйте витрати\nта аналізуйте свої фінанси.',
    hint: null,
    isColorPicker: false,
    cta: null,
  },
  {
    id: 2, visual: 'keypad',
    title: 'Вносьте транзакції миттєво',
    subtitle: 'Введіть суму на клавіатурі,\nоберіть категорію та збережіть.\nВсі суми в гривні (₴).',
    hint: '💡 Підтримує вирази: 500 + 250 =',
    isColorPicker: false,
    cta: null,
  },
  {
    id: 3, visual: 'income_expense',
    title: 'Доходи та витрати',
    subtitle: 'Кожна транзакція — або дохід (зелений)\nабо витрата (червоний).\nДодавайте коментарі.',
    hint: null,
    isColorPicker: false,
    cta: null,
  },
  {
    id: 4, visual: 'taxes',
    title: 'Калькулятор податків',
    subtitle: 'При додаванні доходу оберіть\nподатковий профіль (ФОП, ПДФО, ВЗ).\nFin автоматично запише витрати.',
    hint: '💡 Налаштуйте один раз — застосовується завжди',
    isColorPicker: false,
    cta: null,
  },
  {
    id: 5, visual: 'analytics',
    title: 'Потужна аналітика',
    subtitle: 'Відстежуйте тренди по днях,\nтижнях, місяцях та роках.\nПорівнюйте з попередніми періодами.',
    hint: null,
    isColorPicker: false,
    cta: null,
  },
  {
    id: 6, visual: 'scheme',
    title: 'Оберіть колірну схему',
    subtitle: 'Персоналізуйте додаток під себе.',
    hint: null,
    isColorPicker: true,
    cta: null,
  },
  {
    id: 7, visual: 'ready',
    title: 'Все готово!',
    subtitle: 'Почніть з вашої першої транзакції.\nFin допоможе тримати фінанси\nпід контролем.',
    hint: null,
    isColorPicker: false,
    cta: 'Розпочати →',
  },
]

const SCHEMES: { key: ColorScheme; label: string; color: string }[] = [
  { key: 'emerald', label: 'Смарагд', color: '#10b981' },
  { key: 'blue',    label: 'Синій',   color: '#3b82f6' },
  { key: 'violet',  label: 'Фіолет',  color: '#8b5cf6' },
  { key: 'rose',    label: 'Рожевий', color: '#f43f5e' },
  { key: 'amber',   label: 'Бурштин', color: '#f59e0b' },
]

function SlideVisual({ visual }: { visual: string }) {
  switch (visual) {
    case 'logo':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
            {[0.35, 0.5, 0.75, 1].map((h, i) => (
              <div key={i} style={{
                width: 14, height: h * 52, borderRadius: 4,
                background: i >= 2 ? 'var(--accent)' : 'var(--bg-raised)',
              }} />
            ))}
          </div>
          <span style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.04em' }}>Fin</span>
        </div>
      )
    case 'keypad':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, width: 160 }}>
          {['7','8','9','4','5','6','1','2','3','0','.','⌫'].map(k => (
            <div key={k} style={{
              height: 36, background: 'var(--bg-raised)', borderRadius: 8, border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)',
            }}>{k}</div>
          ))}
        </div>
      )
    case 'income_expense':
      return (
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ background: 'var(--income-dim)', border: '1px solid var(--income-color)', borderRadius: 12, padding: '10px 20px', color: 'var(--income-color)', fontWeight: 600 }}>+ Дохід</div>
          <div style={{ background: 'var(--expense-dim)', border: '1px solid var(--expense-color)', borderRadius: 12, padding: '10px 20px', color: 'var(--expense-color)', fontWeight: 600 }}>− Витрата</div>
        </div>
      )
    case 'taxes':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 180 }}>
          {['ПДФО 18%', 'ВЗ 5%', 'ЄП 5%', 'ЄСВ фікс.'].map(t => (
            <div key={t} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-raised)', borderRadius: 8, padding: '8px 12px', fontSize: '0.8125rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{t}</span>
              <span style={{ color: 'var(--accent)' }}>✓</span>
            </div>
          ))}
        </div>
      )
    case 'analytics':
      return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 64 }}>
          {[30, 50, 40, 70, 55, 80, 65].map((h, i) => (
            <div key={i} style={{
              width: 14, height: h, borderRadius: '3px 3px 0 0',
              background: i === 5 ? 'var(--accent)' : 'var(--bg-raised)',
              border: `1px solid ${i === 5 ? 'var(--accent)' : 'var(--border)'}`,
            }} />
          ))}
        </div>
      )
    case 'ready':
      return (
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--accent-dim)', border: '2px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>✓</div>
      )
    default:
      return <div style={{ width: 80, height: 80, background: 'var(--bg-raised)', borderRadius: 12 }} />
  }
}

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [selectedScheme, setSelectedScheme] = useState<ColorScheme>('emerald')
  const touchStart = useRef(0)

  const slide = SLIDES[current]
  const isLast = current === SLIDES.length - 1

  function goNext() { setDirection(1); setCurrent(c => Math.min(c + 1, SLIDES.length - 1)) }
  function goPrev() { setDirection(-1); setCurrent(c => Math.max(c - 1, 0)) }
  function finish() {
    applyColorScheme(selectedScheme)
    localStorage.setItem('fin_onboarding_done', '1')
    onComplete()
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '60%' : '-60%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-60%' : '60%', opacity: 0 }),
  }

  return (
    <div
      style={{ height: '100dvh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '48px 24px 40px', overflow: 'hidden' }}
      onTouchStart={e => { touchStart.current = e.targetTouches[0].clientX }}
      onTouchEnd={e => {
        const diff = touchStart.current - e.changedTouches[0].clientX
        if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev() }
      }}>

      {/* Skip */}
      <div style={{ alignSelf: 'flex-end' }}>
        {!isLast && (
          <button onClick={finish} style={{ color: 'var(--text-muted)', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', minHeight: 'auto', padding: '4px 0' }}>
            Пропустити
          </button>
        )}
      </div>

      {/* Slide content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', overflow: 'hidden', gap: 32 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={current} custom={direction} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, width: '100%' }}>

            <div style={{ minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {slide.isColorPicker ? (
                <div style={{ display: 'flex', gap: 14 }}>
                  {SCHEMES.map(s => (
                    <button key={s.key} onClick={() => { setSelectedScheme(s.key); applyColorScheme(s.key) }}
                      style={{
                        width: 44, height: 44, borderRadius: '50%', background: s.color, border: 'none', cursor: 'pointer',
                        outline: selectedScheme === s.key ? '3px solid white' : '3px solid transparent',
                        outlineOffset: 2, transition: 'outline 0.15s', minHeight: 'auto',
                      }} title={s.label} />
                  ))}
                </div>
              ) : (
                <SlideVisual visual={slide.visual} />
              )}
            </div>

            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 10 }}>{slide.title}</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{slide.subtitle}</p>
              {slide.hint && (
                <p style={{ marginTop: 12, fontSize: '0.8125rem', color: 'var(--text-muted)', background: 'var(--bg-raised)', borderRadius: 8, padding: '6px 12px', display: 'inline-block' }}>{slide.hint}</p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {SLIDES.map((_, i) => (
            <div key={i} style={{ width: i === current ? 20 : 6, height: 6, borderRadius: 3, background: i === current ? 'var(--accent)' : 'var(--bg-raised)', transition: 'all 0.3s' }} />
          ))}
        </div>

        <button onClick={isLast ? finish : goNext}
          style={{ width: '100%', padding: '16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
          {isLast ? (slide.cta || 'Розпочати →') : 'Далі'}
        </button>

        {current > 0 && !isLast && (
          <button onClick={goPrev} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', minHeight: 'auto' }}>
            Назад
          </button>
        )}
      </div>
    </div>
  )
}
