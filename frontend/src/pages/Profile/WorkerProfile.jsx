import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SideNavbar from '../../components/SideNavbar';
import UpperNavbar from '../../components/UpperNavbar';
import Calendar from '../../components/ui/Calender';
import ProfileCard from '../../components/ui/ProfileCard';
import BasicInformation from '../../components/ui/BasicInformation';
import UpcomingEvents from '../../components/ui/UpCommingEvent';
import Onboarding from '../../components/ui/Onboarding';
import profileService from '../../services/profileService';

const WorkerProfile = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await profileService.getCurrentUserProfile();
        
        if (response.success) {
          const { user, profile } = response.data;
          setProfileData({ user, profile });
          setRating(profile?.ratings?.average || 0);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${isCollapsed ? 'w-20' : 'w-60'} 
        h-screen fixed left-0 top-0 z-20 transition-all duration-300 bg-white shadow`}
      >
        <SideNavbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 overflow-hidden duration-300 
        ${isCollapsed ? 'ml-20' : 'ml-61'} min-h-screen`}
      >
        {/* Upper Navbar */}
        <div className=" flex-shrink-0  bg-white shadow">
          <UpperNavbar isCollapsed={isCollapsed} />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Top Row - Profile, Calendar, Events */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4">
                  <ProfileCard 
                    rating={rating} 
                    setRating={setRating} 
                    profileData={profileData}
                  />
                </div>
                <div className="lg:col-span-4">
                  <Calendar />
                </div>
                <div className="lg:col-span-4">
                  <UpcomingEvents profileData={profileData} />
                </div>
              </div>

              {/* Bottom Row - Basic Info and Onboarding */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5">
                  <BasicInformation profileData={profileData} />
                </div>
                <div className="lg:col-span-7">
                  <Onboarding profileData={profileData} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
