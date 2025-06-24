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
  filters: { [key: string]: any };
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
    filters?: { [key: string]: any };
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
  static calculateRevenueAnalytics(clients: any[]): RevenueAnalytics {
    const activeClients = clients.filter(c => c.status === 'active');
    const totalMRR = activeClients.reduce((sum, client) => sum + (client.contractValue / 12), 0);
    
    // Calculate churn and expansion MRR (mock data for now)
    const churnMRR = totalMRR * 0.05; // 5% monthly churn
    const expansionMRR = totalMRR * 0.15; // 15% expansion
    
    const revenueBySegment = this.calculateRevenueBySegment(activeClients);
    
    return {
      mrr: totalMRR,
      arr: totalMRR * 12,
      churnMRR,
      expansionMRR,
      netRevenueRetention: ((totalMRR - churnMRR + expansionMRR) / totalMRR) * 100,
      averageRevenuePerUser: totalMRR / activeClients.length,
      customerLifetimeValue: (totalMRR / activeClients.length) / 0.05, // Assuming 5% monthly churn
      revenueBySegment,
    };
  }

  static calculateUsageAnalytics(clients: any[]): UsageAnalytics {
    const activeClients = clients.filter(c => c.status === 'active');
    const totalUsage = activeClients.reduce((sum, client) => sum + client.usage.currentMonth, 0);
    
    return {
      totalActiveUsers: activeClients.length,
      dailyActiveUsers: Math.round(activeClients.length * 0.3), // Mock: 30% daily active
      weeklyActiveUsers: Math.round(activeClients.length * 0.7), // Mock: 70% weekly active
      monthlyActiveUsers: activeClients.length,
      averageSessionDuration: 45, // Mock: 45 minutes
      featureAdoptionRates: this.calculateFeatureAdoption(activeClients),
      usageByPlan: this.calculateUsageByPlan(activeClients),
    };
  }

  static calculateHealthAnalytics(clients: any[]): HealthAnalytics {
    const healthScores = clients.map(c => c.healthScore || 0);
    const averageHealth = healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length;
    
    const healthDistribution = [
      { range: '90-100', count: healthScores.filter(s => s >= 90).length, percentage: 0 },
      { range: '70-89', count: healthScores.filter(s => s >= 70 && s < 90).length, percentage: 0 },
      { range: '50-69', count: healthScores.filter(s => s >= 50 && s < 70).length, percentage: 0 },
      { range: '30-49', count: healthScores.filter(s => s >= 30 && s < 50).length, percentage: 0 },
      { range: '0-29', count: healthScores.filter(s => s < 30).length, percentage: 0 },
    ].map(item => ({
      ...item,
      percentage: Math.round((item.count / clients.length) * 100),
    }));

    return {
      overallHealthScore: Math.round(averageHealth),
      healthDistribution,
      healthTrends: this.generateHealthTrends(),
      riskFactors: this.identifyRiskFactors(clients),
      improvementOpportunities: this.identifyImprovementOpportunities(clients),
    };
  }

  static performCohortAnalysis(clients: any[]): CohortAnalysis[] {
    // Group clients by join month
    const cohorts = new Map<string, any[]>();
    
    clients.forEach(client => {
      const joinMonth = new Date(client.joinDate).toISOString().slice(0, 7); // YYYY-MM
      if (!cohorts.has(joinMonth)) {
        cohorts.set(joinMonth, []);
      }
      cohorts.get(joinMonth)!.push(client);
    });

    return Array.from(cohorts.entries()).map(([month, cohortClients]) => {
      const retentionByMonth = this.calculateRetentionByMonth(cohortClients);
      
      return {
        cohortMonth: month,
        clientsStarted: cohortClients.length,
        retentionByMonth,
        averageLifetimeValue: cohortClients.reduce((sum, c) => sum + c.contractValue, 0) / cohortClients.length,
        churnRate: this.calculateCohortChurnRate(cohortClients),
      };
    });
  }

  static generatePredictiveMetrics(clients: any[]): PredictiveMetrics {
    const atRiskClients = clients.filter(c => c.healthScore < 60);
    const highValueClients = clients.filter(c => c.contractValue > 50000);
    
    return {
      churnPrediction: {
        next30Days: atRiskClients.length,
        next90Days: Math.round(atRiskClients.length * 1.5),
        confidence: 78,
      },
      revenueForecast: {
        nextMonth: this.calculateRevenueAnalytics(clients).mrr * 1.05, // 5% growth
        nextQuarter: this.calculateRevenueAnalytics(clients).mrr * 3 * 1.12, // 12% quarterly growth
        confidence: 82,
      },
      expansionOpportunities: highValueClients
        .filter(c => c.healthScore > 80)
        .slice(0, 5)
        .map(client => ({
          clientId: client.id,
          clientName: client.name,
          probability: Math.round(Math.random() * 40 + 60), // 60-100%
          potentialValue: Math.round(client.contractValue * 0.3), // 30% expansion
        })),
    };
  }

  static createCustomDashboard(
    name: string,
    description: string,
    widgets: Omit<DashboardWidget, 'id'>[]
  ): CustomDashboard {
    const now = new Date().toISOString();
    
    return {
      id: `dashboard_${Date.now()}`,
      name,
      description,
      widgets: widgets.map(widget => ({
        ...widget,
        id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      })),
      layout: widgets.map((_, index) => ({
        x: (index % 3) * 4,
        y: Math.floor(index / 3) * 4,
        w: 4,
        h: 4,
      })),
      filters: {},
      createdAt: now,
      updatedAt: now,
    };
  }

  static async exportAnalytics(
    clients: any[],
    options: ExportOptions
  ): Promise<{ success: boolean; data?: any; error?: string }> {
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
  private static calculateRevenueBySegment(clients: any[]) {
    const segments = ['Enterprise', 'Professional', 'Starter'];
    return segments.map(segment => {
      const segmentClients = clients.filter(c => c.plan === segment);
      const revenue = segmentClients.reduce((sum, c) => sum + c.contractValue, 0);
      return {
        segment,
        revenue,
        percentage: Math.round((revenue / clients.reduce((sum, c) => sum + c.contractValue, 0)) * 100),
      };
    });
  }

  private static calculateFeatureAdoption(clients: any[]) {
    const features = ['Dashboard', 'API', 'Integrations', 'Advanced Analytics', 'Custom Reports'];
    return features.map(feature => ({
      feature,
      adoptionRate: Math.round(Math.random() * 40 + 60), // Mock: 60-100%
    }));
  }

  private static calculateUsageByPlan(clients: any[]) {
    const plans = ['Enterprise', 'Professional', 'Starter'];
    return plans.map(plan => {
      const planClients = clients.filter(c => c.plan === plan);
      const averageUsage = planClients.reduce((sum, c) => sum + c.usage.currentMonth, 0) / planClients.length;
      const averageLimit = planClients.reduce((sum, c) => sum + c.usage.limit, 0) / planClients.length;
      return {
        plan,
        averageUsage,
        utilization: Math.round((averageUsage / averageLimit) * 100),
      };
    });
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

  private static identifyRiskFactors(clients: any[]) {
    return [
      { factor: 'Low Usage', impact: 85, prevalence: 23 },
      { factor: 'Inactivity', impact: 78, prevalence: 18 },
      { factor: 'Support Tickets', impact: 65, prevalence: 31 },
      { factor: 'Payment Issues', impact: 92, prevalence: 12 },
    ];
  }

  private static identifyImprovementOpportunities(clients: any[]) {
    return [
      { opportunity: 'Onboarding Optimization', potentialImpact: 15, effort: 'medium' as const },
      { opportunity: 'Feature Adoption Campaign', potentialImpact: 22, effort: 'low' as const },
      { opportunity: 'Proactive Health Monitoring', potentialImpact: 18, effort: 'high' as const },
    ];
  }

  private static calculateRetentionByMonth(cohortClients: any[]) {
    const retention = [];
    for (let month = 1; month <= 12; month++) {
      const retained = Math.round(cohortClients.length * Math.pow(0.95, month - 1)); // 5% monthly churn
      retention.push({
        month,
        retained,
        percentage: Math.round((retained / cohortClients.length) * 100),
      });
    }
    return retention;
  }

  private static calculateCohortChurnRate(cohortClients: any[]) {
    const churned = cohortClients.filter(c => c.status === 'churned').length;
    return Math.round((churned / cohortClients.length) * 100);
  }

  private static convertToCSV(data: any): string {
    // Simple CSV conversion - in reality, you'd use a proper CSV library
    return JSON.stringify(data);
  }

  private static async generatePDFReport(data: any): Promise<string> {
    // Mock PDF generation - in reality, you'd use a library like jsPDF or Puppeteer
    return `PDF report generated at ${new Date().toISOString()}`;
  }

  private static async generateExcelReport(data: any): Promise<string> {
    // Mock Excel generation - in reality, you'd use a library like xlsx
    return `Excel report generated at ${new Date().toISOString()}`;
  }
}

export default AdvancedAnalytics; 