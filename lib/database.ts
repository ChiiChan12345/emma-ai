import { supabaseAdmin } from './supabase'
import { Client, CommunicationSuggestion } from './types'
import { getUser, createServerSupabaseClient } from './auth'

// Database interfaces that match our Supabase schema
export interface DatabaseClient {
  id: string
  user_id: string
  name: string
  email: string
  company: string
  status: 'active' | 'inactive' | 'trial' | 'churned'
  join_date: string
  last_activity: string
  plan: string
  usage_current_month: number
  usage_last_month: number
  usage_limit: number
  health_score: number
  health_status: 'healthy' | 'at-risk' | 'critical'
  tags: string[]
  notes: string
  contract_value: number
  next_renewal: string | null
  created_at: string
  updated_at: string
}

export interface DatabaseCommunication {
  id: string
  client_id: string
  user_id: string
  type: 'email' | 'sms' | 'call'
  subject: string
  content: string | null
  status: 'sent' | 'delivered' | 'opened' | 'replied' | 'failed'
  sent_at: string
  opened_at: string | null
  replied_at: string | null
  created_at: string
}

export interface DatabaseProfile {
  id: string
  email: string
  full_name: string | null
  company_name: string | null
  plan: 'trial' | 'starter' | 'pro' | 'enterprise'
  subscription_status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
  trial_ends_at: string
  created_at: string
  updated_at: string
}

// Helper functions to convert between database and app types
function convertDatabaseClientToClient(dbClient: DatabaseClient, communications: DatabaseCommunication[] = []): Client {
  return {
    id: dbClient.id,
    name: dbClient.name,
    email: dbClient.email,
    company: dbClient.company,
    status: dbClient.status,
    joinDate: dbClient.join_date,
    lastActivity: dbClient.last_activity,
    plan: dbClient.plan,
    usage: {
      currentMonth: dbClient.usage_current_month,
      lastMonth: dbClient.usage_last_month,
      limit: dbClient.usage_limit,
    },
    health: dbClient.health_status,
    healthScore: dbClient.health_score,
    communications: communications.map(comm => ({
      type: comm.type,
      date: comm.sent_at,
      subject: comm.subject,
      status: comm.status as 'sent' | 'opened' | 'replied',
    })),
    tags: dbClient.tags || [],
    notes: dbClient.notes || '',
    contractValue: dbClient.contract_value,
    nextRenewal: dbClient.next_renewal || undefined,
  }
}

function convertClientToDatabaseClient(client: Partial<Client>, userId: string): Partial<DatabaseClient> {
  return {
    user_id: userId,
    name: client.name,
    email: client.email,
    company: client.company,
    status: client.status,
    join_date: client.joinDate,
    last_activity: client.lastActivity,
    plan: client.plan,
    usage_current_month: client.usage?.currentMonth,
    usage_last_month: client.usage?.lastMonth,
    usage_limit: client.usage?.limit,
    health_score: client.healthScore,
    health_status: client.health,
    tags: client.tags,
    notes: client.notes,
    contract_value: client.contractValue,
    next_renewal: client.nextRenewal,
  }
}

