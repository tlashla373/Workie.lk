import React, { useState, useCallback } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useAuth } from '../hooks/useAuth';
import AuthChecker from '../components/ProtectionPage/AuthChecker';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import {
  AccountInformation,
  BankAccountInformation,
  AppearanceSettings,
  NotificationSettings,
  PrivacySettings,
  SupportSettings
} from './Settings/components';

const Settings = () => {
  const { isDarkMode } = useDarkMode();
  const { user, authenticated } = useAuth();

  if (!authenticated) {
    return <AuthChecker />;
  }

  const [message, setMessage] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    account: false,
    bankAccount: false,
    appearance: false,
    notifications: false,
    privacy: false,
    support: false
  });

  const showMessage = useCallback((text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // Debug logging to check user object
  console.log('User object:', user);
  console.log('User type:', user?.userType);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                S
              </span>
            </div>
            <div>
              <h1 className={`text-xl sm:text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Settings
              </h1>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Manage your account preferences and privacy settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-4 sm:space-y-2">
          
          <AccountInformation
            user={user}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            onShowMessage={showMessage}
          />

          {user?.userType === 'worker' && (
            <BankAccountInformation
              user={user}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              onShowMessage={showMessage}
            />
          )}

          <AppearanceSettings
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            onShowMessage={showMessage}
          />

          <NotificationSettings
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            onShowMessage={showMessage}
          />

          <PrivacySettings
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            onShowMessage={showMessage}
          />

          <SupportSettings
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            onShowMessage={showMessage}
          />

        </div>
      </div>

      {message && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg ${
            message.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          } animate-in slide-in-from-right duration-300`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              className="ml-2 hover:bg-black hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
