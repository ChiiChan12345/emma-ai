'use client';

import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isCollapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
}

export function Sidebar({ currentPage, onPageChange, isCollapsed: externalCollapsed, onToggle }: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  // Use external collapsed state if provided, otherwise use internal state
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  
  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    if (onToggle) {
      onToggle(newCollapsed);
    } else {
      setInternalCollapsed(newCollapsed);
    }
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      description: 'Overview & Analytics'
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: '👥',
      description: 'Client Management'
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: '💬',
      description: 'Messages & Outreach'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      description: 'Reports & Insights'
    },
    {
      id: 'automation',
      label: 'Automation',
      icon: '🤖',
      description: 'Workflows & Rules'
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: '🔗',
      description: 'Connect Apps'
    },
    {
      id: 'app-settings',
      label: 'App Settings',
      icon: '⚙️',
      description: 'Emma AI Configuration'
    }
  ];

  const integrationItems = [
    {
      id: 'slack',
      label: 'Slack',
      icon: '💬',
      status: 'available'
    },
    {
      id: 'clickup',
      label: 'ClickUp',
      icon: '✅',
      status: 'available'
    },
    {
      id: 'google',
      label: 'Google Workspace',
      icon: '📧',
      status: 'available'
    },
    {
      id: 'hubspot',
      label: 'HubSpot',
      icon: '🎯',
      status: 'coming-soon'
    },
    {
      id: 'salesforce',
      label: 'Salesforce',
      icon: '☁️',
      status: 'coming-soon'
    },
    {
      id: 'intercom',
      label: 'Intercom',
      icon: '💭',
      status: 'coming-soon'
    }
  ];

  return (
    <div className={`sidebar bg-white h-screen flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } fixed left-0 top-0 z-40`}>
      {/* Header */}
      <div className="p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">Emma AI</div>
                <div className="text-xs text-slate-200">Customer Success</div>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className={`absolute top-4 ${isCollapsed ? '-right-3' : 'right-4'} w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all duration-300 z-50`}
      >
        <svg
          className={`w-3 h-3 text-gray-600 transition-transform duration-300 ${
            isCollapsed ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center ${
              isCollapsed 
                ? 'justify-center p-3 h-12' 
                : 'space-x-3 px-3 py-3 h-12'
            } rounded-lg text-left relative group transition-colors ${
              currentPage === item.id
                ? 'active bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title={isCollapsed ? item.label : ''}
          >
            <span className={`${isCollapsed ? 'text-lg' : 'text-lg'} flex-shrink-0 relative z-10`}>
              {item.icon}
            </span>
            {!isCollapsed && (
              <div className="relative z-10">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-slate-200">{item.description}</div>
              </div>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
} 