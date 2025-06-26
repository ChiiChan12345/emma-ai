import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'

// Client-side auth helper
export const createClient = () => createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Server-side auth helper
export const createServerSupabaseClient = cache(async () => {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
})

// Get current user on server
export async function getUser() {
  const supabase = await createServerSupabaseClient()
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// Get user profile
export async function getUserProfile(userId: string) {
  const supabase = await createServerSupabaseClient()
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

// Check if user has active subscription
export async function hasActiveSubscription(userId: string) {
  const profile = await getUserProfile(userId)
  return profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'
}

// Check if trial has expired
export async function isTrialExpired(userId: string) {
  const profile = await getUserProfile(userId)
  if (!profile?.trial_ends_at) return false
  return new Date(profile.trial_ends_at) < new Date()
} 