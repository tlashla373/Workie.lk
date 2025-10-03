import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideNavbar from '../../components/NavBar/SideNavbar';
import UpperNavbar from '../../components/NavBar/UpperNavbar';
import JobSuggestion from '../JobSuggestions/JobSuggestions';
import AdminAccess from '../../components/AdminPanel/AdminAccess';
import { useDarkMode } from '../../contexts/DarkModeContext';

const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDarkMode } = useDarkMode();

  return (
    <>
      <div className={`h-screen flex overflow-hidden lg:gap-1 md:gap-4 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
        {/* Left Side Navigation - Only visible on desktop */}
        <div className={`hidden lg:block ${isCollapsed ? 'w-20' : 'w-60'} transition-all duration-300 ease-in-out flex-shrink-0 z-100`}>
          <SideNavbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>

        {/* Main Content Area - Full width on mobile, shared with sidebar on desktop */}
        <div className="flex-1 flex flex-col overflow-hidden lg:gap-1.5">
          {/* Upper Navigation - Fixed at top */}
          <div className={`flex-shrink-0 shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <UpperNavbar isCollapsed={isCollapsed} />
          </div>

          {/* Content Area with Main Content and Job Suggestions */}
          <div className="flex-1 flex overflow-hidden lg:gap-1.5">
            {/* Main Content - Scrollable Area with bottom padding on mobile for navigation */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-20 lg:pb-0">
              <div className={`${isDarkMode ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-300/5'} backdrop-blur-xl shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] border p-1`}>
                <Outlet />
              </div>
            </main>

            {/* Job Suggestions Sidebar - Hidden on mobile, visible on desktop */}
            <div className="hidden lg:flex h-screen w-85 overflow-hidden flex-shrink-0">
              <JobSuggestion />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation - Render separately for mobile only */}
      <div className="lg:hidden">
        <SideNavbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Admin Access Button */}
      <AdminAccess />
    </>
  );
};

export default AppLayout;