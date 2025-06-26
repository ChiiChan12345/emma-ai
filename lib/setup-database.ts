import { supabaseAdmin } from './supabase'
import { ClientDatabase } from './database'

// Sample client data for development/testing
const sampleClients = [
  {
    name: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    company: 'TechCorp Inc.',
    status: 'active' as const,
    joinDate: '2024-01-15',
    lastActivity: '2024-12-15',
    plan: 'Pro',
    usage: {
      currentMonth: 750,
      lastMonth: 900,
      limit: 1000,
    },
    communications: [],
    tags: ['high-value', 'engaged'],
    notes: 'Great client, very engaged with the platform',
    contractValue: 12000,
    nextRenewal: '2025-01-15'
  },
  {
    name: 'Mike Chen',
    email: 'mike@startup.io',
    company: 'Startup Solutions',
    status: 'trial' as const,
    joinDate: '2024-12-01',
    lastActivity: '2024-12-14',
    plan: 'Trial',
    usage: {
      currentMonth: 450,
      lastMonth: 0,
      limit: 500,
    },
    communications: [],
    tags: ['trial', 'potential-churn'],
    notes: 'Trial user, needs conversion focus',
    contractValue: 0,
    nextRenewal: '2024-12-31'
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily@designstudio.com',
    company: 'Creative Design Studio',
    status: 'active' as const,
    joinDate: '2024-03-10',
    lastActivity: '2024-12-13',
    plan: 'Starter',
    usage: {
      currentMonth: 280,
      lastMonth: 320,
      limit: 500,
    },
    communications: [],
    tags: ['creative', 'growing'],
    notes: 'Growing agency, potential for upgrade',
    contractValue: 5000,
    nextRenewal: '2025-03-10'
  }
];

export async function setupDatabase(userId: string): Promise<{ success: boolean; message: string; clients?: any[] }> {
  try {
    console.log('Setting up database for user:', userId);

    // Check if user already has clients
    const existingClients = await ClientDatabase.getAllClients(userId);
    if (existingClients.length > 0) {
      return {
        success: false,
        message: `Database already has ${existingClients.length} clients. Skipping setup.`
      };
    }

    // Create sample clients
    const createdClients = [];
    for (const clientData of sampleClients) {
      try {
        const client = await ClientDatabase.createClient(clientData, userId);
        createdClients.push(client);
        console.log(`Created client: ${client.name}`);
      } catch (error) {
        console.error(`Failed to create client ${clientData.name}:`, error);
      }
    }

    // Create some sample communications
    if (createdClients.length > 0) {
      try {
        // Add communications for the first client
        const firstClient = createdClients[0];
        await supabaseAdmin
          .from('communications')
          .insert([
            {
              client_id: firstClient.id,
              user_id: userId,
              type: 'email',
              subject: 'Welcome to Pro Plan',
              content: 'Thank you for upgrading to our Pro plan! We\'re excited to help you achieve your goals.',
              status: 'opened',
              sent_at: new Date('2024-12-10').toISOString(),
            },
            {
              client_id: firstClient.id,
              user_id: userId,
              type: 'email',
              subject: 'Monthly Check-in',
              content: 'How has your experience been with our platform this month?',
              status: 'replied',
              sent_at: new Date('2024-12-05').toISOString(),
              replied_at: new Date('2024-12-06').toISOString(),
            }
          ]);

        // Add communication for trial client
        if (createdClients.length > 1) {
          const trialClient = createdClients[1];
          await supabaseAdmin
            .from('communications')
            .insert([
              {
                client_id: trialClient.id,
                user_id: userId,
                type: 'email',
                subject: 'Welcome to Your Trial',
                content: 'Welcome to your free trial! Let us know if you need any help getting started.',
                status: 'replied',
                sent_at: new Date('2024-12-01').toISOString(),
                replied_at: new Date('2024-12-02').toISOString(),
              }
            ]);
        }

        console.log('Created sample communications');
      } catch (error) {
        console.error('Failed to create sample communications:', error);
      }
    }

    return {
      success: true,
      message: `Successfully created ${createdClients.length} sample clients with communications.`,
      clients: createdClients
    };

  } catch (error) {
    console.error('Database setup failed:', error);
    return {
      success: false,
      message: `Database setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export async function checkDatabaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    // Test database connection by checking if tables exist
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      return {
        success: false,
        message: `Database connection failed: ${error.message}`
      };
    }

    return {
      success: true,
      message: 'Database connection successful'
    };
  } catch (error) {
    return {
      success: false,
      message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export async function resetDatabase(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log('Resetting database for user:', userId);

    // Delete all communications first (due to foreign key constraints)
    const { error: commError } = await supabaseAdmin
      .from('communications')
      .delete()
      .eq('user_id', userId);

    if (commError) {
      throw new Error(`Failed to delete communications: ${commError.message}`);
    }

    // Delete all clients
    const { error: clientError } = await supabaseAdmin
      .from('clients')
      .delete()
      .eq('user_id', userId);

    if (clientError) {
      throw new Error(`Failed to delete clients: ${clientError.message}`);
    }

    console.log('Database reset completed');

    return {
      success: true,
      message: 'Database reset successfully'
    };
  } catch (error) {
    console.error('Database reset failed:', error);
    return {
      success: false,
      message: `Database reset failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
 