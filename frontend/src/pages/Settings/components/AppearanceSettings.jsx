import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../../../contexts/DarkModeContext';
import SettingSection from './SettingSection';

const AppearanceSettings = ({ expandedSections, onToggleSection, onShowMessage }) => {
  const { isDarkMode, themeMode, setThemeMode } = useDarkMode();
  const [language, setLanguage] = useState('english');

  return (
    <SettingSection
      id="appearance"
      title="Appearance"
      description="Customize how Workie.LK looks and feels"
      icon={isDarkMode ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
      iconBg="bg-blue-500"
      isExpanded={expandedSections.appearance}
      onToggle={onToggleSection}
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
      </div>
    </SettingSection>
  );
};

export default AppearanceSettings;
