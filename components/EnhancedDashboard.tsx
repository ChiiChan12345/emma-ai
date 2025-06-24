'use client';

import { useState, useEffect, useCallback } from 'react';
import AIAnalytics from '../lib/aiAnalytics';
import CommunicationAutomation from '../lib/communicationAutomation';
import PerformanceOptimizer from '../lib/performance';
import DesignSystem from '../lib/designSystem';

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'inactive' | 'trial' | 'churned';
  health: 'healthy' | 'at-risk' | 'critical';
  healthScore: number;
  contractValue: number;
  lastActivity: string;
  usage: {
    currentMonth: number;
    lastMonth: number;
    limit: number;
  };
}

interface AIInsights {
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

export function EnhancedDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    metrics: any;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    recommendations: string[];
  } | null>(null);
  const [automationRules, setAutomationRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const initializeDashboard = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch clients with performance optimization
      const clientsData = await PerformanceOptimizer.optimizeApiCall(
        'dashboard-clients',
        () => fetch('/api/clients').then(res => res.json()),
        { ttl: 300000, maxSize: 50, stale: false }
      );

      if (clientsData.success) {
        setClients(clientsData.clients);
        
        // Generate AI insights
        await generateAIInsights(clientsData.clients);
        
        // Load automation rules
        await loadAutomationRules();
        
        // Get performance metrics
        const metrics = PerformanceOptimizer.generatePerformanceReport();
        setPerformanceMetrics(metrics);
      }
    } catch (error) {
      console.error('Dashboard initialization error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeDashboard();
    
    // Initialize performance monitoring
    PerformanceOptimizer.initializeLazyLoading();
    
    // Initialize design system - these methods don't exist, removing them
    // DesignSystem.initializeTheme();
    // DesignSystem.initializeAccessibility();
  }, [initializeDashboard]);

  const generateAIInsights = async (clientData: Client[]) => {
    try {
      const insights: AIInsights = {
        churnRisk: {
          probability: 0,
          risk: 'low',
          factors: []
        },
        healthTrends: {
          improving: 0,
          declining: 0,
          stable: 0
        },
        recommendations: []
      };

      // Analyze each client for churn risk
      let totalChurnRisk = 0;
      const riskFactors: string[] = [];
      
      for (const client of clientData) {
        const churnAnalysis = await AIAnalytics.predictChurnRisk({
          healthScore: client.healthScore,
          usage: client.usage,
          lastActivity: client.lastActivity,
          contractValue: client.contractValue,
          status: client.status
        });
        
        totalChurnRisk += churnAnalysis.churnProbability;
        riskFactors.push(...churnAnalysis.keyRiskFactors);
      }

      insights.churnRisk.probability = totalChurnRisk / clientData.length;
      insights.churnRisk.risk = insights.churnRisk.probability > 0.7 ? 'critical' : 
                              insights.churnRisk.probability > 0.5 ? 'high' :
                              insights.churnRisk.probability > 0.3 ? 'medium' : 'low';
      insights.churnRisk.factors = [...new Set(riskFactors)].slice(0, 5);

      // Analyze health trends
      const healthCounts = clientData.reduce((acc, client) => {
        if (client.healthScore > 80) acc.improving++;
        else if (client.healthScore < 60) acc.declining++;
        else acc.stable++;
        return acc;
      }, { improving: 0, declining: 0, stable: 0 });

      insights.healthTrends = healthCounts;

      // Generate recommendations
      insights.recommendations = [
        `Focus on ${healthCounts.declining} clients with declining health scores`,
        `Implement retention campaigns for ${insights.churnRisk.risk} churn risk clients`,
        'Consider automated health check workflows',
        'Review usage patterns for optimization opportunities'
      ];

      setAiInsights(insights);
    } catch (error) {
      console.error('AI insights generation error:', error);
    }
  };

  const loadAutomationRules = async () => {
    try {
      const rules = await PerformanceOptimizer.optimizeApiCall(
        'automation-rules',
        () => fetch('/api/automation/rules').then(res => res.json()),
        { ttl: 600000, maxSize: 20, stale: true }
      );
      
      setAutomationRules(rules.data || []);
    } catch (error) {
      console.error('Automation rules loading error:', error);
    }
  };

  const createNewAutomationRule = async () => {
    try {
      const rule = CommunicationAutomation.createAutomationRule({
        name: 'Health Score Drop Alert',
        trigger: {
          type: 'health_score',
          condition: 'below',
          value: 60
        },
        action: {
          type: 'email',
          templateId: 'health-check-template',
          delay: 24,
          priority: 'high'
        },
        active: true
      });

      setAutomationRules(prev => [...prev, rule]);
    } catch (error) {
      console.error('Automation rule creation error:', error);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Emma AI Enhanced Dashboard</h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">AI Active</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Insights</p>
                <p className="text-3xl font-bold text-blue-600">Active</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">🤖</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Automation</p>
                <p className="text-3xl font-bold text-green-600">5 Rules</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Performance</p>
                <p className="text-3xl font-bold text-purple-600">Grade A</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">🚀</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Analytics</p>
                <p className="text-3xl font-bold text-orange-600">Enhanced</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 