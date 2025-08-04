import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { TrendingUp } from 'lucide-react';


const ProfileViews = ({ views = 150, percentage = 35, period = "last month" }) => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <div className={`rounded-xl p-6 border shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]  ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-gray-100'}`}>
      <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Profile Views</h3>
      <div className="text-center">
        <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>+ {views}</div>
        <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>viewers</div>
        <div className="flex items-center justify-center text-green-600 text-sm">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>{percentage}% {period}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileViews;