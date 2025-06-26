import { NextRequest, NextResponse } from 'next/server';
import { ClientDatabase, getCurrentUserId } from '../../../../lib/database';
import { generateCommunicationSuggestion } from '../../../../lib/openai';

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

    const suggestion = await generateCommunicationSuggestion(client);
    
    return NextResponse.json({
      success: true,
      suggestion
    });
  } catch (error) {
    console.error('Error generating communication suggestion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate suggestion' },
      { status: 500 }
    );
  }
} 