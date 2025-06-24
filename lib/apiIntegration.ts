export interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters: APIParameter[];
  responses: APIResponse[];
  authentication: 'none' | 'bearer' | 'api-key' | 'oauth';
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
}

export interface APIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  example?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface APIResponse {
  statusCode: number;
  description: string;
  schema: Record<string, any>;
  example?: any;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  secret?: string;
  headers?: Record<string, string>;
  retryPolicy: {
    maxRetries: number;
    backoffStrategy: 'exponential' | 'linear' | 'fixed';
    initialDelay: number;
  };
}

export interface ThirdPartyIntegration {
  id: string;
  name: string;
  type: 'crm' | 'email' | 'analytics' | 'payment' | 'communication';
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, any>;
  endpoints: string[];
  lastSync?: Date;
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
}

export class APIManager {
  private static instance: APIManager;
  private endpoints: Map<string, APIEndpoint> = new Map();
  private webhooks: Map<string, Webhook> = new Map();
  private integrations: Map<string, ThirdPartyIntegration> = new Map();
  private rateLimiters: Map<string, { count: number; resetTime: number }> = new Map();

  private constructor() {
    this.initializeDefaultEndpoints();
    this.initializeDefaultIntegrations();
  }

  static getInstance(): APIManager {
    if (!APIManager.instance) {
      APIManager.instance = new APIManager();
    }
    return APIManager.instance;
  }

