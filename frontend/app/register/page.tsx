'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { register } = useAuth();

  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(pass)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(pass)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/\d/.test(pass)) {
      return 'Password must contain at least one number';
    }
    if (!/[@$!%*?&]/.test(pass)) {
      return 'Password must contain at least one special character (@$!%*?&)';
    }
    return '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate password before submitting
    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      return;
    }
    
    setLoading(true);
    setPasswordError('');

    try {
      await register(email, password, name);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="••••••••"
            />
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <p className="font-medium">Password must contain:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li className={password.length >= 8 ? 'text-green-600' : ''}>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
                  One uppercase letter (A-Z)
                </li>
                <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>
                  One lowercase letter (a-z)
                </li>
                <li className={/\d/.test(password) ? 'text-green-600' : ''}>
                  One number (0-9)
                </li>
                <li className={/[@$!%*?&]/.test(password) ? 'text-green-600' : ''}>
                  One special character (@$!%*?&)
                </li>
              </ul>
            </div>
            {passwordError && (
              <p className="mt-2 text-sm text-red-600">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Login
          </Link>
        </p>

        <Link
          href="/"
          className="block mt-4 text-center text-gray-600 hover:text-gray-800"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}