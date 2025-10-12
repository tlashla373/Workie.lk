import React, { useState, useEffect } from 'react';
import { CreditCard, Save, RefreshCw, Shield, AlertTriangle } from 'lucide-react';
import { useDarkMode } from '../../../contexts/DarkModeContext';
import { useAuth } from '../../../hooks/useAuth';
import { ProfileService } from '../../../services/profileService';
import SettingSection from './SettingSection';

const BankAccountInformation = ({ user, expandedSections, onToggleSection, onShowMessage }) => {
  const { isDarkMode } = useDarkMode();
  const { user: authUser, refreshUser } = useAuth();
  const profileService = new ProfileService();

  // Use the passed user prop or fallback to authUser
  const currentUser = user || authUser;

  const [bankSettings, setBankSettings] = useState({
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    branchCode: '',
    swiftCode: ''
  });

  const [isEditingBank, setIsEditingBank] = useState(false);
  const [saving, setSaving] = useState(false);

  // Update bank settings when user data changes
  useEffect(() => {
    if (currentUser?.bankAccount) {
      setBankSettings(prev => ({
        ...prev,
        bankName: currentUser.bankAccount.bankName || '',
        accountNumber: currentUser.bankAccount.accountNumber || '',
        accountHolderName: currentUser.bankAccount.accountHolderName || '',
        branchCode: currentUser.bankAccount.branchCode || '',
        swiftCode: currentUser.bankAccount.swiftCode || ''
      }));
    }
  }, [currentUser]);

  const saveBankSettings = async () => {
    setSaving(true);
    try {
      const updateData = {
        bankAccount: {
          bankName: bankSettings.bankName,
          accountNumber: bankSettings.accountNumber,
          accountHolderName: bankSettings.accountHolderName,
          branchCode: bankSettings.branchCode,
          swiftCode: bankSettings.swiftCode
        }
      };

      await profileService.updateUser(currentUser._id || currentUser.id, updateData);
      await refreshUser();
      setIsEditingBank(false);
      onShowMessage('Bank account information saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving bank settings:', error);
      onShowMessage('Failed to save bank account information. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const cancelEditBank = () => {
    setBankSettings(prev => ({
      ...prev,
      bankName: currentUser?.bankAccount?.bankName || '',
      accountNumber: currentUser?.bankAccount?.accountNumber || '',
      accountHolderName: currentUser?.bankAccount?.accountHolderName || '',
      branchCode: currentUser?.bankAccount?.branchCode || '',
      swiftCode: currentUser?.bankAccount?.swiftCode || ''
    }));
    setIsEditingBank(false);
  };

  const handleBankChange = (field, value) => {
    setBankSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Only render for worker accounts
  if (!currentUser || currentUser.userType !== 'worker') {
    return null;
  }

  return (
    <SettingSection
      id="bankAccount"
      title="Bank Account Information"
      description="Manage your payment details for receiving job payments"
      icon={<CreditCard className="w-5 h-5 text-white" />}
      iconBg="bg-green-500"
      isExpanded={expandedSections.bankAccount}
      onToggle={onToggleSection}
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Security Notice */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border-blue-700/30' : 'bg-blue-50 border-blue-200'} border`}>
          <div className="flex items-start space-x-3">
            <Shield className={`w-5 h-5 mt-0.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <h4 className={`font-medium text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                Secure Payment Information
              </h4>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                Your bank account information is encrypted and secure. This information is only used for processing payments for completed jobs.
              </p>
            </div>
          </div>
        </div>

        {/* Edit Button Header */}
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Payment Details
          </h3>
          {!isEditingBank ? (
            <button
              onClick={() => setIsEditingBank(true)}
              className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center space-x-2`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'} font-medium`}>
                Editing Mode
              </span>
            </div>
          )}
        </div>

        {/* Bank Account Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Bank Name
            </label>
            <input
              type="text"
              value={bankSettings.bankName}
              onChange={(e) => handleBankChange('bankName', e.target.value)}
              disabled={!isEditingBank}
              placeholder="Enter your bank name"
              className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } ${
                isEditingBank
                  ? 'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                  : 'opacity-60 cursor-not-allowed'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Account Holder Name
            </label>
            <input
              type="text"
              value={bankSettings.accountHolderName}
              onChange={(e) => handleBankChange('accountHolderName', e.target.value)}
              disabled={!isEditingBank}
              placeholder="Enter account holder name"
              className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } ${
                isEditingBank
                  ? 'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                  : 'opacity-60 cursor-not-allowed'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Account Number
            </label>
            <input
              type="text"
              value={bankSettings.accountNumber}
              onChange={(e) => handleBankChange('accountNumber', e.target.value)}
              disabled={!isEditingBank}
              placeholder="Enter account number"
              className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } ${
                isEditingBank
                  ? 'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                  : 'opacity-60 cursor-not-allowed'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Branch Code
            </label>
            <input
              type="text"
              value={bankSettings.branchCode}
              onChange={(e) => handleBankChange('branchCode', e.target.value)}
              disabled={!isEditingBank}
              placeholder="Enter branch code"
              className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } ${
                isEditingBank
                  ? 'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                  : 'opacity-60 cursor-not-allowed'
              }`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            SWIFT Code (Optional)
          </label>
          <input
            type="text"
            value={bankSettings.swiftCode}
            onChange={(e) => handleBankChange('swiftCode', e.target.value)}
            disabled={!isEditingBank}
            placeholder="Enter SWIFT code for international transfers"
            className={`w-full px-3 py-2 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } ${
              isEditingBank
                ? 'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                : 'opacity-60 cursor-not-allowed'
            }`}
          />
        </div>

        {/* Action Buttons */}
        {isEditingBank && (
          <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={cancelEditBank}
              disabled={saving}
              className={`w-full sm:w-auto px-4 py-2 border rounded-lg transition-colors ${
                isDarkMode
                  ? 'border-gray-600 text-gray-400 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Cancel
            </button>
            <button
              onClick={saveBankSettings}
              disabled={saving || !bankSettings.bankName || !bankSettings.accountNumber || !bankSettings.accountHolderName}
              className={`w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
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
          </div>
        )}

        {/* Warning for incomplete information */}
        {(!bankSettings.bankName || !bankSettings.accountNumber || !bankSettings.accountHolderName) && !isEditingBank && (
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-yellow-900/20 border-yellow-700/30' : 'bg-yellow-50 border-yellow-200'} border`}>
            <div className="flex items-start space-x-3">
              <AlertTriangle className={`w-5 h-5 mt-0.5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <div>
                <h4 className={`font-medium text-sm ${isDarkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
                  Incomplete Bank Information
                </h4>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  Please complete your bank account information to receive payments for completed jobs.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </SettingSection>
  );
};

export default BankAccountInformation;
