import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const StatusCard = ({ icon: Icon, title, value, bgColor }) => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <div className={`${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 shadow-sm border transition-colors duration-300`}>
      <div className="flex flex-col md:flex-row items-center md:space-x-3 space-y-2 md:space-y-0">
        <div className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 ${bgColor} rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
        </div>
        <div className="text-center md:text-left">
          <p className={`text-lg md:text-xl lg:text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>{value}</p>
          <p className={`text-xs md:text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>{title}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;