import OpenAI from 'openai';
import type { Client, CommunicationSuggestion } from './types';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const DEFAULT_MODEL = 'gpt-4o-mini';

export async function generateCommunicationSuggestion(client: Client): Promise<CommunicationSuggestion> {
  try {
    const prompt = createCommunicationPrompt(client);

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are Emma, an AI Customer Success Manager. You craft personalized, professional communications that strengthen client relationships. Always maintain a warm, helpful tone while being direct and actionable. Format your response as JSON with 'type', 'subject', 'content', and 'timing' fields.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    const suggestionText = completion.choices[0]?.message?.content;

    if (!suggestionText) {
      throw new Error('Failed to generate communication suggestion');
    }

    // Try to parse the JSON response from OpenAI
    let suggestion: CommunicationSuggestion;
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
        type: 'email',
        subject: extractSubject(suggestionText),
        content: suggestionText,
        timing: 'Send within 24 hours'
      };
    }

    return suggestion;
  } catch (error) {
    console.error('Error generating communication suggestion:', error);
    throw new Error('Failed to generate communication suggestion');
  }
}

function createCommunicationPrompt(client: Client): string {
  const clientInfo = `
Client: ${client.name} from ${client.company}
Status: ${client.status} (${client.plan} plan)
Health: ${client.health} (Score: ${client.healthScore})
Last Activity: ${client.lastActivity}
Usage: ${client.usage.currentMonth}/${client.usage.limit} this month (${client.usage.lastMonth} last month)

Recent Communications:
${client.communications.slice(0, 5).map(comm => 
  `- ${comm.date}: ${comm.subject} (${comm.status})`
).join('\n')}

Tags: ${client.tags.join(', ')}
Notes: ${client.notes}
  `;

  let prompt = `${clientInfo}\n\n`;

  // Determine communication type and urgency based on client health
  if (client.health === 'critical') {
    prompt += `This client is in CRITICAL health status. Create an urgent email that addresses their concerns immediately. Focus on retention and problem-solving.`;
  } else if (client.health === 'at-risk') {
    prompt += `This client is AT RISK. Create a proactive email to re-engage them and address potential issues before they become critical.`;
  } else {
    prompt += `This client is healthy. Create a relationship-building email that adds value and strengthens the partnership.`;
  }

  prompt += `\n\nReturn your response as JSON with these fields:
- "type": "email" (default communication type)
- "subject": A compelling subject line
- "content": The full email content (professional but warm)
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