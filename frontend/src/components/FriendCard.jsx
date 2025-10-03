import React from 'react';
import { Mail, Phone, UserPlus, UserCheck, User, Star } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

const FriendCard = ({ friend, onEmailClick, onCallClick, onConnectClick, onViewProfileClick, isConnected, showConnectButton = false }) => {
  const { isDarkMode } = useDarkMode();

  const handleEmailClick = () => {
    if (onEmailClick) {
      onEmailClick(friend);
    } else {
      console.log(`Emailing ${friend.name}`);
    }
  };

  const handleCallClick = () => {
    if (onCallClick) {
      onCallClick(friend);
    } else {
      console.log(`Calling ${friend.name}`);
    }
  };

  const handleConnectClick = () => {
    if (onConnectClick) {
      onConnectClick(friend);
    } else {
      console.log(`Connecting with ${friend.name}`);
    }
  };

  const handleViewProfileClick = () => {
    if (onViewProfileClick) {
      onViewProfileClick(friend);
    } else {
      console.log(`Viewing profile of ${friend.name}`);
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-4 sm:p-6 border shadow-sm hover:shadow-md transition-all duration-300 group`}>
      {/* Profile Section */}
      <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
        <div className="relative mb-3 sm:mb-4">
          <img
            src={friend.avatar}
            alt={friend.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-gray-100 dark:ring-gray-600 group-hover:ring-blue-200 dark:group-hover:ring-blue-400 transition-all duration-300"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 sm:border-3 border-white dark:border-gray-800"></div>
        </div>

        <h3 className={`text-base sm:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
          {friend.name}
        </h3>

        {/* Display title with fallback */}
        <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
          {friend.title || friend.profession || 'Professional'}
        </p>

        {/* Rating Display for Workers */}
        {friend.userType === 'worker' && (
          <div className="flex items-center justify-center space-x-1 mb-2">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {friend.rating && friend.rating > 0 ? friend.rating.toFixed(1) : '0.0'}
            </span>
            {friend.totalReviews > 0 && (
              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                ({friend.totalReviews} review{friend.totalReviews !== 1 ? 's' : ''})
              </span>
            )}
          </div>
        )}

        <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'}`}>
          {friend.role}
        </span>
      </div>

      {/* Action Buttons */}
      <div className={`flex ${showConnectButton ? 'space-x-2' : 'space-x-2 sm:space-x-3'}`}>
        {showConnectButton ? (
          <>
            <button
              onClick={handleViewProfileClick}
              className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-all duration-200 group/btn bg-blue-500 text-white hover:bg-blue-600`}
            >
              <User className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform duration-200" />
              <span className="text-xs sm:text-sm font-medium">View</span>
            </button>
            <button
              onClick={handleEmailClick}
              className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500' : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'} transition-all duration-200 group/btn`}
            >
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform duration-200" />
              <span className="text-xs sm:text-sm font-medium">Email</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEmailClick}
              className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500' : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'} transition-all duration-200 group/btn`}
            >
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform duration-200" />
              <span className="text-xs sm:text-sm font-medium">Email</span>
            </button>

            <button
              onClick={handleCallClick}
              className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500' : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'} transition-all duration-200 group/btn`}
            >
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform duration-200" />
              <span className="text-xs sm:text-sm font-medium">Call</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FriendCard;
