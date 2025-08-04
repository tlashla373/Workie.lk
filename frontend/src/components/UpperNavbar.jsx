import React, { useState } from 'react';
import {
  Search,
  MessageCircle,
  Bell,
} from 'lucide-react';
import profileImage from '../assets/profile.jpeg';
import { useLocation } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';

const UpperNavbar = ({ isCollapsed = false }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const { isDarkMode } = useDarkMode();

  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const pageTitles = {
    '/': 'Home',
    '/postjob': 'Post Job',
    '/friends': 'Friends',
    '/notifications': 'Notifications',
    '/findjobs': 'Find Jobs',
    '/workhistory': 'Work History',
    '/games': 'Video',
    '/settings': 'Settings',
    '/logout': 'Log Out',
  };
  
  const currentPageTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <>
      {/* Top Bar */}
      <header className={`h-full px-6 py-2 flex items-center border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#FFFFFF] border-gray-700/50'}`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <h1 className={`text-xl alatsi-regular font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>{currentPageTitle}</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 ">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search for people, posts, or topics..."
                className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-[#F0F3FF] border-gray-400/50 text-white placeholder-gray-400'}`}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3 pl-4">
            <div className=''></div>
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className={`w-full flex items-center space-x-3 p-2 rounded-xl transition-all border duration-200 group ${isDarkMode ? 'bg-gray-700 border-gray-800 hover:bg-gray-600' : 'bg-[#F0F3FF] border-gray-300 hover:bg-gray-400/50'}`}
              >
                <div className="relative">
                  <img
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                    src={profileImage}
                    alt="Profile"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-300"></div>
                </div>
                {(!isCollapsed || isProfileDropdownOpen) && (
                  <div className="flex-1 text-left">
                    <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>Supun Hashintha</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-500'}`}>My Account</p>
                  </div>
                )}
              </button>
            </div>
            
            <button className={`p-2 rounded-xl transition-all duration-200 ${isDarkMode ? 'bg-gray-700/50 text-gray-100 hover:bg-gray-700 hover:text-white' : 'bg-gray-700/30 text-gray-100 hover:bg-gray-700/50 hover:text-white'}`}>
              <MessageCircle className="w-5 h-5" />
            </button>
            
            <button className={`relative p-2 rounded-xl transition-all duration-200 ${isDarkMode ? 'bg-gray-700/50 text-gray-100 hover:bg-gray-700 hover:text-white' : 'bg-gray-700/30 text-gray-100 hover:bg-gray-700/50 hover:text-white'}`}>
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Overlay for mobile */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </>
  );
};

export default UpperNavbar;