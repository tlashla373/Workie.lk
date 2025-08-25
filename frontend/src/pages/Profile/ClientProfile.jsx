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
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
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
        setError(null); // Clear any previous errors
        
        const response = await profileService.getCurrentUserProfile();
        
        if (response.success) {
          const { user, profile } = response.data;
          
          // Validate that user data exists
          if (!user) {
            throw new Error('User data not found');
          }
          
          // Map backend data to frontend structure
          const mappedData = {
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
            profession: profile?.preferences?.jobTypes?.join(', ') || "Professional",
            location: user.address ? `${user.address.city}, ${user.address.country}` : "",
            phone: user.phone || "",
            website: profile?.socialLinks?.website || "",
            coverImage: user.coverPhoto || "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800&h=300&fit=crop",
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
        } else {
          throw new Error(response.message || 'Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        
        // Show specific error message
        const errorMessage = error.message === 'User data not found' 
          ? 'Profile data is incomplete. Please check your profile settings.'
          : error.message?.includes('401') || error.message?.includes('authentication')
          ? 'Authentication failed. Please log in again.'
          : error.message?.includes('Network')
          ? 'Network error. Please check your connection.'
          : 'Failed to load profile data. Please try again.';
          
        setError(errorMessage);
        
        // Don't set mock data anymore - let user know there's an issue
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Retry function
  const retryFetchProfile = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setError(null);
      setLoading(true);
      
      setTimeout(async () => {
        try {
          const response = await profileService.getCurrentUserProfile();
          if (response.success) {
            const { user, profile } = response.data;
            if (!user) throw new Error('User data not found');
            
            const mappedData = {
              name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
              profession: profile?.preferences?.jobTypes?.join(', ') || "Professional",
              location: user.address ? `${user.address.city}, ${user.address.country}` : "",
              phone: user.phone || "",
              website: profile?.socialLinks?.website || "",
              coverImage: user.coverPhoto || "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800&h=300&fit=crop",
              profileImage: user.profilePicture || "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
              followers: 0,
              following: 0,
              posts: 0,
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
            setRetryCount(0); // Reset retry count on success
          }
        } catch (error) {
          console.error(`Retry ${retryCount + 1} failed:`, error);
          const errorMessage = error.message === 'User data not found' 
            ? 'Profile data is incomplete. Please check your profile settings.'
            : error.message?.includes('401') || error.message?.includes('authentication')
            ? 'Authentication failed. Please log in again.'
            : error.message?.includes('Network')
            ? 'Network error. Please check your connection.'
            : `Failed to load profile data. Attempt ${retryCount + 1} of ${maxRetries}.`;
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      }, 1000 * (retryCount + 1)); // Exponential backoff
    }
  };

  const handleCoverPhotoUpdate = async (newCoverImage) => {
    setProfileData({...profileData, coverImage: newCoverImage});
    
    // Optionally refetch the complete profile data to ensure consistency
    try {
      const response = await profileService.getCurrentUserProfile();
      if (response.success) {
        const { user, profile } = response.data;
        const mappedData = {
          ...profileData,
          coverImage: user.coverPhoto || newCoverImage,
          profileImage: user.profilePicture || profileData.profileImage
        };
        setProfileData(mappedData);
      }
    } catch (error) {
      console.error('Error refreshing profile data:', error);
    }
  };

  const handleProfilePhotoUpdate = async (newProfileImage) => {
    setProfileData({...profileData, profileImage: newProfileImage});
    
    // Optionally refetch the complete profile data to ensure consistency
    try {
      const response = await profileService.getCurrentUserProfile();
      if (response.success) {
        const { user, profile } = response.data;
        const mappedData = {
          ...profileData,
          profileImage: user.profilePicture || newProfileImage,
          coverImage: user.coverPhoto || profileData.coverImage
        };
        setProfileData(mappedData);
      }
    } catch (error) {
      console.error('Error refreshing profile data:', error);
    }
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
            {retryCount < maxRetries ? (
              <button 
                onClick={retryFetchProfile}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
              >
                Retry ({retryCount + 1}/{maxRetries})
              </button>
            ) : (
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
              >
                Reload Page
              </button>
            )}
            <button 
              onClick={() => setError(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Dismiss
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
        
        <div className="p-4 sm:p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;