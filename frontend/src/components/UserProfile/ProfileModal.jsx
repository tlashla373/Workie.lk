import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, Star, Briefcase } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const ProfileModal = ({ friend, isOpen, onClose }) => {
  const { isDarkMode } = useDarkMode();

  if (!isOpen || !friend) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-inherit rounded-t-2xl">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Profile Details
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-4">
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-200 dark:ring-blue-400"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white dark:border-gray-800"></div>
            </div>
            
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              {friend.name}
            </h3>
            
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
              {friend.profession}
            </p>
            
            <div className="flex items-center space-x-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                {friend.role}
              </span>
              {friend.verified && (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'}`}>
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            {/* Bio Section */}
            {friend.bio && (
              <div>
                <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  About
                </h4>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {friend.bio}
                </p>
              </div>
            )}

            {/* Contact Information */}
            <div>
              <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                Contact Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {friend.email}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {friend.phone}
                  </span>
                </div>
                {friend.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {friend.location}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Section */}
            {friend.skills && friend.skills.length > 0 && (
              <div>
                <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {friend.skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {skill.name || skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rating Section */}
            {friend.rating > 0 && (
              <div>
                <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                  Rating
                </h4>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= friend.rating
                            ? 'text-yellow-400 fill-current'
                            : isDarkMode
                            ? 'text-gray-600'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {friend.rating}/5 ({friend.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>
            )}

            {/* Availability */}
            {friend.availability && (
              <div>
                <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                  Availability
                </h4>
                <div className="flex items-center space-x-2">
                  <Briefcase className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {friend.availability}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                window.open(`mailto:${friend.email}?subject=Hello ${friend.name}`);
              }}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Send Email</span>
            </button>
            <button
              onClick={() => {
                if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
                  window.open(`tel:${friend.phone}`);
                } else {
                  navigator.clipboard.writeText(friend.phone);
                  alert('Phone number copied to clipboard');
                }
              }}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
