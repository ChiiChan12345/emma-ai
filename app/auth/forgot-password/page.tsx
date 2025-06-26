'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL || location.origin}/auth/callback`,
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage('If an account with that email exists, a password reset link has been sent.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-700">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white rounded-full shadow-lg p-4 flex items-center justify-center" style={{ width: 64, height: 64 }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="#6366F1" />
              <text x="50%" y="55%" textAnchor="middle" fill="white" fontSize="20" fontFamily="Arial" dy=".3em">E</text>
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white mt-4 mb-2 tracking-tight">Reset your password</h2>
          <p className="text-blue-100 text-sm">Enter your email to receive a password reset link.</p>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleReset}>
            {message && (
              <div className="mb-4 rounded-md bg-green-600/90 p-3 text-sm text-white shadow">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 rounded-md bg-red-600/90 p-3 text-sm text-white shadow">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending reset link...' : 'Send reset link'}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
