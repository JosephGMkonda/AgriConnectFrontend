import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector }  from "../store/hook"
import {
  fetchSuggestedUsers,
  followUser,
}  from "../Slices/SuggestedFollow"

interface User {
  id: number;
  username: string;
  avatarUrl: string;
  farmType: string;
  isOnline: boolean;
  lastSeen?: string;
}

export const RightSidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(5); 

  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((s) => s.suggested);

  
    useEffect(() => {
    dispatch(fetchSuggestedUsers());
  }, [dispatch]);

  const handleFollow = (userId: number) => {
    dispatch(followUser(userId));
  };



  const trendingTopics = [
    { tag: '#OrganicFarming', posts: '1.2K' },
    { tag: '#CropRotation', posts: '892' },
    { tag: '#SustainableAg', posts: '756' },
    { tag: '#LivestockCare', posts: '634' },
    { tag: '#Harvest2024', posts: '512' },
  ];

  return (
    <aside className="hidden lg:block w-80 bg-white border-l border-green-200 fixed right-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-6">
      
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search farmers or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-green-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-3">🔍</div>
          </div>
        </div>

         {/* showing people who are online
        <div className="bg-green-50 rounded-xl p-4 ">
          <h3 className="font-semibold text-gray-800 mb-4">Online Now</h3>
          <div className="flex items-center space-x-2">
            {suggestedUsers.filter(u => u.isOnline).slice(0, 5).map((user) => (
              <div key={user.id} className="relative group">
                <img
                  src={user.avatarUrl || '/default-avatar.png'}
                  alt={user.username}
                  className="w-8 h-8 rounded-full object-cover border-2 border-green-400"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
                  {user.username}
                </div>
              </div>
            ))}
            <span className="text-sm text-gray-500">
              +{suggestedUsers.filter(u => u.isOnline).length - 5} more online
            </span>
          </div>
        </div> */}


        {/* Suggestion poeple might follow based on tags/location as well profile*/}
        <div className="bg-green-50 rounded-xl p-4 mt-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Farmers to Follow</h3>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="space-y-3">
            {users.slice(0, visibleCount).map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar_url || "/default-avatar.png"}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-sm">{user.username}</div>
                    <div className="text-xs text-gray-500">
                      {user.farm_type || "Farmer"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleFollow(user.id)}
                  disabled={user.is_following}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    user.is_following
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {user.is_following ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>

          {visibleCount < users.length && (
            <button
              onClick={() => setVisibleCount((c) => c + 5)}
              className="text-green-600 text-sm font-semibold mt-3 hover:text-green-700"
            >
              Show more
            </button>
          )}
        </div>

        {/* Trending agricuture topics */}
        <div className="bg-green-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Trending in Farming</h3>
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="cursor-pointer hover:bg-green-100 p-2 rounded-lg transition-colors">
                <div className="font-semibold text-green-800">{topic.tag}</div>
                <div className="text-xs text-gray-500">{topic.posts} posts</div>
              </div>
            ))}
          </div>
        </div>

       
      </div>
    </aside>
  );
};