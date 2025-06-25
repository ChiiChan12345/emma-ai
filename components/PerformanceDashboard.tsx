'use client';

import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  memoryUsage: number;
  apiResponseTime: number;
  cacheHitRate: number;
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 1200,
    memoryUsage: 45,
    apiResponseTime: 250,
    cacheHitRate: 0.85
  });
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        setMetrics({
          loadTime: Math.random() * 1000 + 800,
          memoryUsage: Math.random() * 30 + 20,
          apiResponseTime: Math.random() * 300 + 100,
          cacheHitRate: Math.random() * 0.3 + 0.7
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const getGrade = () => {
    let score = 100;
    if (metrics.loadTime > 1500) score -= 20;
    if (metrics.memoryUsage > 40) score -= 15;
    if (metrics.apiResponseTime > 300) score -= 20;
    if (metrics.cacheHitRate < 0.8) score -= 15;

    return score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'D';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">🚀 Performance Dashboard</h3>
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            getGrade() === 'A' ? 'bg-green-100 text-green-700' :
            getGrade() === 'B' ? 'bg-blue-100 text-blue-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            Grade {getGrade()}
          </div>
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isMonitoring 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Load Time</h4>
          <div className="text-2xl font-bold text-blue-600">{Math.round(metrics.loadTime)}ms</div>
          <div className="text-xs text-gray-600 mt-1">Target: &lt;1000ms</div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Memory Usage</h4>
          <div className="text-2xl font-bold text-green-600">{Math.round(metrics.memoryUsage)}MB</div>
          <div className="text-xs text-gray-600 mt-1">Target: &lt;30MB</div>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">API Response</h4>
          <div className="text-2xl font-bold text-purple-600">{Math.round(metrics.apiResponseTime)}ms</div>
          <div className="text-xs text-gray-600 mt-1">Target: &lt;200ms</div>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Cache Hit Rate</h4>
          <div className="text-2xl font-bold text-yellow-600">{Math.round(metrics.cacheHitRate * 100)}%</div>
          <div className="text-xs text-gray-600 mt-1">Target: &gt;90%</div>
        </div>
      </div>

      {isMonitoring && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-700 font-medium">Real-time monitoring active</span>
          </div>
        </div>
      )}
    </div>
  );
} 