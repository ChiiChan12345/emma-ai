import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '../../../lib/database';
import { setupDatabase, checkDatabaseConnection, resetDatabase } from '../../../lib/setup-database';

export async function GET(request: NextRequest) {
  try {
    // Check database connection
    const connectionResult = await checkDatabaseConnection();
    
    return NextResponse.json({
      success: true,
      connection: connectionResult
    });
  } catch (error) {
    console.error('Setup API GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check database connection' },
      { status: 500 }
    );
  }
}

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

    const { action } = await request.json();

    if (action === 'setup') {
      // Setup database with sample data
      const result = await setupDatabase(userId);
      return NextResponse.json(result);
    }

    if (action === 'reset') {
      // Reset database (delete all user data)
      const result = await resetDatabase(userId);
      return NextResponse.json(result);
    }

    if (action === 'check') {
      // Check database connection
      const result = await checkDatabaseConnection();
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action. Use "setup", "reset", or "check"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Setup API POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
 