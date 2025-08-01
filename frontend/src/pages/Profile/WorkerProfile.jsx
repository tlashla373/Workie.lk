import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideNavbar from '../../components/SideNavbar';
import UpperNavbar from '../../components/UpperNavbar';
import Calendar from '../../components/ui/Calender';
import ProfileCard from '../../components/ui/ProfileCard';
import BasicInformation from '../../components/ui/BasicInformation';
import UpcomingEvents from '../../components/ui/UpCommingEvent';
import Onboarding from '../../components/ui/Onboarding';

const WorkerProfile = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [rating, setRating] = useState(4);

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${isCollapsed ? 'w-20' : 'w-60'} 
        h-screen fixed left-0 top-0 z-20 transition-all duration-300 bg-white shadow`}
      >
        <SideNavbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 
        ${isCollapsed ? 'ml-20' : 'ml-61'} min-h-screen`}
      >
        {/* Upper Navbar */}
        <div className=" flex-shrink-0  top-0 bg-white shadow">
          <UpperNavbar isCollapsed={isCollapsed} />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Row - Profile, Calendar, Events */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <ProfileCard rating={rating} setRating={setRating} />
            </div>
            <div className="lg:col-span-4">
              <Calendar />
            </div>
            <div className="lg:col-span-4">
              <UpcomingEvents />
            </div>
          </div>

          {/* Bottom Row - Basic Info and Onboarding */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <BasicInformation />
            </div>
            <div className="lg:col-span-7">
              <Onboarding />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
