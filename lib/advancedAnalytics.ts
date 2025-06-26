import { Client } from './types';

export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'stable';
  unit: string;
  category: 'revenue' | 'health' | 'usage' | 'engagement' | 'churn';
}

export interface CohortAnalysis {
  cohortMonth: string;
  clientsStarted: number;
  retentionByMonth: { month: number; retained: number; percentage: number }[];
  averageLifetimeValue: number;
  churnRate: number;
}

export interface RevenueAnalytics {
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  churnMRR: number;
  expansionMRR: number;
  netRevenueRetention: number;
  averageRevenuePerUser: number;
  customerLifetimeValue: number;
  revenueBySegment: { segment: string; revenue: number; percentage: number }[];
}

export interface UsageAnalytics {
  totalActiveUsers: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionDuration: number;
  featureAdoptionRates: { feature: string; adoptionRate: number }[];
  usageByPlan: { plan: string; averageUsage: number; utilization: number }[];
}

export interface HealthAnalytics {
  overallHealthScore: number;
  healthDistribution: { range: string; count: number; percentage: number }[];
  healthTrends: { date: string; averageHealth: number }[];
  riskFactors: { factor: string; impact: number; prevalence: number }[];
  improvementOpportunities: { opportunity: string; potentialImpact: number; effort: 'low' | 'medium' | 'high' }[];
}

export interface PredictiveMetrics {
  churnPrediction: {
    next30Days: number;
    next90Days: number;
    confidence: number;
  };
  revenueForecast: {
    nextMonth: number;
    nextQuarter: number;
    confidence: number;
  };
  expansionOpportunities: {
    clientId: string;
    clientName: string;
    probability: number;
    potentialValue: number;
  }[];
}

export interface CustomDashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  layout: { x: number; y: number; w: number; h: number }[];
  filters: { [key: string]: unknown };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'gauge' | 'heatmap';
  title: string;
  dataSource: string;
  config: {
    chartType?: 'line' | 'bar' | 'pie' | 'area';
    metrics?: string[];
    dimensions?: string[];
    filters?: { [key: string]: unknown };
    aggregation?: 'sum' | 'avg' | 'count' | 'max' | 'min';
  };
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  dateRange: { start: string; end: string };
  metrics: string[];
  includeCharts: boolean;
  includeRawData: boolean;
}

export class AdvancedAnalytics {
  static calculateRevenueAnalytics(clients: Client[]): RevenueAnalytics {
    const totalRevenue = clients.reduce((sum, client) => sum + client.contractValue, 0);
    const averageRevenue = totalRevenue / clients.length;
    
    return {
      mrr: Math.round(totalRevenue / 12),
      arr: totalRevenue,
      churnMRR: Math.round(totalRevenue * 0.05), // Mock 5% churn
      expansionMRR: Math.round(totalRevenue * 0.15), // Mock 15% expansion
      netRevenueRetention: 110, // Mock NRR
      averageRevenuePerUser: Math.round(averageRevenue),
      customerLifetimeValue: Math.round(averageRevenue * 3), // Mock 3 year LTV
      revenueBySegment: this.calculateRevenueBySegment(clients),
    };
  }

  static calculateUsageAnalytics(clients: Client[]): UsageAnalytics {
    const activeUsers = clients.filter(c => c.status === 'active').length;
    
    return {
      totalActiveUsers: activeUsers,
      dailyActiveUsers: Math.round(activeUsers * 0.6), // Mock 60% daily active
      weeklyActiveUsers: Math.round(activeUsers * 0.8), // Mock 80% weekly active
      monthlyActiveUsers: activeUsers,
      averageSessionDuration: 45, // Mock 45 minutes
      featureAdoptionRates: this.calculateFeatureAdoption(clients),
      usageByPlan: this.calculateUsageByPlan(clients),
    };
  }

  static calculateHealthAnalytics(clients: Client[]): HealthAnalytics {
    const healthScores = clients.map(c => c.healthScore);
    const averageHealth = healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length;
    
    const healthRanges = [
      { range: '90-100', count: clients.filter(c => c.healthScore >= 90).length },
      { range: '70-89', count: clients.filter(c => c.healthScore >= 70 && c.healthScore < 90).length },
      { range: '50-69', count: clients.filter(c => c.healthScore >= 50 && c.healthScore < 70).length },
      { range: '0-49', count: clients.filter(c => c.healthScore < 50).length },
    ].map(range => ({
      ...range,
      percentage: Math.round((range.count / clients.length) * 100),
    }));

    return {
      overallHealthScore: Math.round(averageHealth),
      healthDistribution: healthRanges,
      healthTrends: this.generateHealthTrends(),
      riskFactors: this.identifyRiskFactors(clients),
      improvementOpportunities: this.identifyImprovementOpportunities(clients),
    };
  }

