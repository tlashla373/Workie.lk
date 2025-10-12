import React from 'react';
import { CreditCard, Smartphone, Building, Wallet } from 'lucide-react';
import { useDarkMode } from '../../../contexts/DarkModeContext';

const PaymentMethods = ({ selectedMethod, onMethodSelect, onNext }) => {
  const { isDarkMode } = useDarkMode();

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: CreditCard,
      popular: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: Wallet,
      popular: false
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      description: 'Direct transfer from your bank',
      icon: Building,
      popular: false
    },
    {
      id: 'digital',
      name: 'Digital Wallet',
      description: 'Apple Pay, Google Pay, Samsung Pay',
      icon: Smartphone,
      popular: false
    }
  ];

  return (
    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        Choose Payment Method
      </h2>
      
      <div className="space-y-4 mb-6">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          return (
            <div
              key={method.id}
              onClick={() => onMethodSelect(method.id)}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : isDarkMode
                  ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              {method.popular && (
                <div className="absolute -top-2 left-4 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                  Popular
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  selectedMethod === method.id
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300'
                    : isDarkMode
                    ? 'bg-gray-600 text-gray-300'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {method.name}
                  </h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {method.description}
                  </p>
                </div>
                
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-500'
                    : isDarkMode
                    ? 'border-gray-500'
                    : 'border-gray-300'
                }`}>
                  {selectedMethod === method.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!selectedMethod}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedMethod
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : isDarkMode
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PaymentMethods;