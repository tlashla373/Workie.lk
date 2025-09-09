import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const { userId } = useParams(); // Get userId from URL params
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isOwnProfile, setIsOwnProfile] = useState(false); // Track if viewing own profile
  const [currentUserId, setCurrentUserId] = useState(null); // Current logged-in user ID
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  // Get current user ID and determine if viewing own profile
  useEffect(() => {
    const getCurrentUser = () => {
      try {
        const userData = localStorage.getItem('auth_user');
        if (userData) {
          const user = JSON.parse(userData);
          const loggedInUserId = user.id || user._id;
          setCurrentUserId(loggedInUserId);
          
          // If no userId in URL params, viewing own profile
          if (!userId) {
            setIsOwnProfile(true);
          } else {
            // If userId in URL matches current user, viewing own profile
            setIsOwnProfile(userId === loggedInUserId);
          }
        }
      } catch (error) {
        console.error('Error getting current user:', error);
        setIsOwnProfile(false);
      }
    };

    getCurrentUser();
  }, [userId]);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors
        
        console.log('ClientProfile: Starting profile fetch...');
        console.log('ClientProfile: Auth token exists:', !!localStorage.getItem('auth_token'));
        console.log('ClientProfile: User data exists:', !!localStorage.getItem('auth_user'));
        console.log('ClientProfile: Is own profile:', isOwnProfile);
        console.log('ClientProfile: Target userId:', userId);
        
        let response;
        
        // Fetch own profile or another user's profile
        if (isOwnProfile || !userId) {
          response = await profileService.getCurrentUserProfile();
        } else {
          response = await profileService.getUserProfile(userId);
        }
        
        console.log('ClientProfile: Profile service response:', response);
        
        if (response.success) {
          // Handle different response structures from different endpoints
          let user, profile;
          
          if (isOwnProfile || !userId) {
            // getCurrentUserProfile response structure from /auth/me
            user = response.data.user;
            profile = response.data.profile;
          } else {
            // getUserProfile response structure from /profiles/:userId
            if (response.data.user && response.data.profile) {
              // New structure after backend update
              user = response.data.user;
              profile = response.data.profile;
            } else {
              // Legacy structure where response.data is the profile with populated user
              profile = response.data;
              user = profile.user;
            }
          }
          
          console.log('Client Profile - User data:', user);
          console.log('Client Profile - Profile data:', profile);
          
          // Validate that user data exists
          if (!user) {
            throw new Error('User data not found');
          }
          
          // Map backend data to frontend structure (Client-specific)
          const mappedData = {
            // Basic user information
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
            profession: user.userType === 'client' ? 'Client' : (profile?.preferences?.jobTypes?.join(', ') || profile?.skills?.map(skill => skill.name)?.join(', ') || "Professional"),
            location: user.address ? `${user.address.city || ''}, ${user.address.country || ''}`.replace(', ,', ',').trim().replace(/^,|,$/g, '') : "",
            phone: user.phone || "",
            email: user.email || "",
            website: profile?.socialLinks?.website || "",
            
            // Images
            coverImage: user.coverPhoto || "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800&h=300&fit=crop",
            profileImage: user.profilePicture || "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
            
            // Stats
            followers: 0, // Not implemented yet
            following: 0, // Not implemented yet
            posts: 0, // Not implemented yet
            rating: profile?.ratings?.average || 0,
            completedJobs: user.userType === 'client' ? (profile?.completedJobs || 0) : 0, // For clients, this could be "Posted Jobs"
            
            // Profile details
            bio: profile?.bio || "",
            skills: profile?.skills?.map(skill => skill.name || skill) || [],
            experience: profile?.experience?.map(exp => ({
              title: exp.title,
              company: exp.company || "",
              duration: exp.isCurrent ? 
                `${new Date(exp.startDate).getFullYear()} - Present` : 
                `${new Date(exp.startDate).getFullYear()} - ${new Date(exp.endDate).getFullYear()}`,
              description: exp.description || ""
            })) || [],
            portfolio: profile?.portfolio?.map(item => {
              // Handle both new media format and legacy images format
              if (item.media && item.media.length > 0) {
                return item.media[0].url;
              }
              return item.images?.[0] || "";
            }).filter(img => img) || [],
            
            // Include raw user and profile data for components that need it
            user: user,
            profile: profile,
            
            // Additional metadata
            userType: user.userType,
            isVerified: user.isVerified || false,
            joinDate: user.createdAt,
            availability: profile?.availability?.status || 'available'
          };
          
          console.log('Client Profile - Mapped data:', mappedData);
          setProfileData(mappedData);
        } else {
          console.log('ClientProfile: Response not successful:', response);
          throw new Error(response.message || 'Failed to fetch profile data');
        }
      } catch (error) {
        console.error('ClientProfile: Error fetching profile data:', error);
        console.error('ClientProfile: Error name:', error.name);
        console.error('ClientProfile: Error message:', error.message);
        console.error('ClientProfile: Full error:', error);
        
        // Show specific error message
        const errorMessage = error.message === 'User data not found' 
          ? 'Profile data is incomplete. Please check your profile settings.'
          : error.message?.includes('401') || error.message?.includes('authentication') || error.message?.includes('Invalid token') || error.message?.includes('Token expired')
          ? 'Authentication failed. Please log in again.'
          : error.message?.includes('Network') || error.message?.includes('fetch')
          ? 'Network error. Please check your connection.'
          : `Failed to load profile data: ${error.message || 'Please try again.'}`;
          
        setError(errorMessage);
        
        // Auto-redirect to login if authentication failed
        if (error.message?.includes('401') || error.message?.includes('Invalid token') || error.message?.includes('Token expired') || error.message?.includes('authentication')) {
          console.log('ClientProfile: Redirecting to login due to auth error');
          // Clear invalid tokens
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
        
        // Don't set mock data anymore - let user know there's an issue
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, isOwnProfile, currentUserId]); // Re-fetch when userId or profile ownership changes

  // Retry function
  const retryFetchProfile = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setError(null);
      setLoading(true);
      
      setTimeout(async () => {
        try {
          let response;
          if (isOwnProfile || !userId) {
            response = await profileService.getCurrentUserProfile();
          } else {
            response = await profileService.getUserProfile(userId);
          }
          
          if (response.success) {
            // Handle different response structures from different endpoints
            let user, profile;
            
            if (isOwnProfile || !userId) {
              // getCurrentUserProfile response structure from /auth/me
              user = response.data.user;
              profile = response.data.profile;
            } else {
              // getUserProfile response structure from /profiles/:userId
              if (response.data.user && response.data.profile) {
                // New structure after backend update
                user = response.data.user;
                profile = response.data.profile;
              } else {
                // Legacy structure where response.data is the profile with populated user
                profile = response.data;
                user = profile.user;
              }
            }
            
            if (!user) throw new Error('User data not found');
            
            const mappedData = {
              // Basic user information
              name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
              profession: user.userType === 'client' ? 'Client' : (profile?.preferences?.jobTypes?.join(', ') || profile?.skills?.map(skill => skill.name)?.join(', ') || "Professional"),
              location: user.address ? `${user.address.city || ''}, ${user.address.country || ''}`.replace(', ,', ',').trim().replace(/^,|,$/g, '') : "",
              phone: user.phone || "",
              email: user.email || "",
              website: profile?.socialLinks?.website || "",
              
              // Images
              coverImage: user.coverPhoto || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEBNC5QQQqyu8DeKNhuhTzHJhEPOflFO5XUQ&s",
              profileImage: user.profilePicture || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
              
              // Stats
              followers: 0,
              following: 0,
              posts: 0,
              rating: profile?.ratings?.average || 0,
              completedJobs: user.userType === 'client' ? (profile?.completedJobs || 0) : 0,
              
              // Profile details
              bio: profile?.bio || "",
              skills: profile?.skills?.map(skill => skill.name || skill) || [],
              experience: profile?.experience?.map(exp => ({
                title: exp.title,
                company: exp.company || "",
                duration: exp.isCurrent ? 
                  `${new Date(exp.startDate).getFullYear()} - Present` : 
                  `${new Date(exp.startDate).getFullYear()} - ${new Date(exp.endDate).getFullYear()}`,
                description: exp.description || ""
              })) || [],
              portfolio: profile?.portfolio?.map(item => item.images?.[0] || "").filter(img => img) || [],
              
              // Include raw user and profile data for components that need it
              user: user,
              profile: profile,
              
              // Additional metadata
              userType: user.userType,
              isVerified: user.isVerified || false,
              joinDate: user.createdAt,
              availability: profile?.availability?.status || 'available'
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
    // Only allow editing own profile
    if (!isOwnProfile) {
      console.log('Cannot edit other user\'s profile');
      return;
    }

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
    // Only allow editing own profile
    if (!isOwnProfile) {
      console.log('Cannot edit other user\'s profile');
      return;
    }

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

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
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
        return (
          <ProfileAbout 
            profileData={profileData} 
            isDarkMode={isDarkMode} 
            isOwnProfile={isOwnProfile}
            isEditModalOpen={isEditModalOpen}
            setIsEditModalOpen={setIsEditModalOpen}
          />
        );
      case 'photos':
        return <ProfilePhotos photos={profileData.portfolio} isDarkMode={isDarkMode} isOwnProfile={isOwnProfile} />;
      case 'timeline':
        return <ProfileTimeline isDarkMode={isDarkMode} isOwnProfile={isOwnProfile} />;
      case 'friends':
        return <ProfileFriends isDarkMode={isDarkMode} onConnect={handleFriendConnect} isOwnProfile={isOwnProfile} />;
      default:
        return (
          <ProfileAbout 
            profileData={profileData} 
            isDarkMode={isDarkMode} 
            isOwnProfile={isOwnProfile}
            isEditModalOpen={isEditModalOpen}
            setIsEditModalOpen={setIsEditModalOpen}
          />
        );
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
          isOwnProfile={isOwnProfile}
        />
        
        <NavigationTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isFollowing={isFollowing}
          setIsFollowing={setIsFollowing}
          isDarkMode={isDarkMode}
          isOwnProfile={isOwnProfile}
          onEditProfile={handleEditProfile}
        />
        
        <div className="p-4 sm:p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;