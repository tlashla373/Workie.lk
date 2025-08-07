import React from 'react';
import { Briefcase, MapPin, Phone, Globe, Star } from 'lucide-react';

const ProfileAbout = ({ profileData, isDarkMode = false }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-1 space-y-6">
        {/* Basic Info */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border transition-colors duration-300`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>About</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Briefcase className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{profileData.profession}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{profileData.location}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{profileData.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <a href={profileData.website} className="text-blue-500 hover:text-blue-600 transition-colors">
                {profileData.website}
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border transition-colors duration-300`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{profileData.rating}</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center justify-center space-x-1`}>
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>Rating</span>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{profileData.completedJobs}</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Jobs Done</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Bio */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border transition-colors duration-300`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Bio</h3>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
            {profileData.bio}
          </p>
        </div>

        {/* Skills */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border transition-colors duration-300`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'}`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border transition-colors duration-300`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Experience</h3>
          <div className="space-y-4">
            {profileData.experience.map((exp, index) => (
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
      </div>
    </div>
  );
};

export default ProfileAbout;
