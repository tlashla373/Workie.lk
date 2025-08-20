import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

const FriendCard = ({ friend, onEmailClick, onCallClick }) => {
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

        <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2 sm:mb-3`}>
          {friend.profession}
        </p>

        <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'}`}>
          {friend.role}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 sm:space-x-3">
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
      </div>
    </div>
  );
};

export default FriendCard;
