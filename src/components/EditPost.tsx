import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { updatePost } from '../Slices/creatingPost'
import { toast } from 'react-toastify';
import { FaCamera, FaVideo } from 'react-icons/fa';
import { IoPricetagsOutline } from 'react-icons/io5';
import { BsEmojiGrin } from 'react-icons/bs';
import { MediaPreview } from '../re-components/MediaPreview';

interface EditPostProps {
  onClose: () => void;
  onPostUpdated?: () => void;
  isOpen: boolean;
  post: Post; 
}

export const EditPost: React.FC<EditPostProps> = ({ onClose, onPostUpdated, isOpen, post }) => {
  const dispatch = useAppDispatch();
  const [content, setContent] = useState(post.content);
  const [title, setTitle] = useState(post.title);
  const [postType, setPostType] = useState(post.post_type);
  const [selectedTags, setSelectedTags] = useState<string[]>(post.tags || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [existingMedia, setExistingMedia] = useState<Media[]>(post.media || []);


  const currentUser = useAppSelector((state: RootState) => state.auth.user);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  
  const [mediaToRemove, setMediaToRemove] = useState<number[]>([]);

  // Initialize form with post data
  useEffect(() => {
    if (post) {
      setContent(post.content);
      setTitle(post.title);
      setPostType(post.post_type);
      setSelectedTags(post.tags || []);
      setExistingMedia(post.media || []);
    }
  }, [post]);

  if (!isOpen) return null;

  const postTypes = [
    { value: 'article', label: 'Article', icon: '📝' },
    { value: 'question', label: 'Question', icon: '❓' },
    { value: 'advice', label: 'Advice', icon: '💡' },
    { value: 'news', label: 'News', icon: '📰' },
    { value: 'tip', label: 'Farming Tip', icon: '🌱' }
  ];

  const popularTags = [
    'Organic Farming', 'Crop Rotation', 'Livestock', 'Poultry', 
    'Irrigation', 'Harvest', 'Sustainable', 'Compost', 'Greenhouse'
  ];

  const handleFilesSelect = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setUploadResults(prev => prev.filter((_, i) => i !== index));
  };

 const handleRemoveExistingMedia = (index: number) => {
  const media = existingMedia[index];
  
  
  if (media && media.id) {
    setExistingMedia(prev => prev.filter((_, i) => i !== index));
    setMediaToRemove(prev => [...prev, media.id]); 
  } else {
    console.warn('Media object missing ID:', media);

    setExistingMedia(prev => prev.filter((_, i) => i !== index));
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!title.trim() || !content.trim()) {
    toast.error('Please add a title and content');
    return;
  }

  setIsSubmitting(true);

  try {
    
    const allMediaFiles = [...selectedFiles];
    
    const updatePayload = {
      postId: post.id,
      title,
      content,
      post_type: postType,
      tags: selectedTags,
      mediaFiles: allMediaFiles, 
    };

    console.log('🔄 Simple Update - Replacing all media with:', {
      newFiles: selectedFiles.length,
      totalFiles: allMediaFiles.length
    });

    await dispatch(updatePost(updatePayload)).unwrap();

    toast.success('Post updated successfully!');
    onClose();
    onPostUpdated?.();
  } catch (error: any) {
    console.error('❌ Update post error:', error);
    toast.error(error?.message || 'Failed to update post');
  } finally {
    setIsSubmitting(false);
  }
};

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    const textarea = textareaRef.current;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + emoji + content.substring(end);
      
      setContent(newContent);
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    } else {
      setContent(prev => prev + emoji);
    }
    
    setShowEmojiPicker(false);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/5 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative z-10 bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden text-gray-900">
        
        
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <span className="text-xl text-gray-600">×</span>
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Edit Post</h2>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim() || !title.trim()}
            className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </div>

        
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Type
              </label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {postTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full px-4 py-3 text-xl font-normal border-0 focus:ring-0 focus:outline-none"
                required
              />
            </div>

        
            <div>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What's happening?"
                className="w-full px-4 py-2 border-0 focus:ring-0 focus:outline-none resize-none min-h-[120px] text-gray-800"
                required
              />
            </div>

            {/* Existing Media Preview */}
            {existingMedia.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Existing Media</h4>
                <div className="grid grid-cols-2 gap-2">
                  {existingMedia.map((media, index) => (
                    <div key={index} className="relative group">
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt={media.alt || 'Post media'}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <video
                          src={media.url}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingMedia(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Media Preview */}
            {selectedFiles.length > 0 && (
              <MediaPreview
                files={selectedFiles}
                uploadResults={uploadResults}
                onRemove={handleRemoveFile}
                isUploading={isUploading}
              />
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 py-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </form>
        </div>

      
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center space-x-4">
              
              <button
                type="button"
                className="text-blue-500 hover:text-blue-700 transition-colors"
                onClick={() => document.getElementById("mediaInput")?.click()}
              >
                <FaCamera /> / <FaVideo />
              </button>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                style={{ display: 'none' }}
                id="mediaInput"
                onChange={(e) => handleFilesSelect(e.target.files)}
              />

        
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <BsEmojiGrin />
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-full left-0 mb-2 z-10">
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

          
              <div className="relative group">
                <button
                  type="button"
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <IoPricetagsOutline />
                </button>
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-white rounded-lg shadow-lg p-3 w-48 z-10">
                  <div className="text-sm font-medium text-gray-700 mb-2">Add tags</div>
                  <div className="space-y-1">
                    {popularTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`block w-full text-left px-2 py-1 rounded text-sm ${
                          selectedTags.includes(tag)
                            ? 'bg-blue-100 text-blue-800'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};