import React, { useState } from 'react';
import {
  Home,
  Search,
  MessageCircle,
  Bell,
  LogOut,
  Settings,
  Edit3,
  Users,
  BriefcaseBusiness,
  History,
  Video,
  Hash,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import profileImage from '../assets/profile.jpeg';
import { Outlet, useLocation, NavLink } from 'react-router-dom';

const NavBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
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

  const navigationLinks = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Edit3, label: 'Post Jobs', href: '/postjob' },
    { icon: Users, label: 'Friends', href: '/friends' },
    { icon: Bell, label: 'Notifications', href: '/notifications', badge: 2 },
    { icon: BriefcaseBusiness, label: 'Find Jobs', href: '/findjobs' },
    { icon: History, label: 'Work History', href: '/workhistory' },
    { icon: Video, label: 'Video', href: '/games' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: LogOut, label: 'Log Out', href: '/authform', danger: true },
  ];

  return (
    <div className="flex h-screen bg-gray-900">
      <div
        className={`bg-gray-800/90 backdrop-blur-xl border-r border-gray-700/50 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-72'
        } flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                onClick={toggleSidebar}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center cursor-pointer"
              >
                {isCollapsed ? <ChevronRight className="w-5 h-5 text-white" /> : <Hash className="w-5 h-5 text-white" />}
              </div>
              {!isCollapsed && <span className="text-xl font-bold text-white">Workie.lk</span>}
            </div>
            {!isCollapsed && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-700/50">
          <button
            onClick={toggleProfileDropdown}
            className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-200"
          >
            <div className="relative">
              <img
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-600"
                src={profileImage}
                alt="Profile"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
            </div>
            {!isCollapsed && (
              <div className="text-left">
                <p className="text-white font-medium text-sm">Supun Hashintha</p>
                <p className="text-gray-400 text-xs">My Account</p>
              </div>
            )}
          </button>
        </div>

        {/* Navigation */}
        {!isCollapsed && (
          <div className="px-6 py-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</span>
          </div>
        )}

        <nav className="flex-1 px-4 py-2 space-y-1">
          {navigationLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.label}
                to={link.href}
                end={link.href === '/'}
                className={({ isActive }) =>
                  `relative flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : link.danger
                      ? 'text-gray-300 hover:text-red-400 hover:bg-red-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/30'
                  }`
                }
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {link.badge && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {link.badge}
                    </span>
                  )}
                </div>
                {!isCollapsed && <span className="font-medium">{link.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {link.label}
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

          {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 px-6 py-4">
          <div className="flex items-center justify-between">

            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-white">{currentPageTitle}</h1>
            </div>

            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for people, posts, or topics..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                />
                
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">

              <div >
              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-200 group"
                >
                  <div className="relative">
                    <img
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-gray-600"
                      src={profileImage}
                      alt="Profile"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  </div>
                  {(isCollapsed || isProfileDropdownOpen) && (
                    <div className="flex-1 text-left">
                      <p className="text-white font-medium text-sm">Supun Hashintha</p>
                      <p className="text-gray-400 text-xs">My Account</p>
                    </div>
                  )}
                </button>
              </div>

            </div>
              <button className="p-2 rounded-xl bg-gray-700/30 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button className="relative p-2 rounded-xl bg-gray-700/30 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 ">
          <div className="max-w-4xl mx-auto">            
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8">
              
                <Outlet/>
              
            </div>
          </div>
        </main>
      </div>

{/* Overlay for mobile */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default NavBar;