// Client database operations
export class ClientDatabase {
  static async getAllClients(userId: string): Promise<Client[]> {
    try {
      const supabase = await createServerSupabaseClient()
      const { data: clients, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (clientError) throw clientError

      if (!clients || clients.length === 0) {
        return []
      }

      // Get communications for all clients
      const clientIds = clients.map(c => c.id)
      const { data: communications } = await supabase
        .from('communications')
        .select('*')
        .in('client_id', clientIds)
        .order('sent_at', { ascending: false })

      // Group communications by client_id
      const commsByClient = communications?.reduce((acc, comm) => {
        if (!acc[comm.client_id]) acc[comm.client_id] = []
        acc[comm.client_id].push(comm)
        return acc
      }, {} as Record<string, DatabaseCommunication[]>) || {}

      return clients.map(client => 
        convertDatabaseClientToClient(client, commsByClient[client.id] || [])
      )
    } catch (error) {
      console.error('Error fetching clients:', error)
      throw new Error('Failed to fetch clients from database')
    }
  }

  static async getClientById(clientId: string, userId: string): Promise<Client | null> {
    try {
      const supabase = await createServerSupabaseClient()
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .eq('user_id', userId)
        .single()

      if (clientError || !client) {
        return null
      }

      // Get communications for this client
      const { data: communications } = await supabase
        .from('communications')
        .select('*')
        .eq('client_id', clientId)
        .order('sent_at', { ascending: false })

      return convertDatabaseClientToClient(client, communications || [])
    } catch (error) {
      console.error('Error fetching client:', error)
      return null
    }
  }

  static async createClient(clientData: Omit<Client, 'id' | 'healthScore' | 'health'>, userId: string): Promise<Client> {
    try {
      const supabase = await createServerSupabaseClient()
      // Calculate health score
      const tempClient = { ...clientData, id: '', healthScore: 0, health: 'healthy' as const }
      const healthScore = calculateHealthScore(tempClient)
      const healthStatus = getHealthStatus(healthScore)

      const dbClient = convertClientToDatabaseClient({
        ...clientData,
        healthScore,
        health: healthStatus,
      }, userId)

      const { data: newClient, error } = await supabase
        .from('clients')
        .insert([dbClient])
        .select()
        .single()

      if (error) throw error

      return convertDatabaseClientToClient(newClient, [])
    } catch (error) {
      console.error('Error creating client:', error)
      throw new Error('Failed to create client')
    }
  }

  static async updateClient(clientId: string, updates: Partial<Client>, userId: string): Promise<Client | null> {
    try {
      const supabase = await createServerSupabaseClient()
      // Get current client to recalculate health if needed
      const currentClient = await this.getClientById(clientId, userId)
      if (!currentClient) return null

      const updatedClient = { ...currentClient, ...updates }
      const healthScore = calculateHealthScore(updatedClient)
      const healthStatus = getHealthStatus(healthScore)

      const dbUpdates = convertClientToDatabaseClient({
        ...updates,
        healthScore,
        health: healthStatus,
      }, userId)

      const { data: updated, error } = await supabase
        .from('clients')
        .update(dbUpdates)
        .eq('id', clientId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      // Get updated communications
      const { data: communications } = await supabase
        .from('communications')
        .select('*')
        .eq('client_id', clientId)
        .order('sent_at', { ascending: false })

      return convertDatabaseClientToClient(updated, communications || [])
    } catch (error) {
      console.error('Error updating client:', error)
      return null
    }
  }

  static async deleteClient(clientId: string, userId: string): Promise<boolean> {
    try {
      const supabase = await createServerSupabaseClient()
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)
        .eq('user_id', userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting client:', error)
      return false
    }
  }
}

// Communication database operations
export class CommunicationDatabase {
  static async createCommunication(
    clientId: string,
    userId: string,
    communication: {
      type: 'email' | 'sms' | 'call'
      subject: string
      content?: string
      status?: 'sent' | 'delivered' | 'opened' | 'replied' | 'failed'
    }
  ): Promise<DatabaseCommunication | null> {
    try {
      const supabase = await createServerSupabaseClient()
      const { data, error } = await supabase
        .from('communications')
        .insert([{
          client_id: clientId,
          user_id: userId,
          type: communication.type,
          subject: communication.subject,
          content: communication.content || null,
          status: communication.status || 'sent',
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating communication:', error)
      return null
    }
  }

  static async getCommunicationsForClient(clientId: string): Promise<DatabaseCommunication[]> {
    try {
      const supabase = await createServerSupabaseClient()
      const { data, error } = await supabase
        .from('communications')
        .select('*')
        .eq('client_id', clientId)
        .order('sent_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching communications:', error)
      return []
    }
  }
}

// Profile database operations
export class ProfileDatabase {
  static async getProfile(userId: string): Promise<DatabaseProfile | null> {
    try {
      const supabase = await createServerSupabaseClient()
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

  static async updateProfile(userId: string, updates: Partial<DatabaseProfile>): Promise<DatabaseProfile | null> {
    try {
      const supabase = await createServerSupabaseClient()
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating profile:', error)
      return null
    }
  }
}

// Health scoring logic (moved from clientData.ts)
export function calculateHealthScore(client: Client): number {
  let score = 100;
  
  // Usage patterns (40% of score)
  const usageRatio = client.usage.currentMonth / client.usage.limit;
  if (usageRatio < 0.2) score -= 30; // Very low usage
  else if (usageRatio < 0.5) score -= 15; // Low usage
  else if (usageRatio > 0.9) score += 10; // High engagement
  
  // Activity recency (30% of score)
  const daysSinceActivity = Math.floor((Date.now() - new Date(client.lastActivity).getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceActivity > 14) score -= 25;
  else if (daysSinceActivity > 7) score -= 10;
  else if (daysSinceActivity <= 1) score += 5;
  
  // Communication engagement (20% of score)
  const recentComms = client.communications.filter(c => 
    new Date(c.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const repliedComms = recentComms.filter(c => c.status === 'replied').length;
  const engagementRate = recentComms.length > 0 ? repliedComms / recentComms.length : 0;
  score += engagementRate * 15;
  
  // Account status (10% of score)
  switch (client.status) {
    case 'trial':
      score -= 10;
      break;
    case 'inactive':
      score -= 30;
      break;
    case 'churned':
      score = 0;
      break;
  }
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getHealthStatus(score: number): 'healthy' | 'at-risk' | 'critical' {
  if (score >= 70) return 'healthy';
  if (score >= 40) return 'at-risk';
  return 'critical';
}

// Utility function to get current user ID from session
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const user = await getUser();
    if (!user) return null;
    return user.id;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
 