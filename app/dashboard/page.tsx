'use client';

import { useState, useEffect, useCallback } from 'react';
import { ClientList } from '../components/ClientList';
import { ClientDetail } from '../components/ClientDetail';
import { DashboardStats } from '../components/DashboardStats';
import { Sidebar } from '../components/Sidebar';
import { AddClientModal } from '../components/AddClientModal';
import { IntegrationsPage } from '../components/IntegrationsPage';
import { AppSettingsPage } from '../components/AppSettingsPage';
import { ProfileSettingsPage } from '../components/ProfileSettingsPage';
import CommunicationsHub from '../../components/CommunicationsHub';
import HelpCenter from '../components/HelpCenter';
import { Client, Summary, Filters } from '../../lib/types';

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [analyticsTab, setAnalyticsTab] = useState('overview');

  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    health: 'all'
  });

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.health !== 'all') params.append('health', filters.health);

      const response = await fetch(`/api/clients?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setClients(data.clients);
        setSummary(data.summary);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch clients');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfileDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('.profile-dropdown-container')) {
          setShowProfileDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
  };

  const handleBackToList = () => {
    setSelectedClient(null);
  };

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClientAdded = () => {
    fetchClients();
  };

  const renderPage = () => {
    if (selectedClient) {
    return (
        <div className="p-6">
          <ClientDetail 
            client={selectedClient} 
            onBack={handleBackToList}
          />
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        // Show loading state without layout shift
        if (loading && !summary) {
          return (
            <div className="p-6">
              <div className="animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-48 bg-gray-200 rounded"></div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-48 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // Show error state
        if (error) {
          return (
            <div className="p-6">
              <div className="text-center py-12">
                <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                  onClick={fetchClients}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          );
        }

        // Show dashboard analytics
        return (
          <div className="p-6 space-y-6">
            {/* Dashboard Stats */}
            {summary && <DashboardStats summary={summary} />}
            
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Health Distribution */}
              <div className="bg-gray-800 rounded-lg border border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Client Health Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-slate-200">Healthy</span>
                    </div>
                    <div className="text-sm font-medium text-white">
                      {summary?.byHealth.healthy || 0} clients
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-slate-200">At Risk</span>
                    </div>
                    <div className="text-sm font-medium text-white">
                      {summary?.byHealth['at-risk'] || 0} clients
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-slate-200">Critical</span>
                    </div>
                    <div className="text-sm font-medium text-white">
                      {summary?.byHealth.critical || 0} clients
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Overview */}
              <div className="bg-gray-800 rounded-lg border border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Account Status Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-slate-200">Active</span>
                    </div>
                    <div className="text-sm font-medium text-white">
                      {summary?.byStatus.active || 0} clients
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-slate-200">Trial</span>
                    </div>
                    <div className="text-sm font-medium text-white">
                      {summary?.byStatus.trial || 0} clients
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-sm text-slate-200">Inactive</span>
                    </div>
                    <div className="text-sm font-medium text-white">
                      {summary?.byStatus.inactive || 0} clients
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-slate-200">Churned</span>
                    </div>
                    <div className="text-sm font-medium text-white">
                      {summary?.byStatus.churned || 0} clients
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg border border-gray-600 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setCurrentPage('clients')}
                  className="p-4 border border-gray-600 rounded-lg hover:bg-gray-700 text-left transition-colors"
                >
                  <div className="text-blue-400 text-2xl mb-2">👥</div>
                  <div className="font-medium text-white">Manage Clients</div>
                  <div className="text-sm text-slate-200">View detailed client database</div>
                </button>
                <button
                  onClick={() => setShowAddClientModal(true)}
                  className="group relative p-4 border-2 border-green-500/30 bg-gradient-to-br from-green-600/10 to-emerald-600/10 rounded-lg hover:from-green-600/20 hover:to-emerald-600/20 hover:border-green-400/50 text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-emerald-400/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-green-400 text-2xl">✨</div>
                      <div className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full font-medium">
                        New
                      </div>
                    </div>
                    <div className="font-semibold text-white mb-1">Add New Client</div>
                    <div className="text-sm text-slate-200">Onboard a new client quickly</div>
                    <div className="mt-3 flex items-center text-green-300 text-sm font-medium">
                      <span>Get started</span>
                      <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setCurrentPage('analytics')}
                  className="p-4 border border-gray-600 rounded-lg hover:bg-gray-700 text-left transition-colors"
                >
                  <div className="text-purple-400 text-2xl mb-2">📊</div>
                  <div className="font-medium text-white">View Analytics</div>
                  <div className="text-sm text-slate-200">Detailed reports & insights</div>
                </button>
              </div>
            </div>

            {/* Recent Activity Preview */}
            <div className="bg-gray-800 rounded-lg border border-gray-600 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Client Activity</h3>
                <button
                  onClick={() => setCurrentPage('clients')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                >
                  <span>View All</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                {clients.slice(0, 5).map((client) => (
                  <div key={client.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#1e3a8a' }}
                      >
                        <span className="text-xs font-medium text-blue-200">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{client.name}</div>
                        <div className="text-xs text-slate-200">{client.company}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-200">
                        Last active: {client.lastActivity ? new Date(client.lastActivity).toLocaleDateString() : 'Never'}
                      </div>
                      <div 
                        className={`inline-flex text-xs px-1.5 py-0.5 rounded-full border font-medium ${
                          client.health === 'healthy' ? 'text-green-200 border-green-500' :
                          client.health === 'at-risk' ? 'text-yellow-200 border-yellow-500' :
                          'text-red-200 border-red-500'
                        }`}
                        style={{
                          backgroundColor: client.health === 'healthy' ? '#064e3b' :
                                         client.health === 'at-risk' ? '#78350f' :
                                         '#7f1d1d'
                        }}
                      >
                        {client.health}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'clients':
        // Show loading state without layout shift
        if (loading && !clients.length) {
          return (
            <div className="p-6">
              <div className="animate-pulse">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
        </div>
      </div>
    );
  }

        // Show error state
  if (error) {
    return (
            <div className="p-6">
              <div className="text-center py-12">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchClients}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

        // Show detailed client database
        return (
          <div className="p-6">
            <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Client Management</h2>
                <p className="text-gray-600 mt-1">Manage your client relationships and track their success</p>
              </div>
              <button
                onClick={() => setShowAddClientModal(true)}
                className="group relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 border border-blue-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <div className="bg-white/20 rounded-lg p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span>Add Client</span>
                  <div className="bg-blue-400/30 text-blue-100 text-xs px-2 py-1 rounded-full font-medium">
                    Quick
                  </div>
                </div>
              </button>
            </div>
            <ClientList 
              clients={clients}
              filters={filters}
              onFilterChange={updateFilters}
              onClientSelect={handleClientSelect}
              loading={loading}
            />
          </div>
        );

      case 'communications':
        return <CommunicationsHub />;

      case 'analytics':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Customer Success Analytics</h1>
            
            {/* Analytics Tabs */}
            <div className="mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                <nav className="flex space-x-1" aria-label="Tabs">
                  <button
                    onClick={() => setAnalyticsTab('overview')}
                    className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                      analyticsTab === 'overview'
                        ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2 text-lg">📊</span>
                    <span>Analytics Overview</span>
                  </button>
                  <button
                    onClick={() => setAnalyticsTab('reports')}
                    className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                      analyticsTab === 'reports'
                        ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2 text-lg">📈</span>
                    <span>Custom Reports</span>
                  </button>
                  <button
                    onClick={() => setAnalyticsTab('insights')}
                    className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                      analyticsTab === 'insights'
                        ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2 text-lg">🧠</span>
                    <span>AI Insights</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {analyticsTab === 'overview' && (
              <>
                {/* Key Customer Success Metrics for Agencies & Enterprise */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Average Revenue Per Account */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Avg Revenue Per Account</h3>
                      <span className="text-2xl">💼</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${Math.round((clients.reduce((sum, client) => sum + client.contractValue, 0) / Math.max(clients.length, 1)) || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      ↗ +18.2% from last quarter
                    </div>
                  </div>

                  {/* Client Retention Rate */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Client Retention Rate</h3>
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.round(((summary?.byStatus.active || 0) / Math.max(summary?.total || 1, 1)) * 100)}%
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      ↗ +4.1% from last quarter
                    </div>
                  </div>

                  {/* Account Expansion Rate */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Account Expansion Rate</h3>
                      <span className="text-2xl">📈</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.round((clients.filter(c => (c.usage.currentMonth / c.usage.limit) > 0.7).length / Math.max(clients.length, 1)) * 100)}%
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      ↗ +12.3% expansion opportunities
                    </div>
                  </div>

                  {/* Net Promoter Score */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Net Promoter Score</h3>
                      <span className="text-2xl">⭐</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.round((summary?.byHealth.healthy || 0) * 1.2 + 45)}
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      ↗ +6 points this quarter
                    </div>
                  </div>
                </div>

                {/* Client Health & Account Management */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Account Health Overview */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Health Overview</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          <span className="text-sm font-medium text-gray-700">Healthy Accounts</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{width: `${((summary?.byHealth.healthy || 0) / (summary?.total || 1)) * 100}%`}}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12">{summary?.byHealth.healthy || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                          <span className="text-sm font-medium text-gray-700">Needs Attention</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full" 
                              style={{width: `${((summary?.byHealth['at-risk'] || 0) / (summary?.total || 1)) * 100}%`}}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12">{summary?.byHealth['at-risk'] || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-red-500 rounded"></div>
                          <span className="text-sm font-medium text-gray-700">High Risk</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full" 
                              style={{width: `${((summary?.byHealth.critical || 0) / (summary?.total || 1)) * 100}%`}}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12">{summary?.byHealth.critical || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Utilization */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Utilization</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Average Utilization</span>
                        <span className="text-sm text-gray-600">{summary?.averageUsage?.toFixed(1) || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{width: `${summary?.averageUsage || 0}%`}}
                        ></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {clients.filter(c => (c.usage.currentMonth / c.usage.limit) > 0.8).length}
                          </div>
                          <div className="text-sm text-gray-600">High Utilizers</div>
                          <div className="text-xs text-gray-500">Expansion Ready</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {clients.filter(c => (c.usage.currentMonth / c.usage.limit) < 0.3).length}
                          </div>
                          <div className="text-sm text-gray-600">Low Adopters</div>
                          <div className="text-xs text-gray-500">Need Support</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Growth Opportunities & Risk Management */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Account Growth Opportunities */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Account Growth Opportunities</h3>
                    <div className="space-y-3">
                      {clients
                        .filter(client => 
                          client.health === 'healthy' && 
                          (client.usage.currentMonth / client.usage.limit) > 0.75 &&
                          client.status === 'active'
                        )
                        .slice(0, 5)
                        .map(client => (
                          <div key={client.id} className="flex items-center justify-between p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                            <div>
                              <div className="font-medium text-white">{client.name}</div>
                              <div className="text-sm text-gray-300">{client.company} • {client.plan}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-green-400">
                                {((client.usage.currentMonth / client.usage.limit) * 100).toFixed(1)}% utilized
                              </div>
                              <div className="text-xs text-green-300 font-medium">Upsell Ready</div>
                            </div>
                          </div>
                        ))}
                      {clients.filter(client => 
                        client.health === 'healthy' && 
                        (client.usage.currentMonth / client.usage.limit) > 0.75 &&
                        client.status === 'active'
                      ).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-3xl mb-2">📊</div>
                          <div>No immediate growth opportunities</div>
                          <div className="text-sm">Focus on client adoption</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Risk Management Dashboard */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Risk Management</h3>
                    <div className="space-y-3">
                      {clients
                        .filter(client => client.health === 'critical' || client.health === 'at-risk')
                        .sort((a, b) => a.healthScore - b.healthScore)
                        .slice(0, 5)
                        .map(client => (
                          <div key={client.id} className="flex items-center justify-between p-3 bg-red-900/30 rounded-lg border border-red-500/30">
                            <div>
                              <div className="font-medium text-white">{client.name}</div>
                              <div className="text-sm text-gray-300">{client.company} • ${client.contractValue.toLocaleString()}</div>
                            </div>
                            <div className="text-right">
                              <div className={`text-sm font-medium ${client.health === 'critical' ? 'text-red-400' : 'text-yellow-400'}`}>
                                {client.health === 'critical' ? 'High Risk' : 'At Risk'}
                              </div>
                              <div className="text-xs text-gray-300 font-medium">Health: {client.healthScore}/100</div>
                            </div>
                          </div>
                        ))}
                      {clients.filter(client => client.health === 'critical' || client.health === 'at-risk').length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-3xl mb-2">✅</div>
                          <div>All accounts are healthy</div>
                          <div className="text-sm">Great customer success work!</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Success Performance */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Customer Success Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {clients.reduce((sum, client) => sum + (client.communications?.length || 0), 0)}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Total Touchpoints</div>
                      <div className="text-xs text-gray-500">This quarter</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {clients.reduce((sum, client) => 
                          sum + (client.communications?.filter(c => c.status === 'replied').length || 0), 0
                        )}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Client Responses</div>
                      <div className="text-xs text-gray-500">Active engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {Math.round((clients.reduce((sum, client) => 
                          sum + (client.communications?.filter(c => c.status === 'replied').length || 0), 0
                        ) / Math.max(1, clients.reduce((sum, client) => sum + (client.communications?.length || 0), 0))) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Response Rate</div>
                      <div className="text-xs text-gray-500">Communication efficiency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">
                        {Math.round(clients.filter(c => c.nextRenewal && new Date(c.nextRenewal) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)).length)}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Renewals Due</div>
                      <div className="text-xs text-gray-500">Next 90 days</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {analyticsTab === 'reports' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">📊 Custom Reports & Export</h3>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">Enterprise</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Report Builder */}
                  <div className="lg:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-4">Build Custom Report</h4>
                    
                    {/* Metrics Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Metrics</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {[
                          'Revenue Per Account',
                          'Retention Rate', 
                          'Expansion Rate',
                          'Net Promoter Score',
                          'Health Distribution',
                          'Utilization Rates',
                          'Communication Stats',
                          'Renewal Pipeline',
                          'Risk Analysis',
                          'Growth Opportunities'
                        ].map((metric) => (
                          <label key={metric} className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              defaultChecked={['Revenue Per Account', 'Retention Rate', 'Health Distribution'].includes(metric)}
                            />
                            <span className="text-xs text-gray-700">{metric}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Last 30 days</option>
                          <option>Last quarter</option>
                          <option>Last 6 months</option>
                          <option>Last year</option>
                          <option>Custom range</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Client Segment</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>All clients</option>
                          <option>Enterprise</option>
                          <option>High-value accounts</option>
                          <option>At-risk clients</option>
                          <option>Growth opportunities</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Executive Summary</option>
                          <option>Detailed Analysis</option>
                          <option>Performance Review</option>
                          <option>Risk Assessment</option>
                          <option>Growth Report</option>
                        </select>
                      </div>
                    </div>

                    {/* Export Options */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                        </svg>
                        <span>Export PDF</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>Export Excel</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>Export CSV</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        <span>Share Link</span>
                      </button>
                    </div>
                  </div>

                  {/* Saved Reports */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Saved Report Templates</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-sm text-gray-900">Executive Dashboard</div>
                          <button className="text-xs text-blue-600 hover:text-blue-700">Use</button>
                        </div>
                        <div className="text-xs text-gray-700">Revenue, retention, health overview</div>
                        <div className="text-xs text-gray-600 mt-1">Last used: 2 days ago</div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-sm text-gray-900">Board Report</div>
                          <button className="text-xs text-blue-600 hover:text-blue-700">Use</button>
                        </div>
                        <div className="text-xs text-gray-700">KPIs, growth metrics, risk analysis</div>
                        <div className="text-xs text-gray-600 mt-1">Last used: 1 week ago</div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-sm text-gray-900">Client Health Report</div>
                          <button className="text-xs text-blue-600 hover:text-blue-700">Use</button>
                        </div>
                        <div className="text-xs text-gray-700">Health scores, utilization, renewals</div>
                        <div className="text-xs text-gray-600 mt-1">Last used: 3 days ago</div>
                      </div>

                      <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
                        + Save Current as Template
                      </button>
                    </div>
                  </div>
                </div>

                {/* Automated Reports */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">🤖 Automated Reporting</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-sm text-white">Weekly Executive Brief</span>
                      </div>
                      <div className="text-xs text-gray-300 mb-2">Auto-sends every Monday 9 AM</div>
                      <div className="text-xs text-gray-400">Next: Dec 23, 2024</div>
                    </div>
                    
                    <div className="p-4 bg-green-900/30 rounded-lg border border-green-500/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-sm text-white">Monthly Health Review</span>
                      </div>
                      <div className="text-xs text-gray-300 mb-2">Auto-sends 1st of each month</div>
                      <div className="text-xs text-gray-400">Next: Jan 1, 2025</div>
                    </div>
                    
                    <div className="p-4 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="font-medium text-sm text-white">Risk Alert Reports</span>
                      </div>
                      <div className="text-xs text-gray-300 mb-2">Triggered by high-risk events</div>
                      <div className="text-xs text-gray-400">Last sent: 2 days ago</div>
                    </div>
                  </div>
                  
                  <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    Configure Automated Reports
                  </button>
                </div>
              </div>
            )}

            {analyticsTab === 'insights' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">🧠 AI-Powered Insights</h3>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">Coming Soon</span>
                  </div>
                </div>
                
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔮</div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Advanced AI Analytics</h4>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Get predictive insights, automated recommendations, and advanced pattern recognition to stay ahead of client needs.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
                    <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
                      <div className="text-2xl mb-2">🎯</div>
                      <div className="font-medium text-white">Predictive Churn</div>
                      <div className="text-sm text-gray-300">AI-powered churn prediction with 95% accuracy</div>
                    </div>
                    <div className="p-4 bg-green-900/30 rounded-lg border border-green-500/30">
                      <div className="text-2xl mb-2">💡</div>
                      <div className="font-medium text-white">Smart Recommendations</div>
                      <div className="text-sm text-gray-300">Automated action suggestions for each client</div>
                    </div>
                    <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
                      <div className="text-2xl mb-2">📈</div>
                      <div className="font-medium text-white">Growth Predictions</div>
                      <div className="text-sm text-gray-300">Forecast expansion opportunities with ML</div>
                    </div>
                  </div>
                  
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                    Join Beta Waitlist
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'automation':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Automation & Workflows</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Workflow Templates */}
              <div className="bg-gray-800 rounded-xl border border-gray-600 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Workflow Templates</h3>
                <div className="space-y-4">
                  <div className="border border-gray-600 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">New Client Onboarding</h4>
                      <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Active</span>
                    </div>
                    <p className="text-slate-200 text-sm mb-2">Automated welcome sequence for new clients</p>
                    <div className="text-xs text-slate-400">5 steps • 2 weeks duration</div>
                  </div>
                  <div className="border border-gray-600 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">At-Risk Client Intervention</h4>
                      <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">Draft</span>
                    </div>
                    <p className="text-slate-200 text-sm mb-2">Proactive outreach for declining health scores</p>
                    <div className="text-xs text-slate-400">3 steps • Triggered by health score</div>
                  </div>
                </div>
              </div>

              {/* Automation Rules */}
              <div className="bg-gray-800 rounded-xl border border-gray-600 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Automation Rules</h3>
                <div className="space-y-4">
                  <div className="border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">Health Score Alerts</h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <p className="text-slate-200 text-sm">Notify when client health drops below 60</p>
                  </div>
                  <div className="border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">Renewal Reminders</h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <p className="text-slate-200 text-sm">Send reminders 30 days before renewal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'integrations':
        return <IntegrationsPage />;

      case 'app-settings':
        return <AppSettingsPage />;

      case 'profile-settings':
        return <ProfileSettingsPage />;

      case 'knowledge-base':
        return <HelpCenter />;

      case 'submit-request':
        return (
          <div className="p-6">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">📧</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit Support Request</h1>
                  <p className="text-gray-600">Get help from our customer success team</p>
                </div>

                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Type
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Technical Support</option>
                      <option>Feature Request</option>
                      <option>Account Question</option>
                      <option>Integration Help</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of your request"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea 
                      rows={6}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Please provide detailed information about your request..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                    >
                      Submit Request
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage('knowledge-base')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Browse Help
                    </button>
                  </div>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-center text-sm text-gray-600">
                    <p>Need immediate help? Contact us directly:</p>
                    <div className="flex justify-center space-x-6 mt-2">
                      <span className="flex items-center space-x-1">
                        <span>📞</span>
                        <span>1-800-EMMA-AI</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>💬</span>
                        <span>Live Chat</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Welcome to Emma AI</h1>
            <p className="text-gray-600 mt-1">Your AI-powered Customer Success Manager</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        isCollapsed={sidebarCollapsed}
        onToggle={setSidebarCollapsed}
      />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col h-screen ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 capitalize">
                {selectedClient ? selectedClient.name : currentPage}
              </h1>
              <p className="text-sm text-gray-500">
                {selectedClient ? selectedClient.company : `Emma AI ${currentPage}`}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              
              {/* Profile Button */}
              <div className="relative profile-dropdown-container">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="profile-avatar w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">E</span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-700">Emma AI</div>
                    <div className="text-xs text-gray-500">Manager</div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setCurrentPage('profile-settings');
                        setShowProfileDropdown(false);
                      }}
                      className="dropdown-item w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <span>👤</span>
                      <span>Profile Settings</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        // Handle sign out
                        localStorage.removeItem('emma-auth-token');
                        localStorage.removeItem('emma-user');
                        window.location.href = '/auth/login';
                      }}
                      className="dropdown-item w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <span>🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>

      {/* Add Client Modal */}
      {showAddClientModal && (
        <AddClientModal
          isOpen={showAddClientModal}
          onClose={() => setShowAddClientModal(false)}
          onClientAdded={handleClientAdded}
        />
      )}
    </div>
  );
} 