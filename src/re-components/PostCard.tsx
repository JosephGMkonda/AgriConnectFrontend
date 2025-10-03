import React, { useEffect,useState, useRef, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  FaCommentDots,
  FaLongArrowAltLeft,
  FaLongArrowAltRight,
  FaQuestion,
} from "react-icons/fa";
import { AiFillBulb } from "react-icons/ai";
import { IoNewspaperOutline, IoPlay } from "react-icons/io5";
import { GiRootTip } from "react-icons/gi";
import { GrArticle } from "react-icons/gr";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FaShareFromSquare } from "react-icons/fa6";
import { IoIosPause } from "react-icons/io";
import { IoVolumeMute, IoVolumeLow, IoVolumeHigh, IoExpand } from "react-icons/io5";

import { CommentsSection } from "./CommentSection";
import { fetchFollowing, followUser, unfollowUser } from "../Slices/followSlice";
import { toggleLike } from "../Slices/LikeSlice";
import { EditPost } from "../components/EditPost";
import { deletePost } from "../Slices/creatingPost";
import { toast } from "react-toastify";

interface Media {
  type: "image" | "video";
  url: string;
  alt?: string;
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
  share_count?: number;
  post_type?: string;
  tags?: string[];
  media?: Media[];
  video_url?: string;
  image_url?: string;
  is_liked?: boolean;
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
  onShare,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.auth.user);
  const { following } = useAppSelector((state) => state.follow);
  const [isDeleting, setIsDeleting] = useState(false);
  const likeEntry = useAppSelector(
    (state) => state.likes.likes?.[post.id] || null
  );

  
  const authorUsername = post.author?.username || "Unknown User";
  const authorAvatar = post.author?.avatar_url || '/default-avatar.png'

  const isOwnPost = currentUser?.id === post.author?.id;

  

  

  const isLiked = likeEntry?.is_liked ?? post.is_liked ?? false;
  const likeCount = likeEntry?.like_count ?? post.like_count ?? 0;

    const media = useMemo(() => {
    const mediaArray: Media[] = [];
    if (post.image_url) mediaArray.push({ type: "image", url: post.image_url });
    if (post.video_url) mediaArray.push({ type: "video", url: post.video_url });
    if (post.media && post.media.length > 0) mediaArray.push(...post.media);
    return mediaArray;
  }, [post.image_url, post.video_url, post.media]);

  
  const videoRefs = useRef<React.RefObject<HTMLVideoElement>[]>([]);
  const [videoStates, setVideoStates] = useState<Array<{
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    isMuted: boolean;
    volume: number;
  }>>([]);





  useEffect(() => {
    if (media.length > 0) {
      
      videoRefs.current = media.map((_, i) => videoRefs.current[i] || React.createRef<HTMLVideoElement>());
      
    
      setVideoStates(prevStates => {
        if (prevStates.length === media.length) return prevStates;
        
        return media.map((_, index) => 
          prevStates[index] || {
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            isMuted: true,
            volume: 0.7,
          }
        );
      });
    }
  }, [media]);



  const handlePlay = (index: number) => {
    setVideoStates(prevStates => 
      prevStates.map((state, i) => 
        i === index ? { ...state, isPlaying: true } : state
      )
    );
  };
 const handlePause = (index: number) => {
    setVideoStates(prevStates => 
      prevStates.map((state, i) => 
        i === index ? { ...state, isPlaying: false } : state
      )
    );
  };

    useEffect(() => {
  
    videoRefs.current.forEach((ref, index) => {
      if (ref.current && index !== currentImageIndex) {
        ref.current.pause();
      }
    });

  
    setVideoStates(prevStates => 
      prevStates.map((state, index) => ({
        ...state,
        isPlaying: index === currentImageIndex ? state.isPlaying : false,
      }))
    );
  }, [currentImageIndex]);


    const togglePlay = (index: number) => {
    const video = videoRefs.current[index]?.current;
    if (video) {
      if (videoStates[index]?.isPlaying) {
        video.pause();
      } else {
        
        videoRefs.current.forEach((ref, i) => {
          if (i !== index && ref.current) {
            ref.current.pause();
          }
        });
        
        video.play();
      }
      
      setVideoStates(prevStates => 
        prevStates.map((state, i) => ({
          ...state,
          isPlaying: i === index ? !state.isPlaying : false,
        }))
      );
    }
  };

  const toggleMute = (index: number) => {
    const video = videoRefs.current[index]?.current;
    if (video) {
      const newMutedState = !videoStates[index]?.isMuted;
      video.muted = newMutedState;
      
      setVideoStates(prevStates => 
        prevStates.map((state, i) => 
          i === index ? { ...state, isMuted: newMutedState } : state
        )
      );
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRefs.current[index]?.current;
    
    if (video) {
      video.volume = newVolume;
      
      setVideoStates(prevStates => 
        prevStates.map((state, i) => 
          i === index ? { 
            ...state, 
            volume: newVolume,
            isMuted: newVolume === 0 ? true : state.isMuted
          } : state
        )
      );
    }
  };

  const handleTimeUpdate = (index: number) => {
    const video = videoRefs.current[index]?.current;
    if (video) {
      setVideoStates(prevStates => 
        prevStates.map((state, i) => 
          i === index ? { ...state, currentTime: video.currentTime } : state
        )
      );
    }
  };

  const handleLoadedMetadata = (index: number) => {
    const video = videoRefs.current[index]?.current;
    if (video) {
      setVideoStates(prevStates => 
        prevStates.map((state, i) => 
          i === index ? { ...state, duration: video.duration } : state
        )
      );
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const video = videoRefs.current[index]?.current;
    const progressBar = e.currentTarget;
    
    if (video) {
      const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
      const progressBarWidth = progressBar.offsetWidth;
      const newTime = (clickPosition / progressBarWidth) * video.duration;
      
      video.currentTime = newTime;
      
      setVideoStates(prevStates => 
        prevStates.map((state, i) => 
          i === index ? { ...state, currentTime: newTime } : state
        )
      );
    }
  };

  const toggleFullscreen = (index: number) => {
    const video = videoRefs.current[index]?.current;
    if (video) {
      if (!document.fullscreenElement) {
        video.requestFullscreen().catch(err => {
          console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };






  // ---- Follow ----
 const handleFollow = async () => {
    if (!post.author?.id || !currentUser) return;


    
    setIsLocalLoading(true);
    try {
      if (isFollowing) {
        await dispatch(unfollowUser(post.author.id)).unwrap();
      } else {
        await dispatch(followUser(post.author.id)).unwrap();
      }
    } catch (error) {
      console.error("Follow/unfollow failed:", error);
    } finally {
      setIsLocalLoading(false);
    }
  };

  // ---- Like ----
  const handleLike = () => {
    dispatch(toggleLike(post.id));
    onLike?.(post.id);
  };

  

  

  const nextImage = () => {
  
  if (videoRef.current && isPlaying) {
    videoRef.current.pause();
    setIsPlaying(false);
  }
  
  setCurrentImageIndex((prevIndex) => 
    prevIndex === media.length - 1 ? 0 : prevIndex + 1
  );
};

  const prevImage = () => {

  if (videoRef.current && isPlaying) {
    videoRef.current.pause();
    setIsPlaying(false);
  }
  
  setCurrentImageIndex((prevIndex) => 
    prevIndex === 0 ? media.length - 1 : prevIndex - 1
  );
};



  // ---- Format ----
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  }

  
  return date.toLocaleDateString();
};


  const getPostTypeIcon = (type?: string) => {
    switch (type) {
      case "question":
        return <FaQuestion />;
      case "advice":
        return <AiFillBulb />;
      case "news":
        return <IoNewspaperOutline />;
      case "tip":
        return <GiRootTip />;
      default:
        return <GrArticle />;
    }
  };

  const shouldTruncate = post.content.length > 150 && !isExpanded;
  const displayContent = shouldTruncate
    ? post.content.substring(0, 150) + "..."
    : post.content;


  // Follow and Following 

  useEffect(() => {
    if(currentUser){
      dispatch(fetchFollowing())
    }
  },[currentUser, dispatch])

  const followEntry = useMemo(() => {
    return following.find((f) => f.userId === post.author?.id);
  }, [following, post.author?.id])
  const isFollowing = !!followEntry;
  const shouldShowFollowButton = currentUser && !isOwnPost;

const handleEdit = () => {
  setShowEditModal(true);
};

const handleDelete = async () => {
  setShowDeleteConfirm(true);
};

const confirmDelete = async () => {
  setIsDeleting(true);
  try {
    await dispatch(deletePost(post.id)).unwrap();
    toast.success('Post deleted successfully!');
    setShowDeleteConfirm(false);
  } catch (error: any) {
    console.error(' Delete post failed:', error);
    toast.error(error?.message || 'Failed to delete post');
  } finally {
    setIsDeleting(false);
  }
};

const shouldShowEditButton = isOwnPost;

  return (
    <>
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-6 mb-4">
      {/* ---- Header ---- */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <img
            src={authorAvatar}
            alt={authorUsername}
            className="w-12 h-12 rounded-full object-cover border-2 border-green-100 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {authorUsername}
            </h3>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <span>{formatDate(post.created_at)}</span>
              {post.post_type && (
                <span className="flex items-center space-x-1">
                  <span>{getPostTypeIcon(post.post_type)}</span>
                  <span className="capitalize">{post.post_type}</span>
                </span>
              )}
            </div>
          </div>
        </div>


{shouldShowEditButton && (
  <div className="flex items-center space-x-1">
    <button
      onClick={handleEdit}
      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      title="Edit post"
    >
      <FaEdit className="text-sm" />
    </button>
    
    <button
  onClick={handleDelete}
  disabled={isDeleting}
  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
  title="Delete post"
>
  {isDeleting ? '...' : <FaTrash className="text-sm" />}
</button>
  </div>
)}

             {shouldShowFollowButton && (
          <button
            onClick={handleFollow}
            disabled={isLocalLoading}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors flex-shrink-0 min-w-[100px] ${
              isFollowing
                ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                : "bg-green-600 text-white hover:bg-green-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLocalLoading
              ? "..."
              : isFollowing
              ? "Following"
              : "Follow"}
          </button>
        )}
        
        
        {!currentUser && (
          <button
            onClick={() => {}}
            className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Login to Follow
          </button>
        )}
      </div>

      {/* ---- Content ---- */}
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

    
     

{media.length > 0 && (
        <div className="relative mb-4">
          {/* Navigation Arrows - Show for ALL media types when multiple items exist */}
          {media.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-30"
              >
                <FaLongArrowAltLeft />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-30"
              >
                <FaLongArrowAltRight />
              </button>
            </>
          )}

          {/* Media Counter - Show for ALL media types */}
          {media.length > 1 && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-30">
              {currentImageIndex + 1} / {media.length}
            </div>
          )}

          {/* Media Items */}
          {media.map((item, index) => (
            <div
              key={index}
              className={`${index === currentImageIndex ? "block" : "hidden"}`}
            >
              {item.type === "image" ? (
                <div className="relative">
                  <img
                    src={item.url}
                    alt={item.alt || post.title}
                    className="w-full h-auto max-h-96 object-cover rounded-xl"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="relative group">
                  {/* Video Player with individual ref */}
                  <video
                    ref={videoRefs.current[index]}
                    src={item.url}
                    className="w-full h-auto max-h-96 object-cover rounded-xl"
                    controls={false}
                    loop
                    muted={videoStates[index]?.isMuted ?? true}
                    onTimeUpdate={() => handleTimeUpdate(index)}
                    onLoadedMetadata={() => handleLoadedMetadata(index)}
                    onPlay={() => handlePlay(index)}
                    onPause={() => handlePause(index)}
                  />
                  
                  {/* Custom Video Controls for this specific video */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    
                    {/* Progress Bar */}
                    <div 
                      className="w-full bg-gray-600 h-1 rounded-full mb-3 cursor-pointer"
                      onClick={(e) => handleProgressClick(e, index)}
                    >
                      <div 
                        className="bg-blue-500 h-1 rounded-full transition-all duration-100"
                        style={{ width: `${((videoStates[index]?.currentTime || 0) / (videoStates[index]?.duration || 1)) * 100}%` }}
                      />
                    </div>
                    
                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {/* Play/Pause Button */}
                        <button
                          onClick={() => togglePlay(index)}
                          className="text-white hover:text-gray-300 transition-colors"
                        >
                          {videoStates[index]?.isPlaying ? <IoIosPause size={24} /> : <IoPlay size={24} />}
                        </button>
                        
                        {/* Volume Control */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleMute(index)}
                            className="text-white hover:text-gray-300 transition-colors"
                          >
                            {videoStates[index]?.isMuted || videoStates[index]?.volume === 0 ? <IoVolumeMute size={20} /> : 
                            videoStates[index]?.volume < 0.5 ? <IoVolumeLow size={20} /> : <IoVolumeHigh size={20} />}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={videoStates[index]?.volume || 0.7}
                            onChange={(e) => handleVolumeChange(e, index)}
                            className="w-16 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
                          />
                        </div>
                        
                        {/* Time Display */}
                        <span className="text-white text-sm font-medium">
                          {formatTime(videoStates[index]?.currentTime || 0)} / {formatTime(videoStates[index]?.duration || 0)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {/* Fullscreen Button */}
                        <button
                          onClick={() => toggleFullscreen(index)}
                          className="text-white hover:text-gray-300 transition-colors"
                        >
                          <IoExpand size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Play Button Overlay (when paused) */}
                  {!videoStates[index]?.isPlaying && (
                    <button
                      onClick={() => togglePlay(index)}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors rounded-xl group-hover:opacity-0 z-10"
                    >
                      <div className="bg-white/90 p-4 rounded-full">
                        <IoPlay className="text-2xl" />
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </div>

         {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                 #{typeof tag === 'object' ? tag.name : tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-gray-500 text-sm">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

      {/* ---- Stats ---- */}
      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
        <span>
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </span>
        <span>{post.comment_count} comments</span>
        {post.share_count !== undefined && (
          <span>{post.share_count} shares</span>
        )}
      </div>

      {/* ---- Actions ---- */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isLiked
              ? "text-red-600 bg-red-50"
              : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
          }`}
        >
          {isLiked ? <FcLike /> : <FcLikePlaceholder />}
          <span>Like</span>
        </button>

        <button
          onClick={() => setShowComments(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
        >
          <FaCommentDots />
          <span>Comment</span>
        </button>

        <button
          onClick={() => onShare?.(post.id)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-gray-50 transition-colors"
        >
          <FaShareFromSquare />
          <span>Share</span>
        </button>
      </div>

      {/* ---- Comments ---- */}
      {showComments && (
        <CommentsSection
          postId={post.id}
          isOpen={showComments}
          onClose={() => setShowComments(false)}
          currentUserId={currentUser?.id}
          post={post}
        />
      )}
    </article>

     <EditPost
      isOpen={showEditModal}
      onClose={() => setShowEditModal(false)}
      onPostUpdated={() => {
    
        
      }}
      post={post}
    />


    {showDeleteConfirm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl p-6 max-w-sm mx-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Post?</h3>
      <p className="text-gray-600 mb-4">
        Are you sure you want to delete this post? This action cannot be undone.
      </p>
      <div className="flex space-x-3">
        <button
          onClick={() => setShowDeleteConfirm(false)}
          className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          onClick={confirmDelete}
          disabled={isDeleting}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
};
