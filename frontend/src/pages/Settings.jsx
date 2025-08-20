import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Bell,
  Shield,
  User,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Globe,
  CreditCard,
  HelpCircle,
} from 'lucide-react';

// Assuming you have a DarkModeContext defined and a useDarkMode hook
import { useDarkMode } from '../contexts/DarkModeContext'; 

const Settings = () => {
  const { isDarkMode, themeMode, setThemeMode } = useDarkMode();

  const [expandedSections, setExpandedSections] = useState({
    appearance: false,
    notifications: false,
    privacy: false,
    account: false,
    billing: false,
    support: false
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    jobAlerts: true,
    messages: true,
    newsletters: false,
    promotions: true,
    security: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    searchable: true,
    analytics: false
  });

  const [language, setLanguage] = useState('english');
  const [showPassword, setShowPassword] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const SettingSection = ({ id, title, description, icon, iconBg, children, isExpanded }) => (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300 overflow-hidden`}>
      <button
        onClick={() => toggleSection(id)}
        className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-opacity-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            {icon}
          </div>
          <div className="text-left min-w-0 flex-1">
            <h2 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>{title}</h2>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2 sm:line-clamp-1`}>{description}</p>
          </div>
        </div>
        <div className={`transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </div>
      </button>

      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-4 sm:pt-6`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Settings</h1>
          <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your account preferences and privacy settings
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4">
          {/* Appearance */}
          <SettingSection
            id="appearance"
            title="Appearance"
            description="Customize how Workie.LK looks and feels"
            icon={isDarkMode ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
            iconBg="bg-blue-500"
            isExpanded={expandedSections.appearance}
          >
            <div className="space-y-4 sm:space-y-6">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3 sm:mb-4`}>
                  Adjust the appearance of Workie.LK to reduce glare and give your eyes a break.
                </p>
                <p className="text-xs text-gray-500 mb-3 sm:mb-4">
                  Current mode: {themeMode === 'system' ? 'Automatic' : themeMode === 'dark' ? 'Dark' : 'Light'}
                </p>

                <div className="space-y-2 sm:space-y-3">
                  {['light', 'dark', 'system'].map(mode => (
                    <div
                      key={mode}
                      onClick={() => setThemeMode(mode)}
                      className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        themeMode === mode
                          ? isDarkMode
                            ? 'border-blue-500 bg-blue-900/20'
                            : 'border-blue-500 bg-blue-50'
                          : isDarkMode
                            ? 'border-gray-600 hover:border-gray-500'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <h4 className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {mode === 'light' ? 'Light' : mode === 'dark' ? 'Dark' : 'Automatic'}
                          </h4>
                          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                            {mode === 'light'
                              ? 'Use light mode'
                              : mode === 'dark'
                                ? 'Use dark mode'
                                : "We'll adjust based on your system settings"}
                          </p>
                        </div>
                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 ${
                          themeMode === mode ? 'border-blue-500 bg-blue-500' : isDarkMode ? 'border-gray-500' : 'border-gray-300'
                        }`}>
                          {themeMode === mode && (
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div>
                  <h3 className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Language</h3>
                  <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Choose your preferred language</p>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`w-full sm:w-auto px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                >
                  <option value="english">English</option>
                  <option value="sinhala">සිංහල</option>
                  <option value="tamil">தமிழ்</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div>
                  <h3 className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Font Size</h3>
                  <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Adjust text size for better readability</p>
                </div>
                <select
                  className={`w-full sm:w-auto px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </SettingSection>

          {/* Notifications */}
          <SettingSection
            id="notifications"
            title="Notifications"
            description="Control what notifications you receive and how"
            icon={<Bell className="w-5 h-5 text-white" />}
            iconBg="bg-green-500"
            isExpanded={expandedSections.notifications}
          >
            <div className="space-y-3 sm:space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-medium capitalize text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {key === 'jobAlerts' ? 'Job Alerts' :
                        key === 'sms' ? 'SMS' :
                        key === 'newsletters' ? 'Newsletters' :
                        key === 'promotions' ? 'Promotions' :
                        key === 'security' ? 'Security Alerts' : key}
                    </h3>
                    <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                      {key === 'email' && 'Receive notifications via email'}
                      {key === 'push' && 'Browser push notifications'}
                      {key === 'sms' && 'Text message notifications'}
                      {key === 'jobAlerts' && 'New job opportunities matching your profile'}
                      {key === 'messages' && 'Direct messages from employers'}
                      {key === 'newsletters' && 'Weekly job market updates'}
                      {key === 'promotions' && 'Special offers and premium features'}
                      {key === 'security' && 'Login attempts and security updates'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange(key)}
                    className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0 ${value ? 'bg-blue-500' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </SettingSection>

          {/* Privacy & Security */}
          <SettingSection
            id="privacy"
            title="Privacy & Security"
            description="Manage your privacy preferences and security settings"
            icon={<Shield className="w-5 h-5 text-white" />}
            iconBg="bg-purple-500"
            isExpanded={expandedSections.privacy}
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div>
                  <h3 className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Profile Visibility</h3>
                  <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Who can see your profile</p>
                </div>
                <select
                  value={privacy.profileVisibility}
                  onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  className={`w-full sm:w-auto px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                >
                  <option value="public">Public</option>
                  <option value="registered">Registered Users</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div>
                  <h3 className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Show Email</h3>
                  <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Display email on your profile</p>
                </div>
                <button
                  onClick={() => handlePrivacyChange('showEmail', !privacy.showEmail)}
                  className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0 ${privacy.showEmail ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <span
                    className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${privacy.showEmail ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div>
                  <h3 className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Allow Messages</h3>
                  <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Let employers contact you directly</p>
                </div>
                <button
                  onClick={() => handlePrivacyChange('allowMessages', !privacy.allowMessages)}
                  className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0 ${privacy.allowMessages ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <span
                    className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${privacy.allowMessages ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div>
                  <h3 className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Searchable Profile</h3>
                  <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Allow your profile to appear in search results</p>
                </div>
                <button
                  onClick={() => handlePrivacyChange('searchable', !privacy.searchable)}
                  className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0 ${privacy.searchable ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <span
                    className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${privacy.searchable ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div>
                  <h3 className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Analytics</h3>
                  <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Help improve our service with usage data</p>
                </div>
                <button
                  onClick={() => handlePrivacyChange('analytics', !privacy.analytics)}
                  className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0 ${privacy.analytics ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <span
                    className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${privacy.analytics ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
            </div>
          </SettingSection>

          {/* Account Information */}
          <SettingSection
            id="account"
            title="Account Information"
            description="Update your personal information and credentials"
            icon={<User className="w-5 h-5 text-white" />}
            iconBg="bg-orange-500"
            isExpanded={expandedSections.account}
          >
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className={`block text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Supun"
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                  />
                </div>
                <div>
                  <label className={`block text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Perera"
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className={`block text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="supun@example.com"
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                  />
                </div>
                <div>
                  <label className={`block text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue="+94 77 123 4567"
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Location
                </label>
                <input
                  type="text"
                  defaultValue="Colombo, Sri Lanka"
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                />
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Change Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    className={`w-full px-3 py-2 pr-10 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-2 sm:pt-4">
                <button className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} rounded-lg transition-colors text-sm`}>
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </SettingSection>

          {/* Billing & Subscription */}
          <SettingSection
            id="billing"
            title="Billing & Subscription"
            description="Manage your subscription and payment methods"
            icon={<CreditCard className="w-5 h-5 text-white" />}
            iconBg="bg-indigo-500"
            isExpanded={expandedSections.billing}
          >
            <div className="space-y-4 sm:space-y-6">
              <div className={`p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} border ${isDarkMode ? 'border-gray-600' : 'border-blue-200'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div>
                    <h3 className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Current Plan</h3>
                    <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Free Plan - Basic job search features</p>
                  </div>
                  <button className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                    Upgrade
                  </button>
                </div>
              </div>

              <div>
                <h3 className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3 sm:mb-4`}>Payment Methods</h3>
                <button className={`w-full p-3 sm:p-4 border-2 border-dashed ${isDarkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'} rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors text-sm`}>
                  + Add Payment Method
                </button>
              </div>

              <div>
                <h3 className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3 sm:mb-4`}>Billing History</h3>
                <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No billing history available</p>
              </div>
            </div>
          </SettingSection>

          {/* Help & Support */}
          <SettingSection
            id="support"
            title="Help & Support"
            description="Get help and contact our support team"
            icon={<HelpCircle className="w-5 h-5 text-white" />}
            iconBg="bg-pink-500"
            isExpanded={expandedSections.support}
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button className={`p-3 sm:p-4 text-left rounded-lg border ${isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'} transition-colors`}>
                  <h3 className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>FAQ</h3>
                  <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Find answers to common questions</p>
                </button>
                
                <button className={`p-3 sm:p-4 text-left rounded-lg border ${isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'} transition-colors`}>
                  <h3 className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Contact Us</h3>
                  <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Get in touch with our support team</p>
                </button>
              </div>

              <div className={`p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>App Version</h3>
                <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Workie.LK v2.1.0</p>
              </div>

              <button className="w-full p-2 sm:p-3 text-red-500 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm">
                Delete Account
              </button>
            </div>
          </SettingSection>
        </div>
      </div>
    </div>
  );
};

export default Settings;