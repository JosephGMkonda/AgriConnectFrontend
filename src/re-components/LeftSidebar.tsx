
import React, {useState} from 'react';
import { Link, useLocation } from 'react-router-dom';


interface LeftSidebarProps {
  onNewPost: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ onNewPost }) => {
  const location = useLocation();
  const [loading, isLoading] = useState()

  const menuItems = [
    { path: '/', icon: '🏠', label: 'Home', active: true },
    { path: '/explore', icon: '🔍', label: 'Explore' },
    { 
      path: '/notifications', 
      icon: '🔔', 
      label: 'Notifications',
      badge: 0
    },
    { path: '/messages', icon: '✉️', label: 'Messages' },
    { path: '/user-profile', icon: '👤', label: 'Profile' },
  ];

 

  return (
    <aside className="hidden md:block w-64 bg-white border-r border-green-200 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-6">
        <nav className="space-y-2 mb-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors group ${
                location.pathname === item.path
                  ? 'bg-green-100 text-green-700 font-semibold'
                  : 'text-gray-700 hover:bg-green-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-lg">{item.label}</span>
              </div>
              
              {/* Notification Badge with Loading State */}
              <div className="flex items-center">
                {item.path === '/notifications' && isLoading ? (
                  <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>
                ) : item.badge ? (
                  <span className={`
                    bg-red-500 text-white text-xs font-bold rounded-full 
                    flex items-center justify-center min-w-[20px] h-5 px-1
                    animate-pulse shadow-sm border border-white
                    transition-all duration-200 group-hover:scale-110
                    ${item.badge > 99 ? 'text-[10px]' : 'text-xs'}
                  `}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </nav>

        
        <button
          onClick={onNewPost}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors font-semibold mb-8"
        >
          + New Post
        </button>


      
        <div className="border-t border-green-200 pt-6">
          <div className="space-y-2 text-sm text-gray-500">
            <a href="#" className="block hover:text-green-600">Help Center</a>
            <a href="#" className="block hover:text-green-600">Terms of Service</a>
            <a href="#" className="block hover:text-green-600">Privacy Policy</a>
            <a href="#" className="block hover:text-green-600">About</a>
          </div>
          
          <div className="mt-4 text-xs text-gray-400">
            © 2024 AgriConnect. Growing together.
          </div>
        </div>
      </div>
    </aside>
  );
};