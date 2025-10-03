import React, { useState, useEffect } from 'react';
import { MessageCircle, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import connectionService from '../../services/connectionService';

const NavigationTabs = ({ 
  activeTab, 
  setActiveTab, 
  isFollowing, 
  setIsFollowing,
  isDarkMode = false,
  isOwnProfile = false, // New prop to determine if viewing own profile
  onEditProfile // New prop for edit profile callback
}) => {
  const [friendCount, setFriendCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  // Get current user type
  useEffect(() => {
    const getUserType = () => {
      try {
        const userData = localStorage.getItem('auth_user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserType(user.userType);
        }
      } catch (error) {
        console.error('Error getting user type:', error);
      }
    };

    getUserType();
  }, []);

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
    // Show Posted Jobs tab for clients, Available Jobs tab for workers (only on own profile)
    ...(isOwnProfile && userType === 'client' ? [{ id: 'posted-jobs', label: 'Posted Jobs' }] : []),
    ...(isOwnProfile && userType === 'worker' ? [{ id: 'available-jobs', label: 'Available Jobs' }] : []),
  ];

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10 transition-colors duration-300`}>
      <div className="px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between">
          <div className="flex overflow-x-auto no-scrollbar space-x-4 sm:space-x-8 pb-2 sm:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 sm:py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
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

          {/* Action Buttons - Different for own profile vs others */}
          <div className="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-3 pt-3 sm:pt-0 pb-3 sm:pb-0">
            {isOwnProfile ? (
              // Own profile - show edit button
              <button
                onClick={() => navigate('/edit-profile')}
                className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-sm transition-colors ${
                  isDarkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Edit Profile
              </button>
            ) : (
              // Other user's profile - show follow/message buttons
              <>
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-sm transition-colors ${
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
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}
            <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}>
              <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationTabs;