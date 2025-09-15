import React from 'react';
import { Link } from 'react-router-dom';

interface TopNavigationProps {
  onNewPost: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-green-200 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-green-800">AgriConnect</span>
          </Link>

          
          <div className="md:hidden flex-1 max-w-xs mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search farmers..."
                className="w-full pl-10 pr-4 py-2 border border-green-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-2.5">
                <span className="text-green-400">🔍</span>
              </div>
            </div>
          </div>

          
          <div className="flex items-center space-x-4">
          
            
            <div className="flex items-center space-x-3">
              <img
                src="/default-avatar.png"
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-green-400"
              />
              <span className="hidden md:block text-sm font-medium text-gray-700">
                Username
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};