  private initializeDefaultEndpoints(): void {
    const defaultEndpoints: APIEndpoint[] = [
      {
        id: 'get-clients',
        name: 'Get Clients',
        method: 'GET',
        path: '/api/clients',
        description: 'Retrieve a list of all clients with optional filtering',
        parameters: [
          {
            name: 'status',
            type: 'string',
            required: false,
            description: 'Filter by client status',
            example: 'active'
          },
          {
            name: 'health',
            type: 'string',
            required: false,
            description: 'Filter by health status',
            example: 'healthy'
          },
          {
            name: 'limit',
            type: 'number',
            required: false,
            description: 'Maximum number of clients to return',
            example: 50,
            validation: { min: 1, max: 1000 }
          }
        ],
        responses: [
          {
            statusCode: 200,
            description: 'Successfully retrieved clients',
            schema: {
              success: 'boolean',
              clients: 'array',
              summary: 'object'
            }
          },
          {
            statusCode: 400,
            description: 'Invalid parameters',
            schema: {
              success: 'boolean',
              error: 'string'
            }
          }
        ],
        authentication: 'bearer',
        rateLimit: {
          requests: 100,
          windowMs: 60000 // 1 minute
        }
      },
      {
        id: 'create-client',
        name: 'Create Client',
        method: 'POST',
        path: '/api/clients',
        description: 'Create a new client record',
        parameters: [
          {
            name: 'name',
            type: 'string',
            required: true,
            description: 'Client full name',
            example: 'John Doe'
          },
          {
            name: 'email',
            type: 'string',
            required: true,
            description: 'Client email address',
            example: 'john@example.com',
            validation: { pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$' }
          },
          {
            name: 'company',
            type: 'string',
            required: true,
            description: 'Client company name',
            example: 'TechCorp Inc.'
          }
        ],
        responses: [
          {
            statusCode: 201,
            description: 'Client created successfully',
            schema: {
              success: 'boolean',
              client: 'object'
            }
          },
          {
            statusCode: 409,
            description: 'Client already exists',
            schema: {
              success: 'boolean',
              error: 'string'
            }
          }
        ],
        authentication: 'bearer'
      },
      {
        id: 'update-client',
        name: 'Update Client',
        method: 'PUT',
        path: '/api/clients/:id',
        description: 'Update an existing client record',
        parameters: [
          {
            name: 'id',
            type: 'string',
            required: true,
            description: 'Client ID',
            example: 'client-123'
          },
          {
            name: 'name',
            type: 'string',
            required: false,
            description: 'Updated client name',
            example: 'John Smith'
          },
          {
            name: 'status',
            type: 'string',
            required: false,
            description: 'Updated client status',
            example: 'active'
          }
        ],
        responses: [
          {
            statusCode: 200,
            description: 'Client updated successfully',
            schema: {
              success: 'boolean',
              client: 'object'
            }
          },
          {
            statusCode: 404,
            description: 'Client not found',
            schema: {
              success: 'boolean',
              error: 'string'
            }
          }
        ],
        authentication: 'bearer'
      },
      {
        id: 'delete-client',
        name: 'Delete Client',
        method: 'DELETE',
        path: '/api/clients/:id',
        description: 'Delete a client record',
        parameters: [
          {
            name: 'id',
            type: 'string',
            required: true,
            description: 'Client ID to delete',
            example: 'client-123'
          }
        ],
        responses: [
          {
            statusCode: 200,
            description: 'Client deleted successfully',
            schema: {
              success: 'boolean',
              message: 'string'
            }
          },
          {
            statusCode: 404,
            description: 'Client not found',
            schema: {
              success: 'boolean',
              error: 'string'
            }
          }
        ],
        authentication: 'bearer'
      },
      {
        id: 'ai-analyze',
        name: 'AI Analysis',
        method: 'POST',
        path: '/api/ai/analyze',
        description: 'Perform AI analysis on client data',
        parameters: [
          {
            name: 'clientId',
            type: 'string',
            required: true,
            description: 'Client ID to analyze',
            example: 'client-123'
          },
          {
            name: 'analysisType',
            type: 'string',
            required: true,
            description: 'Type of analysis to perform',
            example: 'churn-prediction'
          }
        ],
        responses: [
          {
            statusCode: 200,
            description: 'Analysis completed successfully',
            schema: {
              success: 'boolean',
              analysis: 'object'
            }
          }
        ],
        authentication: 'bearer',
        rateLimit: {
          requests: 20,
          windowMs: 60000 // 1 minute
        }
      }
    ];

    defaultEndpoints.forEach(endpoint => {
      this.endpoints.set(endpoint.id, endpoint);
    });
  }

  private initializeDefaultIntegrations(): void {
    const defaultIntegrations: ThirdPartyIntegration[] = [
      {
        id: 'salesforce-crm',
        name: 'Salesforce CRM',
        type: 'crm',
        provider: 'Salesforce',
        status: 'disconnected',
        config: {
          apiVersion: 'v54.0',
          sandbox: false
        },
        endpoints: [
          '/services/data/v54.0/sobjects/Account',
          '/services/data/v54.0/sobjects/Contact',
          '/services/data/v54.0/sobjects/Opportunity'
        ],
        syncFrequency: 'hourly'
      },
      {
        id: 'hubspot-crm',
        name: 'HubSpot CRM',
        type: 'crm',
        provider: 'HubSpot',
        status: 'disconnected',
        config: {
          portalId: null,
          hapiKey: null
        },
        endpoints: [
          '/contacts/v1/lists/all/contacts/all',
          '/deals/v1/deal/paged',
          '/companies/v2/companies/paged'
        ],
        syncFrequency: 'hourly'
      },
      {
        id: 'sendgrid-email',
        name: 'SendGrid Email',
        type: 'email',
        provider: 'SendGrid',
        status: 'disconnected',
        config: {
          apiKey: null,
          fromEmail: null,
          fromName: null
        },
        endpoints: [
          '/v3/mail/send',
          '/v3/templates',
          '/v3/marketing/campaigns'
        ],
        syncFrequency: 'realtime'
      },
      {
        id: 'stripe-payment',
        name: 'Stripe Payments',
        type: 'payment',
        provider: 'Stripe',
        status: 'disconnected',
        config: {
          publishableKey: null,
          secretKey: null,
          webhookSecret: null
        },
        endpoints: [
          '/v1/customers',
          '/v1/subscriptions',
          '/v1/invoices',
          '/v1/payment_intents'
        ],
        syncFrequency: 'realtime'
      },
      {
        id: 'slack-communication',
        name: 'Slack Integration',
        type: 'communication',
        provider: 'Slack',
        status: 'disconnected',
        config: {
          botToken: null,
          signingSecret: null,
          defaultChannel: '#customer-success'
        },
        endpoints: [
          '/api/chat.postMessage',
          '/api/channels.list',
          '/api/users.list'
        ],
        syncFrequency: 'realtime'
      }
    ];

    defaultIntegrations.forEach(integration => {
      this.integrations.set(integration.id, integration);
    });
  }

  // API Endpoint Management
  getAllEndpoints(): APIEndpoint[] {
    return Array.from(this.endpoints.values());
  }

  getEndpoint(id: string): APIEndpoint | undefined {
    return this.endpoints.get(id);
  }

  addEndpoint(endpoint: APIEndpoint): void {
    this.endpoints.set(endpoint.id, endpoint);
  }

  updateEndpoint(id: string, updates: Partial<APIEndpoint>): boolean {
    const endpoint = this.endpoints.get(id);
    if (!endpoint) return false;

    this.endpoints.set(id, { ...endpoint, ...updates });
    return true;
  }

  deleteEndpoint(id: string): boolean {
    return this.endpoints.delete(id);
  }

  // Rate Limiting
  checkRateLimit(endpointId: string, clientId: string): boolean {
    const endpoint = this.endpoints.get(endpointId);
    if (!endpoint?.rateLimit) return true;

    const key = `${endpointId}:${clientId}`;
    const limiter = this.rateLimiters.get(key);
    const now = Date.now();

    if (!limiter || now > limiter.resetTime) {
      // Reset or initialize rate limiter
      this.rateLimiters.set(key, {
        count: 1,
        resetTime: now + endpoint.rateLimit.windowMs
      });
      return true;
    }

    if (limiter.count >= endpoint.rateLimit.requests) {
      return false; // Rate limit exceeded
    }

    limiter.count++;
    return true;
  }

  // Webhook Management
  getAllWebhooks(): Webhook[] {
    return Array.from(this.webhooks.values());
  }

  addWebhook(webhook: Webhook): void {
    this.webhooks.set(webhook.id, webhook);
  }

  updateWebhook(id: string, updates: Partial<Webhook>): boolean {
    const webhook = this.webhooks.get(id);
    if (!webhook) return false;

    this.webhooks.set(id, { ...webhook, ...updates });
    return true;
  }

  deleteWebhook(id: string): boolean {
    return this.webhooks.delete(id);
  }

  async triggerWebhook(webhookId: string, event: string, data: any): Promise<boolean> {
    const webhook = this.webhooks.get(webhookId);
    if (!webhook || !webhook.active || !webhook.events.includes(event)) {
      return false;
    }

    try {
      const payload = {
        event,
        data,
        timestamp: new Date().toISOString(),
        webhook_id: webhookId
      };

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': this.generateWebhookSignature(payload, webhook.secret),
          ...webhook.headers
        },
        body: JSON.stringify(payload)
      });

