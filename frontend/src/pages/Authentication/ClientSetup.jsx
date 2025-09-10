import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Camera,
  Phone,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Upload
} from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const ClientSetup = () => {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [clientData, setClientData] = useState({
    profilePhoto: null,
    phone: '',
    phoneVerified: false
  });

  const handleFileUpload = (file) => {
    setClientData((prev) => ({ ...prev, profilePhoto: file }));
  };

  const handleVerifyPhone = () => {
    setClientData((prev) => ({ ...prev, phoneVerified: true }));
  };

  const handleComplete = () => {
    try {
      console.log('Client setup completed, navigating to client profile...');
      navigate('/clientprofile');
    } catch (error) {
      console.error('Error navigating to client profile:', error);
    }
  };

  const handleBack = () => {
    navigate('/roleselection');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <User className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-blue-500" />
          <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Complete Your Profile
          </h1>
          <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} px-4 sm:px-0`}>
            Add a profile picture and verify your contact details to get started
          </p>
        </div>

        {/* Setup Form */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} mb-6 sm:mb-8`}>
          <div className="space-y-6 sm:space-y-8">
            {/* Profile Photo */}
            <div className="text-center">
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3 sm:mb-4`}>
                Profile Picture
              </label>

              <div className="relative inline-block">
                <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100'} flex items-center justify-center overflow-hidden`}>
                  {clientData.profilePhoto ? (
                    <img
                      src={URL.createObjectURL(clientData.profilePhoto)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className={`w-8 h-8 sm:w-12 sm:h-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="profilePhoto"
                />
                <label
                  htmlFor="profilePhoto"
                  className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                </label>
              </div>

              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2 px-4 sm:px-0`}>
                Add a clear photo to help workers recognize you
              </p>
            </div>

            {/* Contact Verification */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className={`text-base sm:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Phone Verification (Optional)
              </h3>

              {/* Phone Verification */}
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Phone Number
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <input
                    type="tel"
                    placeholder="+94 77 123 4567"
                    value={clientData.phone}
                    onChange={(e) => setClientData((prev) => ({ ...prev, phone: e.target.value }))}
                    className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border text-sm sm:text-base ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <button
                    onClick={handleVerifyPhone}
                    disabled={!clientData.phone || clientData.phoneVerified}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    {clientData.phoneVerified ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Verified</span>
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4" />
                        <span>Verify</span>
                      </>
                    )}
                  </button>
                </div>
                {clientData.phoneVerified && (
                  <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mt-2 flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Phone verified successfully</span>
                  </p>
                )}
              </div>
            </div>

            {/* Benefits */}
            <div className={`p-4 sm:p-6 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'} border`}>
              <h4 className={`font-semibold text-sm sm:text-base ${isDarkMode ? 'text-blue-300' : 'text-blue-800'} mb-3`}>
                Why verify your phone number?
              </h4>
              <ul className={`space-y-2 text-xs sm:text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Workers can contact you directly about jobs</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Receive SMS notifications about your projects</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Enhanced account security with 2FA</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <button
            onClick={handleBack}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors text-sm sm:text-base`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <button
              onClick={handleComplete}
              className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'} transition-colors text-sm sm:text-base`}
            >
              Skip for now
            </button>

            <button
              onClick={handleComplete}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
            >
              <span>Complete Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSetup;
