import { openai } from './openai';
import { Client } from './types';

export interface PredictiveAnalysis {
  churnProbability: number;
  churnRisk: 'low' | 'medium' | 'high' | 'critical';
  keyRiskFactors: string[];
  recommendedActions: string[];
  confidenceScore: number;
}

export interface SentimentAnalysis {
  overall: 'positive' | 'neutral' | 'negative';
  score: number; // -1 to 1
  emotions: {
    satisfaction: number;
    frustration: number;
    excitement: number;
    concern: number;
  };
  trends: {
    improving: boolean;
    declining: boolean;
    stable: boolean;
  };
}

export interface MLHealthScore {
  score: number;
  factors: {
    usagePatterns: number;
    engagementLevel: number;
    supportTickets: number;
    featureAdoption: number;
    paymentHistory: number;
  };
  prediction: {
    nextMonthScore: number;
    trend: 'improving' | 'declining' | 'stable';
    confidence: number;
  };
}

export class AIAnalytics {
  static async predictChurnRisk(clientData: Client): Promise<PredictiveAnalysis> {
    try {
      const prompt = `
        Analyze this client data for churn risk prediction:
        
        Client: ${clientData.name} (${clientData.company})
        Usage: ${clientData.usage.currentMonth}/${clientData.usage.limit} (${((clientData.usage.currentMonth / clientData.usage.limit) * 100).toFixed(1)}%)
        Last Activity: ${clientData.lastActivity}
        Plan: ${clientData.plan}
        Health Score: ${clientData.healthScore}
        Communications: ${JSON.stringify(clientData.communications?.slice(-5) || [])}
        Contract Value: $${clientData.contractValue}
        
        Provide a detailed churn risk analysis with:
        1. Churn probability (0-100%)
        2. Risk level (low/medium/high/critical)
        3. Key risk factors
        4. Recommended actions
        5. Confidence score (0-100%)
        
        Format as JSON.
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      });

      const analysis = JSON.parse(completion.choices[0].message.content || '{}');
      
      return {
        churnProbability: analysis.churnProbability || 0,
        churnRisk: analysis.riskLevel || 'low',
        keyRiskFactors: analysis.keyRiskFactors || [],
        recommendedActions: analysis.recommendedActions || [],
        confidenceScore: analysis.confidenceScore || 0,
      };
    } catch (error) {
      console.error('Error in churn prediction:', error);
      return {
        churnProbability: 0,
        churnRisk: 'low',
        keyRiskFactors: ['Unable to analyze'],
        recommendedActions: ['Manual review required'],
        confidenceScore: 0,
      };
    }
  }

  static async analyzeSentiment(communications: Client['communications']): Promise<SentimentAnalysis> {
    try {
      const recentComms = communications.slice(-10);
      const prompt = `
        Analyze the sentiment of these client communications:
        
        ${recentComms.map(comm => `
        Date: ${comm.date}
        Type: ${comm.type}
        Subject: ${comm.subject}
        Status: ${comm.status}
        `).join('\n')}
        
        Provide sentiment analysis with:
        1. Overall sentiment (positive/neutral/negative)
        2. Sentiment score (-1 to 1)
        3. Emotion breakdown (satisfaction, frustration, excitement, concern) as percentages
        4. Trend analysis (improving/declining/stable)
        
        Format as JSON.
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      });

      const analysis = JSON.parse(completion.choices[0].message.content || '{}');
      
