'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [showAddClientModal, setShowAddClientModal] = useState<boolean>(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [analyticsTab, setAnalyticsTab] = useState<string>('overview');
  
  // User profile state
  const [userProfile, setUserProfile] = useState<{
    full_name: string;
    email: string;
    company_name: string;
  } | null>(null);

  const supabase = createClientComponentClient();

  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    health: 'all'
  });

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name, email, company_name')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setUserProfile(profile);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, [supabase]);

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
    fetchUserProfile(); // Fetch user profile on mount
  }, [fetchClients, fetchUserProfile]);

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

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get display name and avatar initial
  const getDisplayName = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name;
    }
    return userProfile?.email?.split('@')[0] || 'User';
  };

  const getAvatarInitial = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
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
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
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
                      <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
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

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">New client onboarded: TechCorp Inc.</span>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                      </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Health score improved for Startup Solutions</span>
                  <span className="text-xs text-gray-400">5 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Follow-up email sent to 3 at-risk clients</span>
                  <span className="text-xs text-gray-400">1 day ago</span>
                      </div>
              </div>
            </div>
          </div>
        );
      
      case 'clients':
          return (
            <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Client Management</h2>
                <p className="text-gray-600">Manage and monitor your client relationships</p>
              </div>
              <button
                onClick={() => setShowAddClientModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>+</span>
                  <span>Add Client</span>
              </button>
            </div>
            
            <ClientList 
              clients={clients}
              onClientSelect={handleClientSelect}
              filters={filters}
              onFilterChange={updateFilters}
              loading={loading}
            />
          </div>
        );

      case 'communications':
        return <CommunicationsHub />;

      case 'analytics':
        return (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
              <p className="text-gray-600">Deep insights into your customer success metrics</p>
            </div>
            
            {/* Analytics Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {['overview', 'churn', 'health', 'engagement'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setAnalyticsTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                      analyticsTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
                </nav>
            </div>

            {/* Analytics Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {analyticsTab === 'overview' && 'Performance Overview'}
                  {analyticsTab === 'churn' && 'Churn Analysis'}
                  {analyticsTab === 'health' && 'Health Score Trends'}
                  {analyticsTab === 'engagement' && 'Engagement Metrics'}
                </h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Chart placeholder - Analytics coming soon</p>
                    </div>
                  </div>

              <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Key Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Health Score</span>
                      <span className="font-semibold text-green-600">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Churn Rate</span>
                      <span className="font-semibold text-red-600">2.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client Satisfaction</span>
                      <span className="font-semibold text-blue-600">4.8/5</span>
                    </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Recent Insights</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 3 clients showed improved engagement this week</li>
                    <li>• Trial conversion rate increased by 15%</li>
                    <li>• Average response time improved to 2.3 hours</li>
                  </ul>
                    </div>
                    </div>
                    </div>
                  </div>
        );

      case 'automation':
        return (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Automation & Workflows</h2>
              <p className="text-gray-600">Automate your customer success processes</p>
                  </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Automations */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Automations</h3>
                    <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div>
                      <div className="font-medium text-green-900">Welcome Email Sequence</div>
                      <div className="text-sm text-green-700">Triggered on new client signup</div>
                            </div>
                    <div className="text-green-600">✓ Active</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div>
                      <div className="font-medium text-blue-900">Health Score Alerts</div>
                      <div className="text-sm text-blue-700">Notifies when score drops below 60</div>
                            </div>
                    <div className="text-blue-600">✓ Active</div>
                </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div>
                      <div className="font-medium text-yellow-900">Renewal Reminders</div>
                      <div className="text-sm text-yellow-700">30 days before renewal date</div>
                      </div>
                    <div className="text-yellow-600">⏸ Paused</div>
                      </div>
                      </div>
                    </div>

              {/* Automation Templates */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation Templates</h3>
                    <div className="space-y-3">
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="font-medium">Onboarding Workflow</div>
                    <div className="text-sm text-gray-600">Complete onboarding sequence</div>
                      </button>
                  
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="font-medium">Churn Prevention</div>
                    <div className="text-sm text-gray-600">Automated intervention for at-risk clients</div>
                  </button>
                  
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="font-medium">Upsell Campaign</div>
                    <div className="text-sm text-gray-600">Identify and nurture upsell opportunities</div>
                  </button>
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
            <div className="max-w-2xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Submit Support Request</h2>
                  <p className="text-gray-600">Get help from our customer success team</p>
                </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
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
                    <span className="text-white font-semibold text-sm">{getAvatarInitial()}</span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-700">{getDisplayName()}</div>
                    <div className="text-xs text-gray-500">{userProfile?.company_name || 'Manager'}</div>
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
                      onClick={handleSignOut}
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