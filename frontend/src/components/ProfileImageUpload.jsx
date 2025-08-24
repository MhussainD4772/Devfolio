import React, { useState, useRef } from 'react';
import imageUploadService from '../services/imageUploadService';

const ProfileImageUpload = ({ 
  currentImageUrl, 
  onImageUpload, 
  onImageRemove, 
  userId,
  className = "" 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    setError('');
    
    // Validate file
    const validation = imageUploadService.validateFile(file);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadImage(file);
  };

  const uploadImage = async (file) => {
    if (!userId) {
      setError('User ID is required for upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress (since Supabase doesn't provide real-time progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const result = await imageUploadService.uploadProfilePicture(file, userId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        onImageUpload(result.url, result.path);
        setError('');
        
        // Reset progress after success
        setTimeout(() => setUploadProgress(0), 1000);
      } else {
        setError(result.error);
        setPreviewUrl(currentImageUrl); // Revert preview
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
      setPreviewUrl(currentImageUrl); // Revert preview
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (currentImageUrl && onImageRemove) {
      onImageRemove();
      setPreviewUrl('');
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer group ${
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Upload Icon */}
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {currentImageUrl ? 'Change Profile Picture' : 'Upload Profile Picture'}
          </h3>
          
          <p className="text-gray-600 mb-4">
            Drag & drop an image here, or click to browse
          </p>
          
          <div className="text-sm text-gray-500 space-y-1">
            <p>Supported formats: JPEG, PNG, WebP</p>
            <p>Max file size: 2MB</p>
            <p>Recommended size: 800x800 pixels</p>
          </div>
        </div>

        {/* Progress Bar */}
        {isUploading && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
        className="hidden"
      />

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Current Image Preview */}
      {previewUrl && (
        <div className="relative group">
          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-white">
            <img
              src={previewUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
            
            {/* Remove Button Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={handleRemoveImage}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200"
                title="Remove image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-600 mt-2">
            {currentImageUrl ? 'Click to change' : 'Preview'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileImageUpload;
