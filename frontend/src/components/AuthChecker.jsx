import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';

const AuthChecker = () => {
  const { isDarkMode } = useDarkMode();
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    isLoggedIn: false
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('auth_user');
      
      let parsedUser = null;
      if (user) {
        try {
          parsedUser = JSON.parse(user);
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }

      setAuthState({
        token: token,
        user: parsedUser,
        isLoggedIn: !!token
      });
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    // Navigate to login page
    window.location.href = '/loginpage';
  };

  if (!authState.isLoggedIn) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className={`${isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} rounded-2xl p-6 sm:p-8 border shadow-sm text-center`}>
            <div className={`mx-auto w-16 h-16 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'} rounded-full flex items-center justify-center mb-4`}>
              <svg className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Authentication Required
            </h3>
            <p className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-sm sm:text-base mb-6`}>
              Please log in to access your connections and discover new people.
            </p>
            <button
              onClick={handleLogin}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null; // Don't render anything if user is authenticated
};

export default AuthChecker;
