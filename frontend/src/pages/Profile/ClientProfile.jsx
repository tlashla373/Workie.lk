import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import ProfileHeader from '../../components/ProfileHeader';
import NavigationTabs from '../../components/NavigationTab';
import ProfileAbout from '../../components/AboutTab';
import ProfilePhotos from '../../components/ProfilePhotos';
import ProfileTimeline from '../../components/TimelineTab';
import ProfileFriends from '../../components/FriendsTab';
import profileService from '../../services/profileService';

const ClientProfile = () => {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('about');
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    profession: "",
    location: "",
    phone: "",
    website: "",
    coverImage: "",
    profileImage: "",
    followers: 0,
    following: 0,
    posts: 0,
    rating: 0,
    completedJobs: 0,
    bio: "",
    skills: [],
    experience: [],
    portfolio: []
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await profileService.getCurrentUserProfile();
        
        if (response.success) {
          const { user, profile } = response.data;
          
          // Map backend data to frontend structure
          const mappedData = {
            name: `${user.firstName} ${user.lastName}`,
            profession: profile?.preferences?.jobTypes?.join(', ') || "Professional",
            location: user.address ? `${user.address.city}, ${user.address.country}` : "",
            phone: user.phone || "",
            website: profile?.socialLinks?.website || "",
            coverImage: profile?.coverImage || "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800&h=300&fit=crop",
            profileImage: user.profilePicture || "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
            followers: 0, // Not implemented yet
            following: 0, // Not implemented yet
            posts: 0, // Not implemented yet
            rating: profile?.ratings?.average || 0,
            completedJobs: profile?.completedJobs || 0,
            bio: profile?.bio || "",
            skills: profile?.skills?.map(skill => skill.name) || [],
            experience: profile?.experience?.map(exp => ({
              title: exp.title,
              company: exp.company || "",
              duration: exp.isCurrent ? 
                `${new Date(exp.startDate).getFullYear()} - Present` : 
                `${new Date(exp.startDate).getFullYear()} - ${new Date(exp.endDate).getFullYear()}`,
              description: exp.description || ""
            })) || [],
            portfolio: profile?.portfolio?.map(item => item.images?.[0] || "").filter(img => img) || []
          };
          
          setProfileData(mappedData);
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

  const handleCoverPhotoUpdate = (newCoverImage) => {
    setProfileData({...profileData, coverImage: newCoverImage});
  };

  const handleProfilePhotoUpdate = (newProfileImage) => {
    setProfileData({...profileData, profileImage: newProfileImage});
  };

  const handleFriendConnect = (friendId) => {
    console.log(`Connected with friend ID: ${friendId}`);
    // You can add additional logic here like API calls
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
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
      );
    }

    switch(activeTab) {
      case 'about':
        return <ProfileAbout profileData={profileData} isDarkMode={isDarkMode} />;
      case 'photos':
        return <ProfilePhotos photos={profileData.portfolio} isDarkMode={isDarkMode} />;
      case 'timeline':
        return <ProfileTimeline isDarkMode={isDarkMode} />;
      case 'friends':
        return <ProfileFriends isDarkMode={isDarkMode} onConnect={handleFriendConnect} />;
      default:
        return <ProfileAbout profileData={profileData} isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
        <ProfileHeader 
          profileData={profileData}
          onCoverPhotoUpdate={handleCoverPhotoUpdate}
          onProfilePhotoUpdate={handleProfilePhotoUpdate}
          isDarkMode={isDarkMode}
        />
        
        <NavigationTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isFollowing={isFollowing}
          setIsFollowing={setIsFollowing}
          isDarkMode={isDarkMode}
        />
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;