import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Play, FileCheck, CreditCard, DollarSign, Star, XCircle } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import RatingSystem from '../RatingReviewPage/RatingSystem';
import { 
  acceptApplication, 
  startWork, 
  completeWork, 
  releasePayment, 
  confirmPayment, 
  submitReview, 
  closeJob,
  getStageFromStatus 
} from '../../services/applicationProgressService';

const JobProgress = ({ role = 'worker', initialStage = 1, jobData, applicationData, applicationStatus }) => {
  const { isDarkMode } = useDarkMode();
  
  // Use application status to determine current stage if available
  const actualInitialStage = applicationStatus ? getStageFromStatus(applicationStatus) : initialStage;
  
  const [currentStage, setCurrentStage] = useState(actualInitialStage);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [clientReview, setClientReview] = useState(null); // Store the actual review from client
  
  // Payment method selection state
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Use application data if available for more context
  const application = applicationData || jobData;
  const applicationId = application?.applicationId || application?.id || application?._id;

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

  // Generic API action handler
  const handleApiAction = async (actionFn, successMessage, nextStage) => {
    if (!applicationId) {
      setError('Application ID not found');
      return;
    }

    console.log('handleApiAction called with:', {
      applicationId,
      actionName: actionFn.name,
      nextStage
    });

    setLoading(true);
    setError('');

    try {
      await actionFn(applicationId);
      setCurrentStage(nextStage);
      console.log(successMessage);
    } catch (err) {
      console.error('Action failed:', err);
      setError(err.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptApplication = () => {
    handleApiAction(acceptApplication, 'Application accepted successfully', 2);
  };

  const handleStartWork = () => {
    handleApiAction(startWork, 'Work started successfully', 3);
  };

  const handleMarkCompleted = () => {
    handleApiAction(completeWork, 'Work completed successfully', 4);
  };

  const handleReleasePayment = () => {
    // Go directly to stage 5 where payment method selection happens
    // Don't call API yet - wait for payment method selection
    setCurrentStage(5);
    setError(''); // Clear any previous errors
  };

  const handlePaymentMethodSubmit = () => {
    if (!paymentAmount.trim()) {
      setError('Please enter payment amount');
      return;
    }

    setPaymentProcessing(true);
    
    const paymentData = {
      paymentMethod,
      amount: parseFloat(paymentAmount),
      notes: paymentNotes.trim() || undefined
    };
    
    // After payment method selection, call API and go to stage 6 (waiting for worker)
    handleApiAction(() => releasePayment(applicationId, paymentData), 'Payment released successfully', 6);
  };

  const handleAcceptPayment = () => {
    handleApiAction(confirmPayment, 'Payment confirmed successfully', 7);
  };

  const handleSubmitReview = async (reviewData = null) => {
    // Use provided data or fallback to component state
    const finalRating = reviewData?.rating || rating;
    const finalReview = reviewData?.comment || review;

    console.log('handleSubmitReview called with:', {
      reviewData,
      finalRating,
      finalReview,
      applicationId,
      application: application ? {
        id: application._id,
        applicationId: application.applicationId,
        status: application.status
      } : null
    });

    if (!finalRating || finalRating === 0) {
      setError('Please provide a rating');
      return;
    }

    if (!applicationId) {
      console.error('Application ID not found. Application data:', application);
      setError('Application ID not found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Calling submitReview with:', { applicationId, finalRating, finalReview });
      await submitReview(applicationId, finalRating, finalReview);
      
      // Store the client review data
      setClientReview({
        rating: finalRating,
        comment: finalReview,
        submittedAt: new Date()
      });
      
      setReviewSubmitted(true);
      // Stay in stage 7 but update the worker's view to show they can close
      console.log('Review submitted successfully');
      
      // Update local state if using external data
      if (reviewData) {
        setRating(reviewData.rating);
        setReview(reviewData.comment);
      }
    } catch (err) {
      console.error('Review submission failed:', err);
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseJob = () => {
    handleApiAction(closeJob, 'Job closed successfully', 8);
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
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors text-sm md:text-base w-full md:w-auto flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Starting...
                </>
              ) : (
                'Start Work'
              )}
            </button>
          );
        case 3:
          return (
            <button
              onClick={handleMarkCompleted}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors text-sm md:text-base w-full md:w-auto flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Completing...
                </>
              ) : (
                'Mark as Completed'
              )}
            </button>
          );
        case 6:
          const paymentMethod = application?.payment?.method || 'online';
          const buttonText = paymentMethod === 'physical' ? 'Confirm Cash Received' : 'Confirm Payment Received';
          const paymentInfo = application?.payment;
          return (
            <div className="text-center space-y-4 max-w-md mx-auto">
              {paymentInfo && (
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
                    Payment Details
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      <strong>Method:</strong> {paymentInfo.method === 'physical' ? 'Cash Payment' : 'Online Payment'}
                    </p>
                    {paymentInfo.amount && (
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        <strong>Amount:</strong> ${paymentInfo.amount.toFixed(2)}
                      </p>
                    )}
                    {paymentInfo.notes && (
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        <strong>Notes:</strong> {paymentInfo.notes}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <button
                onClick={handleAcceptPayment}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors text-sm md:text-base w-full md:w-auto flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Confirming...
                  </>
                ) : (
                  buttonText
                )}
              </button>
            </div>
          );
        case 7:
          // Worker waits for client review and then can close the job
          return (
            <div className="space-y-4 w-full max-w-md mx-auto">
              {reviewSubmitted && clientReview ? (
                // Show client's review and allow worker to close job
                <div className="space-y-4 text-center">
                  <div className="space-y-3">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      Client Review Received!
                    </h3>
                  </div>

                  {/* Display the actual client review */}
                  <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg text-left`}>
                    <h4 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-3`}>
                      Client Review:
                    </h4>
                    
                    {/* Rating stars */}
                    <div className="flex items-center mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= clientReview.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {clientReview.rating}/5 stars
                      </span>
                    </div>
                    
                    {/* Review comment */}
                    {clientReview.comment && (
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm leading-relaxed`}>
                        "{clientReview.comment}"
                      </p>
                    )}
                  </div>

                  {/* Payment summary */}
                  {application?.payment && (
                    <div className={`${isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg p-4`}>
                      <h4 className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-green-800'} mb-2`}>
                        Payment Received ✓
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className={isDarkMode ? 'text-green-200' : 'text-green-700'}>
                          <strong>Amount:</strong> Rs. {application.payment.amount?.toLocaleString()}
                        </p>
                        <p className={isDarkMode ? 'text-green-200' : 'text-green-700'}>
                          <strong>Method:</strong> {application.payment.method === 'physical' ? 'Cash Payment' : 'Online Payment'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Close job button */}
                  <button
                    onClick={handleCloseJob}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Closing Job...
                      </>
                    ) : (
                      'Close Job'
                    )}
                  </button>
                </div>
              ) : (
                // Show waiting state
                <div className="space-y-4 text-center">
                  <div className="space-y-4">
                    <Star className="w-12 h-12 text-yellow-500 mx-auto" />
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      Waiting for Client Review
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      The client is reviewing your work. You'll be able to close the job once they submit their review.
                    </p>
                    
                    {/* Show payment completion status */}
                    {application?.payment && (
                      <div className={`${isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg p-4`}>
                        <h4 className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-green-800'} mb-2`}>
                          Payment Received ✓
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p className={isDarkMode ? 'text-green-200' : 'text-green-700'}>
                            <strong>Amount:</strong> Rs. {application.payment.amount?.toLocaleString()}
                          </p>
                          <p className={isDarkMode ? 'text-green-200' : 'text-green-700'}>
                            <strong>Method:</strong> {application.payment.method === 'physical' ? 'Cash Payment' : 'Online Payment'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Loading indicator */}
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Waiting for client feedback...
                      </span>
                    </div>
                  </div>
                </div>
              )}
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
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors text-sm md:text-base w-full md:w-auto flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Accepting...
                </>
              ) : (
                'Accept Application'
              )}
            </button>
          );
        case 4:
          return (
            <button
              onClick={handleReleasePayment}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors text-sm md:text-base w-full md:w-auto flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                'Confirm & Release Payment'
              )}
            </button>
          );
        case 5:
          return (
            <div className="text-center space-y-4 max-w-md mx-auto">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                Choose Payment Method
              </h3>
              
              <div className="space-y-4">
                {/* Payment Amount */}
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Payment Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount (e.g., 150.00)"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-200' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Payment Method
                  </label>
                  <div className="space-y-3">
                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                      paymentMethod === 'online' 
                        ? isDarkMode ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-50'
                        : isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          Online Payment
                        </span>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Bank Transfer / Digital Payment
                        </p>
                      </div>
                    </label>
                    
                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                      paymentMethod === 'physical' 
                        ? isDarkMode ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-50'
                        : isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="physical"
                        checked={paymentMethod === 'physical'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          Cash Payment
                        </span>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Pay cash directly to worker
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Payment Notes */}
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Notes (Optional)
                  </label>
                  <textarea
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    placeholder="Add any payment details or instructions..."
                    rows="2"
                    className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-200' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                {/* Payment Method Info */}
                {paymentMethod === 'physical' && (
                  <div className={`${isDarkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-3`}>
                    <p className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                      <strong>Cash Payment:</strong> The worker will confirm when they receive the cash payment.
                    </p>
                  </div>
                )}
                
                {paymentMethod === 'online' && (
                  <div className={`${isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-3`}>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                      <strong>Online Payment:</strong> Complete your payment and the worker will be notified.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <button
                  onClick={handlePaymentMethodSubmit}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Confirm Payment Method'
                  )}
                </button>
              </div>
            </div>
          );
        case 6:
          const paymentInfo = application?.payment;
          return (
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-blue-500 mr-2 md:mr-3"></div>
                <span className="text-blue-600 font-medium text-sm md:text-base">Waiting for Worker Confirmation...</span>
              </div>
              {paymentInfo && (
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg max-w-sm mx-auto`}>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <strong>Payment Method:</strong> {paymentInfo.method === 'physical' ? 'Cash Payment' : 'Online Payment'}
                  </p>
                  {paymentInfo.amount && (
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <strong>Amount:</strong> ${paymentInfo.amount.toFixed(2)}
                    </p>
                  )}
                  {paymentInfo.notes && (
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                      <strong>Notes:</strong> {paymentInfo.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        case 7:
          const reviewPaymentInfo = application?.payment;
          return (
            <div className="max-w-md mx-auto space-y-4 w-full px-4 md:px-0">
              {reviewSubmitted ? (
                // Show completion message after review is submitted
                <div className="space-y-4 text-center">
                  <div className="space-y-3">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      Review Submitted Successfully!
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Thank you for your feedback. The worker can now close the job.
                    </p>
                  </div>

                  {/* Show submitted review */}
                  {clientReview && (
                    <div className={`${isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4 text-left`}>
                      <h4 className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-800'} mb-3`}>
                        Your Review:
                      </h4>
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= clientReview.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className={`ml-2 text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                          {clientReview.rating}/5 stars
                        </span>
                      </div>
                      {clientReview.comment && (
                        <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-700'} italic`}>
                          "{clientReview.comment}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Payment Summary */}
                  {reviewPaymentInfo && (
                    <div className={`${isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg p-3`}>
                      <h4 className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-green-800'} mb-2 text-sm`}>
                        Payment Completed ✓
                      </h4>
                      <div className="space-y-1 text-xs">
                        <p className={isDarkMode ? 'text-green-200' : 'text-green-700'}>
                          <strong>Method:</strong> {reviewPaymentInfo.method === 'physical' ? 'Cash Payment' : 'Online Payment'}
                        </p>
                        {reviewPaymentInfo.amount && (
                          <p className={isDarkMode ? 'text-green-200' : 'text-green-700'}>
                            <strong>Amount:</strong> Rs. {reviewPaymentInfo.amount.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Waiting for worker to close */}
                  <div className="flex items-center justify-center space-x-2 py-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Waiting for worker to close the job...
                    </span>
                  </div>
                </div>
              ) : (
                // Show review form
                <div className="space-y-4">
                  {/* Payment Summary */}
                  {reviewPaymentInfo && (
                    <div className={`${isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg p-3 mb-4`}>
                      <h4 className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-green-800'} mb-2 text-sm`}>
                        Payment Completed ✓
                      </h4>
                      <div className="space-y-1 text-xs">
                        <p className={isDarkMode ? 'text-green-200' : 'text-green-700'}>
                          <strong>Method:</strong> {reviewPaymentInfo.method === 'physical' ? 'Cash Payment' : 'Online Payment'}
                        </p>
                        {reviewPaymentInfo.amount && (
                          <p className={isDarkMode ? 'text-green-200' : 'text-green-700'}>
                            <strong>Amount:</strong> Rs. {reviewPaymentInfo.amount.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Enhanced Rating Section with RatingSystem Component */}
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                        Rate Your Experience
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Help others by sharing your experience with {application.workerId?.name}
                      </p>
                    </div>

                    <RatingSystem
                      onRatingSubmit={(reviewData) => {
                        // Call handleSubmitReview with the review data
                        handleSubmitReview(reviewData);
                      }}
                      workerId={application.workerId?._id}
                      jobTitle={application.jobId?.title}
                      workerName={application.workerId?.name}
                      showJobContext={false}
                      submitButtonText="Submit Review"
                      isLoading={loading}
                      size="medium"
                      showWorkerInfo={false}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        case 8:
          return (
            <div className="max-w-md mx-auto space-y-4 w-full px-4 md:px-0 text-center">
              <div className="space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Job Completed Successfully!
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Thank you for using our platform. Your review has been submitted and the job is now closed.
                </p>
                
                {/* Final Payment Summary */}
                {application?.payment && (
                  <div className={`${isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg p-4`}>
                    <h4 className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-green-800'} mb-2`}>
                      Final Payment Summary
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p className={isDarkMode ? 'text-green-200' : 'text-green-700'}>
                        <strong>Amount:</strong> Rs. {application.payment.amount?.toLocaleString()}
                      </p>
                      <p className={isDarkMode ? 'text-green-200' : 'text-green-700'}>
                        <strong>Method:</strong> {application.payment.method === 'physical' ? 'Cash Payment' : 'Online Payment'}
                      </p>
                      <p className={isDarkMode ? 'text-green-200' : 'text-green-700'}>
                        <strong>Status:</strong> Completed ✓
                      </p>
                    </div>
                  </div>
                )}

                {/* Review Summary */}
                {rating > 0 && (
                  <div className={`${isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
                    <h4 className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-800'} mb-2`}>
                      Your Review
                    </h4>
                    <div className="flex justify-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    {review && (
                      <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-700'} italic`}>
                        "{review}"
                      </p>
                    )}
                  </div>
                )}
              </div>
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

      {/* Error Message */}
      {error && (
        <div className="mb-6 mx-auto max-w-md">
          <div className={`p-4 rounded-lg border ${
            isDarkMode 
              ? 'bg-red-900/20 border-red-800 text-red-400' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p className="text-sm font-medium">Error: {error}</p>
          </div>
        </div>
      )}

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