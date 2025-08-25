import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Play, FileCheck, CreditCard, DollarSign, Star, XCircle } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext'; // Add this import

const JobProgress = ({ role = 'worker', initialStage = 1 }) => {
  const { isDarkMode } = useDarkMode(); // Add dark mode hook
  const [currentStage, setCurrentStage] = useState(initialStage);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const stages = [
    { id: 1, name: 'Application Pending', icon: Clock },
    { id: 2, name: 'Application Accepted', icon: CheckCircle },
    { id: 3, name: 'In Progress', icon: Play },
    { id: 4, name: 'Work Completed', icon: FileCheck },
    { id: 5, name: 'Payment Pending', icon: CreditCard },
    { id: 6, name: 'Payment Successful', icon: DollarSign },
    { id: 7, name: 'Review & Feedback', icon: Star },
    { id: 8, name: 'Job Closed', icon: XCircle }
  ];

  // Auto-progress from Payment Pending to Payment Successful for client
  useEffect(() => {
    if (currentStage === 5 && paymentProcessing) {
      const timer = setTimeout(() => {
        setCurrentStage(6);
        setPaymentProcessing(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStage, paymentProcessing]);

  const handleAcceptApplication = () => {
    if (currentStage === 1) {
      setCurrentStage(2);
    }
  };

  const handleStartWork = () => {
    if (currentStage === 2) {
      setCurrentStage(3);
    }
  };

  const handleMarkCompleted = () => {
    if (currentStage === 3) {
      setCurrentStage(4);
    }
  };

  const handleReleasePayment = () => {
    if (currentStage === 4) {
      setCurrentStage(5);
      setPaymentProcessing(true);
    }
  };

  const handleAcceptPayment = () => {
    if (currentStage === 5) {
      setCurrentStage(6);
    }
  };

  const handleSubmitReview = () => {
    if (currentStage === 6 && review.trim() && rating > 0) {
      setCurrentStage(7);
    }
  };

  const handleCloseJob = () => {
    if (currentStage === 7) {
      setCurrentStage(8);
    }
  };

  const getStageStatus = (stageId) => {
    if (stageId < currentStage) return 'completed';
    if (stageId === currentStage) return 'current';
    return 'pending';
  };

  const getStageClasses = (status) => {
    switch (status) {
      case 'completed':
        return `bg-gray-700 text-green-500 border-green-500`;
      case 'current':
        return `bg-gray-700 text-blue-500 border-blue-500`;
      case 'pending':
        return isDarkMode 
          ? 'bg-gray-700 text-gray-400 border-gray-600' 
          : 'bg-gray-200 text-gray-500 border-gray-300';
      default:
        return isDarkMode 
          ? 'bg-gray-700 text-gray-400 border-gray-600' 
          : 'bg-gray-200 text-gray-500 border-gray-300';
    }
  };

  const getConnectorClasses = (stageId) => {
    if (stageId < currentStage) return 'bg-green-500';
    return isDarkMode ? 'bg-gray-600' : 'bg-gray-300';
  };

  const renderStageMessage = () => {
    const messages = {
      worker: {
        1: "Waiting for Client to accept your application.",
        2: "Application accepted! You can now start work.",
        3: "You're currently working on this job.",
        4: "Work submitted. Waiting for Client Payment.",
        5: "Payment is being processed by the client.",
        6: "Payment received! You can accept it.",
        7: "Client has left a review. You can view it below.",
        8: "Job completed successfully!"
      },
      client: {
        1: "Worker has applied for this job.",
        2: "Job Accepted – waiting for Worker to start.",
        3: "Work is currently in Progress.",
        4: "Work has been completed by the worker.",
        5: "Processing Payment…",
        6: "Payment Successful! Leave a review.",
        7: "Review submitted. Worker can now close the job.",
        8: "Job completed successfully!"
      }
    };

    return messages[role][currentStage];
  };

  const renderRoleActions = () => {
    if (role === 'worker') {
      switch (currentStage) {
        case 2:
          return (
            <button
              onClick={handleStartWork}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors text-sm md:text-base w-full md:w-auto"
            >
              Start Work
            </button>
          );
        case 3:
          return (
            <button
              onClick={handleMarkCompleted}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors text-sm md:text-base w-full md:w-auto"
            >
              Mark as Completed
            </button>
          );
        case 6:
          return (
            <button
              onClick={handleAcceptPayment}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors text-sm md:text-base w-full md:w-auto"
            >
              Accept Payment Received
            </button>
          );
        case 7:
          return (
            <div className="space-y-4 w-full max-w-md mx-auto">
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 md:p-4 rounded-lg`}>
                <h4 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2 text-sm md:text-base`}>Client Review:</h4>
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className={`ml-2 text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>4/5 stars</span>
                </div>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-xs md:text-sm`}>Great work! Very professional and delivered on time.</p>
              </div>
              <button
                onClick={handleCloseJob}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors text-sm md:text-base w-full"
              >
                Close Job
              </button>
            </div>
          );
        default:
          return null;
      }
    } else if (role === 'client') {
      switch (currentStage) {
        case 1:
          return (
            <button
              onClick={handleAcceptApplication}
              className="bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors text-sm md:text-base w-full md:w-auto"
            >
              Accept Application
            </button>
          );
        case 4:
          return (
            <button
              onClick={handleReleasePayment}
              className="bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors text-sm md:text-base w-full md:w-auto"
            >
              Confirm & Release Payment
            </button>
          );
        case 5:
          return (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-blue-500 mr-2 md:mr-3"></div>
              <span className="text-blue-600 font-medium text-sm md:text-base">Processing Payment...</span>
            </div>
          );
        case 6:
          return (
            <div className="max-w-md mx-auto space-y-4 w-full px-4 md:px-0">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Rate this worker
                </label>
                <div className="flex justify-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 md:w-8 md:h-8 transition-colors ${
                          star <= rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300 hover:text-yellow-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="review" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Leave Review & Feedback
                </label>
                <textarea
                  id="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience with this worker..."
                  className={`w-full p-3 text-sm md:text-base rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  rows={4}
                />
              </div>
              <button
                onClick={handleSubmitReview}
                disabled={!review.trim() || rating === 0}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors text-sm md:text-base"
              >
                Submit Review
              </button>
            </div>
          );
        default:
          return null;
      }
    }
    return null;
  };

  return (
    <div className={`w-full max-w-6xl mx-auto p-3 md:p-4 lg:p-6 ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    } rounded-lg shadow-lg transition-colors duration-300`}>
      <div className="mb-6 md:mb-8">
        <h2 className={`text-xl md:text-2xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        } text-center mb-2`}>Job Progress Tracker</h2>
        <p className={`text-center text-sm md:text-base ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        } capitalize`}>{role} Dashboard</p>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-6 md:mb-8">
        {/* Mobile: Vertical layout */}
        <div className="md:hidden space-y-4">
          {stages.map((stage, index) => {
            const status = getStageStatus(stage.id);
            const Icon = stage.icon;
            
            return (
              <div key={stage.id} className="flex items-center relative">
                {/* Connector Line for mobile */}
                {index < stages.length - 1 && (
                  <div 
                    className={`absolute left-6 top-12 w-0.5 h-8 ${getConnectorClasses(stage.id)} z-0`}
                  />
                )}
                
                {/* Stage Circle */}
                <div className={`
                  w-12 h-12 rounded-full border-2 flex items-center justify-center mr-4 z-10 flex-shrink-0
                  ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
                  ${getStageClasses(status)}
                `}>
                  <Icon size={20} className="text-current" />
                </div>
                
                {/* Stage Label */}
                <div className="flex-1">
                  <span className={`text-sm font-medium ${
                    status === 'current' ? 'text-blue-500' : 
                    status === 'completed' ? 'text-green-500' : 
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {stage.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: Horizontal layout */}
        <div className="hidden md:flex justify-between items-start">
          {stages.map((stage, index) => {
            const status = getStageStatus(stage.id);
            const Icon = stage.icon;
            
            return (
              <div key={stage.id} className="flex flex-col items-center relative flex-1">
                {/* Connector Line */}
                {index < stages.length - 1 && (
                  <div 
                    className={`absolute top-6 left-1/2 h-1 ${getConnectorClasses(stage.id)} z-0`}
                    style={{ 
                      width: 'calc(100% - 1.5rem)',
                      marginLeft: '0.75rem'
                    }}
                  />
                )}
                
                {/* Stage Circle */}
                <div className={`
                  w-12 h-12 rounded-full border-2 flex items-center justify-center mb-3 z-10
                  ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
                  ${getStageClasses(status)}
                `}>
                  <Icon size={20} className="text-current" />
                </div>
                
                {/* Stage Label */}
                <span className={`text-xs font-medium text-center px-1 leading-tight ${
                  status === 'current' ? 'text-blue-500' : 
                  status === 'completed' ? 'text-green-500' : 
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {stage.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Stage Information */}
      <div className="text-center mb-6 md:mb-8">
        <div className={`inline-block ${
          isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
        } border rounded-lg px-4 md:px-6 py-3`}>
          <h3 className={`text-base md:text-lg font-semibold ${
            isDarkMode ? 'text-blue-400' : 'text-blue-800'
          } mb-1`}>
            Stage {currentStage}: {stages[currentStage - 1]?.name}
          </h3>
          <p className={`${isDarkMode ? 'text-blue-300' : 'text-blue-700'} text-xs md:text-sm`}>
            {renderStageMessage()}
          </p>
        </div>
      </div>

      {/* Review Section Dark Mode Updates */}
      {currentStage === 7 && role === 'worker' && (
        <div className={`${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
        } p-3 md:p-4 rounded-lg mb-4`}>
          <h4 className={`font-medium ${
            isDarkMode ? 'text-gray-200' : 'text-gray-800'
          } mb-2 text-sm md:text-base`}>Client Review:</h4>
          <div className="flex items-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
            <span className={`ml-2 text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>4/5 stars</span>
          </div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-xs md:text-sm`}>Great work! Very professional and delivered on time.</p>
        </div>
      )}

      {/* Role-specific Actions */}
      <div className="flex justify-center mb-4 md:mb-6 px-4 md:px-0">
        {renderRoleActions()}
      </div>

      {/* Completion Message */}
      {currentStage === 8 && (
        <div className="text-center px-4 md:px-0">
          <div className={`inline-flex items-center ${
            isDarkMode 
              ? 'bg-green-900/20 text-green-400' 
              : 'bg-green-100 text-green-800'
          } px-4 md:px-6 py-3 rounded-lg`}>
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            <span className="text-base md:text-lg font-semibold">Job Completed Successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobProgress;