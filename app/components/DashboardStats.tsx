interface Summary {
  total: number;
  byStatus: {
    active: number;
    trial: number;
    inactive: number;
    churned: number;
  };
  byHealth: {
    healthy: number;
    'at-risk': number;
    critical: number;
  };
  averageUsage: number;
}

interface DashboardStatsProps {
  summary: Summary;
}

export function DashboardStats({ summary }: DashboardStatsProps) {
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-200 border-green-500';
      case 'at-risk': return 'text-yellow-200 border-yellow-500';
      case 'critical': return 'text-red-200 border-red-500';
      default: return 'text-slate-200 border-gray-500';
    }
  };

  const getHealthBgColor = (health: string) => {
    switch (health) {
      case 'healthy': return { backgroundColor: '#064e3b', borderColor: '#10b981' };
      case 'at-risk': return { backgroundColor: '#78350f', borderColor: '#f59e0b' };
      case 'critical': return { backgroundColor: '#7f1d1d', borderColor: '#ef4444' };
      default: return { backgroundColor: '#374151', borderColor: '#6b7280' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-200 border-green-500';
      case 'trial': return 'text-blue-200 border-blue-500';
      case 'inactive': return 'text-slate-200 border-gray-500';
      case 'churned': return 'text-red-200 border-red-500';
      default: return 'text-slate-200 border-gray-500';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'active': return { backgroundColor: '#064e3b', borderColor: '#10b981' };
      case 'trial': return { backgroundColor: '#1e3a8a', borderColor: '#3b82f6' };
      case 'inactive': return { backgroundColor: '#374151', borderColor: '#6b7280' };
      case 'churned': return { backgroundColor: '#7f1d1d', borderColor: '#ef4444' };
      default: return { backgroundColor: '#374151', borderColor: '#6b7280' };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Clients */}
      <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-600">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-200">Total Clients</p>
            <p className="text-3xl font-bold text-white">{summary.total}</p>
          </div>
          <div 
            className="p-3 rounded-full"
            style={{ backgroundColor: '#1e3a8a' }}
          >
            <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Average Usage */}
      <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-600">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-200">Average Usage</p>
            <p className="text-3xl font-bold text-white">{Math.round(summary.averageUsage * 100)}%</p>
          </div>
          <div 
            className="p-3 rounded-full"
            style={{ backgroundColor: '#064e3b' }}
          >
            <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Health Status */}
      <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-600">
        <p className="text-sm font-medium text-slate-200 mb-3">Health Status</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span 
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getHealthColor('healthy')}`}
              style={getHealthBgColor('healthy')}
            >
              Healthy
            </span>
            <span className="text-sm font-semibold text-white">{summary.byHealth.healthy}</span>
          </div>
          <div className="flex items-center justify-between">
            <span 
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getHealthColor('at-risk')}`}
              style={getHealthBgColor('at-risk')}
            >
              At Risk
            </span>
            <span className="text-sm font-semibold text-white">{summary.byHealth['at-risk']}</span>
          </div>
          <div className="flex items-center justify-between">
            <span 
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getHealthColor('critical')}`}
              style={getHealthBgColor('critical')}
            >
              Critical
            </span>
            <span className="text-sm font-semibold text-white">{summary.byHealth.critical}</span>
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-600">
        <p className="text-sm font-medium text-slate-200 mb-3">Account Status</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span 
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor('active')}`}
              style={getStatusBgColor('active')}
            >
              Active
            </span>
            <span className="text-sm font-semibold text-white">{summary.byStatus.active}</span>
          </div>
          <div className="flex items-center justify-between">
            <span 
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor('trial')}`}
              style={getStatusBgColor('trial')}
            >
              Trial
            </span>
            <span className="text-sm font-semibold text-white">{summary.byStatus.trial}</span>
          </div>
          <div className="flex items-center justify-between">
            <span 
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor('inactive')}`}
              style={getStatusBgColor('inactive')}
            >
              Inactive
            </span>
            <span className="text-sm font-semibold text-white">{summary.byStatus.inactive}</span>
          </div>
          <div className="flex items-center justify-between">
            <span 
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor('churned')}`}
              style={getStatusBgColor('churned')}
            >
              Churned
            </span>
            <span className="text-sm font-semibold text-white">{summary.byStatus.churned}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 