      return {
        overall: analysis.overall || 'neutral',
        score: analysis.score || 0,
        emotions: {
          satisfaction: analysis.emotions?.satisfaction || 50,
          frustration: analysis.emotions?.frustration || 25,
          excitement: analysis.emotions?.excitement || 15,
          concern: analysis.emotions?.concern || 10,
        },
        trends: {
          improving: analysis.trends?.improving || false,
          declining: analysis.trends?.declining || false,
          stable: analysis.trends?.stable || true,
        },
      };
    } catch (error) {
      console.error('Error in sentiment analysis:', error);
      return {
        overall: 'neutral',
        score: 0,
        emotions: { satisfaction: 50, frustration: 25, excitement: 15, concern: 10 },
        trends: { improving: false, declining: false, stable: true },
      };
    }
  }

  static calculateMLHealthScore(clientData: Client): MLHealthScore {
    // Advanced ML-based health scoring algorithm
    const factors = {
      usagePatterns: this.calculateUsageScore(clientData),
      engagementLevel: this.calculateEngagementScore(clientData),
      supportTickets: this.calculateSupportScore(clientData),
      featureAdoption: this.calculateFeatureAdoptionScore(clientData),
      paymentHistory: this.calculatePaymentScore(clientData),
    };

    // Weighted scoring
    const weights = {
      usagePatterns: 0.3,
      engagementLevel: 0.25,
      supportTickets: 0.2,
      featureAdoption: 0.15,
      paymentHistory: 0.1,
    };

    const score = Object.entries(factors).reduce((total, [key, value]) => {
      return total + (value * weights[key as keyof typeof weights]);
    }, 0);

    // Predict next month's score based on trends
    const trend = this.calculateTrend(clientData);
    const nextMonthScore = Math.max(0, Math.min(100, score + trend.change));

    return {
      score: Math.round(score),
      factors,
      prediction: {
        nextMonthScore: Math.round(nextMonthScore),
        trend: trend.direction,
        confidence: trend.confidence,
      },
    };
  }

  private static calculateUsageScore(clientData: Client): number {
    const usageRatio = clientData.usage.currentMonth / clientData.usage.limit;
    const lastMonthRatio = clientData.usage.lastMonth / clientData.usage.limit;
    
    // Optimal usage is 60-80% of limit
    let score = 0;
    if (usageRatio >= 0.6 && usageRatio <= 0.8) {
      score = 100;
    } else if (usageRatio >= 0.4 && usageRatio < 0.6) {
      score = 80;
    } else if (usageRatio >= 0.8 && usageRatio <= 1.0) {
      score = 90;
    } else if (usageRatio < 0.4) {
      score = 40;
    } else {
      score = 60; // Over limit
    }

    // Adjust for trend
    const growth = usageRatio - lastMonthRatio;
    if (growth > 0.1) score += 10;
    else if (growth < -0.1) score -= 15;

    return Math.max(0, Math.min(100, score));
  }

  private static calculateEngagementScore(clientData: Client): number {
    const daysSinceLastActivity = Math.floor(
      (new Date().getTime() - new Date(clientData.lastActivity).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastActivity <= 1) return 100;
    if (daysSinceLastActivity <= 3) return 90;
    if (daysSinceLastActivity <= 7) return 75;
    if (daysSinceLastActivity <= 14) return 50;
    if (daysSinceLastActivity <= 30) return 25;
    return 10;
  }

  private static calculateSupportScore(clientData: Client): number {
    // Assume fewer support tickets = better health
    const supportTickets = (clientData as any).supportTickets || 0;
    if (supportTickets === 0) return 100;
    if (supportTickets <= 2) return 80;
    if (supportTickets <= 5) return 60;
    if (supportTickets <= 10) return 40;
    return 20;
  }

  private static calculateFeatureAdoptionScore(clientData: Client): number {
    // Mock feature adoption calculation
    const adoptedFeatures = (clientData as any).featuresUsed || [];
    const totalFeatures = 10; // Assume 10 total features
    const adoptionRate = adoptedFeatures.length / totalFeatures;
    return Math.round(adoptionRate * 100);
  }

  private static calculatePaymentScore(clientData: Client): number {
    // Mock payment history calculation
    const status = clientData.status;
    if (status === 'active') return 100;
    if (status === 'trial') return 70;
    if (status === 'inactive') return 30;
    return 10; // churned
  }

  private static calculateTrend(clientData: Client): { direction: 'improving' | 'declining' | 'stable'; change: number; confidence: number } {
    // Mock trend calculation based on recent activity
    const usageGrowth = (clientData.usage.currentMonth - clientData.usage.lastMonth) / clientData.usage.lastMonth;
    
    if (usageGrowth > 0.1) {
      return { direction: 'improving', change: 5, confidence: 85 };
    } else if (usageGrowth < -0.1) {
      return { direction: 'declining', change: -8, confidence: 80 };
    } else {
      return { direction: 'stable', change: 0, confidence: 70 };
    }
  }
}

export default AIAnalytics; 