  static performCohortAnalysis(clients: Client[]): CohortAnalysis[] {
    // Group clients by their start month (mock implementation)
    const cohorts = new Map<string, Client[]>();
    
    clients.forEach(client => {
      // Mock cohort month based on client ID for demo
      const cohortMonth = new Date().toISOString().slice(0, 7);
      if (!cohorts.has(cohortMonth)) {
        cohorts.set(cohortMonth, []);
      }
      cohorts.get(cohortMonth)!.push(client);
    });

    return Array.from(cohorts.entries()).map(([month, cohortClients]) => ({
      cohortMonth: month,
      clientsStarted: cohortClients.length,
      retentionByMonth: this.calculateRetentionByMonth(cohortClients),
      averageLifetimeValue: cohortClients.reduce((sum, c) => sum + c.contractValue, 0) / cohortClients.length,
      churnRate: this.calculateCohortChurnRate(cohortClients),
    }));
  }

  static generatePredictiveMetrics(clients: Client[]): PredictiveMetrics {
    const atRiskClients = clients.filter(c => c.healthScore < 60);
    const totalRevenue = clients.reduce((sum, c) => sum + c.contractValue, 0);
    
    return {
      churnPrediction: {
        next30Days: Math.round((atRiskClients.length / clients.length) * 100),
        next90Days: Math.round((atRiskClients.length / clients.length) * 100 * 1.5),
        confidence: 85,
      },
      revenueForecast: {
        nextMonth: Math.round(totalRevenue * 1.05), // 5% growth
        nextQuarter: Math.round(totalRevenue * 1.15), // 15% quarterly growth
        confidence: 78,
      },
      expansionOpportunities: clients
        .filter(c => c.healthScore > 80 && c.usage.currentMonth / c.usage.limit > 0.8)
        .slice(0, 5)
        .map(client => ({
          clientId: client.id,
          clientName: client.name,
          probability: Math.round(Math.random() * 30 + 60), // 60-90%
          potentialValue: Math.round(client.contractValue * 0.5), // 50% upsell
        })),
    };
  }

