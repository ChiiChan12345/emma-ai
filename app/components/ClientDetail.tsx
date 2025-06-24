'use client';

import { useState } from 'react';

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'inactive' | 'trial' | 'churned';
  joinDate: string;
  lastActivity: string;
  plan: string;
  usage: {
    currentMonth: number;
    lastMonth: number;
    limit: number;
  };
  health: 'healthy' | 'at-risk' | 'critical';
  healthScore: number;
  communications: Array<{
    type: 'email' | 'sms' | 'call';
    date: string;
    subject: string;
    status: 'sent' | 'opened' | 'replied';
  }>;
  tags: string[];
  notes: string;
  contractValue: number;
  nextRenewal?: string;
}

interface ClientDetailProps {
  client: Client;
  onBack: () => void;
}

export function ClientDetail({ client, onBack }: ClientDetailProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState('comprehensive');
  const [communicationType, setCommunicationType] = useState('email');
  const [context, setContext] = useState('');

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600 bg-green-100 border-green-200';
      case 'at-risk': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 border-green-200';
      case 'trial': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'inactive': return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'churned': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUsagePercentage = () => {
    return Math.round((client.usage.currentMonth / client.usage.limit) * 100);
  };

  const getUsageTrend = () => {
    if (client.usage.currentMonth > client.usage.lastMonth) return { text: 'Increasing', color: 'text-green-600', icon: '↗️' };
    if (client.usage.currentMonth < client.usage.lastMonth) return { text: 'Decreasing', color: 'text-red-600', icon: '↘️' };
    return { text: 'Stable', color: 'text-gray-600', icon: '➡️' };
  };

  const analyzeClient = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agent/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          analysisType: analysisType
        })
      });

      const data = await response.json();
      if (data.success) {
        setAnalysis(data.analysis);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestion = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/comms/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          communicationType: communicationType,
          context: context,
          urgency: client.health === 'critical' ? 'high' : 'normal'
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuggestion(data.suggestion);
      }
    } catch (error) {
      console.error('Suggestion error:', error);
    } finally {
      setLoading(false);
    }
  };

  const trend = getUsageTrend();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Client List
        </button>
      </div>

      {/* Client Info Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-blue-600">
                {client.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
              <p className="text-gray-600">{client.company}</p>
              <p className="text-sm text-gray-500">{client.email}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(client.status)}`}>
              {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getHealthColor(client.health)}`}>
              {client.health.charAt(0).toUpperCase() + client.health.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-sm font-medium text-gray-600">Plan</h3>
          <p className="text-2xl font-bold text-gray-900">{client.plan}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-sm font-medium text-gray-600">Usage This Month</h3>
          <p className="text-2xl font-bold text-gray-900">{getUsagePercentage()}%</p>
          <p className={`text-sm ${trend.color}`}>
            {trend.icon} {trend.text} from last month
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-sm font-medium text-gray-600">Join Date</h3>
          <p className="text-lg font-semibold text-gray-900">{formatDate(client.joinDate)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-sm font-medium text-gray-600">Last Activity</h3>
          <p className="text-lg font-semibold text-gray-900">{formatDate(client.lastActivity)}</p>
        </div>
      </div>

      {/* Usage Details */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Analytics</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Current Month Usage</span>
              <span>{client.usage.currentMonth} / {client.usage.limit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${getUsagePercentage()}%` }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Last Month:</span>
              <span className="ml-2 font-semibold">{client.usage.lastMonth}</span>
            </div>
            <div>
              <span className="text-gray-600">Limit:</span>
              <span className="ml-2 font-semibold">{client.usage.limit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emma AI Analysis</h3>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <select
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="comprehensive">Comprehensive Analysis</option>
            <option value="health">Health Assessment</option>
            <option value="engagement">Engagement Analysis</option>
            <option value="churn-risk">Churn Risk Assessment</option>
            <option value="upsell">Upsell Opportunities</option>
          </select>
          
          <button
            onClick={analyzeClient}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Analyze Client'}
          </button>
        </div>

        {analysis && (
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900 mb-2">Analysis Results:</h4>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">{analysis}</div>
          </div>
        )}
      </div>

      {/* Communication Suggestions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Suggestions</h3>
        
        <div className="space-y-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={communicationType}
              onChange={(e) => setCommunicationType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="call">Phone Call</option>
            </select>
          </div>
          
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Add context for the communication (optional)..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          
          <button
            onClick={generateSuggestion}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Suggestion'}
          </button>
        </div>

        {suggestion && (
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900 mb-2">Suggested {suggestion.type}:</h4>
            <div className="space-y-3">
              <div>
                <strong>Subject:</strong> {suggestion.subject}
              </div>
              <div>
                <strong>Content:</strong>
                <div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{suggestion.content}</div>
              </div>
              <div className="text-sm text-gray-600">
                <strong>Timing:</strong> {suggestion.timing}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Communication History */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication History</h3>
        {client.communications.length === 0 ? (
          <p className="text-gray-500">No communications recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {client.communications.map((comm, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{comm.subject}</p>
                  <p className="text-sm text-gray-600">{comm.type} • {formatDate(comm.date)}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  comm.status === 'replied' ? 'text-green-600 bg-green-100' :
                  comm.status === 'opened' ? 'text-blue-600 bg-blue-100' :
                  'text-gray-600 bg-gray-100'
                }`}>
                  {comm.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 