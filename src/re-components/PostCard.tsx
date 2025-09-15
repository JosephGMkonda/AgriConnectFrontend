import type React from "react";
import { useState } from "react";
import {  useAppSelector } from "../store/hook";
import { FaCommentDots, FaQuestion } from "react-icons/fa";
import { AiFillBulb } from "react-icons/ai";
import { IoNewspaperOutline } from "react-icons/io5";
import { GiRootTip } from "react-icons/gi";
import { GrArticle } from "react-icons/gr";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { FaShareFromSquare } from "react-icons/fa6";


interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    username: string;
    avatar_url?: string;
    is_verified?: boolean;
    farm_type?: string;
  };
  created_at: string;
  like_count: number;
  comment_count: number;
  view_count: number;
  post_type?: string;
  tags?: string[];
  image_url?: string;
}


interface PostCardProps {
  post: Post;
  onFollow?: (userId: number) => void;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
}



export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onFollow, 
  onLike, 
  onComment, 
  onShare 
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const currentUser = useAppSelector(state => state.auth.user);

  const isOwnPost = currentUser?.id === post.author.id;
  const shouldTruncate = post.content.length > 150 && !isExpanded;
  const displayContent = shouldTruncate 
    ? post.content.substring(0, 150) + '...' 
    : post.content;

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onFollow?.(post.author.id);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(post.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    
    return date.toLocaleDateString();
  };

  const getPostTypeIcon = (type?: string) => {
    switch (type) {
      case 'question': return <FaQuestion />;
      case 'advice': return <AiFillBulb />;
      case 'news': return <IoNewspaperOutline />;
      case 'tip': return <GiRootTip />;
      default: return <GrArticle />;
    }
  };

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-6 mb-4">
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <img
            src={post.author.avatar_url || '/default-avatar.png'}
            alt={post.author.username}
            className="w-12 h-12 rounded-full object-cover border-2 border-green-100 flex-shrink-0"
          />
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {post.author.username}
              </h3>
              {post.author.is_verified && (
                <span className="text-blue-500" title="Verified Farmer">✅</span>
              )}
            </div>
            
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <span>{formatDate(post.created_at)}</span>
              {post.author.farm_type && (
                <>
                  <span>•</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    {post.author.farm_type}
                  </span>
                </>
              )}
              {post.post_type && (
                <span className="flex items-center space-x-1">
                  <span>{getPostTypeIcon(post.post_type)}</span>
                  <span className="capitalize">{post.post_type}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        
        {!isOwnPost && (
          <button
            onClick={handleFollow}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors flex-shrink-0 ${
              isFollowing
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
          {post.title}
        </h2>
        
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {displayContent}
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-green-600 hover:text-green-700 font-medium ml-1"
            >
              See more
            </button>
          )}
        </p>

        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-gray-500 text-sm">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        
        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-64 object-cover rounded-xl mt-4"
            loading="lazy"
          />
        )}
      </div>

    
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <span>{post.like_count} likes</span>
          <span>{post.comment_count} comments</span>
          <span>{post.view_count} views</span>
        </div>
      </div>

      
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isLiked
              ? 'text-red-600 bg-red-50'
              : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
          }`}
        >
          <span className="text-lg">{isLiked ? <FcLike /> : <FcLikePlaceholder />}</span>
          <span>Like</span>
        </button>

        <button
          onClick={() => onComment?.(post.id)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg"><FaCommentDots /></span>
          <span>Comment</span>
        </button>

        <button
          onClick={() => onShare?.(post.id)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg"><FaShareFromSquare /></span>
          <span>Share</span>
        </button>
      </div>
    </article>
  );
};