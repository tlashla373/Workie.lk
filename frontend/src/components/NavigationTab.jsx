import React, { useState, useEffect } from 'react';
import { MessageCircle, MoreHorizontal } from 'lucide-react';
import connectionService from '../services/connectionService';

const NavigationTabs = ({ 
  activeTab, 
  setActiveTab, 
  isFollowing, 
  setIsFollowing,
  isDarkMode = false 
}) => {
  const [friendCount, setFriendCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch friend count from API
  useEffect(() => {
    const fetchConnectionStats = async () => {
      try {
        const response = await connectionService.getConnectionStats();
        if (response.success) {
          setFriendCount(response.data.totalConnections);
        }
      } catch (error) {
        console.error('Error fetching connection stats:', error);
        // Fallback to default value
        setFriendCount(8);
      } finally {
        setLoading(false);
      }
    };

    fetchConnectionStats();
  }, []);

  const tabs = [
    { id: 'timeline', label: 'Timeline' },
    { id: 'about', label: 'About' },
    { id: 'friends', label: 'Friends', count: friendCount },
    { id: 'photos', label: 'Photos' },
  ];

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10 transition-colors duration-300`}>
      <div className="px-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : isDarkMode
                    ? 'border-transparent text-gray-400 hover:text-gray-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count && (
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isFollowing
                  ? isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}>
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}>
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationTabs;