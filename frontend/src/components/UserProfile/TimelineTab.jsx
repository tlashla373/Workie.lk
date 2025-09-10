import React from 'react';
import { Users } from 'lucide-react';

const ProfileTimeline = ({ isDarkMode = false }) => {
  return (
    <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
      <p className="text-lg font-medium mb-2">Timeline Coming Soon</p>
      <p>Posts and activities will appear here</p>
    </div>
  );
};

export default ProfileTimeline;
