'use client';

import { useState } from 'react';
import { UserProfile } from '../../lib/types';

export function ProfileSettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    business: {
      companyName: 'Emma AI Solutions',
      industry: 'Software',
      companySize: '10-50',
      website: 'https://emma-ai.com',
      address: '123 Innovation Drive',
      city: 'San Francisco',
      state: 'CA'
    },
    personal: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@emma-ai.com',
      phone: '+1 (555) 123-4567',
      jobTitle: 'Customer Success Manager',
      department: 'Customer Success'
    },
    preferences: {
      timezone: 'PST',
      language: 'English',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12-hour',
      currency: 'USD',
      theme: 'Light',
      notifications: true,
      emailSignature: 'Best regards,\nSarah Johnson\nCustomer Success Manager'
    },
    security: {
      twoFactorEnabled: false,
      lastPasswordChange: '2024-01-15',
      passwordLastChanged: '2024-01-15',
      loginHistory: [
        { date: '2024-01-20', ip: '192.168.1.100', location: 'San Francisco, CA' },
        { date: '2024-01-19', ip: '192.168.1.100', location: 'San Francisco, CA' },
        { date: '2024-01-18', ip: '10.0.0.50', location: 'Remote Office' }
      ]
    }
  });

  const [activeTab, setActiveTab] = useState<string>('business');

  const handleProfileChange = (category: keyof UserProfile, field: string, value: string | boolean | number) => {
    setProfile(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    alert('Profile updated successfully!');
  };

  const tabs = [
    { id: 'business', label: 'Business Info', icon: '🏢' },
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your business and personal information</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'business' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={profile.business.companyName}
                  onChange={(e) => handleProfileChange('business', 'companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={profile.business.industry}
                  onChange={(e) => handleProfileChange('business', 'industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Software">Software</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                <select
                  value={profile.business.companySize}
                  onChange={(e) => handleProfileChange('business', 'companySize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="10-50">10-50 employees</option>
                  <option value="50-200">50-200 employees</option>
                  <option value="200-1000">200-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={profile.business.website}
                  onChange={(e) => handleProfileChange('business', 'website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={profile.business.address}
                  onChange={(e) => handleProfileChange('business', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={profile.business.city}
                  onChange={(e) => handleProfileChange('business', 'city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                <input
                  type="text"
                  value={profile.business.state}
                  onChange={(e) => handleProfileChange('business', 'state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'personal' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={profile.personal.firstName}
                  onChange={(e) => handleProfileChange('personal', 'firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={profile.personal.lastName}
                  onChange={(e) => handleProfileChange('personal', 'lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.personal.email}
                  onChange={(e) => handleProfileChange('personal', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profile.personal.phone}
                  onChange={(e) => handleProfileChange('personal', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  value={profile.personal.jobTitle}
                  onChange={(e) => handleProfileChange('personal', 'jobTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  value={profile.personal.department}
                  onChange={(e) => handleProfileChange('personal', 'department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <select
                  value={profile.preferences.dateFormat}
                  onChange={(e) => handleProfileChange('preferences', 'dateFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                <select
                  value={profile.preferences.timeFormat}
                  onChange={(e) => handleProfileChange('preferences', 'timeFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="12-hour">12 Hour</option>
                  <option value="24-hour">24 Hour</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={profile.preferences.currency}
                  onChange={(e) => handleProfileChange('preferences', 'currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Signature</label>
                <textarea
                  value={profile.preferences.emailSignature}
                  onChange={(e) => handleProfileChange('preferences', 'emailSignature', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-700">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-500">Add an extra layer of security</div>
                </div>
                <input
                  type="checkbox"
                  checked={profile.security.twoFactorEnabled}
                  onChange={(e) => handleProfileChange('security', 'twoFactorEnabled', e.target.checked)}
                  className="h-4 w-4 text-blue-600"
                />
              </div>
              <div>
                <div className="font-medium text-gray-700">Change Password</div>
                <div className="text-sm text-gray-500">Last changed: {profile.security.passwordLastChanged}</div>
                <button
                  onClick={() => {
                    // Implement password change logic here
                  }}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
} 