import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { 
  fetchFriendRecommendations,
  setActiveTab,
  removeSuggestion
} from '../hooks/FindFriendSlice';

import followUser from '../hooks/followSlice';
import unfollowUser from '../hooks/followSlice';
import {fetchFollowing} from '../hooks/followSlice';

import { 
  FaUser, 
  FaMapMarkerAlt, 
  FaSeedling, 
  FaPlus, 
  FaCheck, 
  FaUsers,
  FaLightbulb,
  FaSync,
  FaSearch
} from 'react-icons/fa';

export const FindFriends: React.FC = () => {
  const dispatch = useAppDispatch();
  const { suggestedUsers, loading, error, activeTab } = useAppSelector(
    (state) => state.friends
  );
  const { following } = useAppSelector((state) => state.follow);
  

   useEffect(() => {
    dispatch(fetchFriendRecommendations());
    dispatch(fetchFollowing()); 
  }, [dispatch]);

  
  const handleFollow = async (userId: number) => {
    try {
      await dispatch(followUser(userId)).unwrap();
      
      dispatch(removeSuggestion(userId));
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  const handleUnfollow = (userId: number) => {
    dispatch(unfollowUser(userId));
  }

  const handleRefresh = () => {
    dispatch(fetchFriendRecommendations());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto p-4">
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find Farmers</h1>
              <p className="text-gray-600">Connect with fellow agricultural enthusiasts</p>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaSync size={14} />
              <span>Refresh</span>
            </button>
          </div>

          
          <div className="relative">
            <div className="absolute left-3 top-3">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search farmers by name, location, or farming type..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => dispatch(setActiveTab('suggested'))}
              className={`flex-1 py-4 text-center font-medium border-b-2 transition-colors ${
                activeTab === 'suggested'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FaLightbulb />
                <span>Suggested Farmers</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  {suggestedUsers.length}
                </span>
              </div>
            </button>
            
            <button
              onClick={() => dispatch(setActiveTab('following'))}
              className={`flex-1 py-4 text-center font-medium border-b-2 transition-colors ${
                activeTab === 'following'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FaUsers />
                <span>Following</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {following.length}
                </span>
              </div>
            </button>
          </div>

        
          <div className="p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {activeTab === 'suggested' ? (
              <div className="space-y-4">
                {suggestedUsers.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FaUsers className="text-4xl mx-auto mb-4" />
                    <p className="text-lg font-medium">No suggestions available</p>
                    <p className="text-sm">Try refreshing or complete your profile for better matches</p>
                  </div>
                ) : (
                  suggestedUsers.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      onFollow={() => handleFollow(user.id)}
                      isFollowing={false}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {following.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FaUsers className="text-4xl mx-auto mb-4" />
                    <p className="text-lg font-medium">Not following anyone yet</p>
                    <p className="text-sm">Start connecting with other farmers from the suggestions tab</p>
                  </div>
                ) : (
                  following.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      onFollow={() => handleUnfollow(user.id)}
                      isFollowing={true}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


interface UserCardProps {
  user: any;
  onFollow: () => void;
  isFollowing: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, onFollow, isFollowing }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        
        <img
          src={user.avatar_url || '/default-avatar.png'}
          alt={user.username}
          className="w-16 h-16 rounded-full object-cover border-2 border-green-200"
        />
        
    
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{user.username}</h3>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
            
            <button
              onClick={onFollow}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isFollowing
                  ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isFollowing ? (
                <>
                  <FaCheck size={14} />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <FaPlus size={14} />
                  <span>Follow</span>
                </>
              )}
            </button>
          </div>

    
          <div className="mt-3 space-y-2">
            {user.farmType && (
              <div className="flex items-center space-x-2 text-sm">
                <FaSeedling className="text-green-600" />
                <span className="text-gray-700">{user.farmType}</span>
              </div>
            )}
            
            {user.location && (
              <div className="flex items-center space-x-2 text-sm">
                <FaMapMarkerAlt className="text-green-600" />
                <span className="text-gray-700">{user.location}</span>
              </div>
            )}
            
            {user.bio && (
              <p className="text-gray-600 text-sm mt-2">{user.bio}</p>
            )}
            
        
            {user.score && (
              <div className="mt-3">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-600">Match score:</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${user.score}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-green-600">{Math.round(user.score)}%</span>
                </div>
              </div>
            )}
            
            
            {user.common_interests && user.common_interests.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                  {user.common_interests.slice(0, 3).map((interest: string, index: number) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};