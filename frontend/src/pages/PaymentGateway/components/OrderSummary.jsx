import React from 'react';
import { ShoppingCart, Tag, Percent } from 'lucide-react';
import { useDarkMode } from '../../../contexts/DarkModeContext';

const OrderSummary = ({ data }) => {
  const { isDarkMode } = useDarkMode();
  
  const subtotal = data.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || data.amount;
  const taxRate = 0.08; // 8% tax
  const tax = subtotal * taxRate;
  const discount = 0; // No discount in this demo
  const total = subtotal + tax - discount;

  return (
    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-6`}>
      <div className="flex items-center mb-4">
        <ShoppingCart className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Order Summary
        </h3>
      </div>

      {/* Order ID */}
      <div className="mb-2 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Order ID:</span>
          <span className={`text-sm font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {data.orderId}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-4">
        {data.items?.map((item) => (
          <div key={item.id} className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {item.name}
              </h4>
              {item.description && (
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {item.description}
                </p>
              )}
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Qty: {item.quantity}
              </div>
            </div>
            <div className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              LKR {(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        )) || (
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h4 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {data.description || 'Service Payment'}
              </h4>
            </div>
            <div className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              LKR {data.amount?.toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {/* Calculations */}
      <div className="space-y-2 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between">
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Subtotal:</span>
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            LKR {subtotal.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Tax (8%):</span>
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            LKR {tax.toFixed(2)}
          </span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center">
              <Percent className="w-4 h-4 mr-1" />
              Discount:
            </span>
            <span>-LKR {discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className={`flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-700 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          <span>Total:</span>
          <span> LKR {total.toFixed(2)}</span>
        </div>
      </div>

      {/* Promo Code Section */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Promo code"
            className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400' 
                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
            }`}
          />
          <button className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}>
            Apply
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <div className="flex items-center mb-2">
          <Tag className="w-3 h-3 mr-1" />
          <span>All prices include applicable fees</span>
        </div>
        <p>
          By proceeding, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;