import React from 'react';
import { CheckCircle, XCircle, Download, Share2, ArrowLeft, Copy } from 'lucide-react';
import { useDarkMode } from '../../../contexts/DarkModeContext';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';

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
      
      // Colors
      const primaryColor = '#3B82F6'; // Blue
      const darkGray = '#374151';
      const lightGray = '#6B7280';
      const successColor = '#10B981'; // Green
      
      // Add Workie Logo (text-based since we don't have the actual logo file)
      pdf.setFontSize(24);
      pdf.setTextColor(primaryColor);
      pdf.setFont('helvetica', 'bold');
      pdf.text('WORKIE', 20, 25);
      
      // Add tagline
      pdf.setFontSize(10);
      pdf.setTextColor(lightGray);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Your Trusted Service Platform', 20, 32);
      
      // Add header line
      pdf.setDrawColor(primaryColor);
      pdf.setLineWidth(0.5);
      pdf.line(20, 38, pageWidth - 20, 38);
      
      // Receipt Title
      pdf.setFontSize(20);
      pdf.setTextColor(darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PAYMENT RECEIPT', 20, 55);
      
      // Receipt Status
      if (result?.success) {
        pdf.setFontSize(12);
        pdf.setTextColor(successColor);
        pdf.setFont('helvetica', 'bold');
        pdf.text('✓ PAYMENT SUCCESSFUL', 20, 68);
      }
      
      // Transaction Details Section
      let yPosition = 85;
      
      pdf.setFontSize(14);
      pdf.setTextColor(darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Transaction Details', 20, yPosition);
      
      yPosition += 10;
      pdf.setDrawColor(lightGray);
      pdf.setLineWidth(0.3);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      
      yPosition += 15;
      
      // Transaction info
      const transactionDetails = [
        ['Transaction ID:', result?.transactionId || 'N/A'],
        ['Date & Time:', new Date(result?.timestamp).toLocaleString()],
        ['Amount:', `$${result?.amount?.toFixed(2)} ${result?.currency || 'USD'}`],
        ['Payment Method:', result?.method === 'card' ? 'Credit/Debit Card' :
                          result?.method === 'paypal' ? 'PayPal' :
                          result?.method === 'bank' ? 'Bank Transfer' : 'Digital Wallet'],
        ['Status:', result?.status || 'Completed']
      ];
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      transactionDetails.forEach(([label, value]) => {
        pdf.setTextColor(lightGray);
        pdf.text(label, 20, yPosition);
        pdf.setTextColor(darkGray);
        pdf.text(value, 80, yPosition);
        yPosition += 12;
      });
      
      // Job Details Section (if it's a job payment)
      if (isJobPayment && jobDetails) {
        yPosition += 10;
        
        pdf.setFontSize(14);
        pdf.setTextColor(darkGray);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Job Details', 20, yPosition);
        
        yPosition += 10;
        pdf.setDrawColor(lightGray);
        pdf.setLineWidth(0.3);
        pdf.line(20, yPosition, pageWidth - 20, yPosition);
        
        yPosition += 15;
        
        const jobInfo = [
          ['Job Description:', jobDetails?.description || result?.description || 'Service Payment'],
          ['Job ID:', jobDetails?.jobId || 'N/A'],
          ['Application ID:', jobDetails?.applicationId || 'N/A']
        ];
        
        if (jobDetails?.notes) {
          jobInfo.push(['Notes:', jobDetails.notes]);
        }
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        jobInfo.forEach(([label, value]) => {
          pdf.setTextColor(lightGray);
          pdf.text(label, 20, yPosition);
          pdf.setTextColor(darkGray);
          
          // Handle long text wrapping
          const maxWidth = pageWidth - 100;
          const lines = pdf.splitTextToSize(value, maxWidth);
          pdf.text(lines, 80, yPosition);
          yPosition += 12 * lines.length;
        });
      }
      
      // Client Details Section
      yPosition += 10;
      
      pdf.setFontSize(14);
      pdf.setTextColor(darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Client Details', 20, yPosition);
      
      yPosition += 10;
      pdf.setDrawColor(lightGray);
      pdf.setLineWidth(0.3);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      
      yPosition += 15;
      
      const clientDetails = [
        ['Name:', user?.name || user?.firstName + ' ' + user?.lastName || 'N/A'],
        ['Email:', user?.email || 'N/A'],
        ['User ID:', user?.id || user?._id || 'N/A']
      ];
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      clientDetails.forEach(([label, value]) => {
        pdf.setTextColor(lightGray);
        pdf.text(label, 20, yPosition);
        pdf.setTextColor(darkGray);
        pdf.text(value, 80, yPosition);
        yPosition += 12;
      });
      
      // Worker Details Section (if available)
      if (isJobPayment && jobDetails?.recipient) {
        yPosition += 10;
        
        pdf.setFontSize(14);
        pdf.setTextColor(darkGray);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Service Provider Details', 20, yPosition);
        
        yPosition += 10;
        pdf.setDrawColor(lightGray);
        pdf.setLineWidth(0.3);
        pdf.line(20, yPosition, pageWidth - 20, yPosition);
        
        yPosition += 15;
        
        const workerDetails = [
          ['Name:', jobDetails.recipient || 'N/A'],
          ['Service Type:', 'Professional Service']
        ];
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        workerDetails.forEach(([label, value]) => {
          pdf.setTextColor(lightGray);
          pdf.text(label, 20, yPosition);
          pdf.setTextColor(darkGray);
          pdf.text(value, 80, yPosition);
          yPosition += 12;
        });
      }
      
      // Payment Summary Box
      yPosition += 20;
      
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }
      
      // Summary box
      const boxHeight = 40;
      pdf.setFillColor(245, 247, 250); // Light gray background
      pdf.rect(20, yPosition, pageWidth - 40, boxHeight, 'F');
      
      pdf.setDrawColor(primaryColor);
      pdf.setLineWidth(1);
      pdf.rect(20, yPosition, pageWidth - 40, boxHeight);
      
      // Summary content
      pdf.setFontSize(12);
      pdf.setTextColor(darkGray);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TOTAL AMOUNT PAID', 30, yPosition + 15);
      
      pdf.setFontSize(16);
      pdf.setTextColor(successColor);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`$${result?.amount?.toFixed(2)} ${result?.currency || 'USD'}`, 30, yPosition + 30);
      
      // Footer
      yPosition = pageHeight - 40;
      
      pdf.setDrawColor(lightGray);
      pdf.setLineWidth(0.3);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      
      yPosition += 15;
      
      pdf.setFontSize(8);
      pdf.setTextColor(lightGray);
      pdf.setFont('helvetica', 'normal');
      pdf.text('This is a computer-generated receipt. No signature required.', 20, yPosition);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, yPosition + 8);
      
      // Support info
      pdf.text('For support: support@workie.lk | +94 123 456 789', pageWidth - 120, yPosition);
      pdf.text('Visit: www.workie.lk', pageWidth - 120, yPosition + 8);
      
      // Add page numbers if multiple pages
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(lightGray);
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 10);
      }
      
      // Save the PDF
      const fileName = `workie-receipt-${result?.transactionId || Date.now()}.pdf`;
      pdf.save(fileName);
      
      toast.success('Receipt PDF downloaded successfully!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Fallback to JSON download if PDF generation fails
      const receiptData = {
        companyName: 'Workie',
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
                  ${result.amount?.toFixed(2)} {result.currency}
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