// components/WorkHistoryHeader.jsx
import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const WorkHistoryHeader = ({ viewRole, setViewRole }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="mb-4 md:mb-6 lg:mb-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className={`text-xl md:text-2xl lg:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 md:mb-2`}>
            Work History
          </h1>
          <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {viewRole === 'worker' 
              ? 'Track your completed projects and earnings' 
              : 'Manage your hired projects and payments'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            View as:
          </span>
          <select
            value={viewRole}
            onChange={(e) => setViewRole(e.target.value)}
            className={`px-2 md:px-3 py-1 md:py-2 text-sm md:text-base rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="worker">Worker</option>
            <option value="client">Client</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default WorkHistoryHeader;