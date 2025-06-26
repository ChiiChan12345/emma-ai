'use client';

import { useState, useEffect } from 'react';

interface Integration {
  id: string;
  name: string;
  provider: string;
  type: 'crm' | 'email' | 'analytics' | 'payment' | 'communication';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
  syncFrequency: string;
}

interface APIEndpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  status: 'active' | 'inactive';
  requests: number;
  responseTime: number;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  lastTriggered?: Date;
}

export function IntegrationsDashboard() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [activeTab, setActiveTab] = useState<'integrations' | 'endpoints' | 'webhooks'>('integrations');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    setLoading(true);
    
    // Mock data
    const mockIntegrations: Integration[] = [
      {
        id: '1',
        name: 'Salesforce CRM',
        provider: 'Salesforce',
        type: 'crm',
        status: 'connected',
        lastSync: new Date(Date.now() - 3600000),
        syncFrequency: 'hourly'
      },
      {
        id: '2',
        name: 'SendGrid Email',
        provider: 'SendGrid',
        type: 'email',
        status: 'connected',
        lastSync: new Date(Date.now() - 1800000),
        syncFrequency: 'realtime'
      },
      {
        id: '3',
        name: 'HubSpot CRM',
        provider: 'HubSpot',
        type: 'crm',
        status: 'disconnected',
        syncFrequency: 'daily'
      },
      {
        id: '4',
        name: 'Stripe Payments',
        provider: 'Stripe',
        type: 'payment',
        status: 'error',
        lastSync: new Date(Date.now() - 86400000),
        syncFrequency: 'realtime'
      },
      {
        id: '5',
        name: 'Slack Communication',
        provider: 'Slack',
        type: 'communication',
        status: 'disconnected',
        syncFrequency: 'realtime'
      },
      {
        id: '6',
        name: 'Google Analytics',
        provider: 'Google',
        type: 'analytics',
        status: 'connected',
        lastSync: new Date(Date.now() - 7200000),
        syncFrequency: 'daily'
      }
    ];

    const mockEndpoints: APIEndpoint[] = [
      {
        id: '1',
        name: 'Get Clients',
        method: 'GET',
        path: '/api/clients',
        status: 'active',
        requests: 1250,
        responseTime: 120
      },
      {
        id: '2',
        name: 'Create Client',
        method: 'POST',
        path: '/api/clients',
        status: 'active',
        requests: 890,
        responseTime: 250
      },
      {
        id: '3',
        name: 'AI Analysis',
        method: 'POST',
        path: '/api/ai/analyze',
        status: 'active',
        requests: 445,
        responseTime: 1200
      },
      {
        id: '4',
        name: 'Update Client',
        method: 'PUT',
        path: '/api/clients/:id',
        status: 'active',
        requests: 320,
        responseTime: 180
      },
      {
        id: '5',
        name: 'Delete Client',
        method: 'DELETE',
        path: '/api/clients/:id',
        status: 'active',
        requests: 45,
        responseTime: 95
      }
    ];

    const mockWebhooks: Webhook[] = [
      {
        id: '1',
        name: 'Client Status Change',
        url: 'https://example.com/webhooks/client-status',
        events: ['client.status.changed', 'client.health.updated'],
        active: true,
        lastTriggered: new Date(Date.now() - 1800000)
      },
      {
        id: '2',
        name: 'Payment Received',
        url: 'https://example.com/webhooks/payment',
        events: ['payment.received', 'payment.failed'],
        active: true,
        lastTriggered: new Date(Date.now() - 3600000)
      },
      {
        id: '3',
        name: 'AI Analysis Complete',
        url: 'https://example.com/webhooks/ai-analysis',
        events: ['ai.analysis.complete'],
        active: false
      }
    ];

    setIntegrations(mockIntegrations);
    setEndpoints(mockEndpoints);
    setWebhooks(mockWebhooks);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return 'text-blue-200 border-blue-500';
      case 'disconnected':
      case 'inactive':
        return 'text-slate-200 border-gray-500';
      case 'error':
        return 'text-red-200 border-red-500';
      default:
        return 'text-slate-200 border-gray-500';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return { backgroundColor: '#1e3a8a', borderColor: '#3b82f6' };
      case 'disconnected':
      case 'inactive':
        return { backgroundColor: '#374151', borderColor: '#6b7280' };
      case 'error':
        return { backgroundColor: '#7f1d1d', borderColor: '#ef4444' };
      default:
        return { backgroundColor: '#374151', borderColor: '#6b7280' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crm': return '👥';
      case 'email': return '📧';
      case 'analytics': return '📊';
      case 'payment': return '💳';
      case 'communication': return '💬';
      default: return '🔗';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-blue-200 border-blue-500';
      case 'POST': return 'text-emerald-200 border-emerald-500';
      case 'PUT': return 'text-amber-200 border-amber-500';
      case 'DELETE': return 'text-red-200 border-red-500';
      default: return 'text-slate-200 border-gray-500';
    }
  };

  const getMethodBgColor = (method: string) => {
    switch (method) {
      case 'GET': return { backgroundColor: '#1e3a8a', borderColor: '#3b82f6' };
      case 'POST': return { backgroundColor: '#064e3b', borderColor: '#10b981' };
      case 'PUT': return { backgroundColor: '#78350f', borderColor: '#f59e0b' };
      case 'DELETE': return { backgroundColor: '#7f1d1d', borderColor: '#ef4444' };
      default: return { backgroundColor: '#374151', borderColor: '#6b7280' };
    }
  };

  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">Available Integrations</h2>
          <p className="text-slate-200">Connect with your favorite tools and services</p>
        </div>
        <button 
          className="text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          style={{ 
            background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
            border: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, #1d4ed8, #1e40af)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, #2563eb, #1d4ed8)';
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Integration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map(integration => (
          <div key={integration.id} className="bg-gray-800 border border-gray-600 rounded-xl p-6 hover:shadow-lg hover:border-gray-500 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getTypeIcon(integration.type)}</div>
                <div>
                  <h3 className="font-semibold text-white">{integration.name}</h3>
                  <p className="text-sm text-slate-200">{integration.provider}</p>
                </div>
              </div>
              <span 
                className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(integration.status)}`}
                style={getStatusBgColor(integration.status)}
              >
                {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-200">Sync Frequency:</span>
                <span className="font-medium text-white capitalize">{integration.syncFrequency}</span>
              </div>
              
              {integration.lastSync && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-200">Last Sync:</span>
                  <span className="font-medium text-white">
                    {integration.lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-gray-600">
                {integration.status === 'connected' ? (
                  <div className="flex space-x-2">
                    <button 
                      className="flex-1 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                      style={{ 
                        background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                        border: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, #1d4ed8, #1e40af)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, #2563eb, #1d4ed8)';
                      }}
                    >
                      Configure
                    </button>
                    <button 
                      className="flex-1 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      style={{ 
                        background: 'linear-gradient(to right, #4b5563, #374151)',
                        border: '2px solid #6b7280'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, #374151, #1f2937)';
                        e.currentTarget.style.borderColor = '#9ca3af';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, #4b5563, #374151)';
                        e.currentTarget.style.borderColor = '#6b7280';
                      }}
                    >
                      Disconnect
                    </button>
                  </div>
                ) : integration.status === 'error' ? (
                  <button 
                    className="w-full text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                    style={{ 
                      background: 'linear-gradient(to right, #dc2626, #b91c1c)',
                      border: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to right, #b91c1c, #991b1b)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to right, #dc2626, #b91c1c)';
                    }}
                  >
                    Fix Connection
                  </button>
                ) : (
                  <button 
                    className="w-full text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    style={{ 
                      background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                      border: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to right, #1d4ed8, #1e40af)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to right, #2563eb, #1d4ed8)';
                    }}
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEndpointsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">API Endpoints</h2>
          <p className="text-slate-200">Monitor and manage your API endpoints</p>
        </div>
        <button 
          className="text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          style={{ 
            background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
            border: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, #1d4ed8, #1e40af)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, #2563eb, #1d4ed8)';
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Create Endpoint</span>
        </button>
      </div>

      <div className="bg-gray-800 border border-gray-600 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Endpoint</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Requests</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Avg Response</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-600">
              {endpoints.map(endpoint => (
                <tr key={endpoint.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-white">{endpoint.name}</div>
                      <div className="text-sm text-slate-200 font-mono">{endpoint.path}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getMethodColor(endpoint.method)}`}
                      style={getMethodBgColor(endpoint.method)}
                    >
                      {endpoint.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(endpoint.status)}`}
                      style={getStatusBgColor(endpoint.status)}
                    >
                      {endpoint.status.charAt(0).toUpperCase() + endpoint.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {endpoint.requests.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{endpoint.responseTime}ms</span>
                      <div className={`w-2 h-2 rounded-full ${
                        endpoint.responseTime < 200 ? 'bg-green-400' :
                        endpoint.responseTime < 500 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button 
                        className="text-white font-medium px-3 py-1 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        style={{ 
                          background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                          border: 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(to right, #1d4ed8, #1e40af)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(to right, #2563eb, #1d4ed8)';
                        }}
                      >
                        View
                      </button>
                      <button 
                        className="text-white font-medium px-3 py-1 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        style={{ 
                          background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                          border: 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(to right, #1d4ed8, #1e40af)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(to right, #2563eb, #1d4ed8)';
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderWebhooksTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">Webhooks</h2>
          <p className="text-slate-200">Manage event-driven integrations</p>
        </div>
        <button 
          className="text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          style={{ 
            background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
            border: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, #1d4ed8, #1e40af)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, #2563eb, #1d4ed8)';
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Create Webhook</span>
        </button>
      </div>

      <div className="space-y-4">
        {webhooks.map(webhook => (
          <div key={webhook.id} className="bg-gray-800 border border-gray-600 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-gray-500 transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-white">{webhook.name}</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={webhook.active}
                      onChange={() => {}}
                      className="sr-only peer"
                    />
                    <div 
                      className="w-12 h-6 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-2"
                      style={{
                        backgroundColor: webhook.active ? '#2563eb' : '#4b5563',
                        borderColor: webhook.active ? '#3b82f6' : '#6b7280'
                      }}
                    ></div>
                    <span className="ml-3 text-sm font-medium text-gray-200">
                      {webhook.active ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                </div>
                <p className="text-sm text-slate-200 font-mono mb-3 bg-gray-700 p-2 rounded border border-gray-600">{webhook.url}</p>
                <div className="flex flex-wrap gap-2">
                  {webhook.events.map((event, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border text-blue-200 border-blue-500"
                      style={{ backgroundColor: '#1e3a8a' }}
                    >
                      {event}
                    </span>
                  ))}
                </div>
                {webhook.lastTriggered && (
                  <p className="text-xs text-slate-200 mt-3">
                    Last triggered: {webhook.lastTriggered.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <button 
                  className="text-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  style={{ 
                    background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, #1d4ed8, #1e40af)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, #2563eb, #1d4ed8)';
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  className="text-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  style={{ 
                    background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, #1d4ed8, #1e40af)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, #2563eb, #1d4ed8)';
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button 
                  className="text-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  style={{ 
                    background: 'linear-gradient(to right, #dc2626, #b91c1c)',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, #b91c1c, #991b1b)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, #dc2626, #b91c1c)';
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-600">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-600 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-600 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* Modern Tab Navigation */}
      <div className="bg-gray-800 rounded-xl p-2 shadow-sm border border-gray-600">
        <div className="flex space-x-1">
          {[
            { id: 'integrations', label: 'Integrations', icon: '🔗' },
            { id: 'endpoints', label: 'API Endpoints', icon: '🚀' },
            { id: 'webhooks', label: 'Webhooks', icon: '⚡' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'integrations' | 'endpoints' | 'webhooks')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-slate-200 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'integrations' && renderIntegrationsTab()}
        {activeTab === 'endpoints' && renderEndpointsTab()}
        {activeTab === 'webhooks' && renderWebhooksTab()}
      </div>
    </div>
  );
} 