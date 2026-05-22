import type { SupabaseClient } from '@supabase/supabase-js'
import { getCategoriesForActivity, type ActivityType } from './onboarding-categories'

export async function applyOnboardingResults(
  supabase: SupabaseClient,
  userId: string,
  activity: ActivityType,
) {
  await supabase.from('categories').delete().eq('user_id', userId)

  const templates = getCategoriesForActivity(activity)
  const rows = templates.map((t, i) => ({
    user_id: userId,
    name: t.name,
    icon: t.icon,
    color: '#6b7280',
    type: t.type,
    is_archived: false,
    sort_order: i,
  }))

  await supabase.from('categories').insert(rows)
}
