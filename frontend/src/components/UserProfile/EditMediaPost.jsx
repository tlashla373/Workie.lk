import React, { useState, useEffect } from 'react';
import { X, Upload, Image, Play, Edit3, Save, RotateCcw, Loader2 } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const EditMediaPost = ({ 
  mediaFiles = [], 
  description = '', 
  type = 'post', // Add type prop
  onDescriptionChange, 
  onMediaRemove,
  onSave,
  onCancel,
  loading = false,
  isDarkMode 
}) => {
  const [editableDescription, setEditableDescription] = useState(description);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [mediaLoadErrors, setMediaLoadErrors] = useState(new Set());

  useEffect(() => {
    setEditableDescription(description);
  }, [description]);

  // Handle media loading states
  const handleMediaLoad = (mediaId) => {
    setLoadingStates(prev => ({ ...prev, [mediaId]: false }));
  };

  const handleMediaError = (mediaId) => {
    setLoadingStates(prev => ({ ...prev, [mediaId]: false }));
    setMediaLoadErrors(prev => new Set([...prev, mediaId]));
  };

  const handleMediaLoadStart = (mediaId) => {
    setLoadingStates(prev => ({ ...prev, [mediaId]: true }));
  };

  // Handle description editing
  const handleDescriptionEdit = () => {
    setIsEditing(true);
  };

  const handleDescriptionSave = () => {
    setIsEditing(false);
    if (onDescriptionChange) {
      onDescriptionChange(editableDescription);
    }
  };

  const handleDescriptionCancel = () => {
    setIsEditing(false);
    setEditableDescription(description);
  };

  const handleDescriptionChange = (e) => {
    setEditableDescription(e.target.value);
  };

  // Render media item with loading state
  const renderMediaItem = (media, index) => {
    const mediaId = media.id || `media-${index}`;
    const isLoading = loadingStates[mediaId];
    const hasError = mediaLoadErrors.has(mediaId);
    const isVideo = media.type === 'video' || media.fileType === 'video' || 
                   (media.url && (media.url.includes('.mp4') || media.url.includes('.webm') || media.url.includes('.mov')));

    return (
      <div key={mediaId} className="relative group">
        {/* Loading Overlay */}
        {isLoading && (
          <div className={`absolute inset-0 flex items-center justify-center z-10 rounded-lg ${
            isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'
          }`}>
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className={`w-8 h-8 animate-spin ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Loading...
              </span>
            </div>
          </div>
        )}

        {/* Remove Button */}
        {onMediaRemove && (
          <button
            onClick={() => onMediaRemove(index)}
            className="absolute top-2 right-2 z-20 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
            title="Remove media"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Media Content */}
        <div className={`relative overflow-hidden rounded-lg aspect-square ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          {hasError ? (
            // Error State
            <div className={`w-full h-full flex items-center justify-center ${
              isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
            }`}>
              <div className="text-center">
                <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Failed to load</p>
              </div>
            </div>
          ) : isVideo ? (
            // Video
            <div className="relative w-full h-full">
              <video
                src={media.url}
                className="w-full h-full object-cover"
                onLoadStart={() => handleMediaLoadStart(mediaId)}
                onLoadedData={() => handleMediaLoad(mediaId)}
                onError={() => handleMediaError(mediaId)}
                muted
                preload="metadata"
              />
              {/* Video Play Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="p-3 bg-black/50 rounded-full">
                  <Play className="w-6 h-6 text-white fill-current" />
                </div>
              </div>
            </div>
          ) : (
            // Image
            <img
              src={media.url}
              alt={media.alt || `Media ${index + 1}`}
              className="w-full h-full object-cover"
              onLoad={() => handleMediaLoad(mediaId)}
              onError={() => handleMediaError(mediaId)}
              onLoadStart={() => handleMediaLoadStart(mediaId)}
            />
          )}

          {/* Media Type Badge */}
          <div className="absolute bottom-2 left-2">
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
              isVideo 
                ? 'bg-red-500/80 text-white' 
                : isDarkMode 
                  ? 'bg-blue-500/80 text-white' 
                  : 'bg-blue-600/80 text-white'
            }`}>
              {isVideo ? (
                <>
                  <Play className="w-3 h-3 mr-1" />
                  Video
                </>
              ) : (
                <>
                  <Image className="w-3 h-3 mr-1" />
                  Image
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`p-4 rounded-lg border ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Media Post
        </h3>
        <div className="flex items-center space-x-2">
          {onSave && (
            <button
              onClick={onSave}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                loading
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </>
              )}
            </button>
          )}
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Media Grid */}
      {mediaFiles && mediaFiles.length > 0 && (
        <div className="mb-4">
          <h4 className={`text-sm font-medium mb-3 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Media Files ({mediaFiles.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {mediaFiles.map((media, index) => renderMediaItem(media, index))}
          </div>
        </div>
      )}

      {/* Description Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Description
          </h4>
          {!isEditing && (
            <button
              onClick={handleDescriptionEdit}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
              title="Edit description"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>

        {isEditing ? (
          // Editable Description
          <div className="space-y-3">
            <textarea
              value={editableDescription}
              onChange={handleDescriptionChange}
              placeholder="Write a description for your post..."
              rows={4}
              className={`w-full px-3 py-2 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-black placeholder-gray-500'
              }`}
              autoFocus
            />
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={handleDescriptionCancel}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <RotateCcw className="w-4 h-4 mr-1 inline" />
                Cancel
              </button>
              <button
                onClick={handleDescriptionSave}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-1 inline" />
                Save
              </button>
            </div>
          </div>
        ) : (
          // Display Description
          <div className={`p-3 rounded-lg border min-h-[80px] ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            {editableDescription ? (
              <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {editableDescription}
              </p>
            ) : (
              <p className={`text-sm italic ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No description added. Click the edit button to add one.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Media Count Summary */}
      {mediaFiles && mediaFiles.length > 0 && (
        <div className={`mt-4 pt-3 border-t text-xs ${
          isDarkMode 
            ? 'border-gray-700 text-gray-400' 
            : 'border-gray-200 text-gray-500'
        }`}>
          <div className="flex items-center justify-between">
            <span>
              {mediaFiles.length} media file{mediaFiles.length !== 1 ? 's' : ''} attached
            </span>
            <span>
              {mediaFiles.filter(m => m.type === 'video' || (m.url && m.url.match(/\.(mp4|webm|mov)$/i))).length} video{mediaFiles.filter(m => m.type === 'video' || (m.url && m.url.match(/\.(mp4|webm|mov)$/i))).length !== 1 ? 's' : ''}, {' '}
              {mediaFiles.filter(m => m.type !== 'video' && (!m.url || !m.url.match(/\.(mp4|webm|mov)$/i))).length} image{mediaFiles.filter(m => m.type !== 'video' && (!m.url || !m.url.match(/\.(mp4|webm|mov)$/i))).length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditMediaPost;
