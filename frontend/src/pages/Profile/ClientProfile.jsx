import React, { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import ProfileHeader from '../../components/ProfileHeader';
import NavigationTabs from '../../components/NavigationTab';
import ProfileAbout from '../../components/AboutTab';
import ProfilePhotos from '../../components/ProfilePhotos';
import ProfileTimeline from '../../components/TimelineTab';
import ProfileFriends from '../../components/FriendsTab';

const ClientProfile = () => {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('about');
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Rachel Rose",
    profession: "Designer at Jeep Renegade",
    location: "London, United Kingdom",
    phone: "+420 755 666 214",
    website: "https://instagram.com/girlheart",
    coverImage: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800&h=300&fit=crop",
    profileImage: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    followers: 1240,
    following: 890,
    posts: 156,
    rating: 4.8,
    completedJobs: 45,
    bio: "Passionate designer with 5+ years of experience in automotive design. Love creating beautiful and functional designs that make a difference.",
    skills: ["UI/UX Design", "Graphic Design", "Branding", "Adobe Creative Suite", "Figma", "Sketch"],
    experience: [
      {
        title: "Senior Designer",
        company: "Jeep Renegade",
        duration: "2022 - Present",
        description: "Leading design projects for automotive interfaces and user experiences."
      },
      {
        title: "UI/UX Designer",
        company: "Design Studio",
        duration: "2020 - 2022",
        description: "Designed mobile and web applications for various clients."
      }
    ],
    portfolio: [
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      "https://images.pexels.com/photos/3184302/pexels-photo-3184302.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      "https://images.pexels.com/photos/4491459/pexels-photo-4491459.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
    ]
  });

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