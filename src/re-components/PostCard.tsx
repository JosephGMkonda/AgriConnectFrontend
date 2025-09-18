import React from "react";
import { useState,useRef, useEffect, useMemo } from "react";
import {  useAppSelector } from "../store/hook";
import { FaCommentDots, FaLongArrowAltLeft, FaLongArrowAltRight, FaQuestion } from "react-icons/fa";
import { AiFillBulb } from "react-icons/ai";
import { IoNewspaperOutline, IoPlay } from "react-icons/io5";
import { GiRootTip } from "react-icons/gi";
import { GrArticle } from "react-icons/gr";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { FaArrowLeftLong, FaShareFromSquare } from "react-icons/fa6";
import userDefault from '../assets/userDefault.png';
import { IoIosPause } from "react-icons/io";
import { PiFilmSlateDuotone } from "react-icons/pi";
import { CommentsSection } from "./CommentSection";




interface Media {
  type: 'image' | 'video';
  url: string;
  alt?: string
}



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
  media?: Media[];
  video_url?: string;
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const currentUser = useAppSelector(state => state.auth.user);
  const [showComments, setShowComments] = useState(false)





const media = React.useMemo(() => {
  const mediaArray: Media[] = [];

  if(post.image_url){
    mediaArray.push({type: 'image', url: post.image_url})
  }

  if(post.video_url){
    mediaArray.push({type: 'video', url: post.video_url})
  }

  if(post.media && post.media.length > 0){
    mediaArray.push(...post.media)
  }

  return mediaArray
},[post.image_url, post.video_url, post.media])



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

  const handleVideoPlay = () => {
    if(videoRef.current){
      if(isPlaying){
        videoRef.current.pause()
      } else{
        videoRef.current.play()
      }

      setIsPlaying(!isPlaying)
    }
};

const nextImage = () => {
  setCurrentImageIndex(prev => (prev + 1) % media.length)
}

const prevImage = () => {
  setCurrentImageIndex(prev => (prev -1 + media.length) % media.length)
}

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

   const handleCommentClick = () => {
    setShowComments(true);
  };

  

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-6 mb-4">
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <img
            src={post.author.avatar_url || userDefault}
            alt={post.author}
            className="w-12 h-12 rounded-full object-cover border-2 border-green-100 flex-shrink-0"
          />
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {post.author}
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

        

        {/* This section handles media both images and videos */}
        {media.length > 0 && (
          <div className="relative mb-4">
            {media.map((item, index) => (
              <div
                key={index}
                className={`${index === currentImageIndex ? 'block' : 'hidden'}`}
              >
                {item.type === 'image' ? (
                  <div className="relative">
                    <img
                      src={item.url}
                      alt={item.alt || post.title}
                      className="w-full h-auto max-h-96 object-cover rounded-xl"
                      loading="lazy"
                    />
                    
                    
                    {media.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                        <FaLongArrowAltLeft />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <FaLongArrowAltRight />
                        </button>
                        
                        
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {media.length}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      src={item.url}
                      className="w-full h-auto max-h-96 object-cover rounded-xl"
                      controls={false}
                      loop
                      muted
                    />
                    
                    {/* this section handles media such as playing video */}
                    {!isPlaying && (
                      <button
                        onClick={handleVideoPlay}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors rounded-xl"
                      >
                        <div className="bg-white/90 p-4 rounded-full">
                          <span className="text-2xl"><IoPlay /></span>
                        </div>
                      </button>
                    )}
                    
                    {/* Video Controllers here...............*/}
                    {isPlaying && (
                      <button
                        onClick={handleVideoPlay}
                        className="absolute bottom-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                      <IoIosPause />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            
            {media.length > 1 && (
              <div className="flex space-x-2 mt-3 overflow-x-auto">
                {media.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex
                        ? 'border-green-500'
                        : 'border-gray-200'
                    }`}
                  >
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-lg"><PiFilmSlateDuotone /></span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}


       
            {/* tags section here ............... */}
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
        onClick={handleCommentClick}
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


         {/* Comments here  Section */}
  
{showComments && (
  <CommentsSection
    postId={post.id}
    isOpen={showComments}
    onClose={() => setShowComments(false)}
    currentUserId={currentUser?.id}
    post={{
      id: post.id,
      author: post.author,
      content: post.content,
      created_at: post.created_at,
      like_count: post.like_count,
      comment_count: post.comment_count,
      share_count: post.share_count
    }}
  />
)}
    </article>
  );
};