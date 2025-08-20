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
  ImagePlus,
  Menu,
  X
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userRole: userType, clearUserRole } = useUserRole();
  const { isDarkMode } = useDarkMode();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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

  // Navigation links for workers (mobile bottom nav)
  const workerMobileNavLinks = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: BriefcaseBusiness, label: 'Jobs', href: '/findjobs' },
    { icon: ImagePlus, label: 'Post', href: '/add-post'},
    { icon: Users, label: 'Friends', href: '/friends' },
    { icon: Menu, label: 'More', href: '#', isMore: true },
  ];

  // Navigation links for clients (mobile bottom nav)
  const clientMobileNavLinks = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Edit3, label: 'Post Job', href: '/post-job' },
    { icon: ImagePlus, label: 'Post', href: '/add-post'},
    { icon: Users, label: 'Friends', href: '/friends' },
    { icon: Menu, label: 'More', href: '#', isMore: true },
  ];

  // Additional menu items for mobile "More" section
  const moreMenuItems = [
    { icon: History, label: 'Work Status', href: '/workhistory' },
    { icon: Video, label: 'Video', href: '/video' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: LogOut, label: 'Log Out', href: '/loginpage', danger: true },
  ];

  // Select navigation links based on user type
  const navigationLinks = userType === 'client' ? clientNavigationLinks : workerNavigationLinks;
  const mobileNavLinks = userType === 'client' ? clientMobileNavLinks : workerMobileNavLinks;

  // Handle logout - clear localStorage and user data
  const handleLogout = () => {
    clearUserRole();
    setIsMobileMenuOpen(false);
    // Clear other user-related data here
    // localStorage.removeItem('authToken');
    // localStorage.removeItem('userData');
  };

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className={`hidden lg:flex h-full flex-col ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#4E6BF5] border-gray-700/50'}`}>
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

      {/* Mobile Bottom Navigation - Visible only on mobile */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#4E6BF5]  border-blue-400'} border-t`}>
        <div className="flex items-center justify-around py-1 px-4">
          {mobileNavLinks.map((link) => {
            const Icon = link.icon;
            
            if (link.isMore) {
              return (
                <button
                  key={link.label}
                  onClick={toggleMobileMenu}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                    isMobileMenuOpen
                      ? 'text-blue-100 bg-blue-600'
                      : isDarkMode 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-white hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">{link.label}</span>
                </button>
              );
            }

            return (
              <NavLink
                key={link.label}
                to={link.href}
                end={link.href === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-blue-100 bg-blue-700'
                      : isDarkMode 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-white hover:text-gray-900'
                  }`
                }
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Mobile More Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* More Menu */}
          <div className={`fixed bottom-20 right-4 left-4 z-50 lg:hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl shadow-xl`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  More Options
                </h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2 rounded-lg ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {moreMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isLogout = item.danger;
                  
                  return (
                    <NavLink
                      key={item.label}
                      to={item.href}
                      onClick={isLogout ? handleLogout : () => setIsMobileMenuOpen(false)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl transition-colors ${
                        isLogout
                          ? isDarkMode
                            ? 'text-red-400 hover:bg-red-500/10'
                            : 'text-red-500 hover:bg-red-50'
                          : isDarkMode
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium text-center">{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Overlay for desktop profile dropdown */}
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