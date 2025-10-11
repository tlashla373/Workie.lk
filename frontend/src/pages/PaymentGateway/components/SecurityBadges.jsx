import React from 'react';
import { Shield, Lock, Eye, CreditCard, CheckCircle, Star, Award, Zap } from 'lucide-react';
import { useDarkMode } from '../../../contexts/DarkModeContext';

const SecurityBadges = ({ variant = 'default' }) => {
  const { isDarkMode } = useDarkMode();

  const badges = [
    {
      icon: Shield,
      title: 'SSL Secured',
      description: '256-bit encryption',
      color: 'green',
      verified: true
    },
    {
      icon: Lock,
      title: 'PCI Compliant',
      description: 'Level 1 certified',
      color: 'blue',
      verified: true
    },
    {
      icon: Eye,
      title: 'Privacy Protected',
      description: 'GDPR compliant',
      color: 'purple',
      verified: true
    },
    {
      icon: CreditCard,
      title: 'Payment Security',
      description: '3D Secure enabled',
      color: 'orange',
      verified: true
    }
  ];

  const certifications = [
    {
      icon: CheckCircle,
      title: 'Verified Secure',
      issuer: 'TrustGuard',
      color: 'green'
    },
    {
      icon: Star,
      title: 'Top Rated',
      issuer: 'PaymentSafe',
      color: 'yellow'
    },
    {
      icon: Award,
      title: 'Industry Leader',
      issuer: 'SecurePayments',
      color: 'blue'
    },
    {
      icon: Zap,
      title: 'Fast & Secure',
      issuer: 'SpeedPay',
      color: 'purple'
    }
  ];

  const getColorClasses = (color, type = 'badge') => {
    const colors = {
      green: {
        badge: isDarkMode 
          ? 'bg-green-900 text-green-200 border-green-700' 
          : 'bg-green-100 text-green-800 border-green-200',
        icon: 'text-green-500'
      },
      blue: {
        badge: isDarkMode 
          ? 'bg-blue-900 text-blue-200 border-blue-700' 
          : 'bg-blue-100 text-blue-800 border-blue-200',
        icon: 'text-blue-500'
      },
      purple: {
        badge: isDarkMode 
          ? 'bg-purple-900 text-purple-200 border-purple-700' 
          : 'bg-purple-100 text-purple-800 border-purple-200',
        icon: 'text-purple-500'
      },
      orange: {
        badge: isDarkMode 
          ? 'bg-orange-900 text-orange-200 border-orange-700' 
          : 'bg-orange-100 text-orange-800 border-orange-200',
        icon: 'text-orange-500'
      },
      yellow: {
        badge: isDarkMode 
          ? 'bg-yellow-900 text-yellow-200 border-yellow-700' 
          : 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: 'text-yellow-500'
      }
    };
    return colors[color]?.[type] || colors.blue[type];
  };

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-2">
        {badges.slice(0, 2).map((badge, index) => {
          const IconComponent = badge.icon;
          return (
            <div
              key={index}
              className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getColorClasses(badge.color)}`}
            >
              <IconComponent className={`w-3 h-3 ${getColorClasses(badge.color, 'icon')}`} />
              <span>{badge.title}</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          <Shield className="w-4 h-4 text-green-500" />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Secured
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Lock className="w-4 h-4 text-blue-500" />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Encrypted
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Badges */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Security Certifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map((badge, index) => {
            const IconComponent = badge.icon;
            return (
              <div
                key={index}
                className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 hover:bg-gray-650' 
                    : 'border-gray-200 bg-gray-50 hover:bg-white'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-600' : 'bg-white'
                  }`}>
                    <IconComponent className={`w-5 h-5 ${getColorClasses(badge.color, 'icon')}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {badge.title}
                      </h4>
                      {badge.verified && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {badge.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust Indicators */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Trust Indicators
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {certifications.map((cert, index) => {
            const IconComponent = cert.icon;
            return (
              <div
                key={index}
                className={`p-3 text-center border rounded-lg transition-all hover:shadow-md ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 hover:bg-gray-650' 
                    : 'border-gray-200 bg-gray-50 hover:bg-white'
                }`}
              >
                <IconComponent className={`w-6 h-6 mx-auto mb-2 ${getColorClasses(cert.color, 'icon')}`} />
                <h5 className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {cert.title}
                </h5>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {cert.issuer}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Features */}
      <div className={`p-4 border rounded-lg ${
        isDarkMode 
          ? 'border-gray-600 bg-gray-700' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Your Payment is Protected By:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Bank-level encryption
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-blue-500" />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Secure data transmission
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-purple-500" />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Privacy protection
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-orange-500" />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Fraud monitoring
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Verified transactions
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              24/7 monitoring
            </span>
          </div>
        </div>
      </div>

      {/* Money Back Guarantee */}
      <div className={`p-4 border-2 border-dashed rounded-lg text-center ${
        isDarkMode 
          ? 'border-green-600 bg-green-900/20' 
          : 'border-green-300 bg-green-50'
      }`}>
        <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
          100% Money Back Guarantee
        </h4>
        <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
          If you're not satisfied, we'll refund your payment within 30 days
        </p>
      </div>
    </div>
  );
};

export default SecurityBadges;