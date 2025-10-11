import React from 'react';

/**
 * WhatsApp Click-to-Chat Button Component
 * Opens WhatsApp chat with pre-filled message
 * 
 * @param {string} phoneNumber - Phone number in international format (e.g., "94771234567")
 * @param {string} message - Pre-filled message (optional)
 * @param {string} userName - Name of the person to chat with (optional)
 * @param {string} jobTitle - Job title for context (optional)
 * @param {string} className - Additional CSS classes
 * @param {string} size - Button size: 'small', 'medium', or 'large'
 */
const WhatsAppButton = ({ 
  phoneNumber, 
  message, 
  userName,
  jobTitle,
  className = '',
  size = 'medium',
  variant = 'primary' 
}) => {
  const handleWhatsAppClick = () => {
    if (!phoneNumber) {
      console.error('WhatsApp: Phone number is required');
      return;
    }

    // Remove all non-numeric characters from phone number
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    
    // Validate phone number length
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      console.error('WhatsApp: Invalid phone number length');
      alert('Invalid phone number format. Please use international format without + or spaces.');
      return;
    }
    
    // Create default message if not provided
    const defaultMessage = `Hi${userName ? ' ' + userName : ''}, I'm interested in${jobTitle ? ' the ' + jobTitle + ' position' : ' connecting with you on Workie.lk'}!`;
    
    const text = encodeURIComponent(message || defaultMessage);
    const url = `https://wa.me/${cleanPhone}?text=${text}`;
    
    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-green-500 hover:bg-green-600 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-green-600 border-2 border-green-500',
    ghost: 'bg-transparent hover:bg-green-50 text-green-600'
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      disabled={!phoneNumber}
      aria-label={`Chat with ${userName || 'user'} on WhatsApp`}
      title={`Click to chat on WhatsApp`}
    >
      {/* WhatsApp Icon */}
      <svg 
        className="w-5 h-5" 
        fill="currentColor" 
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
      <span>Chat on WhatsApp</span>
    </button>
  );
};

export default WhatsAppButton;
