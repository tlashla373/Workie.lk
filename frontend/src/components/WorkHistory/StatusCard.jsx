import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const StatusCard = ({ icon: Icon, title, value, bgColor }) => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <div className={`${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } rounded-2xl p-6 shadow-sm border transition-colors duration-300`}>
      <div className="flex items-center space-x-3">
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className={`text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>{value}</p>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>{title}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;