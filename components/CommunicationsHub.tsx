'use client';

import { useState, useEffect } from 'react';
import CommunicationAutomation from '../lib/communicationAutomation';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'welcome' | 'follow-up' | 'renewal' | 'churn-prevention' | 'check-in' | 'custom';
  variables: string[];
}

interface CommunicationRecord {
  id: string;
  clientId: string;
  clientName: string;
  type: 'email' | 'sms' | 'call';
  subject: string;
  content: string;
  status: 'sent' | 'delivered' | 'opened' | 'replied' | 'failed';
  sentAt: string;
  openedAt?: string;
  repliedAt?: string;
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  isActive: boolean;
  lastTriggered?: string;
}

const getTemplateTypeColor = (type: string) => {
  const colors = {
    'welcome': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'follow-up': 'bg-blue-100 text-blue-800 border-blue-200',
    'renewal': 'bg-amber-100 text-amber-800 border-amber-200',
    'churn-prevention': 'bg-red-100 text-red-800 border-red-200',
    'check-in': 'bg-purple-100 text-purple-800 border-purple-200',
    'custom': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[type as keyof typeof colors] || colors.custom;
};

export default function CommunicationsHub() {
  const [activeTab, setActiveTab] = useState<'templates' | 'send' | 'history' | 'automation'>('templates');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [communications, setCommunications] = useState<CommunicationRecord[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize with default templates
  useEffect(() => {
    const defaultTemplates: EmailTemplate[] = [
      {
        id: '1',
        name: 'Welcome Email',
        subject: 'Welcome to {{companyName}}, {{firstName}}!',
        content: `Hi {{firstName}},

Welcome to {{companyName}}! We're excited to have you on board.

Here's what you can expect:
• Personalized onboarding support
• 24/7 customer success assistance
• Regular check-ins to ensure your success

If you have any questions, don't hesitate to reach out.

Best regards,
{{senderName}}
Customer Success Team`,
        type: 'welcome',
        variables: ['firstName', 'companyName', 'senderName']
      },
      {
        id: '2',
        name: 'Health Check Follow-up',
        subject: 'How are things going, {{firstName}}?',
        content: `Hi {{firstName}},

I wanted to check in and see how your experience with {{productName}} has been so far.

I noticed your usage has been {{usageStatus}}, and I'd love to help you get the most out of our platform.

Would you be available for a quick 15-minute call this week to discuss:
• Your current goals and challenges
• Ways to optimize your workflow
• Any questions you might have

Let me know what works best for your schedule!

Best,
{{senderName}}`,
        type: 'follow-up',
        variables: ['firstName', 'productName', 'usageStatus', 'senderName']
      },
      {
        id: '3',
        name: 'Renewal Reminder',
        subject: 'Your {{productName}} renewal is coming up',
        content: `Hi {{firstName}},

I hope you've been getting great value from {{productName}}!

Your subscription is set to renew on {{renewalDate}}, and I wanted to reach out to:
• Review your current plan and usage
• Discuss any additional features that might benefit you
• Answer any questions about your renewal

Based on your usage patterns, you might benefit from {{recommendedPlan}}.

Would you like to schedule a quick call to discuss your renewal options?

Best regards,
{{senderName}}`,
        type: 'renewal',
        variables: ['firstName', 'productName', 'renewalDate', 'recommendedPlan', 'senderName']
      },
      {
        id: '4',
        name: 'Churn Prevention',
        subject: 'We miss you, {{firstName}} - Let\'s get you back on track',
        content: `Hi {{firstName}},

I noticed you haven't been active on {{productName}} recently, and I wanted to reach out personally.

I understand that priorities can shift, but I'd hate for you to miss out on the value {{productName}} can provide.

I'd love to understand:
• What challenges you're facing
• How we can better support your goals
• Whether there's anything blocking your success

I'm here to help and would be happy to jump on a quick call to discuss how we can get you back on track.

What do you say? Are you available for a 15-minute chat this week?

Best,
{{senderName}}`,
        type: 'churn-prevention',
        variables: ['firstName', 'productName', 'senderName']
      },
      {
        id: '5',
        name: 'Monthly Check-in',
        subject: 'Your monthly {{productName}} update',
        content: `Hi {{firstName}},

Hope you're having a great month! Here's your monthly update:

📊 Usage Summary:
• Total activities: {{totalActivities}}
• Goals achieved: {{goalsAchieved}}
• Time saved: {{timeSaved}} hours

🎯 Recommendations:
{{recommendations}}

📅 Upcoming:
• Feature updates coming next month
• Webinar on advanced features ({{webinarDate}})

Questions or need help with anything? Just reply to this email!

Best,
{{senderName}}`,
        type: 'check-in',
        variables: ['firstName', 'productName', 'totalActivities', 'goalsAchieved', 'timeSaved', 'recommendations', 'webinarDate', 'senderName']
      }
    ];

    const defaultAutomationRules: AutomationRule[] = [
      {
        id: '1',
        name: 'Welcome Email Trigger',
        trigger: 'New client onboarded',
        action: 'Send welcome email template',
        isActive: true
      },
      {
        id: '2',
        name: 'Low Usage Alert',
        trigger: 'Usage drops below 20% for 7 days',
        action: 'Send health check follow-up',
        isActive: true
      },
      {
        id: '3',
        name: 'Renewal Reminder',
        trigger: '30 days before renewal',
        action: 'Send renewal reminder email',
        isActive: true
      },
      {
        id: '4',
        name: 'Churn Risk Prevention',
        trigger: 'Health score drops below 40',
        action: 'Send churn prevention email',
        isActive: true
      }
    ];

    const sampleCommunications: CommunicationRecord[] = [
      {
        id: '1',
        clientId: '1',
        clientName: 'Alice Johnson',
        type: 'email',
        subject: 'Welcome to Emma AI, Alice!',
        content: 'Welcome email content...',
        status: 'opened',
        sentAt: '2024-01-15T10:00:00Z',
        openedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        clientId: '2',
        clientName: 'Bob Smith',
        type: 'email',
        subject: 'How are things going, Bob?',
        content: 'Follow-up email content...',
        status: 'replied',
        sentAt: '2024-01-14T14:00:00Z',
        openedAt: '2024-01-14T14:15:00Z',
        repliedAt: '2024-01-14T15:00:00Z'
      },
      {
        id: '3',
        clientId: '3',
        clientName: 'Carol Davis',
        type: 'sms',
        subject: 'Quick check-in',
        content: 'Hi Carol! Just checking in...',
        status: 'delivered',
        sentAt: '2024-01-13T09:00:00Z'
      }
    ];

    setTemplates(defaultTemplates);
    setAutomationRules(defaultAutomationRules);
    setCommunications(sampleCommunications);
  }, []);

  const handleSendEmail = async (templateId: string, recipients: string[]) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to communications history
      const template = templates.find(t => t.id === templateId);
      if (template) {
        const newCommunication: CommunicationRecord = {
          id: Date.now().toString(),
          clientId: 'demo',
          clientName: 'Demo Client',
          type: 'email',
          subject: template.subject,
          content: template.content,
          status: 'sent',
          sentAt: new Date().toISOString()
        };
        setCommunications(prev => [newCommunication, ...prev]);
      }
      
      setSelectedTemplate(null);
      setActiveTab('history');
    } catch (error) {
      console.error('Failed to send email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = (template: Omit<EmailTemplate, 'id'>) => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: Date.now().toString()
    };
    setTemplates(prev => [...prev, newTemplate]);
    setShowTemplateModal(false);
  };

  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Email Templates</h2>
        <button
          onClick={() => setShowTemplateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Create Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <div key={template.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${getTemplateTypeColor(template.type)}`}>
                  {template.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              <button
                onClick={() => setSelectedTemplate(template)}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                Use Template
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.subject}</p>
            <div className="flex flex-wrap gap-1">
              {template.variables.slice(0, 3).map((variable, index) => (
                <span key={index} className="inline-flex items-center px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-md border border-indigo-200">
                  {variable}
                </span>
              ))}
              {template.variables.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">
                  +{template.variables.length - 3} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSendTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Send Communication</h2>
      
      {selectedTemplate ? (
        <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-white">{selectedTemplate.name}</h3>
              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${
                selectedTemplate.type === 'welcome' ? 'bg-emerald-800 text-emerald-100 border-emerald-600' :
                selectedTemplate.type === 'follow-up' ? 'bg-blue-800 text-blue-100 border-blue-600' :
                selectedTemplate.type === 'renewal' ? 'bg-amber-800 text-amber-100 border-amber-600' :
                selectedTemplate.type === 'churn-prevention' ? 'bg-red-800 text-red-100 border-red-600' :
                selectedTemplate.type === 'check-in' ? 'bg-purple-800 text-purple-100 border-purple-600' :
                'bg-gray-700 text-gray-100 border-gray-500'
              }`}>
                {selectedTemplate.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            <button
              onClick={() => setSelectedTemplate(null)}
              className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Subject</label>
              <input
                type="text"
                value={selectedTemplate.subject}
                className="w-full px-4 py-3 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Content</label>
              <textarea
                value={selectedTemplate.content}
                rows={12}
                className="w-full px-4 py-3 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white font-mono text-sm"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Recipients</label>
              <input
                type="text"
                placeholder="Enter email addresses separated by commas"
                className="w-full px-4 py-3 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => handleSendEmail(selectedTemplate.id, ['demo@example.com'])}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Send Email</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="bg-transparent border-2 border-gray-600 hover:bg-gray-700 text-slate-200 hover:text-white px-8 py-3 rounded-lg font-medium transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 border-2 border-dashed border-gray-600 rounded-xl p-12 text-center">
          <div className="text-slate-200 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Select a Template</h3>
          <p className="text-slate-200 mb-6">Choose a template from the Templates tab to start composing your message.</p>
          <button
            onClick={() => setActiveTab('templates')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Browse Templates
          </button>
        </div>
      )}
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Communication History</h2>
      
      <div className="bg-gray-800 border border-gray-600 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">Sent</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-600">
              {communications.map(comm => (
                <tr key={comm.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {comm.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                      comm.type === 'email' ? 'bg-blue-800 text-blue-100 border-blue-600' :
                      comm.type === 'sms' ? 'bg-green-800 text-green-100 border-green-600' :
                      'bg-purple-800 text-purple-100 border-purple-600'
                    }`}>
                      {comm.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white max-w-xs truncate">{comm.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                      comm.status === 'sent' ? 'bg-yellow-800 text-yellow-100 border-yellow-600' :
                      comm.status === 'delivered' ? 'bg-blue-800 text-blue-100 border-blue-600' :
                      comm.status === 'opened' ? 'bg-green-800 text-green-100 border-green-600' :
                      comm.status === 'replied' ? 'bg-purple-800 text-purple-100 border-purple-600' :
                      'bg-red-800 text-red-100 border-red-600'
                    }`}>
                      {comm.status.charAt(0).toUpperCase() + comm.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                    {new Date(comm.sentAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-400 hover:text-blue-300 font-medium hover:bg-blue-900 px-3 py-1 rounded-lg transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAutomationTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Automation Rules</h2>
        <button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Create Rule</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {automationRules.map(rule => (
          <div key={rule.id} className="bg-gray-800 border border-gray-600 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="font-semibold text-white">{rule.name}</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.isActive}
                      onChange={() => toggleAutomationRule(rule.id)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-600"></div>
                    <span className="ml-3 text-sm font-medium text-slate-200">
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-200">Trigger:</span>
                    <span className="text-sm text-white bg-gray-700 px-3 py-1 rounded-lg border border-gray-600">{rule.trigger}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-200">Action:</span>
                    <span className="text-sm text-white bg-gray-700 px-3 py-1 rounded-lg border border-gray-600">{rule.action}</span>
                  </div>
                  {rule.lastTriggered && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-200">Last triggered:</span>
                      <span className="text-sm text-slate-200">{new Date(rule.lastTriggered).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-400 hover:text-blue-300 hover:bg-blue-900 p-2 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button className="text-red-400 hover:text-red-300 hover:bg-red-900 p-2 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* Modern Tab Navigation */}
      <div className="bg-gray-800 rounded-xl p-2 shadow-sm border border-gray-600">
        <div className="flex space-x-1">
          {[
            { id: 'templates', label: 'Templates', icon: '📧' },
            { id: 'send', label: 'Send', icon: '📤' },
            { id: 'history', label: 'History', icon: '📊' },
            { id: 'automation', label: 'Automation', icon: '🤖' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-600 p-6">
        {activeTab === 'templates' && renderTemplatesTab()}
        {activeTab === 'send' && renderSendTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'automation' && renderAutomationTab()}
      </div>
    </div>
  );
}
