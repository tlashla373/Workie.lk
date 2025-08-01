import React from 'react';
import { TrendingUp } from 'lucide-react';

const ProfileViews = ({ views = 150, percentage = 35, period = "last month" }) => {
  return (
    <div className="bg-blue-50 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Profile Views</h3>
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-800 mb-1">+ {views}</div>
        <div className="text-sm text-gray-500 mb-2">viewers</div>
        <div className="flex items-center justify-center text-green-600 text-sm">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>{percentage}% {period}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileViews;