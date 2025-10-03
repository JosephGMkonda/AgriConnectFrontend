import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams,useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { api } from '../service/api';
import { PostCard } from '../re-components/PostCard';
import { 
  FaUser, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaSeedling, 
  FaEdit,
  FaCamera,
  FaUsers,
  FaFileAlt,
  FaQuestion,
  FaNewspaper,
  FaLightbulb,
  FaInfoCircle,
  FaLeaf
} from 'react-icons/fa';

interface ProfileData {
  profile: {
    id: number;
    username: string;
    email: string;
    bio: string;
    avatar_url: string;
    phone_number: string;
    farmType: string;
    location: string;
    profile_completed: boolean;
    created_at: string;
    updated_at: string;
  };
  posts: any[];
  post_count: number;
  post_type_counts: Record<string, number>;
  follower_count: number;
  following_count: number;
}

// Post types
const POST_TYPES = [
  { value: 'all', label: 'All Posts', icon: FaFileAlt, color: 'text-gray-600' },
  { value: 'question', label: 'Questions', icon: FaQuestion, color: 'text-blue-600' },
  { value: 'article', label: 'Articles', icon: FaNewspaper, color: 'text-green-600' },
  { value: 'advice', label: 'Advice', icon: FaLightbulb, color: 'text-yellow-600' },
  { value: 'news', label: 'News', icon: FaInfoCircle, color: 'text-red-600' },
  { value: 'tip', label: 'Farming Tips', icon: FaLeaf, color: 'text-purple-600' },
];

export const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');
  const navigate = useNavigate()
  
  const selectedPostType = searchParams.get('type') || 'all';

  useEffect(() => {
    fetchProfileData();
  }, [username, selectedPostType]); 

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const endpoint = username 
      ? `/userprofile/profile/?username=${username}`  
      : '/userprofile/profile/'; 
      
      
      const params: any = {};
      if (selectedPostType !== 'all') {
        params.type = selectedPostType;
      }
      
      const response = await api.get(endpoint, { params });
      console.log("The profile response", response)
      setProfileData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePostTypeChange = (type: string) => {
    
    if (type === 'all') {
      searchParams.delete('type');
    } else {
      searchParams.set('type', type);
    }
    setSearchParams(searchParams);
  };

const handleEdit = () => {
  navigate('/profile'); 
};



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <div className="bg-white p-4 rounded-b-lg">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <button 
              onClick={fetchProfileData}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg p-6 text-center">
            Profile not found
          </div>
        </div>
      </div>
    );
  }

  

  if (!profileData) return null;

  const { profile, posts, post_count, post_type_counts, follower_count, following_count } = profileData;
  const isOwnProfile = currentUser?.username === profile.username;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      
      <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500"></div>
      
      
      <div className="max-w-6xl mx-auto px-4 -mt-16">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">

        
          
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              
              <div className="relative">
                <img
                  src={profile.avatar_url || '/default-avatar.png'}
                  alt={profile.username}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
               
              </div>

              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profile.username}
                    </h1>
                    <p className="text-gray-600">{post_count} posts</p>
                  </div>
                  
                  {isOwnProfile ? (
                    <button
                      onClick={handleEdit}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      <FaEdit size={14} />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                        Follow
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50">
                        Message
                      </button>
                    </div>
                  )}
                </div>

                
                <div className="flex space-x-6 mt-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{post_count}</div>
                    <div className="text-gray-600">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{follower_count}</div>
                    <div className="text-gray-600">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{following_count}</div>
                    <div className="text-gray-600">Following</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          

    
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-4 border-b-2 font-medium ${
                  activeTab === 'posts'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`py-4 border-b-2 font-medium ${
                  activeTab === 'about'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                About
              </button>
            </div>
          </div>

          
          <div className="p-6">
            {activeTab === 'posts' ? (
              <div>
                
                <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-200">
                  {POST_TYPES.map((type) => {
                    const IconComponent = type.icon;
                    const count = type.value === 'all' 
                      ? post_count 
                      : post_type_counts?.[type.value] || 0;
                    
                    return (
                      <button
                        key={type.value}
                        onClick={() => handlePostTypeChange(type.value)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedPostType === type.value
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <IconComponent className={type.color} />
                        <span>{type.label}</span>
                        <span className="bg-white px-2 py-1 rounded-full text-xs font-semibold">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

            
                <div className="space-y-4">
                  {posts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="flex justify-center mb-4">
                        {selectedPostType === 'all' ? (
                          <FaFileAlt className="text-4xl" />
                        ) : (
                          POST_TYPES
                            .find(t => t.value === selectedPostType)
                            ?.icon({ className: "text-4xl" })
                        )}
                      </div>
                      <p className="text-lg font-medium mb-2">
                        No {selectedPostType === 'all' ? '' : selectedPostType + ' '}posts yet
                      </p>
                      {isOwnProfile && (
                        <p className="text-sm">Start sharing your {selectedPostType !== 'all' ? selectedPostType : 'farming'} experiences!</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {selectedPostType === 'all' 
                            ? 'All Posts' 
                            : POST_TYPES.find(t => t.value === selectedPostType)?.label
                          } ({posts.length})
                        </h3>
                      </div>
                     <div className="space-y-4">
  {posts.length === 0 ? (
    <div className="text-center py-12 text-gray-500">
      <div className="flex justify-center mb-4">
        {selectedPostType === 'all' ? (
          <FaFileAlt className="text-4xl" />
        ) : (
          POST_TYPES
            .find(t => t.value === selectedPostType)
            ?.icon({ className: "text-4xl" })
        )}
      </div>
      <p className="text-lg font-medium mb-2">
        No {selectedPostType === 'all' ? '' : selectedPostType + ' '}posts yet
      </p>
      {isOwnProfile && (
        <p className="text-sm">Start sharing your {selectedPostType !== 'all' ? selectedPostType : 'farming'} experiences!</p>
      )}
    </div>
  ) : (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {selectedPostType === 'all' 
            ? 'All Posts' 
            : POST_TYPES.find(t => t.value === selectedPostType)?.label
          } ({posts.length})
        </h3>
      </div>
      
      <div className="space-y-4">
        {posts.map((post) => {
          
          const transformedPost = {
            ...post,
          
            media: (post.media_files || []).map((mediaItem: any) => ({
              type: mediaItem.media_type,
              url: mediaItem.file_url,
              thumbnail: mediaItem.thumbnail_url,
              alt: mediaItem.alt_text || ''
            })),

             tags: (post.tags || []).map((tag: any) => 
      typeof tag === 'object' ? tag.name : tag
    )
          };
          
        
          
          return <PostCard key={post.id} post={transformedPost} />;
        })}
      </div>
    </div>
  )}
</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              
                
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ... About section ... */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};