import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Phone, 
  Globe, 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Plus,
  Users,
  Briefcase,
  Star,
  Edit,
  Settings as SettingsIcon
} from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const ClientProfile = () => {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('about');
  const [isFollowing, setIsFollowing] = useState(false);

  const profileData = {
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
  };

  const tabs = [
    { id: 'timeline', label: 'Timeline' },
    { id: 'about', label: 'About' },
    { id: 'friends', label: 'Friends', count: 340 },
    { id: 'photos', label: 'Photos' }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
        {/* Cover Photo */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={profileData.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {/* Cover Actions */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="p-2 bg-black/20 backdrop-blur-sm rounded-lg text-white hover:bg-black/30 transition-colors">
              <Camera className="w-5 h-5" />
            </button>
            <button className="px-4 py-2 bg-black/20 backdrop-blur-sm rounded-lg text-white hover:bg-black/30 transition-colors flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Edit Cover</span>
            </button>
          </div>

          {/* Profile Info Overlay */}
          <div className="absolute bottom-6 left-6 flex items-end space-x-4">
            <div className="relative">
              <img
                src={profileData.profileImage}
                alt={profileData.name}
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              <button className="absolute bottom-2 right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="text-white mb-4">
              <h1 className="text-3xl font-bold">{profileData.name}</h1>
              <p className="text-lg opacity-90">{profileData.profession}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm opacity-80">
                <span>{profileData.followers} followers</span>
                <span>{profileData.following} following</span>
                <span>{profileData.posts} posts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10 transition-colors duration-300`}>
          <div className="px-6">
            <div className="flex items-center justify-between">
              <div className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : isDarkMode
                        ? 'border-transparent text-gray-400 hover:text-gray-300'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                    {tab.count && (
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isFollowing
                      ? isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                {/*<button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}>
                  <MessageCircle className="w-5 h-5" />
                </button>*/}
                <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}>
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'about' && (
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
                  <button className={`w-full mt-4 py-2 px-4 border border-dashed ${isDarkMode ? 'border-gray-600 text-gray-400 hover:border-gray-500' : 'border-gray-300 text-gray-600 hover:border-gray-400'} rounded-lg transition-colors flex items-center justify-center space-x-2`}>
                    <Plus className="w-4 h-4" />
                    <span>Add a school</span>
                  </button>
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
          )}

          {activeTab === 'photos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profileData.portfolio.map((photo, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg aspect-square">
                  <img
                    src={photo}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                        <Share className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Timeline Coming Soon</p>
              <p>Posts and activities will appear here</p>
            </div>
          )}

          {activeTab === 'friends' && (
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Friends List</p>
              <p>Connect with other professionals</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;