      return response.ok;
    } catch (error) {
      console.error(`Webhook ${webhookId} failed:`, error);
      return false;
    }
  }

  private generateWebhookSignature(payload: any, secret?: string): string {
    if (!secret) return '';
    
    // In a real implementation, use crypto.createHmac
    return `sha256=${Buffer.from(JSON.stringify(payload) + secret).toString('base64')}`;
  }

  // Third-party Integration Management
  getAllIntegrations(): ThirdPartyIntegration[] {
    return Array.from(this.integrations.values());
  }

  getIntegration(id: string): ThirdPartyIntegration | undefined {
    return this.integrations.get(id);
  }

  updateIntegrationStatus(id: string, status: ThirdPartyIntegration['status']): boolean {
    const integration = this.integrations.get(id);
    if (!integration) return false;

    integration.status = status;
    integration.lastSync = status === 'connected' ? new Date() : integration.lastSync;
    return true;
  }

  updateIntegrationConfig(id: string, config: Record<string, any>): boolean {
    const integration = this.integrations.get(id);
    if (!integration) return false;

    integration.config = { ...integration.config, ...config };
    return true;
  }

  async testIntegration(id: string): Promise<{ success: boolean; message: string }> {
    const integration = this.integrations.get(id);
    if (!integration) {
      return { success: false, message: 'Integration not found' };
    }

    try {
      // Mock integration test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate different test results
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        this.updateIntegrationStatus(id, 'connected');
        return { success: true, message: 'Integration test successful' };
      } else {
        this.updateIntegrationStatus(id, 'error');
        return { success: false, message: 'Integration test failed: Authentication error' };
      }
    } catch (error) {
      this.updateIntegrationStatus(id, 'error');
      return { success: false, message: `Integration test failed: ${error}` };
    }
  }

  async syncIntegration(id: string): Promise<{ success: boolean; syncedRecords: number }> {
    const integration = this.integrations.get(id);
    if (!integration || integration.status !== 'connected') {
      return { success: false, syncedRecords: 0 };
    }

    try {
      // Mock sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const syncedRecords = Math.floor(Math.random() * 100) + 10;
      integration.lastSync = new Date();
      
      return { success: true, syncedRecords };
    } catch (error) {
      console.error(`Sync failed for integration ${id}:`, error);
      return { success: false, syncedRecords: 0 };
    }
  }

  // API Documentation Generation
  generateOpenAPISpec(): any {
    const spec = {
      openapi: '3.0.0',
      info: {
        title: 'Emma AI Customer Success API',
        version: '1.0.0',
        description: 'RESTful API for Emma AI Customer Success Manager'
      },
      servers: [
        {
          url: '/api',
          description: 'Production server'
        }
      ],
      paths: {} as any,
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          },
          apiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-Key'
          }
        }
      }
    };

    // Generate paths from endpoints
    this.endpoints.forEach(endpoint => {
      const path = endpoint.path.replace(/:(\w+)/g, '{$1}');
      
      if (!spec.paths[path]) {
        spec.paths[path] = {};
      }

      spec.paths[path][endpoint.method.toLowerCase()] = {
        summary: endpoint.name,
        description: endpoint.description,
        parameters: endpoint.parameters.map(param => ({
          name: param.name,
          in: param.name === 'id' ? 'path' : 'query',
          required: param.required,
          description: param.description,
          schema: {
            type: param.type,
            example: param.example
          }
        })),
        responses: endpoint.responses.reduce((acc, response) => {
          acc[response.statusCode] = {
            description: response.description,
            content: {
              'application/json': {
                schema: response.schema,
                example: response.example
              }
            }
          };
          return acc;
        }, {} as any),
        security: endpoint.authentication !== 'none' ? [
          { [endpoint.authentication === 'bearer' ? 'bearerAuth' : 'apiKeyAuth']: [] }
        ] : []
      };
    });

    return spec;
  }

  // Analytics and Monitoring
  getAPIAnalytics(): {
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
    topEndpoints: Array<{ endpoint: string; requests: number }>;
    rateLimitHits: number;
  } {
    // Mock analytics data
    return {
      totalRequests: Math.floor(Math.random() * 10000) + 5000,
      averageResponseTime: Math.floor(Math.random() * 200) + 100,
      errorRate: Math.random() * 0.05, // 0-5% error rate
      topEndpoints: [
        { endpoint: '/api/clients', requests: 1250 },
        { endpoint: '/api/clients/:id', requests: 890 },
        { endpoint: '/api/ai/analyze', requests: 445 },
        { endpoint: '/api/webhooks', requests: 234 }
      ],
      rateLimitHits: Math.floor(Math.random() * 50) + 10
    };
  }
}

export const apiManager = APIManager.getInstance();
export default APIManager; 