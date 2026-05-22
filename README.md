# Fin — Особистий фінансовий трекер

PWA для відстеження особистих фінансів. Next.js 14 + Supabase.

**Prod:** https://fin-gamma-one.vercel.app

## Стек
- Next.js 14 App Router + TypeScript
- Tailwind CSS + dark mode
- Supabase v2 (@supabase/ssr) — auth + db
- Recharts — графіки аналітики
- Vaul — bottom sheets
- date-fns — робота з датами
- lucide-react — іконки
- PWA — manifest + service worker

## Сторінки
- `/` — Головна: iOS-калькулятор, додавання транзакцій
- `/dashboard` — Аналітика: DateRangePicker, графіки, breakdown по категоріях
- `/transactions` — Рух коштів: список, редагування, видалення
- `/settings` — Категорії, експорт CSV, вихід

## Запуск локально
```bash
cp .env.example .env.local
# заповни NEXT_PUBLIC_SUPABASE_URL і NEXT_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run dev
```

## DB (Supabase)
Таблиці: `transactions`, `categories`, `user_tax_settings`  
RLS увімкнено на всіх таблицях.
