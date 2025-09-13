import React, { useState } from 'react';
import { Search, Filter, UserPlus, Users, Grid3X3, List, Loader2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../hooks/useAuth';
import FriendCard from '../../components/FriendCard';
import AuthChecker from '../../components/AuthChecker';
import useConnections from '../../hooks/useConnections';
import useDiscoverPeople from '../../hooks/useDiscoverPeople';

const Friends = () => {
  const { isDarkMode } = useDarkMode();
  const { user } = useAuth(); // Get current logged-in user
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showConnections, setShowConnections] = useState(true); // Toggle between connections and discover

  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('auth_token');
  
  // If not authenticated, show auth checker
  if (!isAuthenticated) {
    return <AuthChecker />;
  }

  // Custom hooks for data fetching
  const { 
    connections, 
    loading: connectionsLoading, 
    error: connectionsError, 
    stats,
    refetch: refetchConnections,
    sendConnectionRequest,
    removeConnection 
  } = useConnections();

  const { 
    people, 
    loading: peopleLoading, 
    error: peopleError, 
    refetch: refetchPeople 
  } = useDiscoverPeople();

  // Determine which data to show
  const currentData = showConnections ? connections : people;
  const currentLoading = showConnections ? connectionsLoading : peopleLoading;
  const currentError = showConnections ? connectionsError : peopleError;

  const filteredFriends = currentData.filter(friend => {
    const matchesSearch =
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.profession.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || friend.category === filterBy;
    
    // Exclude the current logged-in user from both connections and discover pages
    // Handle both id and _id field formats
    const friendId = friend.id || friend._id;
    const userId = user?.id || user?._id;
    
    // Also check name-based filtering as a fallback
    const currentUserName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';
    const friendName = friend.name;
    const isNotCurrentUserById = friendId !== userId;
    const isNotCurrentUserByName = !currentUserName || !friendName || 
      currentUserName.toLowerCase() !== friendName.toLowerCase();
    
    const isNotCurrentUser = isNotCurrentUserById && isNotCurrentUserByName;
    
    return matchesSearch && matchesFilter && isNotCurrentUser;
  });

  const handleEmailClick = async (friend) => {
    // Create mailto link
    const subject = encodeURIComponent(`Hello ${friend.name}`);
    const body = encodeURIComponent(`Hi ${friend.name},\n\nI hope this message finds you well.\n\nBest regards`);
    window.open(`mailto:${friend.email}?subject=${subject}&body=${body}`);
  };

  const handleCallClick = (friend) => {
    // Create tel link for mobile devices or show phone number
    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
      window.open(`tel:${friend.phone}`);
    } else {
      // For desktop, copy to clipboard or show alert
      navigator.clipboard.writeText(friend.phone).then(() => {
        alert(`Phone number ${friend.phone} copied to clipboard`);
      }).catch(() => {
        alert(`Call ${friend.name} at ${friend.phone}`);
      });
    }
  };

  const handleConnectClick = async (friend) => {
    try {
      if (showConnections) {
        // Remove connection
        await removeConnection(friend.id);
        alert(`Removed connection with ${friend.name}`);
      } else {
        // Send connection request
        await sendConnectionRequest(friend.id);
        alert(`Connection request sent to ${friend.name}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleRefresh = () => {
    if (showConnections) {
      refetchConnections();
    } else {
      refetchPeople();
    }
  };

  const handleViewProfileClick = (friend) => {
    // Navigate to ClientProfile page with the user's ID
    const userId = friend.id || friend._id || friend.userId;
    
    if (userId) {
      navigate(`/profile/${userId}`);
    } else {
      console.error('User ID not found for profile:', friend);
      alert('Unable to view profile: User ID not found');
    }
  };

  const categories = [
    { value: 'all', label: 'All People' },
    { value: 'carpenter', label: 'Carpenters' },
    { value: 'plumber', label: 'Plumbers' },
    { value: 'painter', label: 'Painters' },
    { value: 'welder', label: 'Welders' },
    { value: 'mason', label: 'Masons' },
    { value: 'electrician', label: 'Electricians' },
    { value: 'general', label: 'General Workers' },
    { value: 'client', label: 'Clients' }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4 sm:gap-0">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                {showConnections ? 'Connections' : 'Discover People'}
              </h1>
              <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {showConnections 
                  ? `Connect with people in your network${stats ? ` (${stats.totalConnections} connections)` : ''}`
                  : 'Find and connect with skilled workers and clients'
                }
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleRefresh}
                disabled={currentLoading}
                className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <RefreshCw className={`w-4 h-4 ${currentLoading ? 'animate-spin' : ''}`} />
              </button>
              <button 
                onClick={() => setShowConnections(!showConnections)}
                className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${showConnections ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              >
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{showConnections ? 'Discover People' : 'My Connections'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-4 sm:p-6 border shadow-sm mb-4 sm:mb-6`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder={`Search ${showConnections ? 'connections' : 'people'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className={`px-3 py-2 rounded-lg border text-sm w-full sm:w-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-end space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-500 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {currentLoading && (
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 sm:p-8 border shadow-sm text-center`}>
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className={`w-6 h-6 animate-spin ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Loading {showConnections ? 'connections' : 'people'}...
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {currentError && !currentLoading && (
          <div className={`${isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'} rounded-2xl p-6 sm:p-8 border shadow-sm text-center`}>
            <div className={`mx-auto w-16 h-16 ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'} rounded-full flex items-center justify-center mb-4`}>
              <Users className={`w-8 h-8 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
            </div>
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              {currentError.includes('log in') ? 'Authentication Required' : 'Error loading data'}
            </h3>
            <p className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} text-sm sm:text-base mb-4`}>
              {currentError.includes('log in') 
                ? 'Please log in to view connections and discover people.'
                : currentError
              }
            </p>
            {!currentError.includes('log in') && (
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {/* Friends Grid */}
        {!currentLoading && !currentError && (
          <>
            {filteredFriends.length === 0 ? (
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 sm:p-8 border shadow-sm text-center`}>
                <div className={`mx-auto w-16 h-16 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full flex items-center justify-center mb-4`}>
                  <Users className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {showConnections ? 'No connections found' : 'No people found'}
                </h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm sm:text-base mb-4`}>
                  {showConnections 
                    ? 'You haven\'t connected with anyone yet. Try discovering new people!'
                    : 'Try adjusting your search or filter criteria'
                  }
                </p>
                {showConnections && (
                  <button
                    onClick={() => setShowConnections(false)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Discover People
                  </button>
                )}
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 sm:gap-6' 
                : 'space-y-3 sm:space-y-4'
              }>
                {filteredFriends.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    onEmailClick={handleEmailClick}
                    onCallClick={handleCallClick}
                    onConnectClick={showConnections ? undefined : () => handleConnectClick(friend)}
                    onViewProfileClick={handleViewProfileClick}
                    isConnected={showConnections}
                    showConnectButton={!showConnections}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Friends;
