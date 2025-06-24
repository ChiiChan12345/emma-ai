'use client';

export function IntegrationsPage() {
  const integrations = [
    {
      id: 'slack',
      name: 'Slack',
      icon: '💬',
      description: 'Send notifications and updates to your team channels',
      status: 'available',
      connected: false,
      features: ['Team notifications', 'Client alerts', 'Health score updates']
    },
    {
      id: 'clickup',
      name: 'ClickUp',
      icon: '✅',
      description: 'Create tasks and track client success activities',
      status: 'available',
      connected: false,
      features: ['Auto task creation', 'Client folders', 'Progress tracking']
    },
    {
      id: 'google',
      name: 'Google Workspace',
      icon: '📧',
      description: 'Sync emails, calendar events, and drive documents',
      status: 'available',
      connected: false,
      features: ['Email integration', 'Calendar sync', 'Document sharing']
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      icon: '🎯',
      description: 'Sync contacts, deals, and customer data',
      status: 'coming-soon',
      connected: false,
      features: ['Contact sync', 'Deal tracking', 'Pipeline updates']
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      icon: '☁️',
      description: 'Integrate with your CRM for comprehensive customer view',
      status: 'coming-soon',
      connected: false,
      features: ['CRM sync', 'Lead management', 'Account updates']
    },
    {
      id: 'intercom',
      name: 'Intercom',
      icon: '💭',
      description: 'Connect customer conversations and support tickets',
      status: 'coming-soon',
      connected: false,
      features: ['Conversation sync', 'Support tickets', 'User tracking']
    }
  ];

  const handleConnect = (integrationId: string) => {
    // This would typically open OAuth flow or configuration modal
    alert(`Coming soon: ${integrationId} integration setup`);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-600 mt-1">Connect Emma AI with your favorite tools and services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{integration.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    integration.status === 'available' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {integration.status === 'available' ? 'Available' : 'Coming Soon'}
                  </div>
                </div>
              </div>
              {integration.connected && (
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              )}
            </div>

            <p className="text-gray-600 text-sm mb-4">{integration.description}</p>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
              <ul className="space-y-1">
                {integration.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleConnect(integration.id)}
              disabled={integration.status !== 'available'}
              className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                integration.status === 'available'
                  ? integration.connected
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {integration.connected ? 'Configure' : 
               integration.status === 'available' ? 'Connect' : 'Coming Soon'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Need a Custom Integration?</h2>
        <p className="text-gray-600 mb-4">
          We're always looking to add new integrations. Let us know what tools you use and we'll prioritize them.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Request Integration
        </button>
      </div>
    </div>
  );
} 