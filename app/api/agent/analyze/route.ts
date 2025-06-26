import { NextRequest, NextResponse } from 'next/server';
import { ClientDatabase, getCurrentUserId } from '../../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    // Get current user
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { clientId } = await request.json();
    
    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const client = await ClientDatabase.getClientById(clientId, userId);
    
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Perform analysis based on client data
    const analysis = {
      healthScore: client.healthScore,
      healthStatus: client.health,
      riskFactors: generateRiskFactors(client),
      recommendations: generateRecommendations(client),
      usageAnalysis: {
        currentUsage: client.usage.currentMonth,
        usageLimit: client.usage.limit,
        usagePercentage: Math.round((client.usage.currentMonth / client.usage.limit) * 100),
        trend: client.usage.currentMonth > client.usage.lastMonth ? 'increasing' : 'decreasing'
      },
      communicationAnalysis: {
        totalCommunications: client.communications.length,
        recentCommunications: client.communications.filter(c => 
          new Date(c.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
        engagementRate: calculateEngagementRate(client.communications)
      }
    };
    
    return NextResponse.json({
      success: true,
      client: {
        id: client.id,
        name: client.name,
        company: client.company
      },
      analysis
    });
  } catch (error) {
    console.error('Error analyzing client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze client' },
      { status: 500 }
    );
  }
}

function generateRiskFactors(client: any): string[] {
  const factors = [];
  
  if (client.usage.currentMonth < client.usage.limit * 0.2) {
    factors.push('Very low usage - only using ' + Math.round((client.usage.currentMonth / client.usage.limit) * 100) + '% of limit');
  }
  
  if (client.usage.currentMonth < client.usage.lastMonth) {
    factors.push('Usage declining compared to last month');
  }
  
  const daysSinceActivity = Math.floor((Date.now() - new Date(client.lastActivity).getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceActivity > 14) {
    factors.push('No activity for ' + daysSinceActivity + ' days');
  }
  
  const recentComms = client.communications.filter((c: any) => 
    new Date(c.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  if (recentComms.length === 0) {
    factors.push('No recent communications');
  }
  
  if (client.status === 'trial') {
    factors.push('Still on trial - needs conversion focus');
  }
  
  return factors;
}

function generateRecommendations(client: any): string[] {
  const recommendations = [];
  
  if (client.health === 'critical') {
    recommendations.push('Schedule immediate call to address concerns');
    recommendations.push('Offer additional support or training');
    recommendations.push('Consider account rescue strategy');
  } else if (client.health === 'at-risk') {
    recommendations.push('Proactive outreach to re-engage');
    recommendations.push('Share relevant use cases or success stories');
    recommendations.push('Schedule check-in call');
  } else {
    recommendations.push('Continue regular engagement');
    recommendations.push('Explore expansion opportunities');
    recommendations.push('Share new features or updates');
  }
  
  if (client.usage.currentMonth < client.usage.limit * 0.5) {
    recommendations.push('Provide usage optimization guidance');
    recommendations.push('Share best practices for platform utilization');
  }
  
  if (client.status === 'trial') {
    recommendations.push('Focus on conversion to paid plan');
    recommendations.push('Demonstrate clear ROI and value');
  }
  
  return recommendations;
}

function calculateEngagementRate(communications: any[]): number {
  if (communications.length === 0) return 0;
  
  const recentComms = communications.filter(c => 
    new Date(c.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  
  if (recentComms.length === 0) return 0;
  
  const repliedComms = recentComms.filter(c => c.status === 'replied').length;
  return Math.round((repliedComms / recentComms.length) * 100);
} 