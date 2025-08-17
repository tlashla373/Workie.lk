import React, { useState } from 'react';
import {
  Home,
  LogOut,
  Settings,
  Edit3,
  Users,
  BriefcaseBusiness,
  History,
  Video,
  PanelRightOpen,
  PanelRightClose,
  Bell,
  ImagePlus
} from 'lucide-react';
import profileImage from '../assets/profile.jpeg';
import Logo from '../assets/Logo.png'
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useUserRole } from '../components/hooks/UserRole'; // Import the custom hook

const SideNavbar = ({ 
  isCollapsed = false, 
  setIsCollapsed = () => {}
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { userRole: userType, clearUserRole } = useUserRole();
  const { isDarkMode } = useDarkMode();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  // Navigation links for workers
  const workerNavigationLinks = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Users, label: 'Friends', href: '/friends' },
    { icon: ImagePlus, label: 'Photo/video', href: '/add-post'},
    { icon: BriefcaseBusiness, label: 'Find Jobs', href: '/findjobs' },
    { icon: History, label: 'Work Status', href: '/workhistory' },
    { icon: Video, label: 'Video', href: '/video' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: LogOut, label: 'Log Out', href: '/loginpage', danger: true },
  ];

  // Navigation links for clients
  const clientNavigationLinks = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Edit3, label: 'Post Jobs', href: '/post-job' },
    { icon: Users, label: 'Friends', href: '/friends' },
    { icon: ImagePlus, label: 'Photo/video', href: '/add-post'},
    { icon: History, label: 'Work Status', href: '/workhistory' },
    { icon: Video, label: 'Video', href: '/video' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: LogOut, label: 'Log Out', href: '/loginpage', danger: true },
  ];

  // Select navigation links based on user type
  const navigationLinks = userType === 'client' ? clientNavigationLinks : workerNavigationLinks;

  // Handle logout - clear localStorage and user data
  const handleLogout = () => {
    clearUserRole();
    // Clear other user-related data here
    // localStorage.removeItem('authToken');
    // localStorage.removeItem('userData');
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#4E6BF5] border-gray-700/50'}`}>
        {/* Sidebar Header */}
        <div className={`p-4 border-b-2 ${isDarkMode ? 'border-gray-700' : 'border-white'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                onClick={toggleSidebar}
                className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer ${isDarkMode ? 'bg-white' : 'bg-white'}`}
              >
                {isCollapsed ? <PanelRightClose className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} /> : <img src={Logo} className="w-7 h-7" />}
              </div>
              {!isCollapsed && <span className={`text-xl audiowide-regular  font-bold ${isDarkMode ? 'text-white' : 'text-white'}`}>Workie.LK</span>}
            </div>
            {!isCollapsed && (
              <button
                onClick={toggleSidebar}
                className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-100 hover:text-white hover:bg-gray-700/50'}`}
              >
                <PanelRightOpen className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className={`p-4 border-b-2 ${isDarkMode ? 'border-gray-700' : 'border-white'}`}>
          <Link to={userType === 'client' ? '/clientprofile' : '/workerprofile'}>
            <button
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer ${isDarkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-200/30 hover:bg-gray-700/50'}`}
            >
              <div className="relative">
                <img
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                  src={profileImage}
                  alt="Profile"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-300"></div>
              </div>
              {!isCollapsed && (
                <div className="text-left">
                  <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-white'}`}>Supun Hashintha</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-300'}`}>
                    {userType === 'client' ? 'Client Account' : 'Worker Account'}
                  </p>
                </div>
              )}
            </button>
          </Link>
        </div>

        {/* Navigation */}
        {!isCollapsed && (
          <div className="px-6 py-3">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-white'}`}>
              {userType === 'client' ? 'Client Menu' : 'Worker Menu'}
            </span>
          </div>
        )}

        <nav className="flex-1 px-4 py-2 space-y-1">
          {navigationLinks.map((link) => {
            const Icon = link.icon;
            const isLogout = link.danger;
            
            return (
              <NavLink
                key={link.label}
                to={link.href}
                end={link.href === '/'}
                onClick={isLogout ? handleLogout : undefined}
                className={({ isActive }) =>
                  `relative flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? isDarkMode
                        ? 'bg-gray-700/20 text-white border border-blue-500/30'
                        : 'bg-gray-700/20 text-white border border-blue-500/30'
                      : link.danger
                      ? isDarkMode
                        ? 'text-gray-300 hover:text-red-400 hover:bg-gray-700/30'
                        : 'text-gray-100 hover:text-red-400 hover:bg-gray-700/10'
                      : isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                      : 'text-gray-100 hover:text-white hover:bg-gray-700/30'
                  }`
                }
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                </div>
                {!isCollapsed && <span className="font-medium">{link.label}</span>}
                {isCollapsed && (
                  <div className={`absolute left-full ml-2 px-3 py-2 text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-1000 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'}`}>
                    {link.label}
                    <div className={`absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45 z-100 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-900'}`}></div>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

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

export default SideNavbar;