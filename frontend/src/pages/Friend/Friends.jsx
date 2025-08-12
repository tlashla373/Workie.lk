import React, { useState } from 'react';
import { Search, Filter, UserPlus, Users, Grid3X3, List } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import FriendCard from '../../components/FriendCard';

const Friends = () => {
  const { isDarkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const friends = [
    {
      id: 1,
      name: "Jane Cooper",
      profession: "Paradigm Representative",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
      role: "Admin",
      email: "jane.cooper@example.com",
      phone: "+1 (555) 123-4567",
      category: "carpenter"
    },
    {
      id: 2,
      name: "Cody Fisher",
      profession: "Lead Security Associate",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
      role: "Admin",
      email: "cody.fisher@example.com",
      phone: "+1 (555) 234-5678",
      category: "plumber"
    },
    {
      id: 3,
      name: "Esther Howard",
      profession: "Assurance Administrator",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
      role: "Admin",
      email: "esther.howard@example.com",
      phone: "+1 (555) 345-6789",
      category: "painter"
    },
    {
      id: 4,
      name: "Jenny Wilson",
      profession: "Chief Accountability Analyst",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
      role: "Admin",
      email: "jenny.wilson@example.com",
      phone: "+1 (555) 456-7890",
      category: "welder"
    },
    {
      id: 5,
      name: "Kristin Watson",
      profession: "Investor Data Orchestrator",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
      role: "Admin",
      email: "kristin.watson@example.com",
      phone: "+1 (555) 567-8901",
      category: "mason"
    },
    {
      id: 6,
      name: "Cameron Williamson",
      profession: "Product Infrastructure Executive",
      avatar: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
      role: "Admin",
      email: "cameron.williamson@example.com",
      phone: "+1 (555) 678-9012",
      category: "electrician"
    },
    {
      id: 7,
      name: "Courtney Henry",
      profession: "Investor Factors Associate",
      avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
      role: "Admin",
      email: "courtney.henry@example.com",
      phone: "+1 (555) 789-0123",
      category: "carpenter"
    },
    {
      id: 8,
      name: "Theresa Webb",
      profession: "Global Division Officer",
      avatar: "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
      role: "Admin",
      email: "theresa.webb@example.com",
      phone: "+1 (555) 890-1234",
      category: "plumber"
    },
    {
      id: 9,
      name: "Theresa Webb",
      profession: "Global Division Officer",
      avatar: "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
      role: "Admin",
      email: "theresa.webb@example.com",
      phone: "+1 (555) 890-1234",
      category: "plumber"
    }
  ];

  const filteredFriends = friends.filter(friend => {
    const matchesSearch =
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.profession.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || friend.category === filterBy;
    return matchesSearch && matchesFilter;
  });

  const handleEmailClick = (friend) => {
    console.log(`Opening email to ${friend.name} at ${friend.email}`);
  };

  const handleCallClick = (friend) => {
    console.log(`Calling ${friend.name} at ${friend.phone}`);
  };

  const categories = [
    { value: 'all', label: 'All Friends' },
    { value: 'carpenter', label: 'Carpenters' },
    { value: 'plumber', label: 'Plumbers' },
    { value: 'painter', label: 'Painters' },
    { value: 'welder', label: 'Welders' },
    { value: 'mason', label: 'Masons' },
    { value: 'electrician', label: 'Electricians' }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto p-1">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                Connections
              </h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Connect with skilled professionals in your network
              </p>
            </div>
            <button className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <UserPlus className="w-5 h-5" />
              <span>New Connection</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
            {/* Total Friends */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-sm`}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {friends.length}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Friends
                  </p>
                </div>
              </div>
            </div>

            {/* Online Now */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-sm`}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {Math.floor(friends.length * 0.7)}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Online Now
                  </p>
                </div>
              </div>
            </div>

            {/* New Requests */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-sm`}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    12
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    New Requests
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-sm mb-6`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search friends..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 w-64 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className={`px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-500 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} transition-colors`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-500 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} transition-colors`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Friends Grid */}
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3' : 'grid-cols-1'} gap-4`}>
          {filteredFriends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              onEmailClick={handleEmailClick}
              onCallClick={handleCallClick}
            />
          ))}
        </div>

        {filteredFriends.length === 0 && (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No friends found</p>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
