// Centralized type definitions for Emma AI
export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'inactive' | 'trial' | 'churned';
  joinDate: string;
  lastActivity: string;
  plan: string;
  usage: {
    currentMonth: number;
    lastMonth: number;
    limit: number;
  };
  health: 'healthy' | 'at-risk' | 'critical';
  healthScore: number;
  communications: Array<{
    type: 'email' | 'sms' | 'call';
    date: string;
    subject: string;
    status: 'sent' | 'opened' | 'replied';
  }>;
  tags: string[];
  notes: string;
  contractValue: number;
  nextRenewal?: string;
}

export interface Summary {
  total: number;
  byStatus: {
    active: number;
    trial: number;
    inactive: number;
    churned: number;
  };
  byHealth: {
    healthy: number;
    'at-risk': number;
    critical: number;
  };
  averageUsage: number;
}

export interface Filters {
  status: string;
  health: string;
}

// Component Props Types
export interface ClientListProps {
  clients: Client[];
  onClientSelect: (client: Client) => void;
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  loading?: boolean;
}

export interface ClientDetailProps {
  client: Client;
  onBack: () => void;
  onClose?: () => void;
  onUpdate?: (client: Client) => void;
}

// API Response Types
export interface ClientsResponse {
  success: boolean;
  clients: Client[];
  summary: Summary;
  error?: string;
}

export interface ClientResponse {
  success: boolean;
  client?: Client;
  error?: string;
} 