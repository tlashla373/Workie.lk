import React, { useState, useEffect } from 'react';
import { User, Save, RefreshCw } from 'lucide-react';
import { useDarkMode } from '../../../contexts/DarkModeContext';
import { useAuth } from '../../../hooks/useAuth';
import { ProfileService } from '../../../services/profileService';
import SettingSection from './SettingSection';

const AccountInformation = ({ user, expandedSections, onToggleSection, onShowMessage }) => {
  const { isDarkMode } = useDarkMode();
  const { user: authUser, refreshUser } = useAuth();
  const profileService = new ProfileService();

  // Use the passed user prop or fallback to authUser
  const currentUser = user || authUser;

  const [userSettings, setUserSettings] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    language: 'english',
    fontSize: 'medium'
  });

  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [saving, setSaving] = useState(false);

  // Update user settings when user data changes
  useEffect(() => {
    if (currentUser) {
      setUserSettings(prev => ({
        ...prev,
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        language: currentUser.language || 'english',
        fontSize: currentUser.fontSize || 'medium'
      }));
    }
  }, [currentUser]);

  const saveUserSettings = async () => {
    setSaving(true);
    try {
      const updateData = {
        firstName: userSettings.firstName,
        lastName: userSettings.lastName,
        phone: userSettings.phone,
      };

      await profileService.updateUser(currentUser._id || currentUser.id, updateData);
      await refreshUser();
      setIsEditingAccount(false);
      onShowMessage('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      onShowMessage('Failed to save settings. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const cancelEditAccount = () => {
    setUserSettings(prev => ({
      ...prev,
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      language: currentUser?.language || 'english',
      fontSize: currentUser?.fontSize || 'medium'
    }));
    setIsEditingAccount(false);
  };

  return (
    <SettingSection
      id="account"
      title="Account Information"
      description="Manage your personal information and account details"
      icon={<User className="w-5 h-5 text-white" />}
      iconBg="bg-orange-500"
      isExpanded={expandedSections.account}
      onToggle={onToggleSection}
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Edit Button Header */}
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Personal Information
          </h3>
          {!isEditingAccount ? (
            <button
              onClick={() => setIsEditingAccount(true)}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center space-x-2`}
            >
              <User className="w-4 h-4" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}>
                Editing Mode
              </span>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={userSettings.firstName || ''}
              onChange={(e) => setUserSettings(prev => ({ ...prev, firstName: e.target.value }))}
              disabled={!isEditingAccount}
              autoComplete="given-name"
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? isEditingAccount
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed'
                  : isEditingAccount
                    ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    : 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors`}
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={userSettings.lastName || ''}
              onChange={(e) => setUserSettings(prev => ({ ...prev, lastName: e.target.value }))}
              disabled={!isEditingAccount}
              autoComplete="family-name"
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? isEditingAccount
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed'
                  : isEditingAccount
                    ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    : 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors`}
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Email Address
          </label>
          <input
            type="email"
            value={userSettings.email}
            readOnly
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-600 border-gray-500 text-gray-400' 
                : 'bg-gray-100 border-gray-300 text-gray-600'
            } text-sm cursor-not-allowed`}
            placeholder="Email cannot be changed"
          />
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Contact support to change your email address
          </p>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={userSettings.phone || ''}
            onChange={(e) => setUserSettings(prev => ({ ...prev, phone: e.target.value }))}
            disabled={!isEditingAccount}
            autoComplete="tel"
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode 
                ? isEditingAccount
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed'
                : isEditingAccount
                  ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  : 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors`}
            placeholder="Enter your phone number"
          />
        </div>

        {/* Action Buttons - Only show when editing */}
        {isEditingAccount && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={saveUserSettings}
              disabled={saving}
              className={`flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center space-x-2`}
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
            <button
              onClick={cancelEditAccount}
              disabled={saving}
              className={`px-4 py-2 border ${
                isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Cancel
            </button>
          </div>
        )}

        <div className={`p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Account Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email Verified</span>
              <span className={`text-xs sm:text-sm ${
                currentUser && (currentUser.isEmailVerified || currentUser.isVerified) 
                  ? 'text-green-500' 
                  : 'text-yellow-500'
              }`}>
                {currentUser && (currentUser.isEmailVerified || currentUser.isVerified) 
                  ? 'Verified' 
                  : 'Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Account Status</span>
              <span className={`text-xs sm:text-sm ${user?.isActive ? 'text-green-500' : 'text-red-500'}`}>
                {user?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Member Since</span>
              <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Email Verification Section */}
        {!(user?.isEmailVerified || user?.isVerified) && (
          <div className={`p-3 sm:p-4 rounded-lg border-l-4 border-yellow-500 ${
            isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <h4 className={`text-sm font-medium ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                  Email Verification Required
                </h4>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>
                  Please verify your email address to access all features and ensure account security.
                </p>
              </div>
              <button
                onClick={() => {
                  // This would typically call an API to resend verification email
                  onShowMessage('Verification email sent! Please check your inbox.', 'success');
                }}
                className={`ml-4 px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
              >
                Resend Email
              </button>
            </div>
          </div>
        )}
      </div>
    </SettingSection>
  );
};

export default AccountInformation;