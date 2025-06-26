'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: 'available' | 'coming-soon' | 'beta';
  connected: boolean;
  category: string;
  popular?: boolean;
  instructions: {
    steps: string[];
    requirements: string[];
    supportUrl?: string;
  };
}

export function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const integrations: Integration[] = [
    // CRM Integrations
    {
      id: 'hubspot',
      name: 'HubSpot',
      icon: 'https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png',
      description: 'Sync contacts, deals, and customer data with HubSpot CRM',
      status: 'available',
      connected: false,
      category: 'crm',
      popular: true,
      instructions: {
        steps: [
          'Go to your HubSpot account settings',
          'Navigate to Integrations > Private Apps',
          'Create a new private app named "Emma AI"',
          'Grant read/write permissions for Contacts, Deals, and Companies',
          'Copy the access token',
          'Paste the token in Emma AI settings'
        ],
        requirements: ['HubSpot Professional account or higher', 'Admin access to HubSpot'],
        supportUrl: 'https://developers.hubspot.com/docs/api/private-apps'
      }
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      icon: 'https://img.icons8.com/color/48/salesforce.png',
      description: 'Enterprise CRM integration for comprehensive customer management',
      status: 'available',
      connected: false,
      category: 'crm',
      popular: true,
      instructions: {
        steps: [
          'Log into your Salesforce org as an administrator',
          'Go to Setup > Apps > App Manager',
          'Click "New Connected App"',
          'Fill in basic information and enable OAuth settings',
          'Select required OAuth scopes: Access and manage your data, Perform requests on your behalf',
          'Save and note down Consumer Key and Consumer Secret',
          'Configure OAuth settings in Emma AI'
        ],
        requirements: ['Salesforce admin privileges', 'API access enabled'],
        supportUrl: 'https://help.salesforce.com/s/articleView?id=connected_app_create.htm'
      }
    },
    {
      id: 'zoho',
      name: 'Zoho CRM',
      icon: 'https://www.zoho.com/favicon.ico',
      description: 'Complete business suite integration with Zoho ecosystem',
      status: 'available',
      connected: false,
      category: 'crm',
      instructions: {
        steps: [
          'Sign in to Zoho API Console',
          'Create a new "Server-based Application"',
          'Configure redirect URI to Emma AI callback URL',
          'Note down Client ID and Client Secret',
          'Generate authorization code',
          'Exchange code for access token in Emma AI settings'
        ],
        requirements: ['Zoho CRM account', 'API access permissions'],
        supportUrl: 'https://www.zoho.com/crm/developer/docs/api/v2/'
      }
    },
    {
      id: 'clickup',
      name: 'ClickUp',
      icon: 'https://img.icons8.com/color/48/clickup.png',
      description: 'Project management and CRM capabilities in one platform',
      status: 'available',
      connected: false,
      category: 'crm',
      instructions: {
        steps: [
          'Go to ClickUp Settings > Apps',
          'Click on "API" in the sidebar',
          'Generate a new API token',
          'Copy the personal API token',
          'Enter the token in Emma AI integrations settings',
          'Select which ClickUp spaces to sync'
        ],
        requirements: ['ClickUp workspace access', 'Permission to create API tokens'],
        supportUrl: 'https://clickup.com/api'
      }
    },

    // Communication & Support
    {
      id: 'slack',
      name: 'Slack',
      icon: 'https://img.icons8.com/color/48/slack-new.png',
      description: 'Team communication and client notifications',
      status: 'available',
      connected: false,
      category: 'communication',
      popular: true,
      instructions: {
        steps: [
          'Go to api.slack.com and create a new app',
          'Choose "From scratch" and select your workspace',
          'Go to "OAuth & Permissions" in the sidebar',
          'Add required scopes: channels:read, chat:write, users:read',
          'Install the app to your workspace',
          'Copy the Bot User OAuth Token',
          'Paste the token in Emma AI settings'
        ],
        requirements: ['Slack workspace admin access', 'Permission to install apps'],
        supportUrl: 'https://api.slack.com/start/building'
      }
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      icon: 'https://img.icons8.com/color/48/microsoft-teams.png',
      description: 'Enterprise communication and collaboration platform',
      status: 'available',
      connected: false,
      category: 'communication',
      popular: true,
      instructions: {
        steps: [
          'Go to Azure Active Directory admin center',
          'Navigate to App registrations > New registration',
          'Register Emma AI as a new application',
          'Configure API permissions for Microsoft Graph',
          'Generate a client secret',
          'Configure webhook endpoints in Emma AI',
          'Test the connection'
        ],
        requirements: ['Microsoft 365 admin access', 'Azure AD permissions'],
        supportUrl: 'https://docs.microsoft.com/en-us/graph/auth-register-app-v2'
      }
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: 'https://img.icons8.com/color/48/discord-logo.png',
      description: 'Community-focused communication for modern teams',
      status: 'available',
      connected: false,
      category: 'communication',
      instructions: {
        steps: [
          'Go to Discord Developer Portal',
          'Create a new application',
          'Go to the Bot section and create a bot',
          'Copy the bot token',
          'Enable necessary intents (Server Members, Message Content)',
          'Invite bot to your server with required permissions',
          'Configure bot token in Emma AI'
        ],
        requirements: ['Discord server admin access', 'Developer account'],
        supportUrl: 'https://discord.com/developers/docs/intro'
      }
    },
    {
      id: 'zendesk',
      name: 'Zendesk',
      icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@v9/icons/zendesk.svg',
      description: 'Customer support and ticketing system integration',
      status: 'available',
      connected: false,
      category: 'communication',
      popular: true,
      instructions: {
        steps: [
          'Log into your Zendesk instance as an admin',
          'Go to Admin Center > Apps and integrations > APIs > Zendesk API',
          'Enable token access',
          'Create a new API token',
          'Note down your subdomain, email, and API token',
          'Configure these credentials in Emma AI settings'
        ],
        requirements: ['Zendesk admin access', 'API access enabled'],
        supportUrl: 'https://developer.zendesk.com/api-reference/'
      }
    },
    {
      id: 'intercom',
      name: 'Intercom',
      icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@v9/icons/intercom.svg',
      description: 'Customer messaging and support platform',
      status: 'available',
      connected: false,
      category: 'communication',
      instructions: {
        steps: [
          'Go to Intercom Developer Hub',
          'Create a new app for your workspace',
          'Configure OAuth with required scopes',
          'Get your app credentials',
          'Set up webhook endpoints for real-time sync',
          'Complete OAuth flow in Emma AI settings'
        ],
        requirements: ['Intercom workspace admin access', 'Developer permissions'],
        supportUrl: 'https://developers.intercom.com/building-apps/docs/getting-started'
      }
    },
    {
      id: 'freshdesk',
      name: 'Freshdesk',
      icon: 'https://cdn-icons-png.flaticon.com/512/2706/2706962.png',
      description: 'Cloud-based customer support software',
      status: 'available',
      connected: false,
      category: 'communication',
      instructions: {
        steps: [
          'Log into your Freshdesk account',
          'Go to Admin > API Settings',
          'Generate a new API key',
          'Note down your Freshdesk domain',
          'Copy the API key',
          'Configure domain and API key in Emma AI'
        ],
        requirements: ['Freshdesk admin access', 'API access permissions'],
        supportUrl: 'https://developers.freshdesk.com/api/'
      }
    },

    // Email Marketing
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@v9/icons/mailchimp.svg',
      description: 'Email marketing and automation platform',
      status: 'available',
      connected: false,
      category: 'email',
      popular: true,
      instructions: {
        steps: [
          'Log into your Mailchimp account',
          'Go to Account > Extras > API keys',
          'Create a new API key',
          'Copy the generated API key',
          'Find your server prefix (e.g., us1, us2)',
          'Configure API key and server in Emma AI settings'
        ],
        requirements: ['Mailchimp account', 'API access enabled'],
        supportUrl: 'https://mailchimp.com/developer/marketing/guides/quick-start/'
      }
    },
    {
      id: 'klaviyo',
      name: 'Klaviyo',
      icon: 'https://cdn-icons-png.flaticon.com/512/561/561127.png',
      description: 'Advanced email marketing with customer data platform',
      status: 'available',
      connected: false,
      category: 'email',
      popular: true,
      instructions: {
        steps: [
          'Log into your Klaviyo account',
          'Go to Account > Settings > API Keys',
          'Create a new Private API Key',
          'Set appropriate permissions for profiles and metrics',
          'Copy the API key',
          'Configure the key in Emma AI settings'
        ],
        requirements: ['Klaviyo account', 'Account admin access'],
        supportUrl: 'https://developers.klaviyo.com/en/docs/getting_started'
      }
    },

    // AI Platforms
    {
      id: 'openai',
      name: 'OpenAI',
      icon: 'https://img.icons8.com/color/48/chatgpt.png',
      description: 'GPT models and AI capabilities integration',
      status: 'available',
      connected: false,
      category: 'ai',
      popular: true,
      instructions: {
        steps: [
          'Sign up or log into OpenAI platform',
          'Go to API section in your account',
          'Create a new API key',
          'Set usage limits and permissions',
          'Copy the API key (starts with sk-)',
          'Configure the key in Emma AI AI settings'
        ],
        requirements: ['OpenAI account', 'Valid payment method for API usage'],
        supportUrl: 'https://platform.openai.com/docs/quickstart'
      }
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude',
      icon: 'https://img.icons8.com/color/48/artificial-intelligence.png',
      description: 'Advanced AI assistant for complex reasoning',
      status: 'available',
      connected: false,
      category: 'ai',
      popular: true,
      instructions: {
        steps: [
          'Apply for Anthropic API access',
          'Once approved, log into the console',
          'Generate a new API key',
          'Set up billing and usage limits',
          'Copy the API key',
          'Configure in Emma AI AI settings'
        ],
        requirements: ['Approved Anthropic API access', 'Valid billing setup'],
        supportUrl: 'https://docs.anthropic.com/claude/docs/getting-started'
      }
    },
    {
      id: 'google-ai',
      name: 'Google AI',
      icon: 'https://img.icons8.com/color/48/google-logo.png',
      description: 'Google\'s AI and machine learning services',
      status: 'beta',
      connected: false,
      category: 'ai',
      instructions: {
        steps: [
          'Go to Google Cloud Console',
          'Create a new project or select existing',
          'Enable AI Platform API',
          'Create service account credentials',
          'Download JSON key file',
          'Upload credentials to Emma AI settings'
        ],
        requirements: ['Google Cloud account', 'Billing enabled', 'AI Platform access'],
        supportUrl: 'https://cloud.google.com/ai-platform/docs'
      }
    },
    {
      id: 'custom-ai',
      name: 'Custom AI API',
      icon: 'https://img.icons8.com/color/48/robot.png',
      description: 'Bring your own AI models and API keys',
      status: 'available',
      connected: false,
      category: 'ai',
      instructions: {
        steps: [
          'Prepare your AI API endpoint URL',
          'Gather authentication credentials',
          'Test your API endpoint manually',
          'Go to Emma AI Custom AI settings',
          'Configure endpoint URL and authentication',
          'Test the connection and save'
        ],
        requirements: ['Working AI API endpoint', 'Valid authentication method'],
        supportUrl: 'https://docs.emma-ai.com/custom-ai-integration'
      }
    },

    // Automation
    {
      id: 'zapier',
      name: 'Zapier',
      icon: 'https://img.icons8.com/color/48/zapier.png',
      description: 'Automate workflows between 6000+ apps',
      status: 'available',
      connected: false,
      category: 'automation',
      popular: true,
      instructions: {
        steps: [
          'Sign up for Zapier account',
          'Search for "Emma AI" in app directory',
          'Click "Connect" on Emma AI app',
          'Authorize Emma AI access',
          'Create your first Zap',
          'Test the automation workflow'
        ],
        requirements: ['Zapier account', 'Emma AI Pro plan or higher'],
        supportUrl: 'https://zapier.com/apps/emma-ai/integrations'
      }
    },

    // Analytics
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      icon: 'https://img.icons8.com/color/48/google-analytics.png',
      description: 'Web analytics and user behavior tracking',
      status: 'available',
      connected: false,
      category: 'analytics',
      popular: true,
      instructions: {
        steps: [
          'Go to Google Analytics account',
          'Navigate to Admin section',
          'Create a new service account in Google Cloud',
          'Download service account JSON file',
          'Add service account email to GA property users',
          'Upload JSON file to Emma AI settings'
        ],
        requirements: ['Google Analytics account', 'Admin access to property'],
        supportUrl: 'https://developers.google.com/analytics/devguides/reporting/core/v4/quickstart/service-py'
      }
    },
    {
      id: 'power-bi',
      name: 'Power BI',
      icon: 'https://img.icons8.com/color/48/power-bi.png',
      description: 'Microsoft\'s business analytics solution',
      status: 'available',
      connected: false,
      category: 'analytics',
      instructions: {
        steps: [
          'Go to Azure Active Directory',
          'Register Emma AI as an application',
          'Configure API permissions for Power BI',
          'Generate client secret',
          'Note down tenant ID, client ID, and secret',
          'Configure credentials in Emma AI'
        ],
        requirements: ['Power BI Pro license', 'Azure AD admin access'],
        supportUrl: 'https://docs.microsoft.com/en-us/power-bi/developer/embedded/register-app'
      }
    },
    {
      id: 'looker-studio',
      name: 'Looker Studio',
      icon: 'https://img.icons8.com/color/48/google-data-studio.png',
      description: 'Google\'s data visualization and reporting tool',
      status: 'available',
      connected: false,
      category: 'analytics',
      instructions: {
        steps: [
          'Set up Google Cloud project',
          'Enable Looker Studio API',
          'Create service account',
          'Download credentials JSON',
          'Share Looker Studio reports with service account',
          'Configure in Emma AI analytics settings'
        ],
        requirements: ['Google Cloud account', 'Looker Studio access'],
        supportUrl: 'https://developers.google.com/looker-studio/integrate'
      }
    },

    // Project Management & Productivity
    {
      id: 'notion',
      name: 'Notion',
      icon: 'https://img.icons8.com/color/48/notion.png',
      description: 'All-in-one workspace for notes, docs, and databases',
      status: 'available',
      connected: false,
      category: 'productivity',
      instructions: {
        steps: [
          'Go to Notion Integrations page',
          'Create a new integration',
          'Copy the integration token',
          'Share relevant pages/databases with integration',
          'Configure token in Emma AI settings',
          'Select which databases to sync'
        ],
        requirements: ['Notion workspace admin access', 'Pages/databases to share'],
        supportUrl: 'https://developers.notion.com/docs/getting-started'
      }
    },
    {
      id: 'asana',
      name: 'Asana',
      icon: 'https://cdn.worldvectorlogo.com/logos/asana-logo.svg',
      description: 'Project management and team collaboration',
      status: 'available',
      connected: false,
      category: 'productivity',
      instructions: {
        steps: [
          'Log into Asana',
          'Go to My Profile Settings > Apps',
          'Scroll down to Developer apps',
          'Create a new personal access token',
          'Copy the token',
          'Configure in Emma AI project settings'
        ],
        requirements: ['Asana account', 'Project access permissions'],
        supportUrl: 'https://developers.asana.com/docs/authentication'
      }
    },
    {
      id: 'trello',
      name: 'Trello',
      icon: 'https://img.icons8.com/color/48/trello.png',
      description: 'Visual project management with boards and cards',
      status: 'available',
      connected: false,
      category: 'productivity',
      instructions: {
        steps: [
          'Go to Trello Developer API Keys page',
          'Generate an API key',
          'Generate a token with read/write permissions',
          'Note down both API key and token',
          'Configure both in Emma AI settings',
          'Select boards to sync'
        ],
        requirements: ['Trello account', 'Board access permissions'],
        supportUrl: 'https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/'
      }
    },
    {
      id: 'monday',
      name: 'Monday.com',
      icon: 'https://img.icons8.com/color/48/monday.png',
      description: 'Work operating system for teams',
      status: 'available',
      connected: false,
      category: 'productivity',
      instructions: {
        steps: [
          'Go to Monday.com Admin section',
          'Navigate to API section',
          'Generate a new API token',
          'Set appropriate permissions',
          'Copy the API token',
          'Configure in Emma AI productivity settings'
        ],
        requirements: ['Monday.com admin access', 'API permissions'],
        supportUrl: 'https://developer.monday.com/api-reference/docs/authentication'
      }
    },
    {
      id: 'airtable',
      name: 'Airtable',
      icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@v9/icons/airtable.svg',
      description: 'Spreadsheet-database hybrid for organizing work',
      status: 'available',
      connected: false,
      category: 'productivity',
      instructions: {
        steps: [
          'Go to Airtable Account page',
          'Generate a personal access token',
          'Set required scopes for bases you want to sync',
          'Copy the token',
          'Find your base IDs from base URLs',
          'Configure token and base IDs in Emma AI'
        ],
        requirements: ['Airtable account', 'Base creator or collaborator access'],
        supportUrl: 'https://airtable.com/developers/web/api/introduction'
      }
    },

    // Website Platforms
    {
      id: 'shopify',
      name: 'Shopify',
      icon: 'https://img.icons8.com/color/48/shopify.png',
      description: 'E-commerce platform integration',
      status: 'available',
      connected: false,
      category: 'website',
      popular: true,
      instructions: {
        steps: [
          'Log into your Shopify admin',
          'Go to Apps > Develop apps',
          'Create a new app for Emma AI',
          'Configure API scopes for customers, orders, products',
          'Install the app',
          'Copy API credentials',
          'Configure in Emma AI e-commerce settings'
        ],
        requirements: ['Shopify store admin access', 'Custom app development enabled'],
        supportUrl: 'https://shopify.dev/docs/apps/getting-started'
      }
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce',
      icon: 'https://img.icons8.com/color/48/woocommerce.png',
      description: 'WordPress e-commerce plugin integration',
      status: 'available',
      connected: false,
      category: 'website',
      instructions: {
        steps: [
          'Log into WordPress admin',
          'Go to WooCommerce > Settings > Advanced > REST API',
          'Create a new API key',
          'Set permissions to Read/Write',
          'Copy consumer key and consumer secret',
          'Configure credentials in Emma AI'
        ],
        requirements: ['WordPress admin access', 'WooCommerce installed'],
        supportUrl: 'https://woocommerce.github.io/woocommerce-rest-api-docs/'
      }
    },
    {
      id: 'wordpress',
      name: 'WordPress',
      icon: 'https://img.icons8.com/color/48/wordpress.png',
      description: 'Content management system integration',
      status: 'available',
      connected: false,
      category: 'website',
      popular: true,
      instructions: {
        steps: [
          'Install Application Passwords plugin (or use WP 5.6+)',
          'Go to Users > Profile',
          'Scroll to Application Passwords section',
          'Create new application password for Emma AI',
          'Copy the generated password',
          'Configure username and password in Emma AI'
        ],
        requirements: ['WordPress admin access', 'Application Passwords support'],
        supportUrl: 'https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/'
      }
    },

    // Communication & Video
    {
      id: 'calendly',
      name: 'Calendly',
      icon: 'https://cdn-icons-png.flaticon.com/512/833/833593.png',
      description: 'Automated scheduling and calendar management',
      status: 'available',
      connected: false,
      category: 'scheduling',
      popular: true,
      instructions: {
        steps: [
          'Log into Calendly account',
          'Go to Integrations & Apps > API & Webhooks',
          'Create a new personal access token',
          'Set up webhook endpoints for events',
          'Copy the access token',
          'Configure token and webhooks in Emma AI'
        ],
        requirements: ['Calendly paid plan', 'Admin access to account'],
        supportUrl: 'https://developer.calendly.com/getting-started'
      }
    },
    {
      id: 'loom',
      name: 'Loom',
      icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@v9/icons/loom.svg',
      description: 'Video messaging and screen recording',
      status: 'available',
      connected: false,
      category: 'scheduling',
      instructions: {
        steps: [
          'Contact Loom support for API access',
          'Once approved, get your API credentials',
          'Set up webhook endpoints for video events',
          'Configure API key in Emma AI',
          'Test video upload and sharing features',
          'Set up automated video workflows'
        ],
        requirements: ['Loom Business plan', 'API access approval'],
        supportUrl: 'https://support.loom.com/hc/en-us/articles/360006579637'
      }
    },

    // Security & Password Management
    {
      id: 'onepassword',
      name: '1Password',
      icon: 'https://img.icons8.com/color/48/1password.png',
      description: 'Password manager and secure document storage',
      status: 'available',
      connected: false,
      category: 'security',
      instructions: {
        steps: [
          'Set up 1Password Business account',
          'Enable SCIM bridge for provisioning',
          'Generate service account token',
          'Configure SCIM endpoint URL',
          'Set up user provisioning rules',
          'Test integration with Emma AI users'
        ],
        requirements: ['1Password Business plan', 'Admin access to account'],
        supportUrl: 'https://developer.1password.com/docs/scim/'
      }
    },
    {
      id: 'proton-pass',
      name: 'Proton Pass',
      icon: 'https://img.icons8.com/color/48/security-checked.png',
      description: 'Privacy-focused password manager',
      status: 'available',
      connected: false,
      category: 'security',
      instructions: {
        steps: [
          'Contact Proton for enterprise API access',
          'Set up Proton Pass Business account',
          'Configure organization settings',
          'Generate API credentials',
          'Set up secure sharing policies',
          'Configure in Emma AI security settings'
        ],
        requirements: ['Proton Pass Business plan', 'Enterprise API access'],
        supportUrl: 'https://proton.me/support/proton-pass-business'
      }
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: '🔗' },
    { id: 'crm', name: 'CRM', icon: '👥' },
    { id: 'communication', name: 'Communication', icon: '💬' },
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'ai', name: 'AI', icon: '🤖' },
    { id: 'automation', name: 'Automation', icon: '⚡' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'productivity', name: 'Productivity', icon: '📋' },
    { id: 'website', name: 'Website', icon: '🌐' },
    { id: 'scheduling', name: 'Scheduling', icon: '📅' },
    { id: 'security', name: 'Security', icon: '🔐' }
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openModal = (integration: Integration) => {
    setSelectedIntegration(integration);
  };

  const closeModal = () => {
    setSelectedIntegration(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-3">Integrations</h1>
        <p className="text-gray-300 text-lg">Connect Emma AI with your favorite tools</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
            />
            <div className="absolute left-3 top-3.5 text-gray-400 text-lg">🔍</div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 max-w-7xl mx-auto">
        {filteredIntegrations.map((integration) => (
          <div
            key={integration.id}
            onClick={() => openModal(integration)}
            className="group relative bg-gray-800 rounded-2xl p-6 hover:bg-gray-700 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl border border-gray-700 hover:border-blue-500/50"
          >


            {/* Popular Badge */}
            {integration.popular && (
              <div className="absolute top-2 left-2 text-yellow-400 text-sm">🔥</div>
            )}

            {/* Connected Badge */}
            {integration.connected && (
              <div className="absolute bottom-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
            )}

            {/* Icon */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                {integration.icon.startsWith('http') ? (
                  <Image 
                    src={integration.icon} 
                    alt={integration.name}
                    width={48}
                    height={48}
                    className="w-8 h-8"
                  />
                ) : (
                  <div className="text-4xl">{integration.icon}</div>
                )}
              </div>
              <h3 className="font-semibold text-white text-sm group-hover:text-blue-300 transition-colors">
                {integration.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No integrations found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    {selectedIntegration.icon.startsWith('http') ? (
                      <Image 
                        src={selectedIntegration.icon} 
                        alt={selectedIntegration.name}
                        width={48}
                        height={48}
                        className="w-8 h-8"
                      />
                    ) : (
                      <div className="text-3xl">{selectedIntegration.icon}</div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedIntegration.name}</h2>
                    <p className="text-gray-300">{selectedIntegration.description}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Requirements */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">📋 Requirements</h3>
                <ul className="space-y-2">
                  {selectedIntegration.instructions.requirements.map((req, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Setup Steps */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">🚀 Setup Instructions</h3>
                <ol className="space-y-3">
                  {selectedIntegration.instructions.steps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Support Link */}
              {selectedIntegration.instructions.supportUrl && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">📚 Documentation</h3>
                  <a
                    href={selectedIntegration.instructions.supportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 underline"
                  >
                    View official documentation
                    <span className="ml-1">↗</span>
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={closeModal}
                  disabled={selectedIntegration.status === 'coming-soon'}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                    selectedIntegration.status === 'coming-soon'
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {selectedIntegration.status === 'coming-soon' ? 'Coming Soon' : 'Start Setup'}
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 py-3 px-6 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 text-center">
        <p className="text-gray-400">
          {filteredIntegrations.length} integrations • {integrations.filter(i => i.popular).length} popular • {integrations.filter(i => i.status === 'available').length} ready to connect
        </p>
      </div>
    </div>
  );
} 