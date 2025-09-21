import React, { useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { createPost } from '../hooks/creatingPost';
import { toast } from 'react-toastify';
import { FaCamera, FaVideo } from 'react-icons/fa';
import { IoPricetagsOutline } from 'react-icons/io5';
import { BsEmojiGrin } from 'react-icons/bs';
import { SupabaseStorageService, type UploadResult } from '../service/SupabaseStorageService';
import { MediaPreview } from '../re-components/MediaPreview';


interface CreatePostProps {
  onClose: () => void;
  onPostCreated?: () => void;
  isOpen: boolean;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onClose, onPostCreated, isOpen }) => {
  const dispatch = useAppDispatch();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [postType, setPostType] = useState('article');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [selectedFiles, isSelectedFiles] = useState<File[]>([]);
  const [upLoadingResults, setIsUpLoadingResults] = useState<UploadResult[]>([]);
  const [isUploading, setIsUpLoading] = useState(false);

  const currentUser = useAppSelector((state: RootState) => state.auth.user);


    const handleFilesSelect = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    isSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    isSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setIsUpLoadingResults(prev => prev.filter((_, i) => i !== index));
  };

 
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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


   



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!title.trim() || !content.trim()) {
    toast.error('Please add a title and content');
    return;
  }

  setIsSubmitting(true);

  try {
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('post_type', postType);
    
    
    selectedTags.forEach(tag => {
      formData.append('tags_ids', tag);
    });

    
    selectedFiles.forEach((file, index) => {
      formData.append('media_uploads', file); 
    });

    
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    
    await dispatch(createPost({
      title,
      content,
      post_type: postType,
      tags: selectedTags,
      mediaFiles: selectedFiles 
    })).unwrap();

    toast.success('Post created successfully!');
    
    setTitle('');
    setContent('');
    isSelectedFiles([]);
    setSelectedTags([]);
    onClose();
    onPostCreated?.();
    
  } catch (error: any) {
    console.error('Create post error:', error);
    toast.error(error.message || 'Failed to create post');
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
          <h2 className="text-lg font-semibold text-gray-800">Create Post</h2>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim() || !title.trim()}
            className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
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

            {/* Media Preview */}
           {selectedFiles.length > 0 && (
              <MediaPreview
                files={selectedFiles}
                uploadResults={upLoadingResults}
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
                </span>
              ))}
            </div>
          </form>
        </div>

        {/* The footer page where theys image upload and video */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center space-x-4">
              {/* Image Upload */}
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

            

              {/* Emoji Picker */}
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

              {/* Tag Selector */}
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
