// Network utility functions for handling connectivity and retry logic
export class NetworkError extends Error {
  constructor(message, isNetworkError = false, status = null) {
    super(message);
    this.name = 'NetworkError';
    this.isNetworkError = isNetworkError;
    this.status = status;
  }
}

export const isNetworkError = (error) => {
  return (
    error.name === 'TypeError' && error.message.includes('fetch') ||
    error.message.includes('Failed to fetch') ||
    error.message.includes('Network request failed') ||
    error.message.includes('ERR_NETWORK') ||
    error.message.includes('ERR_INTERNET_DISCONNECTED') ||
    error.message.includes('The Internet connection appears to be offline')
  );
};

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const exponentialBackoff = (attempt) => {
  return Math.min(1000 * Math.pow(2, attempt), 10000); // Max 10 seconds
};

export const isRetryableError = (error) => {
  if (isNetworkError(error)) return true;
  
  const status = error.status || error.code;
  return status >= 500 || status === 408 || status === 429; // Server errors, timeout, rate limit
};

export const createTimeoutSignal = (timeoutMs) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  return {
    signal: controller.signal,
    cleanup: () => clearTimeout(timeoutId)
  };
};

export const checkOnlineStatus = () => {
  return navigator.onLine;
};

export const waitForOnline = () => {
  return new Promise((resolve) => {
    if (navigator.onLine) {
      resolve();
    } else {
      const handleOnline = () => {
        window.removeEventListener('online', handleOnline);
        resolve();
      };
      window.addEventListener('online', handleOnline);
    }
  });
};

export const retryWithBackoff = async (fn, maxRetries = 3, initialDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on non-retryable errors
      if (!isRetryableError(error)) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Wait for network if offline
      if (!checkOnlineStatus()) {
        console.log('Network appears offline, waiting for connection...');
        await waitForOnline();
      }
      
      // Wait with exponential backoff
      const delayMs = initialDelay * Math.pow(2, attempt);
      console.log(`Request failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delayMs}ms...`);
      await delay(delayMs);
    }
  }
  
  throw lastError;
};
