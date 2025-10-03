import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { fetchUser } from '../Slices/AuthSlice';
import { fetchProfile, updateProfile } from '../Slices/ProfileSlice'
import userDefault from '../assets/userDefault.png';

export const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { profile, loading, updating, error } = useAppSelector((state) => state.profile);
  
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null); 
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    bio: '',
    phone_number: '',
    farmType: '',
    avatar_url: '',
    location: ''
  });


  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);



  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
    dispatch(fetchProfile());
  }, [dispatch, user]);

  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        phone_number: profile.phone_number || '',
        farmType: profile.farmType || '',
        avatar_url: profile.avatar_url || '',
        location: profile.location || ''
      });

       if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
      }
    }
  }, [profile]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("bio", formData.bio);
      data.append("phone_number", formData.phone_number);
      data.append("farmType", formData.farmType);
      data.append("location", formData.location);

  
      
    
  
    if (avatarFile && avatarFile instanceof File) {
      data.append("avatar_upload", avatarFile); 
    } else if (avatarFile) {
      console.error('avatarFile is not a File object:', avatarFile);
    }

      await dispatch(updateProfile(data)).unwrap();


    
      
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
      }
      setAvatarFile(null);
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile: ' + (error as string));
    }
  };




 const handleAvatarUpload = (file: File) => {
    
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview); 
    }
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    
    
    setFormData(prev => ({ 
      ...prev, 
      avatar_url: previewUrl 
    }));
    
  
    setAvatarFile(file);
  };

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

   const getAvatarSrc = () => {
    
    if (avatarPreview) {
      return avatarPreview; 
    }
    if (formData.avatar_url) {
      return formData.avatar_url; 
    }
    return userDefault; 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const handleNext = () => {
    navigate('/')

  }


    const handleCancelEdit = () => {
    
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    }
    setAvatarFile(null);
    
    
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        phone_number: profile.phone_number || '',
        farmType: profile.farmType || '',
        avatar_url: profile.avatar_url || '',
        location: profile.location || ''
      });
    }
    
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Farmer Profile</h1>
          <p className="text-green-600">Manage your agricultural profile and connect with fellow farmers</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          <div className="bg-gradient-to-r bg-green-50 p-8 text-green-800">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
              <img
              src={getAvatarSrc()}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600 transition-colors">
                       <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleAvatarUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold">{user?.username}</h2>
                <p className="text-green-800">{user?.email}</p>
                <p className="text-green-800">{profile?.location || 'No location set'}</p>
              </div>
            </div>
          </div>

          
          <div className="p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Farm Type</label>
                    <select
                      name="farmType"
                      value={formData.farmType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select farm type</option>
                      <option value="Crop Farming">Crop Farming</option>
                      <option value="Livestock">Livestock</option>
                      
                      <option value="Poultry">Poultry</option>
                      <option value="Mixed Farming">Mixed Farming</option>
                      <option value="Organic Farming">Organic Farming</option>
                      
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="+255 XXX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your location"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Tell us about your farming experience..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={updating}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                    <button
          type="button"
          onClick={handleCancelEdit}
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Farm Type</h3>
                    <p>{profile?.farmType || 'Not specified'}</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Contact</h3>
                    <p>{profile?.phone_number || 'Not provided'}</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Location</h3>
                    <p>{profile?.location || 'Not specified'}</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Member Since</h3>
                    <p>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>

                {profile?.bio && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">About Me</h3>
                    <p className="text-gray-700">{profile.bio}</p>
                  </div>
                )}
                <div className="flex">

                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Edit Profile
                </button>

                <div className="flex justify-end flex-1">
                <button
                    type="button"
                    onClick={handleNext}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Next
                  </button>
                  </div>

                  </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};