import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { useDarkMode } from '../../../contexts/DarkModeContext';
import SettingSection from './SettingSection';

const PrivacySettings = ({ expandedSections, onToggleSection, onShowMessage }) => {
  const { isDarkMode } = useDarkMode();
  
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    searchable: true,
    analytics: false
  });

  const handlePrivacyChange = (key, value) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <SettingSection
      id="privacy"
      title="Privacy & Security"
      description="Manage your privacy preferences and security settings"
      icon={<Shield className="w-5 h-5 text-white" />}
      iconBg="bg-purple-500"
      isExpanded={expandedSections.privacy}
      onToggle={onToggleSection}
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
  );
};

export default PrivacySettings;
