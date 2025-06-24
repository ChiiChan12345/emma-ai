import { Client } from './types';

// Re-export Client type for convenience
export type { Client } from './types';

// Health scoring logic - explains how tags are determined
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

// Client management functions
export function addClient(clientData: Omit<Client, 'id' | 'healthScore' | 'health'>): Client {
  const newClient: Client = {
    ...clientData,
    id: Date.now().toString(),
    healthScore: 0,
    health: 'healthy'
  };
  
  newClient.healthScore = calculateHealthScore(newClient);
  newClient.health = getHealthStatus(newClient.healthScore);
  
  mockClients.push(newClient);
  return newClient;
}

export function updateClient(id: string, updates: Partial<Client>): Client | null {
  const clientIndex = mockClients.findIndex(c => c.id === id);
  if (clientIndex === -1) return null;
  
  mockClients[clientIndex] = { ...mockClients[clientIndex], ...updates };
  
  // Recalculate health
  mockClients[clientIndex].healthScore = calculateHealthScore(mockClients[clientIndex]);
  mockClients[clientIndex].health = getHealthStatus(mockClients[clientIndex].healthScore);
  
  return mockClients[clientIndex];
}

export function deleteClient(id: string): boolean {
  const clientIndex = mockClients.findIndex(c => c.id === id);
  if (clientIndex === -1) return false;
  
  mockClients.splice(clientIndex, 1);
  return true;
}

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    company: 'TechCorp Inc.',
    status: 'active',
    joinDate: '2024-01-15',
    lastActivity: '2024-12-15',
    plan: 'Pro',
    usage: {
      currentMonth: 750,
      lastMonth: 900,
      limit: 1000,
    },
    health: 'healthy',
    healthScore: 85,
    communications: [
      {
        type: 'email',
        date: '2024-12-10',
        subject: 'Welcome to Pro Plan',
        status: 'opened',
      },
    ],
    tags: ['high-value', 'engaged'],
    notes: 'Great client, very engaged with the platform',
    contractValue: 12000,
    nextRenewal: '2025-01-15'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@startup.io',
    company: 'Startup Solutions',
    status: 'trial',
    joinDate: '2024-12-01',
    lastActivity: '2024-12-14',
    plan: 'Trial',
    usage: {
      currentMonth: 450,
      lastMonth: 0,
      limit: 500,
    },
    health: 'at-risk',
    healthScore: 55,
    communications: [
      {
        type: 'email',
        date: '2024-12-01',
        subject: 'Welcome to Your Trial',
        status: 'replied',
      },
    ],
    tags: ['trial', 'potential-churn'],
    notes: 'Trial user, needs conversion focus',
    contractValue: 0,
    nextRenewal: '2024-12-31'
  },
];

// Initialize health scores for existing clients
mockClients.forEach(client => {
  client.healthScore = calculateHealthScore(client);
  client.health = getHealthStatus(client.healthScore);
});

export function getClientById(id: string): Client | undefined {
  return mockClients.find(client => client.id === id);
}

export function getAllClients(): Client[] {
  return mockClients;
} 