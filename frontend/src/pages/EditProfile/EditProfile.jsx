import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../contexts/DarkModeContext';
import EditProfileModal from '../../components/UserProfile/EditProfileModal';
import profileService from '../../services/profileService';

const EditProfile = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await profileService.getCurrentUserProfile();
        
        if (response.success) {
          const { user, profile } = response.data;
          
          // Map the data to match what EditProfileModal expects
          const mappedData = {
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
            email: user.email || '',
            phone: user.phone || '',
            bio: profile?.bio || '',
            website: profile?.socialLinks?.website || '',
            location: user.address ? `${user.address.city || ''}, ${user.address.country || ''}`.replace(', ,', ',').trim().replace(/^,|,$/g, '') : '',
            profession: user.userType === 'client' ? 'Client' : (profile?.preferences?.jobTypes?.join(', ') || 'Professional')
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

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  const handleSave = () => {
    // Refresh the data and go back
    navigate(-1);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <p className={`${isDarkMode ? 'text-red-400' : 'text-red-500'} mb-4`}>{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Render the EditProfileModal as if it's always open */}
      <EditProfileModal
        isOpen={true}
        onClose={handleClose}
        profileData={profileData}
        onSave={handleSave}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default EditProfile;
