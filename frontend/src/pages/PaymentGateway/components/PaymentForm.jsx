import React, { useState } from 'react';
import { Eye, EyeOff, CreditCard, Calendar, Lock } from 'lucide-react';
import { useDarkMode } from '../../../contexts/DarkModeContext';

const PaymentForm = ({ paymentMethod, onSubmit, onBack }) => {
  const { isDarkMode } = useDarkMode();
  const [showCVV, setShowCVV] = useState(false);
  const [formData, setFormData] = useState({
    // Card details
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    
    // Billing address
    email: '',
    country: '',
    address: '',
    city: '',
    postalCode: '',
    
    // PayPal
    paypalEmail: '',
    
    // Bank transfer
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    
    // Save card option
    saveCard: false
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    // Format card number
    if (field === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      value = value.substring(0, 19); // Limit to 16 digits + 3 spaces
    }
    
    // Format CVV
    if (field === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 4);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (paymentMethod === 'card') {
      if (!formData.cardholderName.trim()) {
        newErrors.cardholderName = 'Cardholder name is required';
      }
      
      if (!formData.cardNumber.replace(/\s/g, '') || formData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Valid card number is required';
      }
      
      if (!formData.expiryMonth || !formData.expiryYear) {
        newErrors.expiry = 'Expiry date is required';
      }
      
      if (!formData.cvv || formData.cvv.length < 3) {
        newErrors.cvv = 'Valid CVV is required';
      }
    }
    
    if (paymentMethod === 'paypal') {
      if (!formData.paypalEmail || !/\S+@\S+\.\S+/.test(formData.paypalEmail)) {
        newErrors.paypalEmail = 'Valid PayPal email is required';
      }
    }
    
    if (paymentMethod === 'bank') {
      if (!formData.bankName.trim()) {
        newErrors.bankName = 'Bank name is required';
      }
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = 'Account number is required';
      }
      if (!formData.routingNumber.trim()) {
        newErrors.routingNumber = 'Routing number is required';
      }
    }
    
    // Common validations
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const months = [
    { value: '01', label: '01 - January' },
    { value: '02', label: '02 - February' },
    { value: '03', label: '03 - March' },
    { value: '04', label: '04 - April' },
    { value: '05', label: '05 - May' },
    { value: '06', label: '06 - June' },
    { value: '07', label: '07 - July' },
    { value: '08', label: '08 - August' },
    { value: '09', label: '09 - September' },
    { value: '10', label: '10 - October' },
    { value: '11', label: '11 - November' },
    { value: '12', label: '12 - December' }
  ];

  const countries = [
     'Sri Lanka', 'India'
  ];

  const renderCardForm = () => (
    <div className="space-y-6">
      {/* Card Number */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Card Number
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
            placeholder="1234 5678 9012 3456"
            className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.cardNumber 
                ? 'border-red-500' 
                : isDarkMode 
                ? 'border-gray-600 bg-gray-700 text-gray-100' 
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          />
          <CreditCard className={`absolute left-4 top-3.5 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
      </div>

      {/* Cardholder Name */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Cardholder Name
        </label>
        <input
          type="text"
          value={formData.cardholderName}
          onChange={(e) => handleInputChange('cardholderName', e.target.value)}
          placeholder="John Doe"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.cardholderName 
              ? 'border-red-500' 
              : isDarkMode 
              ? 'border-gray-600 bg-gray-700 text-gray-100' 
              : 'border-gray-300 bg-white text-gray-900'
          }`}
        />
        {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Month
          </label>
          <select
            value={formData.expiryMonth}
            onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.expiry 
                ? 'border-red-500' 
                : isDarkMode 
                ? 'border-gray-600 bg-gray-700 text-gray-100' 
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            <option value="">Month</option>
            {months.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Year
          </label>
          <select
            value={formData.expiryYear}
            onChange={(e) => handleInputChange('expiryYear', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.expiry 
                ? 'border-red-500' 
                : isDarkMode 
                ? 'border-gray-600 bg-gray-700 text-gray-100' 
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            <option value="">Year</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            CVV
          </label>
          <div className="relative">
            <input
              type={showCVV ? 'text' : 'password'}
              value={formData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value)}
              placeholder="123"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.cvv 
                  ? 'border-red-500' 
                  : isDarkMode 
                  ? 'border-gray-600 bg-gray-700 text-gray-100' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
            <Lock className={`absolute left-3 top-3.5 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <button
              type="button"
              onClick={() => setShowCVV(!showCVV)}
              className={`absolute right-3 top-3.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              {showCVV ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
      {errors.expiry && <p className="text-red-500 text-sm">{errors.expiry}</p>}
      {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
    </div>
  );

  const renderPayPalForm = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className={`text-6xl mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          PayPal
        </div>
        <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          You'll be redirected to PayPal to complete your payment
        </p>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            PayPal Email
          </label>
          <input
            type="email"
            value={formData.paypalEmail}
            onChange={(e) => handleInputChange('paypalEmail', e.target.value)}
            placeholder="your@paypal.com"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.paypalEmail 
                ? 'border-red-500' 
                : isDarkMode 
                ? 'border-gray-600 bg-gray-700 text-gray-100' 
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          />
          {errors.paypalEmail && <p className="text-red-500 text-sm mt-1">{errors.paypalEmail}</p>}
        </div>
      </div>
    </div>
  );

  const renderBankForm = () => (
    <div className="space-y-6">
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Bank Name
        </label>
        <input
          type="text"
          value={formData.bankName}
          onChange={(e) => handleInputChange('bankName', e.target.value)}
          placeholder="Bank of America"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.bankName 
              ? 'border-red-500' 
              : isDarkMode 
              ? 'border-gray-600 bg-gray-700 text-gray-100' 
              : 'border-gray-300 bg-white text-gray-900'
          }`}
        />
        {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Account Number
        </label>
        <input
          type="text"
          value={formData.accountNumber}
          onChange={(e) => handleInputChange('accountNumber', e.target.value)}
          placeholder="1234567890"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.accountNumber 
              ? 'border-red-500' 
              : isDarkMode 
              ? 'border-gray-600 bg-gray-700 text-gray-100' 
              : 'border-gray-300 bg-white text-gray-900'
          }`}
        />
        {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Routing Number
        </label>
        <input
          type="text"
          value={formData.routingNumber}
          onChange={(e) => handleInputChange('routingNumber', e.target.value)}
          placeholder="021000021"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.routingNumber 
              ? 'border-red-500' 
              : isDarkMode 
              ? 'border-gray-600 bg-gray-700 text-gray-100' 
              : 'border-gray-300 bg-white text-gray-900'
          }`}
        />
        {errors.routingNumber && <p className="text-red-500 text-sm mt-1">{errors.routingNumber}</p>}
      </div>
    </div>
  );

  return (
    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        Payment Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Specific Forms */}
        {paymentMethod === 'card' && renderCardForm()}
        {paymentMethod === 'paypal' && renderPayPalForm()}
        {paymentMethod === 'bank' && renderBankForm()}
        {paymentMethod === 'digital' && (
          <div className="text-center py-8">
            <div className={`text-6xl mb-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              📱
            </div>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              You'll be prompted to use your device's payment method
            </p>
          </div>
        )}

        {/* Billing Information */}
        <div className="border-t pt-6">
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Billing Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@example.com"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email 
                    ? 'border-red-500' 
                    : isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-gray-100' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-gray-100' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  placeholder="12345"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-gray-100' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Card Option (for card payments) */}
        {paymentMethod === 'card' && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="saveCard"
              checked={formData.saveCard}
              onChange={(e) => handleInputChange('saveCard', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="saveCard" className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Save this card for future purchases
            </label>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;