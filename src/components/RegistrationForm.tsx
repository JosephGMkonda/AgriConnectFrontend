import React, { useState } from 'react';
import type { RegisterData } from '../types/auth';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../service/auth';
import { useAppDispatch } from '../store/hook';
import { register} from '../hooks/AuthSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
        await dispatch(
        register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        })
      ).unwrap();

      toast.success('Registration successful! Redirecting to login...', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err: any) {

        toast.error(err.message || 'Registration failed!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

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

  
  const colors = {
    primary: {
      500: '#2B8C44', 
      600: '#1F6A33', 
    },
    earth: {
      500: '#8B5A2B', 
      600: '#6B451A', 
      400: '#C19A6B', 
    },
    accent: {
      500: '#D4A017', 
      400: '#F4D03F', 
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ 
        background: `linear-gradient(135deg, ${colors.earth[400]}20 0%, ${colors.accent[400]}10 100%)` 
      }}
    >
       
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        <div className="text-center">
          <div 
            className="mx-auto h-16 w-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.earth[500] }}
          >
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Join AgriConnect</h2>
          <p className="mt-2 text-sm text-gray-600">Create your account and start sharing knowledge</p>
        </div>
         <ToastContainer />

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none transition-colors"
                style={{ 
                  borderColor: '#D1D5DB',
                  focusBorderColor: colors.earth[500],
                  focusRingColor: colors.earth[500]
                }}
                placeholder="Choose a username"
              />
            </div>

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
                  focusBorderColor: colors.earth[500],
                  focusRingColor: colors.earth[500]
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
                  focusBorderColor: colors.earth[500],
                  focusRingColor: colors.earth[500]
                }}
                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none transition-colors"
                style={{ 
                  borderColor: '#D1D5DB',
                  focusBorderColor: colors.earth[500],
                  focusRingColor: colors.earth[500]
                }}
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 border-gray-300 rounded"
              style={{ 
                color: colors.earth[500],
                focusRingColor: colors.earth[400]
              }}
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{' '}
              <a 
                href="#" 
                className="transition-colors"
                style={{ 
                  color: colors.earth[500],
                  hoverColor: colors.earth[600]
                }}
                onMouseOver={(e) => e.currentTarget.style.color = colors.earth[600]}
                onMouseOut={(e) => e.currentTarget.style.color = colors.earth[500]}
              >
                Terms and Conditions
              </a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: colors.earth[500],
                hoverBackgroundColor: colors.earth[600],
                focusRingColor: colors.earth[500]
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.earth[600]}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.earth[500]}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium transition-colors"
                style={{ 
                  color: colors.primary[500],
                  hoverColor: colors.primary[600]
                }}
                onMouseOver={(e) => e.currentTarget.style.color = colors.primary[600]}
                onMouseOut={(e) => e.currentTarget.style.color = colors.primary[500]}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};