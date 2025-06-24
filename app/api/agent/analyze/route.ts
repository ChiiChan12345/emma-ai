import { NextRequest, NextResponse } from 'next/server';
import { openai, DEFAULT_MODEL } from '../../../../lib/openai';
import { getClientById } from '../../../../lib/clientData';
import type { Client } from '../../../../lib/types';

export async function POST(request: NextRequest) {
  try {
    const { clientId, analysisType = 'comprehensive' } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const client = getClientById(clientId);
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Create the analysis prompt based on client data
    const analysisPrompt = createAnalysisPrompt(client, analysisType);

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are Emma, an AI Customer Success Manager. You provide insightful, actionable analysis of client data to help improve customer relationships and reduce churn. Always be professional, empathetic, and data-driven in your responses.`
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const analysis = completion.choices[0]?.message?.content;

    if (!analysis) {
      return NextResponse.json(
        { error: 'Failed to generate analysis' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      client: {
        id: client.id,
        name: client.name,
        company: client.company,
        health: client.health
      },
      analysis,
      analysisType,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function createAnalysisPrompt(client: Client, analysisType: string): string {
  const baseInfo = `
Client Information:
- Name: ${client.name}
- Company: ${client.company}
- Status: ${client.status}
- Plan: ${client.plan}
- Join Date: ${client.joinDate}
- Last Activity: ${client.lastActivity}
- Health Score: ${client.health}

Usage Data:
- Current Month: ${client.usage.currentMonth}/${client.usage.limit}
- Last Month: ${client.usage.lastMonth}
- Usage Trend: ${client.usage.currentMonth > client.usage.lastMonth ? 'Increasing' : 'Decreasing'}

Recent Communications:
${client.communications.map((comm: Client['communications'][0]) => 
  `- ${comm.type}: "${comm.subject}" (${comm.date}) - Status: ${comm.status}`
).join('\n')}
  `;

  switch (analysisType) {
    case 'health':
      return `${baseInfo}\n\nPlease provide a detailed health assessment for this client. Focus on risk factors, usage patterns, and engagement levels. Provide specific recommendations to improve their health score.`;
    
    case 'engagement':
      return `${baseInfo}\n\nAnalyze this client's engagement patterns. Look at their usage trends, communication responsiveness, and activity levels. Suggest specific strategies to increase engagement.`;
    
    case 'churn-risk':
      return `${baseInfo}\n\nAssess this client's churn risk. Identify warning signs, usage patterns, and behavioral indicators. Provide immediate action items to prevent churn.`;
    
    case 'upsell':
      return `${baseInfo}\n\nEvaluate upselling opportunities for this client. Consider their usage patterns, plan limitations, and growth potential. Suggest appropriate upgrade paths and timing.`;
    
    default: // comprehensive
      return `${baseInfo}\n\nProvide a comprehensive Customer Success analysis for this client. Include health assessment, engagement analysis, churn risk evaluation, and actionable recommendations for improving the relationship.`;
  }
} 