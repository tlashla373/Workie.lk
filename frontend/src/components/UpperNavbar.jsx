import React, { useState } from 'react';
import {
  Search,
  MessageCircle,
  Bell,
} from 'lucide-react';
import profileImage from '../assets/profile.jpeg';
import { useLocation } from 'react-router-dom';

const UpperNavbar = ({ isCollapsed = false }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();

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
      <header className="h-full bg-blue-50 backdrop-blur-xl border-b border-gray-700/50 px-6 py-2 flex items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-black">{currentPageTitle}</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for people, posts, or topics..."
                className="w-full pl-10 pr-4 py-2 bg-cyan-100 border border-gray-400/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3 pl-4">
           <div className=''></div>
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="w-full flex items-center space-x-3 p-2 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-200 group"
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
                    <p className="text-white font-medium text-sm">Supun Hashintha</p>
                    <p className="text-gray-200 text-xs">My Account</p>
                  </div>
                )}
              </button>
            </div>
            
            <button className="p-2 rounded-xl bg-gray-700/30 text-gray-100 hover:text-white hover:bg-gray-700/50 transition-all duration-200">
              <MessageCircle className="w-5 h-5" />
            </button>
            
            <button className="relative p-2 rounded-xl bg-gray-700/30 text-gray-100 hover:text-white hover:bg-gray-700/50 transition-all duration-200">
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