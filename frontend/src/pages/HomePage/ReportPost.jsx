import { useState } from 'react';
import { X, Flag, AlertTriangle } from 'lucide-react';
import complaintService from '../../services/complaintService';
import { toast } from 'react-toastify';

const ReportPost = ({ isOpen, onClose, post }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    {
      id: 'spam',
      title: 'Spam',
      description: 'Repetitive, unwanted, or irrelevant content'
    },
    {
      id: 'harassment',
      title: 'Harassment or Bullying',
      description: 'Content that targets individuals with harmful intent'
    },
    {
      id: 'inappropriate',
      title: 'Inappropriate Content',
      description: 'Sexually explicit, violent, or offensive material'
    },
    {
      id: 'fake-info',
      title: 'False Information',
      description: 'Misleading or fraudulent information'
    },
    {
      id: 'copyright',
      title: 'Copyright Violation',
      description: 'Unauthorized use of copyrighted material'
    },
    {
      id: 'scam',
      title: 'Scam or Fraud',
      description: 'Deceptive practices or fraudulent activities'
    },
    {
      id: 'hate-speech',
      title: 'Hate Speech',
      description: 'Content promoting discrimination or hatred'
    },
    {
      id: 'other',
      title: 'Other',
      description: 'Reason not listed above'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedReason) {
      toast.error('Please select a reason for reporting');
      return;
    }

    if (selectedReason === 'other' && !customReason.trim()) {
      toast.error('Please provide a custom reason');
      return;
    }

    setIsSubmitting(true);

    try {
      // Debug: log the post object to see what fields are available
      console.log('Post object for reporting:', post);
      console.log('Post keys:', Object.keys(post));
      
      // Extract the reported user ID with comprehensive fallbacks
      let reportedUserId = null;
      
      // Check originalPost first (from Home.jsx transformation)
      if (post.originalPost?.userId) {
        if (typeof post.originalPost.userId === 'object' && post.originalPost.userId._id) {
          reportedUserId = post.originalPost.userId._id;
          console.log('Found reportedUserId in originalPost.userId._id:', reportedUserId);
        } else if (typeof post.originalPost.userId === 'string') {
          reportedUserId = post.originalPost.userId;
          console.log('Found reportedUserId in originalPost.userId (string):', reportedUserId);
        }
      }
      
      // Check transformed userId field
      if (!reportedUserId && post.userId) {
        if (typeof post.userId === 'object' && post.userId._id) {
          reportedUserId = post.userId._id;
          console.log('Found reportedUserId in userId._id:', reportedUserId);
        } else if (typeof post.userId === 'string') {
          reportedUserId = post.userId;
          console.log('Found reportedUserId in userId (string):', reportedUserId);
        }
      }
      
      // Additional fallbacks
      if (!reportedUserId) {
        reportedUserId = post.author?.id || 
                        post.authorId || 
                        post.user?._id || 
                        post.user?.id ||
                        post.authorInfo?.id ||
                        post.userInfo?.id ||
                        post.userInfo?._id;
        
        if (reportedUserId) {
          console.log('Found reportedUserId in fallback fields:', reportedUserId);
        }
      }

      // Extract content ID with fallbacks
      const contentId = post._id || post.id;

      // Validate required fields before sending
      if (!contentId) {
        console.error('Missing contentId. Post object:', post);
        toast.error('Cannot identify the post to report. Please try again.');
        return;
      }

      // If we still can't find reportedUserId, let backend handle the lookup
      if (!reportedUserId) {
        console.warn('Missing reportedUserId, will let backend lookup from post. Post object:', post);
        console.warn('Available userId fields:', {
          userId: post.userId,
          originalPostUserId: post.originalPost?.userId,
          userInfo: post.userInfo
        });
        reportedUserId = 'lookup_from_post';
      }

      // Prepare complaint data
      const complaintData = {
        contentType: 'post',
        contentId: contentId,
        reportedUserId: reportedUserId,
        reason: selectedReason,
        customReason: selectedReason === 'other' ? customReason.trim() : undefined,
        description: selectedReason === 'other' ? customReason.trim() : `Reported for: ${selectedReason}`
      };

      console.log('Complaint data being sent:', complaintData);

      // Submit complaint using the new API
      await complaintService.submitComplaint(complaintData);
      
      toast.success('Report submitted successfully. We will review it shortly.');
      onClose();
      setSelectedReason('');
      setCustomReason('');
    } catch (error) {
      console.error('Error submitting report:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        response: error.response,
        stack: error.stack
      });
      
      // Check for specific error types
      let errorMessage = 'Failed to submit report. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.message?.includes('authentication') || error.message?.includes('token')) {
        errorMessage = 'Please log in to submit a report.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    onClose();
  };

  if (!isOpen) return null;

  // CSS to hide scrollbar for webkit browsers
  const hideScrollbarStyle = `
    .report-modal-content::-webkit-scrollbar {
      display: none;
    }
  `;

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
      <style dangerouslySetInnerHTML={{ __html: hideScrollbarStyle }} />
      <div 
        className="bg-white border border-gray-300 rounded-lg max-w w-full max-h-[80vh] overflow-y-auto report-modal-content" 
        style={{ 
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* Internet Explorer 10+ */
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Flag className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Report Post</h2>
              <p className="text-sm text-gray-600">Why are you reporting this post?</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Preview */}
        {post && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-start space-x-3">
              <img
                src={post.avatar}
                alt={post.author}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm text-gray-900">{post.author}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">{post.timeAgo}</span>
                </div>
                <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                  {post.description?.length > 100 
                    ? `${post.description.substring(0, 100)}...`
                    : post.description
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Report Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select a reason for reporting this post:
              </label>
              <div className="space-y-2 grid grid-cols-2 gap-2">
                {reportReasons.map((reason) => (
                  <label
                    key={reason.id}
                    className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedReason === reason.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason.id}
                      checked={selectedReason === reason.id}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="mt-1 text-red-600 focus:ring-red-500 focus:ring-offset-0"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-sm text-gray-900">
                        {reason.title}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {reason.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Reason Input */}
            {selectedReason === 'other' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please describe the issue:
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Please provide more details about why you're reporting this post..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {customReason.length}/500 characters
                </div>
              </div>
            )}

            {/* Warning Message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="text-xs text-yellow-800">
                  <p className="font-medium">Please note:</p>
                  <p className="mt-1">
                    False reports may result in action against your account. 
                    Only report content that genuinely violates our community guidelines.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedReason || (selectedReason === 'other' && !customReason.trim()) || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportPost;
