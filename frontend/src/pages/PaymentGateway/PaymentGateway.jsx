import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PaymentMethods from './components/PaymentMethods';
import PaymentForm from './components/PaymentForm';
import OrderSummary from './components/OrderSummary';
import PaymentConfirmation from './components/PaymentConfirmation';
import PaymentHistory from './components/PaymentHistory';
import SecurityBadges from './components/SecurityBadges';
import LoadingSpinner from './components/LoadingSpinner';

const PaymentGateway = () => {
  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check for pending payment from job progress
  const [pendingPayment, setPendingPayment] = useState(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    currency: 'USD',
    description: '',
    orderId: '',
    items: []
  });
  const [paymentResult, setPaymentResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Initialize with pending payment data from job progress
  useEffect(() => {
    const pendingPaymentData = sessionStorage.getItem('pendingPayment');
    if (pendingPaymentData) {
      const payment = JSON.parse(pendingPaymentData);
      setPendingPayment(payment);
      
      // Set up payment data for job payment
      setPaymentData({
        amount: payment.amount,
        currency: 'USD',
        description: payment.description || 'Job Payment',
        orderId: `JOB-${payment.applicationId || Date.now()}`,
        recipient: payment.recipient,
        notes: payment.notes,
        jobId: payment.jobId,
        applicationId: payment.applicationId,
        returnTo: payment.returnTo,
        items: [{
          id: payment.jobId,
          name: payment.description || 'Job Payment',
          description: `Payment for: ${payment.description}`,
          quantity: 1,
          price: payment.amount
        }]
      });
    } else {
      // Demo order data for standalone payment gateway testing
      setPaymentData({
        amount: 150.00,
        currency: 'USD',
        description: 'Professional Web Development Service',
        orderId: `ORD-${Date.now()}`,
        items: [
          {
            id: 1,
            name: 'Web Development Service',
            description: 'Custom website development with modern technologies',
            quantity: 1,
            price: 150.00
          }
        ]
      });
    }
  }, []);

  // Check if user is authenticated for job payments
  useEffect(() => {
    if (pendingPayment && !user) {
      toast.error('Please log in to complete payment');
      navigate('/login');
    }
  }, [pendingPayment, user, navigate]);

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handlePaymentSubmit = async (formData) => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate payment result
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      if (success) {
        const result = {
          success: true,
          transactionId: `TXN-${Date.now()}`,
          amount: paymentData.amount,
          currency: paymentData.currency,
          method: selectedPaymentMethod,
          timestamp: new Date().toISOString(),
          status: 'completed',
          orderId: paymentData.orderId,
          description: paymentData.description,
          notes: paymentData.notes,
          ...formData
        };
        
        setPaymentResult(result);
        setCurrentStep(4); // Move to confirmation step
        toast.success('Payment processed successfully!');
        
        // If this is a job payment, store the result for JobProgress component
        if (pendingPayment) {
          sessionStorage.setItem('paymentResult', JSON.stringify(result));
          sessionStorage.removeItem('pendingPayment'); // Clean up
        }
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    } catch (error) {
      toast.error(error.message || 'Payment failed. Please try again.');
      const errorResult = {
        success: false,
        error: error.message || 'Payment failed'
      };
      setPaymentResult(errorResult);
      
      // If this is a job payment, store the error result
      if (pendingPayment) {
        sessionStorage.setItem('paymentResult', JSON.stringify(errorResult));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReturnToJob = () => {
    console.log('handleReturnToJob called - navigating to work history');
    
    // Always navigate to work history page as requested
    navigate('/workhistory');
  };

  const handleStepChange = (step) => {
    if (step <= currentStep || step === 1) {
      setCurrentStep(step);
    }
  };

  const resetPayment = () => {
    setCurrentStep(1);
    setPaymentResult(null);
    setSelectedPaymentMethod('card');
    setIsProcessing(false);
  };

  const steps = [
    { id: 1, title: 'Payment Method', description: 'Choose how to pay' },
    { id: 2, title: 'Payment Details', description: 'Enter payment information' },
    { id: 3, title: 'Review Order', description: 'Confirm your order' },
    { id: 4, title: 'Confirmation', description: 'Payment complete' }
  ];

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`text-center p-8 rounded-lg ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="text-gray-500 mb-4">You need to be logged in to access the payment gateway.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Payment Gateway
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Secure and fast payment processing
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center mb-4 space-x-4">
          <button
            onClick={() => setShowHistory(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !showHistory
                ? 'bg-blue-600 text-white'
                : isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Make Payment
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showHistory
                ? 'bg-blue-600 text-white'
                : isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Payment History
          </button>
        </div>

        {showHistory ? (
          <PaymentHistory />
        ) : (
          <>
            {/* Progress Steps */}
            <div className="mb-4">
              <div className="flex justify-center">
                <div className="flex items-center space-x-4">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => handleStepChange(step.id)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                            currentStep >= step.id
                              ? 'bg-blue-600 text-white'
                              : isDarkMode
                              ? 'bg-gray-700 text-gray-400'
                              : 'bg-gray-200 text-gray-500'
                          } ${currentStep >= step.id ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                          disabled={currentStep < step.id && step.id !== 1}
                        >
                          {step.id}
                        </button>
                        <div className="text-center mt-2">
                          <div className={`text-sm font-medium ${
                            currentStep >= step.id
                              ? isDarkMode ? 'text-gray-100' : 'text-gray-900'
                              : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {step.title}
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {step.description}
                          </div>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-16 h-0.5 ${
                          currentStep > step.id ? 'bg-blue-600' : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              {/* Left Column - Payment Process */}
              <div className="lg:col-span-2">
                {isProcessing && <LoadingSpinner />}
                
                {!isProcessing && (
                  <>
                    {currentStep === 1 && (
                      <PaymentMethods
                        selectedMethod={selectedPaymentMethod}
                        onMethodSelect={handlePaymentMethodSelect}
                        onNext={() => setCurrentStep(2)}
                      />
                    )}

                    {currentStep === 2 && (
                      <PaymentForm
                        paymentMethod={selectedPaymentMethod}
                        onSubmit={(formData) => {
                          setCurrentStep(3);
                          // Store form data if needed
                        }}
                        onBack={() => setCurrentStep(1)}
                      />
                    )}

                    {currentStep === 3 && (
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                        <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          Review Your Order
                        </h3>
                        <div className="space-y-4 mb-6">
                          <div className="flex justify-between">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Payment Method:</span>
                            <span className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                              {selectedPaymentMethod === 'card' ? 'Credit/Debit Card' :
                               selectedPaymentMethod === 'paypal' ? 'PayPal' :
                               selectedPaymentMethod === 'bank' ? 'Bank Transfer' : 'Digital Wallet'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Amount:</span>
                            <span className={`font-bold text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                              ${paymentData.amount.toFixed(2)} {paymentData.currency}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => setCurrentStep(2)}
                            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                              isDarkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Back
                          </button>
                          <button
                            onClick={() => handlePaymentSubmit({})}
                            className="flex-1 py-3 px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                          >
                            Confirm Payment
                          </button>
                        </div>
                      </div>
                    )}

                    {currentStep === 4 && (
                      <PaymentConfirmation
                        result={paymentResult}
                        onNewPayment={resetPayment}
                        isJobPayment={!!pendingPayment}
                        onReturnToJob={handleReturnToJob}
                        jobDetails={pendingPayment}
                      />
                    )}
                  </>
                )}
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummary data={paymentData} />
                
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentGateway;