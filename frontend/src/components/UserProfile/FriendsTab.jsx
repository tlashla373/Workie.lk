import React, { useState, useEffect } from 'react';
import { Users, UserPlus, MessageCircle, Check } from 'lucide-react';
import connectionService from '../../services/connectionService';

const ProfileFriends = ({ isDarkMode = false, onConnect }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch friends data from API
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const response = await connectionService.getMyConnections();
        
        if (response.success) {
          // Transform API data to match component format
          const transformedFriends = response.data.connections.map(connection => ({
            id: connection._id,
            name: `${connection.firstName} ${connection.lastName}`,
            profession: connection.userType === 'worker' ? 'Skilled Worker' : 'Client',
            avatar: connection.profilePicture || 'https://via.placeholder.com/150',
            mutualFriends: Math.floor(Math.random() * 20) + 1, // Random for now
            isConnected: true, // They are already connected
            location: ''
          }));
          
          setFriends(transformedFriends);
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
        setError('Failed to load connections');
        // Fallback to mock data if API fails
        setFriends([
          {
            id: 1,
            name: "Sarah Wilson",
            profession: "UI/UX Designer",
            avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
            mutualFriends: 12,
            isConnected: false,
            location: "New York, USA"
          },
          {
            id: 2,
            name: "Mike Johnson",
            profession: "Frontend Developer",
            avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
            mutualFriends: 8,
            isConnected: true,
            location: "San Francisco, USA"
          },
          {
            id: 3,
            name: "Emily Davis",
            profession: "Product Manager",
            avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
            mutualFriends: 15,
            isConnected: false,
            location: "London, UK"
          },
          {
            id: 4,
            name: "David Chen",
            profession: "Software Engineer",
            avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
            mutualFriends: 6,
            isConnected: false,
            location: "Toronto, Canada"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleConnect = (friendId) => {
    setFriends(prevFriends =>
      prevFriends.map(friend =>
        friend.id === friendId
          ? { ...friend, isConnected: !friend.isConnected }
          : friend
      )
    );

    if (onConnect) {
      onConnect(friendId);
    }
  };

  const connectedFriends = friends.filter(friend => friend.isConnected);
  const suggestedFriends = friends.filter(friend => !friend.isConnected);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Friends & Connections
          </h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {connectedFriends.length} connections • {suggestedFriends.length} suggestions
          </p>
        </div>
      </div>

      {/* Connected Friends */}
      {connectedFriends.length > 0 && (
        <div>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
            <Users className="w-5 h-5 mr-2" />
            Connected Friends ({connectedFriends.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {connectedFriends.map((friend) => (
              <div
                key={friend.id}
                className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-4 border shadow-sm hover:shadow-md transition-all duration-300 group`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-green-200 dark:ring-green-400"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>

                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {friend.name}
                  </h4>

                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    {friend.profession}
                  </p>

                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mb-3`}>
                    {friend.location}
                  </p>

                  <div className="flex space-x-2 w-full">
                    <button
                      onClick={() => handleConnect(friend.id)}
                      className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        isDarkMode
                          ? 'bg-green-900/30 text-green-300 hover:bg-green-900/50'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>Connected</span>
                    </button>

                    <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}>
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Friends */}
      {suggestedFriends.length > 0 && (
        <div>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
            <UserPlus className="w-5 h-5 mr-2" />
            People You May Know ({suggestedFriends.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {suggestedFriends.map((friend) => (
              <div
                key={friend.id}
                className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-4 border shadow-sm hover:shadow-md transition-all duration-300 group`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600 group-hover:ring-blue-200 dark:group-hover:ring-blue-400 transition-all duration-300"
                    />
                  </div>

                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {friend.name}
                  </h4>

                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    {friend.profession}
                  </p>

                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mb-2`}>
                    {friend.location}
                  </p>

                  <p className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mb-3`}>
                    {friend.mutualFriends} mutual connections
                  </p>

                  <div className="flex space-x-2 w-full">
                    <button
                      onClick={() => handleConnect(friend.id)}
                      className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Connect</span>
                    </button>

                    <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}>
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {friends.length === 0 && (
        <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No Friends Yet</p>
          <p>Start connecting with other professionals</p>
        </div>
      )}
    </div>
  );
};

export default ProfileFriends;
