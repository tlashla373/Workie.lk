import React from 'react';
import { CheckCircle, XCircle, Download, Share2, ArrowLeft, Copy } from 'lucide-react';
import { useDarkMode } from '../../../contexts/DarkModeContext';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import LogoImage from '../../../assets/Logo.png';

const PaymentConfirmation = ({ 
  result, 
  onNewPayment, 
  isJobPayment = false, 
  onReturnToJob = null, 
  jobDetails = null 
}) => {
  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Function to handle return to work history
  const handleReturnToWorkHistory = () => {
    if (onReturnToJob && typeof onReturnToJob === 'function') {
      // Try the provided function first
      onReturnToJob();
    } else {
      // Fallback to direct navigation
      navigate('/workhistory');
    }
  };

  const copyTransactionId = () => {
    if (result?.transactionId) {
      navigator.clipboard.writeText(result.transactionId);
      toast.success('Transaction ID copied to clipboard');
    }
  };

  const downloadReceipt = async () => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;
      
      // Colors matching the design
      const primaryBlue = '#4F46E5'; // Indigo blue for branding
      const darkGray = '#1F2937';
      const mediumGray = '#6B7280';
      const lightGray = '#9CA3AF';
      const greenSuccess = '#10B981';
      
      // Function to load and convert image to base64
      const loadImageAsBase64 = (imagePath) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = this.width;
            canvas.height = this.height;
            ctx.drawImage(this, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
          };
          img.onerror = reject;
          img.src = imagePath;
        });
      };

      // Try to load and add the logo
      try {
        const logoBase64 = await loadImageAsBase64(LogoImage);
        // Add logo - positioned at top left
        pdf.addImage(logoBase64, 'PNG', 20, 15, 25, 25);
      } catch (error) {
        console.log('Could not load logo, using text instead');
        // Fallback to text logo
        pdf.setFontSize(20);
        pdf.setTextColor(primaryBlue);
        pdf.setFont('helvetica', 'bold');
        pdf.text('W', 25, 35);
      }

      // Company name next to logo
      pdf.setFontSize(16);
      pdf.setTextColor(primaryBlue);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Workie.lk Payment Receipt', 55, 30);
      
      // Header line
      pdf.setDrawColor(primaryBlue);
      pdf.setLineWidth(1);
      pdf.line(20, 50, pageWidth - 20, 50);
      
      // Payment Receipt Title
      let yPosition = 70;
      pdf.setFontSize(18);
      pdf.setTextColor(darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Payment Receipt', 20, yPosition);
      
      yPosition += 5;
      pdf.setFontSize(10);
      pdf.setTextColor(mediumGray);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Transaction ID: PAY_${result?.transactionId || Date.now()}`, 20, yPosition);
      
      yPosition += 20;
      
      // Main content area with border
      const contentStartY = yPosition;
      
      // Job Details Section
      pdf.setFontSize(12);
      pdf.setTextColor(darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Job Title', 20, yPosition);
      
      yPosition += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(darkGray);
      pdf.setFont('helvetica', 'normal');
      pdf.text(jobDetails?.description || result?.description || 'Logo Design for Tech Startup', 20, yPosition);
      
      // Payment Method (top right)
      pdf.setFontSize(12);
      pdf.setTextColor(darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Payment Method', pageWidth - 100, contentStartY);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const paymentMethodText = result?.method === 'card' ? 'Card' :
                               result?.method === 'paypal' ? 'PayPal' :
                               result?.method === 'bank' ? 'Bank Transfer' : 'Card';
      pdf.text(paymentMethodText, pageWidth - 100, contentStartY + 8);
      
      yPosition += 20;
      
      // Worker Section
      pdf.setFontSize(12);
      pdf.setTextColor(darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Worker', 20, yPosition);
      
      yPosition += 8;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(jobDetails?.recipient || 'Saman Bandara', 20, yPosition);
      
      // Payment Date (top right)
      pdf.setFontSize(12);
      pdf.setTextColor(darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Payment Date', pageWidth - 100, yPosition - 8);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const paymentDate = new Date(result?.timestamp || Date.now()).toLocaleDateString('en-GB');
      pdf.text(paymentDate, pageWidth - 100, yPosition);
      
      yPosition += 20;
      
      // Client Section
      pdf.setFontSize(12);
      pdf.setTextColor(darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Client', 20, yPosition);
      
      yPosition += 8;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const clientName = user?.name || user?.firstName + ' ' + user?.lastName || 'Avishka Madhushan';
      pdf.text(clientName, 20, yPosition);
      
      // Amount Paid (top right)
      pdf.setFontSize(12);
      pdf.setTextColor(darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Amount Paid', pageWidth - 100, yPosition - 8);
      
      pdf.setFontSize(14);
      pdf.setTextColor(greenSuccess);
      pdf.setFont('helvetica', 'bold');
      const currency = result?.currency === 'LKR' ? 'LKR' : 'LKR ';
      const amount = result?.amount || 1025;
      pdf.text(`${currency}${amount.toLocaleString()}`, pageWidth - 100, yPosition);
      
      yPosition += 30;
      
      // Payment Breakdown Section
      pdf.setFontSize(14);
      pdf.setTextColor(darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Payment Breakdown', 20, yPosition);
      
      yPosition += 15;
      
      // Breakdown details
      const jobAmount = result?.amount ? (result.amount * 0.975) : 1000; // 97.5% to worker
      const platformFee = result?.amount ? (result.amount * 0.025) : 25; // 2.5% platform fee
      const total = result?.amount || 1025;
      
      // Job Amount line
      pdf.setFontSize(11);
      pdf.setTextColor(mediumGray);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Job Amount', 30, yPosition);
      pdf.text(`${currency}${jobAmount.toLocaleString()}`, pageWidth - 50, yPosition);
      
      yPosition += 12;
      
      // Platform Fee line
      pdf.text('Platform Fee (2.5%)', 30, yPosition);
      pdf.text(`${currency}${platformFee.toLocaleString()}`, pageWidth - 50, yPosition);
      
      yPosition += 15;
      
      // Total line with emphasis
      pdf.setDrawColor(lightGray);
      pdf.setLineWidth(0.5);
      pdf.line(30, yPosition - 8, pageWidth - 30, yPosition - 8);
      
      pdf.setFontSize(12);
      pdf.setTextColor(darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Total', 30, yPosition);
      pdf.text(`${currency}${total.toLocaleString()}`, pageWidth - 50, yPosition);
      
      yPosition += 30;
      
      // Footer section
      pdf.setDrawColor(lightGray);
      pdf.setLineWidth(0.5);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      
      yPosition += 15;
      
      // Footer text
      pdf.setFontSize(9);
      pdf.setTextColor(mediumGray);
      pdf.setFont('helvetica', 'normal');
      pdf.text('This is a computer-generated receipt. No signature required.', 20, yPosition);
      
      yPosition += 10;
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, yPosition);
      pdf.text('For support: support@workie.lk', pageWidth - 80, yPosition);
      
      // Save the PDF
      const fileName = `workie-receipt-${result?.transactionId || Date.now()}.pdf`;
      pdf.save(fileName);
      
      toast.success('Receipt PDF downloaded successfully!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Fallback to JSON download if PDF generation fails
      const receiptData = {
        companyName: 'Workie.lk',
        receiptTitle: 'Payment Receipt',
        transactionId: result?.transactionId,
        amount: result?.amount,
        currency: result?.currency,
        method: result?.method,
        status: result?.status,
        timestamp: result?.timestamp,
        clientDetails: {
          name: user?.name || user?.firstName + ' ' + user?.lastName,
          email: user?.email,
          userId: user?.id || user?._id
        },
        jobDetails: isJobPayment ? jobDetails : null,
        generatedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(receiptData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${result?.transactionId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.warning('PDF generation failed. Downloaded as JSON instead.');
    }
  };

  const shareReceipt = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Payment Receipt',
          text: `Payment of $${result?.amount} ${result?.currency} completed successfully. Transaction ID: ${result?.transactionId}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      const shareText = `Payment of $${result?.amount} ${result?.currency} completed successfully. Transaction ID: ${result?.transactionId}`;
      navigator.clipboard.writeText(shareText);
      toast.success('Receipt details copied to clipboard');
    }
  };

  if (!result) {
    return (
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}>
        <div className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          No payment result available
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="text-center mb-8">
        {result.success ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Payment Successful!
            </h2>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Your payment has been processed successfully
            </p>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Payment Failed
            </h2>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {result.error || 'Something went wrong with your payment'}
            </p>
          </>
        )}
      </div>

      {result.success && (
        <>
          {/* Transaction Details */}
          <div className={`bg-gray-50 dark:bg-gray-200 rounded-lg p-4 mb-6`}>
            <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Transaction Details
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Transaction ID:</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-mono text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {result.transactionId}
                  </span>
                  <button
                    onClick={copyTransactionId}
                    className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    title="Copy Transaction ID"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Amount:</span>
                <span className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  LKR {result.amount?.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Payment Method:</span>
                <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                  {result.method === 'card' ? 'Credit/Debit Card' :
                   result.method === 'paypal' ? 'PayPal' :
                   result.method === 'bank' ? 'Bank Transfer' : 'Digital Wallet'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Status:</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {result.status || 'Completed'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Date & Time:</span>
                <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                  {new Date(result.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
            <button
              onClick={downloadReceipt}
              className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Download className="w-5 h-5" />
              <span>Download Receipt</span>
            </button>
            
            <button
              onClick={shareReceipt}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Share Receipt</span>
            </button>
          </div>

          {/* Additional Information */}
          <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6`}>
            <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              What happens next?
            </h4>
            <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
              <li>• You will receive a confirmation email shortly</li>
              <li>• Your service will be activated within 24 hours</li>
              <li>• You can track your order in the dashboard</li>
              <li>• Support is available 24/7 if you need assistance</li>
            </ul>
          </div>
        </>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        {result.success ? (
          <>
            {isJobPayment && onReturnToJob ? (
              // Job payment success - return to work history
              <button
                onClick={handleReturnToWorkHistory}
                className="py-3 px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Return to Work History
              </button>
            ) : (
              // Regular payment success - dashboard option
              <button
                onClick={() => window.location.href = '/dashboard'}
                className={`flex items-center space-x-2 py-3 px-6 rounded-lg font-medium transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>
            )}
            
            {/* Always show option for new payment */}
            <button
              onClick={onNewPayment}
              className="py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Make Another Payment
            </button>
          </>
        ) : (
          <>
            {isJobPayment && onReturnToJob ? (
              // Job payment failed - return to work history
              <button
                onClick={handleReturnToWorkHistory}
                className={`flex items-center space-x-2 py-3 px-6 rounded-lg font-medium transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Work History</span>
              </button>
            ) : (
              // Regular payment failed - dashboard option
              <button
                onClick={() => window.location.href = '/dashboard'}
                className={`flex items-center space-x-2 py-3 px-6 rounded-lg font-medium transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>
            )}
            
            <button
              onClick={onNewPayment}
              className="py-3 px-6 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentConfirmation;