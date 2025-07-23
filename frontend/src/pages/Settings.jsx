import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Globe, 
  CreditCard, 
  Download, 
  Trash2, 
  Save,
  Eye,
  EyeOff,
  Camera
} from 'lucide-react';
import profileImage from '../../assets/profile.jpeg';

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Supun',
    lastName: 'Hashintha',
    email: 'supun@example.com',
    phone: '+94 77 123 4567',
    bio: 'Full-stack developer with 5+ years of experience in web development.',
    location: 'Colombo, Sri Lanka',
    website: 'https://supun.dev',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    jobAlerts: true,
    messageNotifications: true,
    marketingEmails: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: isDarkMode ? Moon : Sun },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'data', label: 'Data & Storage', icon: Download }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
      
      {/* Profile Picture */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-600"
          />
          <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors duration-200">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Profile Picture</h3>
          <p className="text-gray-400 text-sm">Upload a new profile picture</p>
          <div className="flex space-x-3 mt-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Upload New
            </button>
            <button className="px-4 py-2 bg-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200">
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 resize-none"
        />
      </div>

      <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
        <Save className="w-5 h-5" />
        <span>Save Changes</span>
      </button>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Notification Settings</h2>
      
      <div className="space-y-4">
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
            <div>
              <h3 className="text-white font-medium">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </h3>
              <p className="text-gray-400 text-sm">
                {key === 'emailNotifications' && 'Receive notifications via email'}
                {key === 'pushNotifications' && 'Receive push notifications on your device'}
                {key === 'jobAlerts' && 'Get notified about new job opportunities'}
                {key === 'messageNotifications' && 'Receive notifications for new messages'}
                {key === 'marketingEmails' && 'Receive promotional emails and updates'}
              </p>
            </div>
            <button
              onClick={() => handleNotificationChange(key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                value ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Privacy & Security</h2>
      
      {/* Password Change */}
      <div className="bg-gray-700/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 pr-12 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            />
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200">
            Update Password
          </button>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
          <div>
            <h3 className="text-white font-medium">Profile Visibility</h3>
            <p className="text-gray-400 text-sm">Control who can see your profile</p>
          </div>
          <select
            value={privacy.profileVisibility}
            onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
            className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="contacts">Contacts Only</option>
          </select>
        </div>

        {['showEmail', 'showPhone', 'allowMessages'].map(key => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
            <div>
              <h3 className="text-white font-medium">
                {key === 'showEmail' && 'Show Email Address'}
                {key === 'showPhone' && 'Show Phone Number'}
                {key === 'allowMessages' && 'Allow Direct Messages'}
              </h3>
              <p className="text-gray-400 text-sm">
                {key === 'showEmail' && 'Display your email on your public profile'}
                {key === 'showPhone' && 'Display your phone number on your public profile'}
                {key === 'allowMessages' && 'Allow other users to send you direct messages'}
              </p>
            </div>
            <button
              onClick={() => handlePrivacyChange(key, !privacy[key])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                privacy[key] ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  privacy[key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Appearance Settings</h2>
      
      <div className="bg-gray-700/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gray-600/50 rounded-xl">
              {isDarkMode ? <Moon className="w-6 h-6 text-blue-400" /> : <Sun className="w-6 h-6 text-yellow-400" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Theme</h3>
              <p className="text-gray-400">Choose between light and dark mode</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200 ${
              isDarkMode ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
                isDarkMode ? 'translate-x-9' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
            isDarkMode ? 'border-blue-500 bg-gray-800' : 'border-gray-600 bg-gray-700/30'
          }`}>
            <div className="w-full h-20 bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
              <Moon className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-white font-medium text-center">Dark Mode</h4>
          </div>
          
          <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
            !isDarkMode ? 'border-blue-500 bg-white' : 'border-gray-600 bg-gray-700/30'
          }`}>
            <div className="w-full h-20 bg-white rounded-lg mb-3 flex items-center justify-center border border-gray-300">
              <Sun className="w-6 h-6 text-yellow-500" />
            </div>
            <h4 className={`font-medium text-center ${!isDarkMode ? 'text-gray-800' : 'text-white'}`}>Light Mode</h4>
          </div>
        </div>
      </div>

      <div className="bg-gray-700/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Language & Region</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
            <select className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Sinhala</option>
              <option>Tamil</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Time Zone</label>
            <select className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50">
              <option>Asia/Colombo (GMT+5:30)</option>
              <option>UTC (GMT+0:00)</option>
              <option>America/New_York (GMT-5:00)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Billing & Subscription</h2>
      
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">Pro Plan</h3>
            <p className="text-gray-300">Access to premium features</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">$29/month</div>
            <div className="text-sm text-gray-400">Billed monthly</div>
          </div>
        </div>
        <div className="mt-4 flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Manage Subscription
          </button>
          <button className="px-4 py-2 bg-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200">
            View Invoices
          </button>
        </div>
      </div>

      <div className="bg-gray-700/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Methods</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-600/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">•••• •••• •••• 4242</div>
                <div className="text-gray-400 text-sm">Expires 12/25</div>
              </div>
            </div>
            <button className="text-red-400 hover:text-red-300">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200">
          Add Payment Method
        </button>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Data & Storage</h2>
      
      <div className="bg-gray-700/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Export Your Data</h3>
        <p className="text-gray-400 mb-4">Download a copy of your data including profile information, work history, and messages.</p>
        <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200">
          <Download className="w-5 h-5" />
          <span>Export Data</span>
        </button>
      </div>

      <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
        <p className="text-gray-400 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
        <button className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200">
          <Trash2 className="w-5 h-5" />
          <span>Delete Account</span>
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'appearance':
        return renderAppearanceTab();
      case 'billing':
        return renderBillingTab();
      case 'data':
        return renderDataTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <div className="lg:w-64 bg-gray-700/30 rounded-xl p-4">
        <nav className="space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/30'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Settings;