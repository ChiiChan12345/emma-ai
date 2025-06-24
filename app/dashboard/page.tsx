'use client';

import { useState, useEffect } from 'react';
import { ClientList } from '../components/ClientList';
import { ClientDetail } from '../components/ClientDetail';
import { DashboardStats } from '../components/DashboardStats';
import { Sidebar } from '../components/Sidebar';
import { AddClientModal } from '../components/AddClientModal';
import { IntegrationsPage } from '../components/IntegrationsPage';
import { AppSettingsPage } from '../components/AppSettingsPage';
import { ProfileSettingsPage } from '../components/ProfileSettingsPage';
import CommunicationsHub from '../../components/CommunicationsHub';
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
  const [mounted, setMounted] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    health: 'all'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (currentPage === 'dashboard' || currentPage === 'clients') {
    fetchClients();
    }
  }, [filters, currentPage]);

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

  const fetchClients = async () => {
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
  };

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
                  className="p-4 border border-gray-600 rounded-lg hover:bg-gray-700 text-left transition-colors"
                >
                  <div className="text-green-400 text-2xl mb-2">➕</div>
                  <div className="font-medium text-white">Add New Client</div>
                  <div className="text-sm text-slate-200">Onboard a new client</div>
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
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Client Management</h2>
              <button
                onClick={() => setShowAddClientModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Client</span>
              </button>
            </div>
            <ClientList 
              clients={clients}
              filters={filters}
              onFilterChange={updateFilters}
              onClientSelect={handleClientSelect}
            />
          </div>
        );

      case 'communications':
        return <CommunicationsHub />;

      case 'analytics':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Analytics & Reports</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Score Trends</h3>
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  <span className="text-slate-200">Chart Coming Soon</span>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Churn Risk Analysis</h3>
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  <span className="text-slate-200">Chart Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'automation':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Automation & Workflows</h1>
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-gray-600 p-12 text-center shadow-sm">
              <div className="text-6xl mb-6">🤖</div>
              <h3 className="text-2xl font-semibold text-white mb-4">Smart Automation</h3>
              <p className="text-slate-200 mb-8 max-w-md mx-auto">Set up automated workflows for client success and streamline your customer management processes</p>
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 mx-auto">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Workflow</span>
              </button>
            </div>
          </div>
        );

      case 'integrations':
        return <IntegrationsPage />;

      case 'app-settings':
        return <AppSettingsPage />;

      case 'profile-settings':
        return <ProfileSettingsPage />;

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