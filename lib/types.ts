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

// Performance and Cache Types
export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  apiResponseTime: number;
  cacheHitRate: number;
  bundleSize: number;
}

export interface PerformanceReport {
  metrics: PerformanceMetrics;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  recommendations: string[];
}

// AI Analytics Types
export interface ChurnAnalysis {
  churnProbability: number;
  keyRiskFactors: string[];
  recommendations: string[];
  confidenceScore: number;
}

export interface AIInsights {
  churnRisk: {
    probability: number;
    risk: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
  };
  healthTrends: {
    improving: number;
    declining: number;
    stable: number;
  };
  recommendations: string[];
}

// Form Data Types
export interface ClientFormData {
  name: string;
  email: string;
  company: string;
  status: 'trial' | 'active' | 'inactive' | 'churned';
  plan: string;
  contractValue: number;
  notes: string;
  tags: string;
  usage: {
    limit: number;
  };
}

// Settings Types
export interface AppSettings {
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
    clientUpdates: boolean;
    systemAlerts: boolean;
    weeklyReports: boolean;
  };
  privacy: {
    dataCollection: boolean;
    analytics: boolean;
    thirdPartyIntegrations: boolean;
    publicProfile: boolean;
  };
  performance: {
    autoSync: boolean;
    cacheData: boolean;
    backgroundProcessing: boolean;
    lowBandwidthMode: boolean;
  };
  display: {
    compactMode: boolean;
    showAdvancedMetrics: boolean;
    animationsEnabled: boolean;
  };
  ai: {
    enableSuggestions: boolean;
    autoAnalysis: boolean;
    learningMode: boolean;
    confidenceThreshold: number;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    auditLogging: boolean;
  };
}

export interface UserProfile {
  business: {
    companyName: string;
    industry: string;
    companySize: string;
    website: string;
    address: string;
    city: string;
    state: string;
  };
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    jobTitle: string;
    department: string;
  };
  preferences: {
    timezone: string;
    language: string;
    dateFormat: string;
    timeFormat: string;
    currency: string;
    theme: string;
    notifications: boolean;
    emailSignature: string;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    passwordLastChanged: string;
    loginHistory: Array<{
      date: string;
      ip: string;
      location: string;
    }>;
  };
}

// Automation Types
export interface AutomationRule {
  id: string;
  name: string;
  trigger: {
    type: string;
    condition: string;
    value: number | string;
  };
  action: {
    type: string;
    templateId: string;
    delay: number;
    priority: string;
  };
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Utility Types
export type SetStateAction<T> = T | ((prevState: T) => T);
export type EventHandler<T = Element> = (event: React.FormEvent<T>) => void;
export type ChangeHandler<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => void; 