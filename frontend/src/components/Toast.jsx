import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle2, AlertTriangle, Info, Wifi, WifiOff } from 'lucide-react';

const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  NETWORK: 'network'
};

const TOAST_ICONS = {
  [TOAST_TYPES.SUCCESS]: CheckCircle2,
  [TOAST_TYPES.ERROR]: AlertCircle,
  [TOAST_TYPES.WARNING]: AlertTriangle,
  [TOAST_TYPES.INFO]: Info,
  [TOAST_TYPES.NETWORK]: WifiOff
};

const TOAST_STYLES = {
  [TOAST_TYPES.SUCCESS]: 'bg-green-500 text-white',
  [TOAST_TYPES.ERROR]: 'bg-red-500 text-white',
  [TOAST_TYPES.WARNING]: 'bg-yellow-500 text-white',
  [TOAST_TYPES.INFO]: 'bg-blue-500 text-white',
  [TOAST_TYPES.NETWORK]: 'bg-orange-500 text-white'
};

const Toast = ({ 
  id,
  type = TOAST_TYPES.INFO, 
  title, 
  message, 
  duration = 5000, 
  onClose,
  showRetry = false,
  onRetry,
  persistent = false
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, persistent]);

  const handleClose = () => {
    setIsRemoving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.(id);
    }, 300);
  };

  const handleRetry = () => {
    onRetry?.();
    handleClose();
  };

  if (!isVisible) return null;

  const Icon = TOAST_ICONS[type] || Info;

  return (
    <div className={`
      transform transition-all duration-300 ease-in-out mb-2
      ${isRemoving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
    `}>
      <div className={`
        ${TOAST_STYLES[type]} 
        rounded-lg shadow-lg p-4 flex items-start space-x-3 min-w-80 max-w-md
      `}>
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
          )}
          <p className="text-sm opacity-90">{message}</p>
          
          {showRetry && (
            <button
              onClick={handleRetry}
              className="mt-2 text-sm underline hover:no-underline opacity-90 hover:opacity-100"
            >
              Try Again
            </button>
          )}
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ToastContainer = ({ toasts, onRemoveToast, onRetry }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemoveToast}
          onRetry={() => onRetry?.(toast.id)}
        />
      ))}
    </div>
  );
};

// Toast hook for easy usage
let toastId = 0;
const toastListeners = new Set();

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const listener = (newToast) => {
      setToasts(prev => [...prev, { ...newToast, id: ++toastId }]);
    };
    
    toastListeners.add(listener);
    return () => toastListeners.delete(listener);
  }, []);

  const addToast = (toast) => {
    const newToast = { ...toast, id: ++toastId };
    toastListeners.forEach(listener => listener(newToast));
    return newToast.id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    showSuccess: (message, options) => addToast({ type: TOAST_TYPES.SUCCESS, message, ...options }),
    showError: (message, options) => addToast({ type: TOAST_TYPES.ERROR, message, ...options }),
    showWarning: (message, options) => addToast({ type: TOAST_TYPES.WARNING, message, ...options }),
    showInfo: (message, options) => addToast({ type: TOAST_TYPES.INFO, message, ...options }),
    showNetworkError: (message, options) => addToast({ 
      type: TOAST_TYPES.NETWORK, 
      message, 
      showRetry: true,
      persistent: true,
      ...options 
    })
  };
};

// Global toast functions (can be used without hooks)
export const toast = {
  success: (message, options) => {
    const newToast = { type: TOAST_TYPES.SUCCESS, message, id: ++toastId, ...options };
    toastListeners.forEach(listener => listener(newToast));
  },
  error: (message, options) => {
    const newToast = { type: TOAST_TYPES.ERROR, message, id: ++toastId, ...options };
    toastListeners.forEach(listener => listener(newToast));
  },
  warning: (message, options) => {
    const newToast = { type: TOAST_TYPES.WARNING, message, id: ++toastId, ...options };
    toastListeners.forEach(listener => listener(newToast));
  },
  info: (message, options) => {
    const newToast = { type: TOAST_TYPES.INFO, message, id: ++toastId, ...options };
    toastListeners.forEach(listener => listener(newToast));
  },
  networkError: (message, options) => {
    const newToast = { 
      type: TOAST_TYPES.NETWORK, 
      message, 
      id: ++toastId,
      showRetry: true,
      persistent: true,
      ...options 
    };
    toastListeners.forEach(listener => listener(newToast));
  }
};

export { TOAST_TYPES };
export default ToastContainer;
