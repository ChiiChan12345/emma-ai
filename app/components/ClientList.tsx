import { Client, Filters, ClientListProps } from '../../lib/types';

interface ExtendedClientListProps extends ClientListProps {
  loading?: boolean;
}

export function ClientList({ clients, filters, onFilterChange, onClientSelect, loading = false }: ExtendedClientListProps) {
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-100 bg-green-800 border-green-600';
      case 'at-risk': return 'text-yellow-100 bg-yellow-800 border-yellow-600';
      case 'critical': return 'text-red-100 bg-red-800 border-red-600';
      default: return 'text-gray-300 bg-gray-700 border-gray-600';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-200 bg-green-800 border-green-600';
    if (score >= 40) return 'text-yellow-200 bg-yellow-800 border-yellow-600';
    return 'text-red-200 bg-red-800 border-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-200 bg-green-800 border-green-600';
      case 'trial': return 'text-blue-200 bg-blue-800 border-blue-600';
      case 'inactive': return 'text-slate-200 bg-gray-700 border-gray-600';
      case 'churned': return 'text-red-200 bg-red-800 border-red-600';
      default: return 'text-slate-200 bg-gray-700 border-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getUsagePercentage = (usage: Client['usage']) => {
    return Math.round((usage.currentMonth / usage.limit) * 100);
  };

  const getUsageTrend = (usage: Client['usage']) => {
    if (usage.currentMonth > usage.lastMonth) return { icon: '↗️', color: 'text-green-400' };
    if (usage.currentMonth < usage.lastMonth) return { icon: '↘️', color: 'text-red-400' };
    return { icon: '➡️', color: 'text-gray-400' };
  };

  const getDaysUntilRenewal = (renewalDate?: string) => {
    if (!renewalDate) return null;
    const today = new Date();
    const renewal = new Date(renewalDate);
    const diffTime = renewal.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysSinceActivity = (lastActivity: string) => {
    if (!lastActivity) return 999;
    const today = new Date();
    const activity = new Date(lastActivity);
    const diffTime = today.getTime() - activity.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRenewalStatus = (days: number | null) => {
    if (days === null) return { text: 'N/A', color: 'text-slate-200' };
    if (days < 0) return { text: 'Expired', color: 'text-red-400' };
    if (days <= 30) return { text: `${days}d`, color: 'text-red-400' };
    if (days <= 90) return { text: `${days}d`, color: 'text-yellow-400' };
    return { text: `${days}d`, color: 'text-green-400' };
  };

  const getActivityIcon = (lastActivity: string) => {
    const daysSince = getDaysSinceActivity(lastActivity);
    if (daysSince <= 1) return { icon: '🟢', color: 'text-green-400' };
    if (daysSince <= 7) return { icon: '🟡', color: 'text-yellow-400' };
    if (daysSince <= 30) return { icon: '🟠', color: 'text-orange-400' };
    return { icon: '🔴', color: 'text-red-400' };
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="border-b border-gray-600 animate-pulse">
          <td className="py-4 px-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-600 rounded w-3/4"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          </td>
          <td className="py-4 px-4">
            <div className="h-6 bg-gray-600 rounded-full w-16"></div>
          </td>
          <td className="py-4 px-4">
            <div className="space-y-1">
              <div className="h-6 bg-gray-600 rounded-full w-20"></div>
              <div className="h-3 bg-gray-700 rounded w-8"></div>
            </div>
          </td>
          <td className="py-4 px-4">
            <div className="space-y-2">
              <div className="h-3 bg-gray-700 rounded w-16"></div>
              <div className="h-2 bg-gray-600 rounded-full w-full"></div>
              <div className="h-3 bg-gray-700 rounded w-20"></div>
            </div>
          </td>
          <td className="py-4 px-4">
            <div className="h-4 bg-gray-600 rounded w-16"></div>
          </td>
          <td className="py-4 px-4">
            <div className="h-4 bg-gray-600 rounded w-20"></div>
          </td>
          <td className="py-4 px-4">
            <div className="space-y-1">
              <div className="h-4 bg-gray-600 rounded w-8"></div>
              <div className="h-3 bg-gray-700 rounded w-16"></div>
            </div>
          </td>
          <td className="py-4 px-4">
            <div className="flex space-x-1">
              <div className="h-5 bg-gray-600 rounded-full w-12"></div>
              <div className="h-5 bg-gray-600 rounded-full w-16"></div>
            </div>
          </td>
          <td className="py-4 px-4">
            <div className="h-4 bg-gray-600 rounded w-16"></div>
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="space-y-6">
      {/* Health Score Guide */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 border border-gray-600 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <span className="text-xl">📊</span>
            <span>Health Score Guide</span>
          </h3>
          <div className="text-sm text-slate-200 bg-gray-700 px-3 py-1 rounded-full border border-gray-600 animate-pulse">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>AI-Powered Analysis</span>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-green-600 hover:border-green-500 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full group-hover:animate-pulse"></div>
              <span className="font-semibold text-green-300">Healthy</span>
              <span className="text-sm text-slate-200 bg-green-800 px-2 py-1 rounded border border-green-600">70-100</span>
            </div>
            <p className="text-sm text-slate-200">Active engagement, consistent usage, positive communication responses</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-yellow-600 hover:border-yellow-500 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full group-hover:animate-pulse"></div>
              <span className="font-semibold text-yellow-300">At Risk</span>
              <span className="text-sm text-slate-200 bg-yellow-800 px-2 py-1 rounded border border-yellow-600">40-69</span>
            </div>
            <p className="text-sm text-slate-200">Declining usage, reduced engagement, requires attention and outreach</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-red-600 hover:border-red-500 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full group-hover:animate-pulse"></div>
              <span className="font-semibold text-red-300">Critical</span>
              <span className="text-sm text-slate-200 bg-red-800 px-2 py-1 rounded border border-red-600">0-39</span>
            </div>
            <p className="text-sm text-slate-200">Low usage, poor engagement, high churn risk - immediate intervention needed</p>
          </div>
        </div>
      </div>

      {/* Client List Table */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-600 overflow-hidden">
        {/* Header with Filters */}
        <div className="p-6 border-b border-gray-600 bg-gradient-to-r from-gray-800 to-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-3 mb-4 lg:mb-0">
              <h2 className="text-lg font-semibold text-white">
                Client Database
              </h2>
              <div className="bg-blue-600/20 border border-blue-500/30 px-3 py-1 rounded-full">
                <span className="text-sm text-blue-200 font-medium">
                  {loading ? '...' : `${clients.length} clients`}
                </span>
              </div>
              {loading && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                  <span className="text-sm text-slate-300">Loading...</span>
                </div>
              )}
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => onFilterChange({ status: e.target.value })}
                className="filter-select bg-blue-600 px-3 py-2 border border-blue-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-white hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                disabled={loading}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="inactive">Inactive</option>
                <option value="churned">Churned</option>
              </select>

              {/* Health Filter */}
              <select
                value={filters.health}
                onChange={(e) => onFilterChange({ health: e.target.value })}
                className="filter-select bg-blue-600 px-3 py-2 border border-blue-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-white hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                disabled={loading}
              >
                <option value="all">All Health</option>
                <option value="healthy">Healthy</option>
                <option value="at-risk">At Risk</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700 sticky top-0">
              <tr>
                <th className="text-left py-4 px-4 font-semibold text-white border-b border-gray-600">
                  <div className="flex items-center space-x-2">
                    <span>Client</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-white border-b border-gray-600">Status</th>
                <th className="text-left py-4 px-4 font-semibold text-white border-b border-gray-600">Health</th>
                <th className="text-left py-4 px-4 font-semibold text-white border-b border-gray-600">Usage</th>
                <th className="text-left py-4 px-4 font-semibold text-white border-b border-gray-600">Plan</th>
                <th className="text-left py-4 px-4 font-semibold text-white border-b border-gray-600">Contract</th>
                <th className="text-left py-4 px-4 font-semibold text-white border-b border-gray-600">Renewal</th>
                <th className="text-left py-4 px-4 font-semibold text-white border-b border-gray-600">Tags</th>
                <th className="text-left py-4 px-4 font-semibold text-white border-b border-gray-600">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {loading ? (
                <LoadingSkeleton />
              ) : (
                clients.map((client, index) => {
                  const usagePercentage = getUsagePercentage(client.usage);
                  const usageTrend = getUsageTrend(client.usage);
                  const renewalDays = getDaysUntilRenewal(client.nextRenewal);
                  const renewalStatus = getRenewalStatus(renewalDays);
                  const activityIcon = getActivityIcon(client.lastActivity);

                  return (
                    <tr 
                      key={client.id} 
                      onClick={() => onClientSelect(client)}
                      className="hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group hover:shadow-lg hover:scale-[1.01] transform-gpu"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Client Info */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm group-hover:scale-110 transition-transform duration-200">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-white group-hover:text-blue-200 transition-colors duration-200">{client.name}</div>
                            <div className="text-sm text-slate-200">{client.company}</div>
                            <div className="text-xs text-slate-400">{client.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 align-middle">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border transition-all duration-200 hover:scale-105 ${getStatusColor(client.status)}`}>
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </span>
                      </td>

                      {/* Health */}
                      <td className="py-4 px-4 align-middle">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border transition-all duration-200 hover:scale-105 ${getHealthColor(client.health)}`}>
                            {client.health === 'at-risk' ? 'At Risk' : client.health.charAt(0).toUpperCase() + client.health.slice(1)}
                          </span>
                          <span className="text-sm text-slate-200 font-medium">({client.healthScore})</span>
                        </div>
                      </td>

                      {/* Usage */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-start space-x-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between text-xs text-slate-200 mb-1">
                              <span className="font-medium">{client.usage.currentMonth.toLocaleString()}</span>
                              <span className="font-bold">{usagePercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-2 rounded-full transition-all duration-700 ${
                                  usagePercentage >= 90 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                                  usagePercentage >= 70 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                                  'bg-gradient-to-r from-green-500 to-green-400'
                                }`}
                                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              of {client.usage.limit.toLocaleString()} limit
                            </div>
                          </div>
                          <span className={`text-lg ${usageTrend.color} group-hover:scale-125 transition-transform duration-200`}>
                            {usageTrend.icon}
                          </span>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-4 px-4 align-middle">
                        <span className="text-sm text-white font-medium">{client.plan}</span>
                      </td>

                      {/* Contract Value */}
                      <td className="py-4 px-4 align-middle">
                        <span className="text-sm font-bold text-green-200">
                          {formatCurrency(client.contractValue)}
                        </span>
                      </td>

                      {/* Renewal */}
                      <td className="py-4 px-4 align-top">
                        {client.nextRenewal ? (
                          <div>
                            <div className={`text-sm font-bold ${renewalStatus.color}`}>
                              {renewalStatus.text}
                            </div>
                            <div className="text-xs text-slate-400">
                              {formatDate(client.nextRenewal)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">N/A</span>
                        )}
                      </td>

                      {/* Tags */}
                      <td className="py-4 px-4 align-middle">
                        {client.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-40">
                            {client.tags.slice(0, 3).map((tag, tagIndex) => {
                              const tagColors = [
                                'bg-blue-600 text-blue-100 border-blue-500',
                                'bg-green-600 text-green-100 border-green-500',
                                'bg-purple-600 text-purple-100 border-purple-500',
                                'bg-orange-600 text-orange-100 border-orange-500',
                                'bg-pink-600 text-pink-100 border-pink-500',
                                'bg-teal-600 text-teal-100 border-teal-500',
                                'bg-indigo-600 text-indigo-100 border-indigo-500',
                                'bg-red-600 text-red-100 border-red-500'
                              ];
                              const colorIndex = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % tagColors.length;
                              
                              return (
                                <span 
                                  key={tagIndex}
                                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border truncate max-w-24 transition-all duration-200 hover:scale-105 ${tagColors[colorIndex]}`}
                                  title={tag}
                                >
                                  {tag}
                                </span>
                              );
                            })}
                            {client.tags.length > 3 && (
                              <span className="text-xs text-blue-400 font-medium hover:text-blue-300 transition-colors duration-200">
                                +{client.tags.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </td>

                      {/* Last Activity */}
                      <td className="py-4 px-4 align-middle">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${activityIcon.color} group-hover:scale-125 transition-transform duration-200`}>
                            {activityIcon.icon}
                          </span>
                          <span className="text-sm text-slate-200">
                            {formatDate(client.lastActivity)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {!loading && clients.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-4">
              <svg className="w-16 h-16 text-slate-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div className="text-slate-200 text-lg mb-2 font-medium">No clients found</div>
            <div className="text-slate-400 text-sm">
              Try adjusting your filters or add some clients to get started.
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 