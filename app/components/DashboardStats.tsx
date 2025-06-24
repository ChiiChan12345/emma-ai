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

  // Calculate percentages for better insights
  const totalActiveClients = summary.byStatus.active + summary.byStatus.trial;
  const healthyPercentage = summary.total > 0 ? Math.round((summary.byHealth.healthy / summary.total) * 100) : 0;
  const atRiskPercentage = summary.total > 0 ? Math.round((summary.byHealth['at-risk'] / summary.total) * 100) : 0;
  const criticalPercentage = summary.total > 0 ? Math.round((summary.byHealth.critical / summary.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Clients */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-lg p-6 border border-gray-600 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-300 mb-1">Total Clients</p>
              <p className="text-3xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">{summary.total}</p>
              <p className="text-xs text-slate-400 mt-1">
                {totalActiveClients} active accounts
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-600/20 border border-blue-500/30 group-hover:bg-blue-600/30 transition-all duration-300">
              <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Average Usage */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-lg p-6 border border-gray-600 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-300 mb-1">Average Usage</p>
              <p className="text-3xl font-bold text-white group-hover:text-green-200 transition-colors duration-300">
                {Math.round(summary.averageUsage * 100)}%
              </p>
              <div className="mt-2">
                <div className="w-full bg-gray-600 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                    style={{ width: `${Math.min(Math.round(summary.averageUsage * 100), 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-full bg-green-600/20 border border-green-500/30 group-hover:bg-green-600/30 transition-all duration-300">
              <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Health Overview */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-lg p-6 border border-gray-600 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-300 mb-1">Health Score</p>
              <p className="text-3xl font-bold text-white group-hover:text-emerald-200 transition-colors duration-300">
                {healthyPercentage}%
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {summary.byHealth.healthy} healthy clients
              </p>
            </div>
            <div className="p-3 rounded-full bg-emerald-600/20 border border-emerald-500/30 group-hover:bg-emerald-600/30 transition-all duration-300">
              <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Risk Alert */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-lg p-6 border border-gray-600 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-300 mb-1">At Risk</p>
              <p className="text-3xl font-bold text-white group-hover:text-amber-200 transition-colors duration-300">
                {summary.byHealth['at-risk'] + summary.byHealth.critical}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Require attention
              </p>
            </div>
            <div className="p-3 rounded-full bg-amber-600/20 border border-amber-500/30 group-hover:bg-amber-600/30 transition-all duration-300">
              <svg className="w-6 h-6 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Status Breakdown */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-lg p-6 border border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Client Health Distribution</h3>
            <div className="text-sm text-slate-300 bg-gray-700 px-3 py-1 rounded-full border border-gray-600">
              {summary.total} Total
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 border border-green-500/20 hover:border-green-500/40 transition-all duration-200">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-200">Healthy</span>
                <span className="text-xs text-slate-400">({healthyPercentage}%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-600 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-green-500 transition-all duration-500"
                    style={{ width: `${healthyPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-white min-w-[2rem] text-right">{summary.byHealth.healthy}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-200">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-yellow-200">At Risk</span>
                <span className="text-xs text-slate-400">({atRiskPercentage}%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-600 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-yellow-500 transition-all duration-500"
                    style={{ width: `${atRiskPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-white min-w-[2rem] text-right">{summary.byHealth['at-risk']}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 border border-red-500/20 hover:border-red-500/40 transition-all duration-200">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-200">Critical</span>
                <span className="text-xs text-slate-400">({criticalPercentage}%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-600 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-red-500 transition-all duration-500"
                    style={{ width: `${criticalPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-white min-w-[2rem] text-right">{summary.byHealth.critical}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status Breakdown */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-lg p-6 border border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Account Status Overview</h3>
            <div className="text-sm text-slate-300 bg-gray-700 px-3 py-1 rounded-full border border-gray-600">
              Active: {totalActiveClients}
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(summary.byStatus).map(([status, count]) => {
              const percentage = summary.total > 0 ? Math.round((count / summary.total) * 100) : 0;
              const colorMap = {
                active: { bg: 'bg-green-500', border: 'border-green-500/20 hover:border-green-500/40', text: 'text-green-200' },
                trial: { bg: 'bg-blue-500', border: 'border-blue-500/20 hover:border-blue-500/40', text: 'text-blue-200' },
                inactive: { bg: 'bg-gray-500', border: 'border-gray-500/20 hover:border-gray-500/40', text: 'text-gray-200' },
                churned: { bg: 'bg-red-500', border: 'border-red-500/20 hover:border-red-500/40', text: 'text-red-200' }
              };
              const colors = colorMap[status as keyof typeof colorMap];
              
              return (
                <div key={status} className={`flex items-center justify-between p-3 rounded-lg bg-gray-700/50 border ${colors.border} transition-all duration-200`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 ${colors.bg} rounded-full`}></div>
                    <span className={`text-sm font-medium ${colors.text} capitalize`}>{status}</span>
                    <span className="text-xs text-slate-400">({percentage}%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors.bg} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-white min-w-[2rem] text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl shadow-lg p-6 border border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <div className="text-sm text-slate-300 bg-gray-700 px-3 py-1 rounded-full border border-gray-600">
            Shortcuts
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-gray-700/50 rounded-lg border border-blue-500/20 hover:border-blue-500/40 hover:bg-gray-700 transition-all duration-200 group">
            <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mb-2 group-hover:bg-blue-600/30 transition-all duration-200">
              <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-sm font-medium text-white group-hover:text-blue-200 transition-colors duration-200">Add Client</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-gray-700/50 rounded-lg border border-green-500/20 hover:border-green-500/40 hover:bg-gray-700 transition-all duration-200 group">
            <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center mb-2 group-hover:bg-green-600/30 transition-all duration-200">
              <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-white group-hover:text-green-200 transition-colors duration-200">Health Check</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-gray-700/50 rounded-lg border border-purple-500/20 hover:border-purple-500/40 hover:bg-gray-700 transition-all duration-200 group">
            <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center mb-2 group-hover:bg-purple-600/30 transition-all duration-200">
              <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-white group-hover:text-purple-200 transition-colors duration-200">Send Message</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-gray-700/50 rounded-lg border border-orange-500/20 hover:border-orange-500/40 hover:bg-gray-700 transition-all duration-200 group">
            <div className="w-8 h-8 bg-orange-600/20 rounded-lg flex items-center justify-center mb-2 group-hover:bg-orange-600/30 transition-all duration-200">
              <svg className="w-4 h-4 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-white group-hover:text-orange-200 transition-colors duration-200">Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
} 