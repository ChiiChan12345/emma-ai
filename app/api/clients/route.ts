import { NextRequest, NextResponse } from 'next/server';
import { ClientDatabase, getCurrentUserId } from '../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const health = searchParams.get('health');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    let clients = await ClientDatabase.getAllClients(userId);

    // Apply filters
    if (status && status !== 'all') {
      clients = clients.filter(client => client.status === status);
    }

    if (health && health !== 'all') {
      clients = clients.filter(client => client.health === health);
    }

    // Apply sorting
    clients.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      // Handle nested properties like usage.currentMonth
      if (sortBy.includes('.')) {
        const keys = sortBy.split('.');
        aValue = keys.reduce((obj: unknown, key) => (obj as Record<string, unknown>)?.[key], a as unknown) as string | number;
        bValue = keys.reduce((obj: unknown, key) => (obj as Record<string, unknown>)?.[key], b as unknown) as string | number;
      } else {
        aValue = (a as unknown as Record<string, unknown>)[sortBy] as string | number;
        bValue = (b as unknown as Record<string, unknown>)[sortBy] as string | number;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    // Calculate summary
    const summary = {
      total: clients.length,
      byStatus: {
        active: clients.filter(c => c.status === 'active').length,
        trial: clients.filter(c => c.status === 'trial').length,
        inactive: clients.filter(c => c.status === 'inactive').length,
        churned: clients.filter(c => c.status === 'churned').length,
      },
      byHealth: {
        healthy: clients.filter(c => c.health === 'healthy').length,
        'at-risk': clients.filter(c => c.health === 'at-risk').length,
        critical: clients.filter(c => c.health === 'critical').length,
      },
      averageUsage: clients.length > 0 
        ? Math.round(clients.reduce((sum, c) => sum + (c.usage.currentMonth / c.usage.limit * 100), 0) / clients.length)
        : 0,
    };

    return NextResponse.json({
      success: true,
      clients,
      summary,
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
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

    const body = await request.json();
    const { action, clientId, clientData } = body;

    if (action === 'get') {
      // Get specific client details
      const client = await ClientDatabase.getClientById(clientId, userId);
      if (!client) {
        return NextResponse.json(
          { success: false, error: 'Client not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, client });
    }

    if (action === 'create') {
      // Create new client
      if (!clientData || !clientData.name || !clientData.email || !clientData.company) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields: name, email, company' },
          { status: 400 }
        );
      }

      const newClient = await ClientDatabase.createClient({
        name: clientData.name,
        email: clientData.email,
        company: clientData.company,
        status: clientData.status || 'trial',
        joinDate: clientData.joinDate || new Date().toISOString().split('T')[0],
        lastActivity: clientData.lastActivity || new Date().toISOString().split('T')[0],
        plan: clientData.plan || 'Trial',
        usage: clientData.usage || {
          currentMonth: 0,
          lastMonth: 0,
          limit: 500,
        },
        communications: [],
        tags: clientData.tags || [],
        notes: clientData.notes || '',
        contractValue: clientData.contractValue || 0,
        nextRenewal: clientData.nextRenewal,
      }, userId);

      return NextResponse.json({ success: true, client: newClient });
    }

    if (action === 'update') {
      // Update existing client
      if (!clientId) {
        return NextResponse.json(
          { success: false, error: 'Client ID is required for updates' },
          { status: 400 }
        );
      }

      const updatedClient = await ClientDatabase.updateClient(clientId, clientData, userId);
      if (!updatedClient) {
        return NextResponse.json(
          { success: false, error: 'Client not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, client: updatedClient });
    }

    if (action === 'delete') {
      // Delete client
      if (!clientId) {
        return NextResponse.json(
          { success: false, error: 'Client ID is required for deletion' },
          { status: 400 }
        );
      }

      const deleted = await ClientDatabase.deleteClient(clientId, userId);
      if (!deleted) {
        return NextResponse.json(
          { success: false, error: 'Client not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, message: 'Client deleted successfully' });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in POST /api/clients:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 