import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, Video, File, Camera } from 'lucide-react';
import mediaService from '../../services/mediaService';

const FileUpload = ({
  onFileUpload,
  onFileRemove,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxFiles = 1,
  maxSizeInMB = 5,
  allowVideo = false,
  uploadType = 'general', // 'profile', 'verification', 'portfolio', 'job', 'document'
  existingFiles = [],
  className = '',
  disabled = false,
  showPreview = true,
  uploadText = 'Click to upload or drag and drop'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFiles = useCallback(async (files) => {
    if (disabled || uploading) return;

    const validFiles = [];
    const errors = [];

    // Validate files
    Array.from(files).forEach((file) => {
      try {
        const options = {
          allowedTypes: allowVideo ? [...acceptedTypes, 'video/mp4', 'video/mov', 'video/avi'] : acceptedTypes,
          maxSizeInMB: allowVideo && file.type.startsWith('video/') ? 50 : maxSizeInMB,
          isVideo: file.type.startsWith('video/')
        };
        
        mediaService.validateFile(file, options);
        validFiles.push(file);
      } catch (error) {
        errors.push(`${file.name}: ${error.message}`);
      }
    });

    if (errors.length > 0) {
      alert(`Upload errors:\n${errors.join('\n')}`);
    }

    if (validFiles.length === 0) return;

    // Check max files limit
    if (existingFiles.length + validFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Generate previews
    if (showPreview) {
      const previews = validFiles.map(file => ({
        file,
        url: mediaService.getFilePreview(file),
        type: file.type.startsWith('video/') ? 'video' : 'image'
      }));
      setPreviewUrls(prev => [...prev, ...previews]);
    }

    // Upload files
    setUploading(true);
    setUploadProgress(0);

    try {
      let result;

      switch (uploadType) {
        case 'profile':
          if (validFiles.length === 1) {
            result = await mediaService.uploadProfilePicture(validFiles[0]);
          }
          break;

        case 'cover':
          if (validFiles.length === 1) {
            result = await mediaService.uploadCoverPhoto(validFiles[0]);
          }
          break;

        case 'verification':
          // Assuming first file is front ID, second is back ID
          const verificationFiles = {};
          if (validFiles[0]) verificationFiles.idPhotoFront = validFiles[0];
          if (validFiles[1]) verificationFiles.idPhotoBack = validFiles[1];
          result = await mediaService.uploadVerificationDocuments(verificationFiles);
          break;

        case 'portfolio':
          result = await mediaService.uploadPortfolioItems(
            validFiles,
            (progress) => setUploadProgress(progress)
          );
          break;

        case 'job':
          if (validFiles.length === 1) {
            result = await mediaService.uploadJobImage(validFiles[0]);
          }
          break;

        case 'document':
          if (validFiles.length === 1) {
            result = await mediaService.uploadDocument(validFiles[0]);
          }
          break;

        default:
          // Generic upload - just return file info for parent to handle
          result = { files: validFiles };
          break;
      }

      if (onFileUpload) {
        onFileUpload(result, validFiles);
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
      
      // Clean up preview URLs on error
      if (showPreview) {
        previewUrls.forEach(preview => {
          if (preview.url) {
            mediaService.cleanupPreview(preview.url);
          }
        });
        setPreviewUrls([]);
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [
    acceptedTypes,
    allowVideo,
    disabled,
    existingFiles.length,
    maxFiles,
    maxSizeInMB,
    onFileUpload,
    showPreview,
    uploadType,
    uploading
  ]);

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  // File input change handler
  const handleChange = useCallback((e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  // Remove file handler
  const handleRemoveFile = useCallback((index, file) => {
    if (showPreview && previewUrls[index]) {
      mediaService.cleanupPreview(previewUrls[index].url);
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    }

    if (onFileRemove) {
      onFileRemove(file, index);
    }
  }, [onFileRemove, previewUrls, showPreview]);

  // Open file dialog
  const openFileDialog = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  // Get icon based on file type
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (type.startsWith('video/')) return <Video className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : disabled
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-blue-400 cursor-pointer'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={[...acceptedTypes, ...(allowVideo ? ['video/mp4', 'video/mov', 'video/avi'] : [])].join(',')}
          onChange={handleChange}
          className="hidden"
          disabled={disabled || uploading}
        />

        <div className="flex flex-col items-center justify-center text-center">
          {uploading ? (
            <div className="w-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600 mb-2">Uploading...</p>
              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          ) : uploadType === 'profile' ? (
            <>
              <Camera className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-sm font-medium text-gray-700 mb-1">Upload Profile Picture</p>
              <p className="text-xs text-gray-500">{uploadText}</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-sm font-medium text-gray-700 mb-1">{uploadText}</p>
              <p className="text-xs text-gray-500">
                {allowVideo ? 'Images and videos' : 'Images'} up to {maxSizeInMB}MB
              </p>
            </>
          )}
        </div>

        {/* File limit indicator */}
        {maxFiles > 1 && (
          <div className="absolute top-2 right-2 text-xs text-gray-500">
            {existingFiles.length + previewUrls.length}/{maxFiles}
          </div>
        )}
      </div>

      {/* Preview Area */}
      {showPreview && previewUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previewUrls.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                {preview.type === 'video' ? (
                  <video
                    src={preview.url}
                    className="w-full h-full object-cover"
                    controls={false}
                  />
                ) : (
                  <img
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(index, preview.file);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </button>

              {/* File type indicator */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 rounded px-2 py-1">
                {getFileIcon(preview.file.type)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Existing Files */}
      {existingFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Current Files:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  {file.type === 'video' ? (
                    <video
                      src={file.url}
                      className="w-full h-full object-cover"
                      controls={false}
                    />
                  ) : (
                    <img
                      src={file.url}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                {/* Remove button for existing files */}
                {onFileRemove && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileRemove(file, index, true); // true indicates existing file
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    disabled={uploading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Tips */}
      <div className="mt-2 text-xs text-gray-500">
        <p>
          Supported formats: {acceptedTypes.map(type => type.split('/')[1]).join(', ')}
          {allowVideo && ', mp4, mov, avi'}
        </p>
        <p>Maximum file size: {allowVideo ? '50MB for videos, ' : ''}{maxSizeInMB}MB for images</p>
      </div>
    </div>
  );
};

export default FileUpload;
