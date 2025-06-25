import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'

// Client-side auth helper
export const createClient = () => createClientComponentClient()

// Server-side auth helper
export const createServerClient = cache(() => 
  createServerComponentClient({ cookies })
)

// Get current user on server
export async function getUser() {
  const supabase = createServerClient()
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
  const supabase = createServerClient()
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