  static createCustomDashboard(
    name: string,
    description: string,
    widgets: Omit<DashboardWidget, 'id'>[]
  ): CustomDashboard {
    return {
      id: `dashboard_${Date.now()}`,
      name,
      description,
      widgets: widgets.map((widget, index) => ({
        id: `widget_${Date.now()}_${index}`,
        ...widget,
      })),
      layout: widgets.map((_, index) => ({
        x: (index % 2) * 6,
        y: Math.floor(index / 2) * 4,
        w: 6,
        h: 4,
      })),
      filters: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static async exportAnalytics(
    clients: Client[],
    options: ExportOptions
  ): Promise<{ success: boolean; data?: unknown; error?: string }> {
    try {
      const analytics = {
        revenue: this.calculateRevenueAnalytics(clients),
        usage: this.calculateUsageAnalytics(clients),
        health: this.calculateHealthAnalytics(clients),
        cohorts: this.performCohortAnalysis(clients),
        predictive: this.generatePredictiveMetrics(clients),
      };

      switch (options.format) {
        case 'json':
          return { success: true, data: analytics };
        
        case 'csv':
          return { success: true, data: this.convertToCSV(analytics) };
        
        case 'pdf':
          return { success: true, data: await this.generatePDFReport(analytics) };
        
        case 'excel':
          return { success: true, data: await this.generateExcelReport(analytics) };
        
        default:
          return { success: false, error: 'Unsupported format' };
      }
    } catch (error) {
      return { success: false, error: `Export failed: ${error}` };
    }
  }

  static getDefaultDashboards(): CustomDashboard[] {
    return [
      this.createCustomDashboard(
        'Executive Overview',
        'High-level metrics for leadership',
        [
          {
            type: 'metric',
            title: 'Monthly Recurring Revenue',
            dataSource: 'revenue',
            config: { metrics: ['mrr'] },
          },
          {
            type: 'metric',
            title: 'Net Revenue Retention',
            dataSource: 'revenue',
            config: { metrics: ['netRevenueRetention'] },
          },
          {
            type: 'chart',
            title: 'Health Score Distribution',
            dataSource: 'health',
            config: { chartType: 'pie', metrics: ['healthDistribution'] },
          },
          {
            type: 'metric',
            title: 'Churn Risk (30 days)',
            dataSource: 'predictive',
            config: { metrics: ['churnPrediction.next30Days'] },
          },
        ]
      ),
      this.createCustomDashboard(
        'Customer Success Manager',
        'Operational metrics for CSMs',
        [
          {
            type: 'gauge',
            title: 'Overall Health Score',
            dataSource: 'health',
            config: { metrics: ['overallHealthScore'] },
          },
          {
            type: 'chart',
            title: 'Health Trends',
            dataSource: 'health',
            config: { chartType: 'line', metrics: ['healthTrends'] },
          },
          {
            type: 'table',
            title: 'At-Risk Clients',
            dataSource: 'clients',
            config: { filters: { healthScore: { lt: 60 } } },
          },
          {
            type: 'chart',
            title: 'Usage by Plan',
            dataSource: 'usage',
            config: { chartType: 'bar', metrics: ['usageByPlan'] },
          },
        ]
      ),
    ];
  }

  // Helper methods
  private static calculateRevenueBySegment(_clients: Client[]) {
    // Mock implementation - in real app, this would analyze client segments
    return [
      { segment: 'Enterprise', revenue: 150000, percentage: 60 },
      { segment: 'Mid-Market', revenue: 75000, percentage: 30 },
      { segment: 'SMB', revenue: 25000, percentage: 10 },
    ];
  }

  private static calculateFeatureAdoption(_clients: Client[]) {
    // Mock implementation - in real app, this would analyze feature usage
    return [
      { feature: 'Dashboard', adoptionRate: 95 },
      { feature: 'Reports', adoptionRate: 78 },
      { feature: 'API Access', adoptionRate: 45 },
      { feature: 'Integrations', adoptionRate: 62 },
    ];
  }

  private static calculateUsageByPlan(_clients: Client[]) {
    // Mock implementation - in real app, this would analyze usage by plan
    return [
      { plan: 'Basic', averageUsage: 45, utilization: 0.75 },
      { plan: 'Pro', averageUsage: 120, utilization: 0.85 },
      { plan: 'Enterprise', averageUsage: 280, utilization: 0.70 },
    ];
  }

  private static generateHealthTrends() {
    const trends = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      trends.push({
        date: date.toISOString().slice(0, 7),
        averageHealth: Math.round(Math.random() * 20 + 70), // Mock: 70-90
      });
    }
    return trends;
  }

  private static identifyRiskFactors(_clients: Client[]) {
    // Mock implementation
    return [
      { factor: 'Low usage', impact: 8.5, prevalence: 15 },
      { factor: 'Support tickets', impact: 7.2, prevalence: 8 },
      { factor: 'Contract renewal soon', impact: 9.1, prevalence: 12 },
    ];
  }

  private static identifyImprovementOpportunities(_clients: Client[]) {
    // Mock implementation
    return [
      { opportunity: 'Onboarding optimization', potentialImpact: 15, effort: 'medium' as const },
      { opportunity: 'Feature adoption campaigns', potentialImpact: 12, effort: 'low' as const },
      { opportunity: 'Proactive support', potentialImpact: 18, effort: 'high' as const },
    ];
  }

  private static calculateRetentionByMonth(_cohortClients: Client[]) {
    // Mock retention data
    return [
      { month: 1, retained: 100, percentage: 100 },
      { month: 2, retained: 95, percentage: 95 },
      { month: 3, retained: 88, percentage: 88 },
      { month: 6, retained: 82, percentage: 82 },
      { month: 12, retained: 75, percentage: 75 },
    ];
  }

  private static calculateCohortChurnRate(_cohortClients: Client[]) {
    return Math.random() * 0.1 + 0.05; // Mock 5-15% churn rate
  }

  private static convertToCSV(_data: unknown): string {
    // Mock CSV conversion
    return 'header1,header2,header3\nvalue1,value2,value3';
  }

  private static async generatePDFReport(_data: unknown): Promise<string> {
    // Mock PDF generation
    return 'mock-pdf-data';
  }

  private static async generateExcelReport(_data: unknown): Promise<string> {
    // Mock Excel generation
    return 'mock-excel-data';
  }
}

export default AdvancedAnalytics; 