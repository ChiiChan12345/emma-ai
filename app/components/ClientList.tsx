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

interface Filters {
  status: string;
  health: string;
}

interface ClientListProps {
  clients: Client[];
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onClientSelect: (client: Client) => void;
}

export function ClientList({ clients, filters, onFilterChange, onClientSelect }: ClientListProps) {
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
    return { icon: '➡️', color: 'text-slate-200' };
  };



  return (
    <div className="space-y-6">
      {/* Health Score Guide */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 border border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <span className="text-xl">📊</span>
            <span>Health Score Guide</span>
          </h3>
          <div className="text-sm text-slate-200 bg-gray-700 px-3 py-1 rounded-full border border-gray-600">
            AI-Powered Analysis
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-green-600">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-green-300">Healthy</span>
              <span className="text-sm text-slate-200 bg-green-800 px-2 py-1 rounded">70-100</span>
            </div>
            <p className="text-sm text-slate-200">Active engagement, consistent usage, positive communication responses</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-yellow-600">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="font-semibold text-yellow-300">At Risk</span>
              <span className="text-sm text-slate-200 bg-yellow-800 px-2 py-1 rounded">40-69</span>
            </div>
            <p className="text-sm text-slate-200">Declining usage, reduced engagement, requires attention and outreach</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-red-600">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-semibold text-red-300">Critical</span>
              <span className="text-sm text-slate-200 bg-red-800 px-2 py-1 rounded">0-39</span>
            </div>
            <p className="text-sm text-slate-200">Low usage, poor engagement, high churn risk - immediate intervention needed</p>
          </div>
        </div>
      </div>

      {/* Client List Table */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-600">
        {/* Header with Filters */}
        <div className="p-6 border-b border-gray-600">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-lg font-semibold text-white mb-4 lg:mb-0">
              Client Database ({clients.length} clients)
            </h2>
            
            {/* Filters */}
            <div className="client-filters bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex flex-wrap gap-3">
                {/* Status Filter */}
                <select
                  value={filters.status}
                  onChange={(e) => onFilterChange({ status: e.target.value })}
                  className="filter-select bg-blue-600 px-3 py-2 border border-blue-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-white hover:bg-blue-700 transition-colors"
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
                  className="filter-select bg-blue-600 px-3 py-2 border border-blue-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-white hover:bg-blue-700 transition-colors"
                >
                  <option value="all">All Health</option>
                  <option value="healthy">Healthy</option>
                  <option value="at-risk">At Risk</option>
                  <option value="critical">Critical</option>
                </select>


              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-white">Client</th>
                <th className="text-left py-3 px-4 font-semibold text-white">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-white">Health</th>
                <th className="text-left py-3 px-4 font-semibold text-white">Usage</th>
                <th className="text-left py-3 px-4 font-semibold text-white">Plan</th>
                <th className="text-left py-3 px-4 font-semibold text-white">Contract</th>
                <th className="text-left py-3 px-4 font-semibold text-white">Renewal</th>
                <th className="text-left py-3 px-4 font-semibold text-white">Tags</th>
                <th className="text-left py-3 px-4 font-semibold text-white">Last Activity</th>
                <th className="text-left py-3 px-4 font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {clients.map((client) => {
                const usagePercentage = getUsagePercentage(client.usage);
                const usageTrend = getUsageTrend(client.usage);
                const renewalDays = getDaysUntilRenewal(client.nextRenewal);
                const renewalStatus = getRenewalStatus(renewalDays);

                return (
                  <tr 
                    key={client.id} 
                    className="hover:bg-gray-700 transition-colors"
                  >
                    {/* Client Info */}
                    <td className="py-4 px-4 align-top">
                      <div>
                        <div className="font-medium text-white">{client.name}</div>
                        <div className="text-sm text-slate-200">{client.company}</div>
                        <div className="text-xs text-slate-200">{client.email}</div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 align-middle">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(client.status)}`}>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </span>
                    </td>

                    {/* Health */}
                    <td className="py-4 px-4 align-middle">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getHealthColor(client.health)}`}>
                          {client.health === 'at-risk' ? 'At Risk' : client.health.charAt(0).toUpperCase() + client.health.slice(1)}
                        </span>
                        <span className="text-sm text-slate-200">({client.healthScore})</span>
                      </div>
                    </td>

                    {/* Usage */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-start space-x-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-xs text-slate-200 mb-1">
                            <span>{client.usage.currentMonth.toLocaleString()}</span>
                            <span>{usagePercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                usagePercentage >= 90 ? 'bg-red-500' :
                                usagePercentage >= 70 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-slate-200 mt-1">
                            of {client.usage.limit.toLocaleString()} limit
                          </div>
                        </div>
                        <span className={`text-lg ${usageTrend.color} flex-shrink-0`}>
                          {usageTrend.icon}
                        </span>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-4 px-4 align-middle">
                      <span className="text-sm text-white">{client.plan}</span>
                    </td>

                    {/* Contract Value */}
                    <td className="py-4 px-4 align-middle">
                      <span className="text-sm font-medium text-white">
                        {formatCurrency(client.contractValue)}
                      </span>
                    </td>

                    {/* Renewal */}
                    <td className="py-4 px-4 align-top">
                      {client.nextRenewal ? (
                        <div>
                          <div className={`text-sm font-medium ${renewalStatus.color}`}>
                            {renewalStatus.text}
                          </div>
                          <div className="text-xs text-slate-200">
                            {formatDate(client.nextRenewal)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-200">N/A</span>
                      )}
                    </td>

                    {/* Tags */}
                    <td className="py-4 px-4 align-top">
                      {client.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-40">
                          {client.tags.slice(0, 3).map((tag, index) => {
                            // Generate consistent colors for tags based on tag content
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
                                key={index}
                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border truncate max-w-24 ${tagColors[colorIndex]}`}
                                title={tag}
                              >
                                {tag}
                              </span>
                            );
                          })}
                          {client.tags.length > 3 && (
                            <span className="text-xs text-blue-400 font-medium">
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
                      <span className="text-sm text-slate-200">
                        {formatDate(client.lastActivity)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-start space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClientSelect(client);
                          }}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-1 rounded text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {clients.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-200 text-lg mb-2">No clients found</div>
            <div className="text-slate-200 text-sm">
              Try adjusting your filters or add some clients to get started.
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 