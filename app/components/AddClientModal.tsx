'use client';

import { useState } from 'react';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: () => void;
}

export function AddClientModal({ isOpen, onClose, onClientAdded }: AddClientModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    status: 'trial' as 'trial' | 'active' | 'inactive',
    plan: 'Trial',
    contractValue: 0,
    notes: '',
    tags: '',
    usage: {
      limit: 500
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          clientData: {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            contractValue: Number(formData.contractValue),
            usage: {
              currentMonth: 0,
              lastMonth: 0,
              limit: formData.usage.limit
            }
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        onClientAdded();
        onClose();
        setFormData({
          name: '',
          email: '',
          company: '',
          status: 'trial',
          plan: 'Trial',
          contractValue: 0,
          notes: '',
          tags: '',
          usage: { limit: 500 }
        });
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Failed to add client');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Add New Client</h2>
          <button 
            onClick={onClose}
            className="text-slate-200 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-white mb-2" style={{color: '#ffffff !important'}}>
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter client's full name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2" style={{color: '#ffffff !important'}}>
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="client@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2" style={{color: '#ffffff !important'}}>
              Company *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Company name"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-white mb-2" style={{color: '#ffffff !important'}}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as 'trial' | 'active' | 'inactive'})}
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="trial">Trial</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2" style={{color: '#ffffff !important'}}>
                Plan
              </label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({...formData, plan: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="Trial">Trial</option>
                <option value="Basic">Basic</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-white mb-2" style={{color: '#ffffff !important'}}>
                Contract Value ($)
              </label>
              <input
                type="number"
                min="0"
                value={formData.contractValue}
                onChange={(e) => setFormData({...formData, contractValue: Number(e.target.value)})}
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2" style={{color: '#ffffff !important'}}>
                Usage Limit
              </label>
              <input
                type="number"
                min="100"
                value={formData.usage.limit}
                onChange={(e) => setFormData({...formData, usage: { limit: Number(e.target.value) }})}
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2" style={{color: '#ffffff !important'}}>
              Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g., high-value, engaged, potential-churn"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2" style={{color: '#ffffff !important'}}>
              Notes
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Additional notes about the client..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-transparent border-2 border-gray-600 text-slate-200 rounded-lg hover:bg-gray-700 hover:text-white hover:border-gray-500 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Client</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 