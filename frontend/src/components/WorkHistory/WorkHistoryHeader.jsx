// components/WorkHistoryHeader.jsx
import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const WorkHistoryHeader = ({ viewRole, setViewRole }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Work History
          </h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {viewRole === 'worker' 
              ? 'Track your completed projects and earnings' 
              : 'Manage your hired projects and payments'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            View as:
          </span>
          <select
            value={viewRole}
            onChange={(e) => setViewRole(e.target.value)}
            className={`px-3 py-2 rounded-lg border ${
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