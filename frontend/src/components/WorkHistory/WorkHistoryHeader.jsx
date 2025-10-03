// components/WorkHistoryHeader.jsx
import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const WorkHistoryHeader = ({ userType = 'worker' }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="mb-4 md:mb-6 lg:mb-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className={`text-xl md:text-2xl lg:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 md:mb-2`}>
            Work History
          </h1>
          <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {userType === 'worker' 
              ? 'Track your job applications and project history' 
              : 'Manage applications received on your job posts'
            }
          </p>
        </div>
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            userType === 'worker' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
          }`}>
            {userType === 'worker' ? 'Worker Account' : 'Client Account'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WorkHistoryHeader;