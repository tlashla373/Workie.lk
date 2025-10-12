import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useDarkMode } from '../../../contexts/DarkModeContext';
import SettingSection from './SettingSection';

const NotificationSettings = ({ expandedSections, onToggleSection, onShowMessage }) => {
  const { isDarkMode } = useDarkMode();
  
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

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <SettingSection
      id="notifications"
      title="Notifications"
      description="Control what notifications you receive and how"
      icon={<Bell className="w-5 h-5 text-white" />}
      iconBg="bg-green-500"
      isExpanded={expandedSections.notifications}
      onToggle={onToggleSection}
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
  );
};

export default NotificationSettings;
