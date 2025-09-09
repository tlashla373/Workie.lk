import { useState, useCallback } from 'react';
import { NetworkError, isNetworkError, checkOnlineStatus } from '../utils/networkUtils';

export const useApiError = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  const handleApiCall = useCallback(async (apiFunction, options = {}) => {
    const {
      onSuccess,
      onError,
      showLoading = true,
      maxRetries = 3,
      retryDelay = 1000
    } = options;

    if (showLoading) setIsLoading(true);
    clearError();

    let attempt = 0;
    while (attempt <= maxRetries) {
      try {
        const result = await apiFunction();
        
        if (showLoading) setIsLoading(false);
        setRetryCount(0);
        
        if (onSuccess) onSuccess(result);
        return result;
      } catch (err) {
        console.error(`API call failed (attempt ${attempt + 1}):`, err);
        
        // Check if it's a retryable error
        const isRetryable = isNetworkError(err) || (err.status >= 500);
        
        if (attempt === maxRetries || !isRetryable) {
          // Final failure
          if (showLoading) setIsLoading(false);
          
          const errorMessage = getErrorMessage(err);
          setError({
            message: errorMessage,
            originalError: err,
            isNetworkError: isNetworkError(err),
            isRetryable,
            retryCount: attempt
          });
          
          if (onError) onError(err);
          throw err;
        }
        
        // Wait before retry
        if (attempt < maxRetries) {
          setRetryCount(attempt + 1);
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
          attempt++;
        }
      }
    }
  }, [clearError]);

  const retry = useCallback(async (apiFunction, options = {}) => {
    return handleApiCall(apiFunction, options);
  }, [handleApiCall]);

  return {
    error,
    isLoading,
    retryCount,
    clearError,
    handleApiCall,
    retry
  };
};

export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // Network errors
  if (isNetworkError(error)) {
    if (!checkOnlineStatus()) {
      return 'No internet connection. Please check your network and try again.';
    }
    return 'Unable to connect to the server. Please try again.';
  }
  
  // HTTP errors
  if (error.status) {
    switch (error.status) {
      case 400:
        return error.message || 'Invalid request. Please check your input.';
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return 'You don\'t have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable. Please try again.';
      default:
        return error.message || `Request failed with status ${error.status}`;
    }
  }
  
  // Default error message
  return error.message || 'Something went wrong. Please try again.';
};

export const useApiCall = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const { error, isLoading, handleApiCall, retry } = useApiError();

  const execute = useCallback(async (params) => {
    return handleApiCall(
      () => apiFunction(params),
      {
        onSuccess: (result) => setData(result)
      }
    );
  }, [apiFunction, handleApiCall]);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  return {
    data,
    error,
    isLoading,
    execute,
    refetch,
    retry: () => retry(apiFunction, { onSuccess: (result) => setData(result) })
  };
};
