import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useDarkMode } from '../../../contexts/DarkModeContext';

const SettingSection = ({ id, title, description, icon, iconBg, children, isExpanded, onToggle }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300 overflow-hidden`}>
      <button
        onClick={() => onToggle(id)}
        className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-opacity-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            {icon}
          </div>
          <div className="text-left min-w-0 flex-1">
            <h2 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>{title}</h2>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2 sm:line-clamp-1`}>{description}</p>
          </div>
        </div>
        <div className={`transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </div>
      </button>

      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-4 sm:pt-6`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingSection;
