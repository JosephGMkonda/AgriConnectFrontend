import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { fetchComments, createComment, deleteComment } from '../hooks/commentSlice';
import { formatDistanceToNow } from 'date-fns';
import { FaEllipsisH, FaSmile, FaPaperPlane, FaHeart, FaRegHeart, FaReply } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';

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
    author: string;
    content: string;
    created_at: string;
    like_count: number;
    comment_count: number;
    share_count: number;
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        
        <div className="flex items-center justify-between p-4 border-b border-gray-200 ">
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
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">
                  {post.author?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">{post.author}</h3>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-500 text-sm">
                    {formatDistanceToNow(new Date(post.created_at))} ago
                  </span>
                </div>
                <p className="text-gray-800 mt-1 whitespace-pre-line">{post.content}</p>
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
                        {comment.author_name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-100 rounded-2xl p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-sm text-gray-900">
                            {comment.author_name}
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
                        
                        {currentUserId && (
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

        {/* Comment Input  sectiooonnn nn*/}
        <div className="p-4 border-t border-gray-200 bg-gray-50 relative">
          <div className="flex items-end space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">
                {currentUserId?.charAt(0)?.toUpperCase() || 'U'}
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