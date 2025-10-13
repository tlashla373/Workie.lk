import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useDarkMode } from '../../../contexts/DarkModeContext';
import SettingSection from './SettingSection';

const SupportSettings = ({ expandedSections, onToggleSection, onShowMessage }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <SettingSection
      id="support"
      title="Help & Support"
      description="Get help and contact our support team"
      icon={<HelpCircle className="w-5 h-5 text-white" />}
      iconBg="bg-pink-500"
      isExpanded={expandedSections.support}
      onToggle={onToggleSection}
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
  );
};

export default SupportSettings;
