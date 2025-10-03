import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { logout } from '../Slices/AuthSlice'
import { 
  
  FaVideo, 
  FaUser, 
  FaUsers, 
  FaSearch, 
  FaCaretDown,
  FaSignOutAlt,
  FaUserCircle,
  FaCog,
  FaBookmark
} from 'react-icons/fa';



export const TopNavigation: React.FC<TopNavigationProps> = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-green-800 hidden sm:block">AgriConnect</span>
          </Link>

          
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute left-3 top-2.5">
                <FaSearch className="text-gray-400" size={14} />
              </div>
              <input
                type="text"
                placeholder="Search farmers, posts, videos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>

          
          <div className="flex items-center space-x-1 sm:space-x-2">
          

          
            <Link
              to="/videos"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              title="Videos"
            >
              <FaVideo size={20} className="text-gray-600 hover:text-green-600" />
            </Link>

          
            <Link
              to="/user-profile"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              title="My Posts"
            >
              <FaUser size={20} className="text-gray-600 hover:text-green-600" />
            </Link>

          
            <Link
              to="/friends"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              title="Friends"
            >
              <FaUsers size={20} className="text-gray-600 hover:text-green-600" />
            </Link>

            

           

            
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <img
                  src={currentUser?.avatar_url || '/default-avatar.png'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-green-400"
                />
                <span className="hidden lg:block text-sm font-medium text-gray-700">
                  {currentUser?.username || 'User'}
                </span>
                <FaCaretDown className="text-gray-500" />
              </button>

            
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaUserCircle className="mr-3" />
                    Profile
                  </Link>
                  
                  <Link
                    to="/saved"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaBookmark className="mr-3" />
                    Saved Posts
                  </Link>
                  
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaCog className="mr-3" />
                    Settings
                  </Link>
                  
                  <hr className="my-1" />
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        
        <div className="md:hidden pb-3">
          <div className="relative">
            <div className="absolute left-3 top-2.5">
              <FaSearch className="text-gray-400" size={14} />
            </div>
            <input
              type="text"
              placeholder="Search farmers, posts, videos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

  
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
};