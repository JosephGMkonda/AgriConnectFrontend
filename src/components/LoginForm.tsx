import React, { useState } from 'react';
import type { LoginData } from '../types/auth';
import { Link } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // const { user } = await AuthService.login(formData);
      // console.log('Login successful:', user);
      alert('Login functionality would go here');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Define your custom colors as constants
  const colors = {
    primary: {
      500: '#2B8C44', // Green
      600: '#1F6A33', // Darker Green
      400: '#7EBF8D', // Lighter Green
    },
    earth: {
      500: '#8B5A2B', // Brown
      600: '#6B451A', // Darker Brown
    },
    accent: {
      500: '#D4A017', // Gold/Yellow
      400: '#F4D03F', // Lighter Gold
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ 
        background: `linear-gradient(135deg, ${colors.primary[400]}20 0%, ${colors.earth[400]}10 100%)` 
      }}
    >
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        {/* Header */}
        <div className="text-center">
          <div 
            className="mx-auto h-16 w-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.primary[500] }}
          >
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your AgriConnect account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none transition-colors"
                style={{ 
                  borderColor: '#D1D5DB',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary[500];
                  e.target.style.boxShadow = `0 0 0 3px ${colors.primary[500]}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D1D5DB';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none transition-colors"
                style={{ 
                  borderColor: '#D1D5DB',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary[500];
                  e.target.style.boxShadow = `0 0 0 3px ${colors.primary[500]}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D1D5DB';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 border-gray-300 rounded"
                style={{ 
                  color: colors.primary[500],
                }}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a 
                href="#" 
                className="font-medium transition-colors"
                style={{ 
                  color: colors.primary[500],
                }}
                onMouseOver={(e) => e.currentTarget.style.color = colors.primary[600]}
                onMouseOut={(e) => e.currentTarget.style.color = colors.primary[500]}
              >
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: colors.primary[500],
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.primary[600])}
              onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.primary[500])}
              onFocus={(e) => !loading && (e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[500]}40`)}
              onBlur={(e) => !loading && (e.currentTarget.style.boxShadow = 'none')}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-medium transition-colors"
                style={{ 
                  color: colors.earth[500],
                }}
                onMouseOver={(e) => e.currentTarget.style.color = colors.earth[600]}
                onMouseOut={(e) => e.currentTarget.style.color = colors.earth[500]}
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};