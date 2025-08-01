import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideNavbar from '../../components/SideNavbar';
import UpperNavbar from '../../components/UpperNavbar';
import JobSuggestion from '../JobSuggestions/JobSuggestions';

const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="h-screen bg-gray-300 lg:gap-1 md:gap-4 flex overflow-hidden">
      {/* Left Side Navigation - Full Height, Fixed */}
      <div className={`${isCollapsed ? 'w-20' : 'w-60'} transition-all duration-300 ease-in-out flex-shrink-0`}>
        <SideNavbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Main Content Area - Center and Right */}
      <div className="flex-1 flex flex-col overflow-hidden lg:gap-1.5">
        {/* Upper Navigation - Fixed at top */}
        <div className="flex-shrink-0">
           <UpperNavbar isCollapsed={isCollapsed} />
        </div>

        {/* Content Area with Main Content and Job Suggestions */}
        <div className="flex-1 flex overflow-hidden lg:gap-1.5">
          {/* Main Content - Scrollable Area */}
          <main className="flex-1 pl-32 pr-32 overflow-y-auto overflow-x-hidden no-scrollbar">
            
              <div className="bg-white backdrop-blur-xl shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]  border border-gray-300/5 p-8 ">
                <Outlet />
              </div>
            
          </main>

          {/* Job Suggestions Sidebar - Fixed, Right */}
          <div className="h-screen w-85 flex overflow-hidden flex-shrink-0 ">
            <JobSuggestion />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;