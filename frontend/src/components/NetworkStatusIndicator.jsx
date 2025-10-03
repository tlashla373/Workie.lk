import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle2 } from 'lucide-react';

const NetworkStatusIndicator = ({ 
  showOnlineStatus = false, 
  className = "",
  showRetryMessage = true 
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [hasBeenOffline, setHasBeenOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (hasBeenOffline) {
        setShowOfflineMessage(false);
        // Show reconnected message briefly
        setTimeout(() => setHasBeenOffline(false), 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setHasBeenOffline(true);
      setShowOfflineMessage(true);
    };

    // Check current status on mount
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [hasBeenOffline]);

  // Don't show anything if online and showOnlineStatus is false
  if (isOnline && !showOnlineStatus && !hasBeenOffline) {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      {!isOnline && showOfflineMessage && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-down">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">No internet connection</span>
          {showRetryMessage && (
            <span className="text-xs opacity-90">- Check your connection</span>
          )}
        </div>
      )}
      
      {isOnline && hasBeenOffline && (
        <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-down">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm font-medium">Connection restored</span>
        </div>
      )}
      
      {isOnline && showOnlineStatus && !hasBeenOffline && (
        <div className="bg-green-500 text-white px-3 py-1 rounded-full shadow-lg flex items-center space-x-2">
          <Wifi className="w-3 h-3" />
          <span className="text-xs font-medium">Online</span>
        </div>
      )}
    </div>
  );
};

// Error boundary component for network errors
export const NetworkErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleError = (event) => {
      if (event.reason?.isNetworkError || event.reason?.message?.includes('fetch')) {
        setHasError(true);
        setError(event.reason);
      }
    };

    window.addEventListener('unhandledrejection', handleError);
    return () => window.removeEventListener('unhandledrejection', handleError);
  }, []);

  const retry = async () => {
    setIsRetrying(true);
    setHasError(false);
    setError(null);
    
    // Wait a bit for any pending operations to complete
    setTimeout(() => {
      setIsRetrying(false);
      window.location.reload();
    }, 1000);
  };

  if (hasError && !isRetrying) {
    return fallback ? fallback({ error, retry }) : (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-4">
            {error?.isNetworkError 
              ? "Unable to connect to the server. Please check your internet connection."
              : "Something went wrong. Please try again."
            }
          </p>
          <button
            onClick={retry}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isRetrying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Reconnecting...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default NetworkStatusIndicator;
