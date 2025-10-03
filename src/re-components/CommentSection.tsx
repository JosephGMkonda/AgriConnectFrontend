import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { fetchComments, createComment, deleteComment } from '../Slices/commentSlice';
import { formatDistanceToNow } from 'date-fns';
import { FaSmile, FaPaperPlane} from 'react-icons/fa';
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import { IoExpand, IoPlay, IoVolumeHigh, IoVolumeMute } from 'react-icons/io5';
import { IoIosPause } from 'react-icons/io';

interface Comment {
  id: number;
  author_name: string;
  content: string;
  created_at: string;
  like_count: number;
  is_liked: boolean;
}

interface CommentsSectionProps {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
  post: {
    id: number;
    author: {
      id?: number;
      username?: string;
      email?: string;
      avatar_url?: string;
    };
    title?: string;
    content: string;
    created_at: string;
    like_count: number;
    comment_count: number;
    share_count: number;
    media?: Array<{  
      type: "image" | "video";
      url: string;
      thumbnail?: string;
      alt?: string;
    }>;
  };
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  postId,
  isOpen,
  onClose,
  currentUserId,
  post
}) => {
  const dispatch = useAppDispatch();
  const { comments, loading, error } = useAppSelector((state) => state.comments);
  const [newComment, setNewComment] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [videoStates, setVideoStates] = useState<{[key: number]: {
    isPlaying: boolean;
    isMuted: boolean;
    currentTime: number;
    duration: number;
    volume: number;
  }}>({});

  const videoRefs = useRef<{[key: number]: HTMLVideoElement | null}>({});
  

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchComments(postId));
      setCurrentMediaIndex(0);
      
      
      if (post.media) {
        const initialVideoStates: {[key: number]: any} = {};
        post.media.forEach((media, index) => {
          if (media.type === 'video') {
            initialVideoStates[index] = {
              isPlaying: false,
              isMuted: true,
              currentTime: 0,
              duration: 0,
              volume: 0.7,
            };
          }
        });
        setVideoStates(initialVideoStates);
      }
    }
  }, [dispatch, postId, isOpen, post.media]);



  useEffect(() => {
    if (isOpen) {
      dispatch(fetchComments(postId));
    }
  }, [dispatch, postId, isOpen]);

  const handleCreateComment = async (content: string) => {
    try {
      await dispatch(createComment({ postId, content })).unwrap();
      setNewComment('');
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

   useEffect(() => {
    if (isOpen) {
      dispatch(fetchComments(postId));
      setCurrentMediaIndex(0); 
    }
  }, [dispatch, postId, isOpen]);

    
  const nextMedia = () => {
    if (post.media && post.media.length > 0) {
  
      const currentVideoState = videoStates[currentMediaIndex];
      if (currentVideoState?.isPlaying && videoRefs.current[currentMediaIndex]) {
        videoRefs.current[currentMediaIndex]?.pause();
      }
      
      setCurrentMediaIndex((prevIndex) => 
        prevIndex === post.media!.length - 1 ? 0 : prevIndex + 1
      );
    }
  };
  const prevMedia = () => {
    if (post.media && post.media.length > 0) {
      
      const currentVideoState = videoStates[currentMediaIndex];
      if (currentVideoState?.isPlaying && videoRefs.current[currentMediaIndex]) {
        videoRefs.current[currentMediaIndex]?.pause();
      }
      
      setCurrentMediaIndex((prevIndex) => 
        prevIndex === 0 ? post.media!.length - 1 : prevIndex - 1
      );
    }
  };

   const togglePlay = (mediaIndex: number) => {
    const video = videoRefs.current[mediaIndex];
    if (!video) return;

    if (videoStates[mediaIndex]?.isPlaying) {
      video.pause();
    } else {
      video.play();
    }

    setVideoStates(prev => ({
      ...prev,
      [mediaIndex]: {
        ...prev[mediaIndex],
        isPlaying: !prev[mediaIndex]?.isPlaying
      }
    }));
  };

  const toggleMute = (mediaIndex: number) => {
    const video = videoRefs.current[mediaIndex];
    if (!video) return;

    video.muted = !video.muted;
    
    setVideoStates(prev => ({
      ...prev,
      [mediaIndex]: {
        ...prev[mediaIndex],
        isMuted: !prev[mediaIndex]?.isMuted
      }
    }));
  };

  const handleVolumeChange = (mediaIndex: number, newVolume: number) => {
    const video = videoRefs.current[mediaIndex];
    if (!video) return;

    video.volume = newVolume;
    
    setVideoStates(prev => ({
      ...prev,
      [mediaIndex]: {
        ...prev[mediaIndex],
        volume: newVolume,
        isMuted: newVolume === 0 ? true : prev[mediaIndex]?.isMuted
      }
    }));
  };

  const handleTimeUpdate = (mediaIndex: number) => {
    const video = videoRefs.current[mediaIndex];
    if (!video) return;

    setVideoStates(prev => ({
      ...prev,
      [mediaIndex]: {
        ...prev[mediaIndex],
        currentTime: video.currentTime
      }
    }));
  };

  const handleLoadedMetadata = (mediaIndex: number) => {
    const video = videoRefs.current[mediaIndex];
    if (!video) return;

    setVideoStates(prev => ({
      ...prev,
      [mediaIndex]: {
        ...prev[mediaIndex],
        duration: video.duration
      }
    }));
  };

  const handleProgressClick = (mediaIndex: number, e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRefs.current[mediaIndex];
    const progressBar = e.currentTarget;
    
    if (!video) return;

    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.offsetWidth;
    const newTime = (clickPosition / progressBarWidth) * video.duration;
    
    video.currentTime = newTime;
    
    setVideoStates(prev => ({
      ...prev,
      [mediaIndex]: {
        ...prev[mediaIndex],
        currentTime: newTime
      }
    }));
  };

  const toggleFullscreen = (mediaIndex: number) => {
    const video = videoRefs.current[mediaIndex];
    if (!video) return;

    if (!document.fullscreenElement) {
      video.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };


  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await dispatch(deleteComment(commentId)).unwrap();
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  const handleEmojiClick = (emojiData: any) => {
    const emoji = emojiData.emoji;
    setNewComment(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCreateComment(newComment);
    }
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      handleCreateComment(newComment.trim());
    }
  };

  if (!isOpen) return null;

  return (

        <div className="fixed inset-0 z-50 bg-white/30 backdrop-blur-lg border border-white/10 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        
        
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Comments</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        
        <div className="flex-1 overflow-y-auto">
          
          
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-start space-x-3 mb-3">
          
              {post.author?.avatar_url ? (
                <img
                  src={post.author.avatar_url}
                  alt={post.author.username || 'User avatar'}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">
                    {post.author?.username?.charAt(0)?.toUpperCase() || 
                     post.author?.email?.charAt(0)?.toUpperCase() || 
                     'U'}
                  </span>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">
                    {post.author?.username || post.author?.email || 'Unknown User'}
                  </h3>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-500 text-sm">
                    {formatDistanceToNow(new Date(post.created_at))} ago
                  </span>
                </div>
                
                
                {post.title && (
                  <h4 className="font-bold text-gray-900 mt-1 text-lg">{post.title}</h4>
                )}
                
                
                <p className="text-gray-800 mt-1 whitespace-pre-line">{post.content}</p>
                
                
                               {post.media && post.media.length > 0 && (
                  <div className="mt-3 relative">
                    {/* Media Container */}
                    <div className="relative rounded-xl overflow-hidden bg-gray-100">
                      {post.media.map((mediaItem, index) => (
                        <div
                          key={index}
                          className={`transition-opacity duration-300 ${
                            index === currentMediaIndex ? 'block' : 'hidden'
                          }`}
                        >
                          {mediaItem.type === "image" ? (
                            <img
                              src={mediaItem.url}
                              alt={mediaItem.alt || "Post image"}
                              className="w-full h-auto max-h-80 object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="relative group">
                            
                              <video
                                ref={el => videoRefs.current[index] = el}
                                src={mediaItem.url}
                                className="w-full h-auto max-h-80 object-cover rounded-xl"
                                controls={false}
                                loop
                                muted={videoStates[index]?.isMuted ?? true}
                                onTimeUpdate={() => handleTimeUpdate(index)}
                                onLoadedMetadata={() => handleLoadedMetadata(index)}
                                onPlay={() => setVideoStates(prev => ({
                                  ...prev,
                                  [index]: {...prev[index], isPlaying: true}
                                }))}
                                onPause={() => setVideoStates(prev => ({
                                  ...prev,
                                  [index]: {...prev[index], isPlaying: false}
                                }))}
                              />
                              
                            
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                
                        
                                <div 
                                  className="w-full bg-gray-600 h-1 rounded-full mb-2 cursor-pointer"
                                  onClick={(e) => handleProgressClick(index, e)}
                                >
                                  <div 
                                    className="bg-blue-500 h-1 rounded-full transition-all duration-100"
                                    style={{ 
                                      width: `${((videoStates[index]?.currentTime || 0) / (videoStates[index]?.duration || 1)) * 100}%` 
                                    }}
                                  />
                                </div>
                                
                              
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    
                                    <button
                                      onClick={() => togglePlay(index)}
                                      className="text-white hover:text-gray-300 transition-colors"
                                    >
                                      {videoStates[index]?.isPlaying ? 
                                        <IoIosPause size={20} /> : 
                                        <IoPlay size={20} />
                                      }
                                    </button>
                                    
                                    
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => toggleMute(index)}
                                        className="text-white hover:text-gray-300 transition-colors"
                                      >
                                        {videoStates[index]?.isMuted || videoStates[index]?.volume === 0 ? 
                                          <IoVolumeMute size={18} /> : 
                                          videoStates[index]?.volume < 0.5 ? 
                                          <IoVolumeMute size={18} /> : 
                                          <IoVolumeHigh size={18} />
                                        }
                                      </button>
                                      <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={videoStates[index]?.volume || 0.7}
                                        onChange={(e) => handleVolumeChange(index, parseFloat(e.target.value))}
                                        className="w-12 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                      />
                                    </div>
                                    
                                    
                                    <span className="text-white text-sm font-medium">
                                      {formatTime(videoStates[index]?.currentTime || 0)} / {formatTime(videoStates[index]?.duration || 0)}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3">
                                  
                                    <button
                                      onClick={() => toggleFullscreen(index)}
                                      className="text-white hover:text-gray-300 transition-colors"
                                    >
                                      <IoExpand size={18} />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              
                              {!videoStates[index]?.isPlaying && (
                                <button
                                  onClick={() => togglePlay(index)}
                                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors rounded-xl group-hover:opacity-0 z-10"
                                >
                                  <div className="bg-white/90 p-3 rounded-full">
                                    <IoPlay className="text-xl" />
                                  </div>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      
                      {post.media.length > 1 && (
                        <>
                          <button
                            onClick={prevMedia}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-30"
                          >
                            <FaLongArrowAltLeft />
                          </button>
                          <button
                            onClick={nextMedia}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-30"
                          >
                            <FaLongArrowAltRight />
                          </button>
                        </>
                      )}
                      
                      
                      {post.media.length > 1 && (
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-30">
                          {currentMediaIndex + 1} / {post.media.length}
                        </div>
                      )}
                    </div>
                    
                    
                    {post.media.length > 1 && (
                      <div className="flex justify-center space-x-2 mt-3">
                        {post.media.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentMediaIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentMediaIndex 
                                ? 'bg-blue-500' 
                                : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          
            <div className="flex items-center justify-between text-gray-500 text-sm mt-3">
              <span>{post.like_count} likes</span>
              <span>{post.comment_count} comments</span>
              <span>{post.share_count} shares</span>
            </div>
          </div>

          
          <div className="p-4">
            <h3 className="font-semibold text-gray-700 mb-4">Comments</h3>
            
            {loading && <p className="text-gray-500">Loading comments...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            
            {comments.length === 0 && !loading ? (
              <div className="text-center py-8 text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-semibold">
                        {comment.author?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-100 rounded-2xl p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-sm text-gray-900">
                            {comment.author}
                          </h4>
                          <span className="text-gray-500 text-xs">
                            {formatDistanceToNow(new Date(comment.created_at))} ago
                          </span>
                        </div>
                        <p className="text-gray-800 text-sm">{comment.content}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1 ml-2">
                        <button className="text-xs text-gray-500 hover:text-blue-600">
                          Like
                        </button>
                        <button className="text-xs text-gray-500 hover:text-gray-700">
                          Reply
                        </button>
                        <span className="text-xs text-gray-500">
                          {comment.like_count} like{comment.like_count !== 1 ? 's' : ''}
                        </span>
                        
                       {comment.userId === currentUser?.id && (
  <button
    onClick={() => handleDeleteComment(comment.id)}
    className="text-xs text-red-500 hover:text-red-700 ml-auto"
  >
    Delete
  </button>
)}

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comment Input Section */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 relative">
          <div className="flex items-end space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">
                {/* {currentUserId?.charAt(0)?.toUpperCase() || 'U'} */}
              </span>
            </div>
            
            <div className="flex-1 bg-white border border-gray-300 rounded-3xl flex items-center">
              <textarea
                ref={textareaRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 bg-transparent border-none outline-none resize-none text-sm rounded-3xl"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
              
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-gray-400 hover:text-yellow-500"
              >
                <FaSmile size={18} />
              </button>
            </div>
            
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="p-2 text-blue-500 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              <FaPaperPlane size={18} />
            </button>
          </div>

          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2 z-10">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xl">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width={300}
                  height={350}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  
  );
};