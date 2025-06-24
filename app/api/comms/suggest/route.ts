import { NextRequest, NextResponse } from 'next/server';
import { openai, DEFAULT_MODEL } from '../../../../lib/openai';
import { getClientById, Client } from '../../../../lib/clientData';

export async function POST(request: NextRequest) {
  try {
    const { 
      clientId, 
      communicationType = 'email',
      context = '',
      urgency = 'normal'
    } = await request.json();

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

    // Create the communication suggestion prompt
    const suggestionPrompt = createCommunicationPrompt(
      client, 
      communicationType, 
      context, 
      urgency
    );

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are Emma, an AI Customer Success Manager. You craft personalized, professional communications that strengthen client relationships. Always maintain a warm, helpful tone while being direct and actionable. Format your response as JSON with 'subject', 'content', and 'timing' fields.`
        },
        {
          role: 'user',
          content: suggestionPrompt
        }
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    const suggestionText = completion.choices[0]?.message?.content;

    if (!suggestionText) {
      return NextResponse.json(
        { error: 'Failed to generate communication suggestion' },
        { status: 500 }
      );
    }

    // Try to parse the JSON response from OpenAI
    let suggestion;
    try {
      // Clean up the response text (remove markdown code blocks if present)
      const cleanedText = suggestionText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      
      suggestion = JSON.parse(cleanedText);
    } catch {
      // Fallback if OpenAI doesn't return valid JSON
      suggestion = {
        subject: extractSubject(suggestionText),
        content: suggestionText,
        timing: 'Send within 24 hours'
      };
    }

    return NextResponse.json({
      success: true,
      client: {
        id: client.id,
        name: client.name,
        company: client.company,
        health: client.health
      },
      suggestion: {
        type: communicationType,
        urgency,
        subject: suggestion.subject,
        content: suggestion.content,
        timing: suggestion.timing,
        context
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Communication Suggestion API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function createCommunicationPrompt(
  client: Client, 
  type: string, 
  context: string, 
  urgency: string
): string {
  const clientInfo = `
Client: ${client.name} from ${client.company}
Status: ${client.status} (${client.plan} plan)
Health: ${client.health}
Last Activity: ${client.lastActivity}
Usage: ${client.usage.currentMonth}/${client.usage.limit} this month (${client.usage.lastMonth} last month)

Recent Communications:
${client.communications.map((comm: Client['communications'][0]) => 
  `- ${comm.date}: ${comm.subject} (${comm.status})`
).join('\n')}
  `;

  let prompt = `${clientInfo}\n\nContext: ${context}\n\n`;

  switch (type) {
    case 'email':
      prompt += `Create a professional email for this client. Consider their current health status and usage patterns. `;
      break;
    case 'sms':
      prompt += `Create a brief, friendly SMS message for this client. Keep it concise but personal. `;
      break;
    case 'call':
      prompt += `Create talking points and an agenda for a phone call with this client. Include key discussion topics. `;
      break;
    default:
      prompt += `Create a professional communication for this client. `;
  }

  switch (urgency) {
    case 'high':
      prompt += `This is urgent and requires immediate attention. Address any critical issues directly.`;
      break;
    case 'low':
      prompt += `This is a low-priority, relationship-building communication. Focus on value and support.`;
      break;
    default:
      prompt += `This is a normal priority communication. Balance relationship building with actionable items.`;
  }

  prompt += `\n\nReturn your response as JSON with these fields:
- "subject": A compelling subject line/title
- "content": The full communication content
- "timing": When to send this communication

Make it personal, actionable, and aligned with their current status and needs.`;

  return prompt;
}

function extractSubject(text: string): string {
  // Simple fallback to extract a subject from unstructured text
  const lines = text.split('\n');
  const firstLine = lines[0]?.trim();
  
  if (firstLine && firstLine.length < 100) {
    return firstLine.replace(/^(Subject:|Re:|Fwd:)/i, '').trim();
  }
  
  return 'Follow-up on your account';
} 