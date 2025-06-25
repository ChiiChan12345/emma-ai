'use client';

import { useState } from 'react';
import { AppSettings } from '../../lib/types';

// Modern Toggle Switch Component
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

function ToggleSwitch({ checked, onChange, label, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label className="text-sm font-medium text-white">{label}</label>
        {description && (
          <p className="text-xs text-slate-200 mt-1">{description}</p>
        )}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border-2 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-blue-600 border-2 border-gray-500 peer-checked:border-blue-400 shadow-lg"></div>
      </label>
    </div>
  );
}

export function AppSettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    notifications: {
      email: true,
      push: false,
      desktop: true,
      clientUpdates: true,
      systemAlerts: false,
      weeklyReports: true
    },
    privacy: {
      dataCollection: false,
      analytics: true,
      thirdPartyIntegrations: true,
      publicProfile: false
    },
    performance: {
      autoSync: true,
      cacheData: true,
      backgroundProcessing: false,
      lowBandwidthMode: false
    },
    display: {
      compactMode: false,
      showAdvancedMetrics: true,
      animationsEnabled: true
    },
    ai: {
      enableSuggestions: true,
      autoAnalysis: false,
      learningMode: true,
      confidenceThreshold: 75
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      auditLogging: true
    }
  });

  const updateSetting = (category: keyof AppSettings, key: string, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const resetToDefaults = () => {
    setSettings({
      notifications: {
        email: true,
        push: false,
        desktop: true,
        clientUpdates: true,
        systemAlerts: false,
        weeklyReports: true
      },
      privacy: {
        dataCollection: false,
        analytics: true,
        thirdPartyIntegrations: true,
        publicProfile: false
      },
      performance: {
        autoSync: true,
        cacheData: true,
        backgroundProcessing: false,
        lowBandwidthMode: false
      },
      display: {
        compactMode: false,
        showAdvancedMetrics: true,
        animationsEnabled: true
      },
      ai: {
        enableSuggestions: true,
        autoAnalysis: false,
        learningMode: true,
        confidenceThreshold: 75
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 30,
        auditLogging: true
      }
    });
  };

  const saveSettings = () => {
    // Simulate API call
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-600 shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-2">Application Settings</h1>
          <p className="text-slate-200">Configure Emma AI to match your preferences and workflow.</p>
        </div>

        {/* Notifications Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-600 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <span className="text-2xl">🔔</span>
            <span>Notifications</span>
          </h2>
          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.notifications.email}
              onChange={(checked) => updateSetting('notifications', 'email', checked)}
              label="Email Notifications"
              description="Receive important updates via email"
            />
            <ToggleSwitch
              checked={settings.notifications.push}
              onChange={(checked) => updateSetting('notifications', 'push', checked)}
              label="Push Notifications"
              description="Get instant notifications in your browser"
            />
            <ToggleSwitch
              checked={settings.notifications.desktop}
              onChange={(checked) => updateSetting('notifications', 'desktop', checked)}
              label="Desktop Notifications"
              description="Show system notifications on your desktop"
            />
            <ToggleSwitch
              checked={settings.notifications.clientUpdates}
              onChange={(checked) => updateSetting('notifications', 'clientUpdates', checked)}
              label="Client Updates"
              description="Get notified when client status changes"
            />
            <ToggleSwitch
              checked={settings.notifications.systemAlerts}
              onChange={(checked) => updateSetting('notifications', 'systemAlerts', checked)}
              label="System Alerts"
              description="Receive alerts about system issues"
            />
            <ToggleSwitch
              checked={settings.notifications.weeklyReports}
              onChange={(checked) => updateSetting('notifications', 'weeklyReports', checked)}
              label="Weekly Reports"
              description="Get weekly summary reports"
            />
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-600 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <span className="text-2xl">🔒</span>
            <span>Privacy & Data</span>
          </h2>
          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.privacy.dataCollection}
              onChange={(checked) => updateSetting('privacy', 'dataCollection', checked)}
              label="Data Collection"
              description="Allow collection of usage data for improvement"
            />
            <ToggleSwitch
              checked={settings.privacy.analytics}
              onChange={(checked) => updateSetting('privacy', 'analytics', checked)}
              label="Analytics"
              description="Enable analytics tracking"
            />
            <ToggleSwitch
              checked={settings.privacy.thirdPartyIntegrations}
              onChange={(checked) => updateSetting('privacy', 'thirdPartyIntegrations', checked)}
              label="Third-party Integrations"
              description="Allow connections to external services"
            />
            <ToggleSwitch
              checked={settings.privacy.publicProfile}
              onChange={(checked) => updateSetting('privacy', 'publicProfile', checked)}
              label="Public Profile"
              description="Make your profile visible to other users"
            />
          </div>
        </div>

        {/* Performance Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-600 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <span className="text-2xl">⚡</span>
            <span>Performance</span>
          </h2>
          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.performance.autoSync}
              onChange={(checked) => updateSetting('performance', 'autoSync', checked)}
              label="Auto Sync"
              description="Automatically sync data in the background"
            />
            <ToggleSwitch
              checked={settings.performance.cacheData}
              onChange={(checked) => updateSetting('performance', 'cacheData', checked)}
              label="Cache Data"
              description="Store frequently used data locally"
            />
            <ToggleSwitch
              checked={settings.performance.backgroundProcessing}
              onChange={(checked) => updateSetting('performance', 'backgroundProcessing', checked)}
              label="Background Processing"
              description="Allow processing when app is in background"
            />
            <ToggleSwitch
              checked={settings.performance.lowBandwidthMode}
              onChange={(checked) => updateSetting('performance', 'lowBandwidthMode', checked)}
              label="Low Bandwidth Mode"
              description="Reduce data usage for slower connections"
            />
          </div>
        </div>

        {/* Display Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-600 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <span className="text-2xl">🎨</span>
            <span>Display</span>
          </h2>
          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.display.compactMode}
              onChange={(checked) => updateSetting('display', 'compactMode', checked)}
              label="Compact Mode"
              description="Use a more compact layout"
            />
            <ToggleSwitch
              checked={settings.display.showAdvancedMetrics}
              onChange={(checked) => updateSetting('display', 'showAdvancedMetrics', checked)}
              label="Advanced Metrics"
              description="Show detailed performance metrics"
            />
            <ToggleSwitch
              checked={settings.display.animationsEnabled}
              onChange={(checked) => updateSetting('display', 'animationsEnabled', checked)}
              label="Animations"
              description="Enable smooth animations and transitions"
            />
          </div>
        </div>

        {/* AI Settings Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-600 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <span className="text-2xl">🤖</span>
            <span>AI Settings</span>
          </h2>
          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.ai.enableSuggestions}
              onChange={(checked) => updateSetting('ai', 'enableSuggestions', checked)}
              label="AI Suggestions"
              description="Get AI-powered recommendations"
            />
            <ToggleSwitch
              checked={settings.ai.autoAnalysis}
              onChange={(checked) => updateSetting('ai', 'autoAnalysis', checked)}
              label="Auto Analysis"
              description="Automatically analyze client data"
            />
            <ToggleSwitch
              checked={settings.ai.learningMode}
              onChange={(checked) => updateSetting('ai', 'learningMode', checked)}
              label="Learning Mode"
              description="Allow AI to learn from your actions"
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                AI Confidence Threshold: {settings.ai.confidenceThreshold}%
              </label>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={settings.ai.confidenceThreshold}
                onChange={(e) => updateSetting('ai', 'confidenceThreshold', parseInt(e.target.value))}
                className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(settings.ai.confidenceThreshold - 50) / 45 * 100}%, #4a5568 ${(settings.ai.confidenceThreshold - 50) / 45 * 100}%, #4a5568 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-slate-200">
                <span>Conservative (50%)</span>
                <span>Aggressive (95%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-600 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <span className="text-2xl">🛡️</span>
            <span>Security</span>
          </h2>
          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.security.twoFactorAuth}
              onChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
            />
            <ToggleSwitch
              checked={settings.security.auditLogging}
              onChange={(checked) => updateSetting('security', 'auditLogging', checked)}
              label="Audit Logging"
              description="Log all security-related events"
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                Session Timeout: {settings.security.sessionTimeout} minutes
              </label>
              <input
                type="range"
                min="15"
                max="120"
                step="15"
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(settings.security.sessionTimeout - 15) / 105 * 100}%, #4a5568 ${(settings.security.sessionTimeout - 15) / 105 * 100}%, #4a5568 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-slate-200">
                <span>15 min</span>
                <span>2 hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-600 shadow-lg">
          <div className="flex justify-between items-center">
            <button
              onClick={resetToDefaults}
              className="px-6 py-3 border-2 border-gray-500 hover:border-gray-400 bg-transparent hover:bg-gray-700 text-slate-200 hover:text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset to Defaults</span>
            </button>
            
            <button
              onClick={saveSettings}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
} 