import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Phone, Globe, Star, Mail } from 'lucide-react';
import profileService from '../services/profileService';

const ProfileAbout = ({ profileData, isDarkMode = false }) => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        
        if (profileData?.user && profileData?.profile) {
          // Use data from props if available
          setAboutData({
            user: profileData.user,
            profile: profileData.profile
          });
        } else {
          // Fallback to API call if not available in props
          const response = await profileService.getCurrentUserProfile();
          if (response.success) {
            setAboutData({
              user: response.data.user,
              profile: response.data.profile
            });
          }
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
        setError('Failed to load profile information');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, [profileData]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="animate-pulse bg-gray-300 h-64 rounded-2xl"></div>
        </div>
        <div className="lg:col-span-2">
          <div className="animate-pulse bg-gray-300 h-64 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !aboutData) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error || 'No profile data available'}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const { user, profile } = aboutData;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Left Column */}
      <div className="lg:col-span-1 space-y-4 sm:space-y-6">
        {/* Basic Info */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border transition-colors duration-300`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>About</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Briefcase className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {profile?.preferences?.jobTypes?.[0] || user?.userType || 'Not specified'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {profile?.location || user?.location || profileData?.location || 'Not specified'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {profile?.phone || user?.phone || profileData?.phone || 'Not specified'}
              </span>
            </div>
            {(profile?.website || user?.website || profileData?.website) && (
              <div className="flex items-center space-x-3">
                <Globe className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <a 
                  href={profile?.website || user?.website || profileData?.website} 
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile?.website || user?.website || profileData?.website}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-4 sm:p-6 border transition-colors duration-300`}>
          <h3 className={`text-base sm:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3 sm:mb-4`}>Statistics</h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {profile?.rating || profileData?.rating || '0.0'}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center justify-center space-x-1`}>
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>Rating</span>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {profile?.completedJobs || profileData?.completedJobs || '0'}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Jobs Done</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-6">
        {/* Bio */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border transition-colors duration-300`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Bio</h3>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
            {profile?.bio || profileData?.bio || 'No bio available'}
          </p>
        </div>

        {/* Skills */}
        {(profile?.skills || profileData?.skills) && (profile?.skills?.length > 0 || profileData?.skills?.length > 0) && (
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border transition-colors duration-300`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(profile?.skills || profileData?.skills || []).map((skill, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'}`}
                >
                  {typeof skill === 'object' ? skill.name : skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {(profile?.experience || profileData?.experience) && (profile?.experience?.length > 0 || profileData?.experience?.length > 0) && (
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border transition-colors duration-300`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Experience</h3>
            <div className="space-y-4">
              {(profile?.experience || profileData?.experience || []).map((exp, index) => (
                <div key={index} className="flex space-x-4">
                  <div className={`w-12 h-12 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{exp.title}</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{exp.company}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{exp.duration}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mt-2`}>{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileAbout;
