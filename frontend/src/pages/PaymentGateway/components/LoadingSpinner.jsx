import React from 'react';
import { Loader2, CreditCard, Shield, CheckCircle, Clock } from 'lucide-react';
import { useDarkMode } from '../../../contexts/DarkModeContext';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Loading...', 
  variant = 'default',
  progress = null,
  stage = null
}) => {
  const { isDarkMode } = useDarkMode();

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  const stages = {
    'validating': {
      icon: Shield,
      text: 'Validating payment details...',
      color: 'text-blue-500'
    },
    'processing': {
      icon: CreditCard,
      text: 'Processing payment...',
      color: 'text-yellow-500'
    },
    'confirming': {
      icon: Clock,
      text: 'Confirming transaction...',
      color: 'text-orange-500'
    },
    'completing': {
      icon: CheckCircle,
      text: 'Completing payment...',
      color: 'text-green-500'
    }
  };

  if (variant === 'payment') {
    const currentStage = stages[stage] || stages.processing;
    const StageIcon = currentStage.icon;

    return (
      <div className={`flex flex-col items-center justify-center p-8 rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="relative mb-6">
          <div className={`animate-spin ${sizeClasses.large} ${currentStage.color}`}>
            <Loader2 className="w-full h-full" />
          </div>
          <div className={`absolute inset-0 flex items-center justify-center ${currentStage.color}`}>
            <StageIcon className="w-6 h-6" />
          </div>
        </div>
        
        <h3 className={`${textSizes.large} font-semibold mb-2 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {currentStage.text}
        </h3>
        
        <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Please don't close this window while we process your payment
        </p>

        {progress !== null && (
          <div className="w-full max-w-xs mt-6">
            <div className={`w-full bg-gray-200 rounded-full h-2 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className={`text-center mt-2 text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {progress}% complete
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full bg-blue-500 animate-bounce ${
                isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
              }`}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.6s'
              }}
            ></div>
          ))}
        </div>
        {text && (
          <p className={`${textSizes[size]} ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`relative ${sizeClasses[size]}`}>
          <div className={`absolute inset-0 rounded-full bg-blue-500 animate-ping ${
            isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
          }`}></div>
          <div className={`relative rounded-full bg-blue-600 ${sizeClasses[size]} ${
            isDarkMode ? 'bg-blue-500' : 'bg-blue-600'
          }`}></div>
        </div>
        {text && (
          <p className={`${textSizes[size]} ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className="space-y-4 animate-pulse">
        <div className={`h-4 bg-gray-300 rounded ${
          isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
        }`}></div>
        <div className={`h-4 bg-gray-300 rounded w-3/4 ${
          isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
        }`}></div>
        <div className={`h-4 bg-gray-300 rounded w-1/2 ${
          isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
        }`}></div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`p-6 rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="flex items-center space-x-4">
          <Loader2 className={`animate-spin ${sizeClasses[size]} text-blue-500`} />
          <div>
            <h3 className={`${textSizes[size]} font-semibold ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {text}
            </h3>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              This will only take a moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`p-8 rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-xl`}>
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className={`animate-spin ${sizeClasses.large} text-blue-500`} />
            <h3 className={`${textSizes.large} font-semibold ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {text}
            </h3>
            <p className={`text-center ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Please wait while we process your request
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default spinner
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className={`animate-spin ${sizeClasses[size]} text-blue-500`} />
      {text && (
        <p className={`${textSizes[size]} ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Pre-built loading states for common scenarios
export const PaymentProcessingLoader = ({ stage, progress }) => (
  <LoadingSpinner 
    variant="payment" 
    size="large" 
    stage={stage}
    progress={progress}
  />
);

export const CardLoader = ({ text = "Processing..." }) => (
  <LoadingSpinner 
    variant="card" 
    size="medium" 
    text={text}
  />
);

export const OverlayLoader = ({ text = "Loading..." }) => (
  <LoadingSpinner 
    variant="overlay" 
    size="large" 
    text={text}
  />
);

export const DotsLoader = ({ text }) => (
  <LoadingSpinner 
    variant="dots" 
    size="medium" 
    text={text}
  />
);

export const PulseLoader = ({ text }) => (
  <LoadingSpinner 
    variant="pulse" 
    size="medium" 
    text={text}
  />
);

export const SkeletonLoader = () => (
  <LoadingSpinner variant="skeleton" />
);

export default LoadingSpinner;