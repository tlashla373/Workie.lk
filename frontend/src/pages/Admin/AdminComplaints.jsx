import { useState, useEffect, useCallback, useRef } from 'react';
import { AlertTriangle, Eye, CheckCircle, XCircle, Clock, Filter, Trash2 } from 'lucide-react';
import complaintService from '../../services/complaintService';
import postService from '../../services/postService';
import { toast } from 'react-toastify';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, resolved, rejected
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDismissModal, setShowDismissModal] = useState(false);
  const [dismissReason, setDismissReason] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionDetails, setResolutionDetails] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching complaints with filter:', filter);
      const response = await complaintService.adminGetComplaints({ 
        page: 1, 
        limit: 50, 
        status: filter !== 'all' ? filter : undefined 
      });
      console.log('Complaints response:', response);
      
      if (response.success && response.data && response.data.complaints) {
        setComplaints(response.data.complaints);
        console.log('Successfully loaded complaints:', response.data.complaints.length);
      } else {
        console.warn('No complaints found or invalid response structure:', response);
        setComplaints([]);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      toast.error(`Failed to fetch complaints: ${error.message || 'Unknown error'}`);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Function to fetch single complaint details using admin endpoint
  const fetchComplaintDetails = async (complaintId) => {
    try {
      console.log('Fetching complaint details for ID:', complaintId);
      const response = await complaintService.adminGetComplaintDetails(complaintId);
      console.log('Complaint details response:', response);
      
      if (response.success && response.data) {
        return response.data.complaint || response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching complaint details:', error);
      return null;
    }
  };

  const handleUpdateComplaintStatus = async (complaintId, newStatus, adminNotes = '', resolutionDetails = '') => {
    try {
      console.log('Updating complaint status:', { complaintId, newStatus, adminNotes, resolutionDetails });
      
      if (newStatus === 'resolved') {
        await complaintService.adminResolveComplaint(complaintId, 'other', resolutionDetails);
      } else {
        await complaintService.adminUpdateComplaintStatus(complaintId, newStatus, adminNotes);
      }

      toast.success(`Complaint ${newStatus} successfully`);
      
      // Fetch the updated complaint details from server to ensure we have the latest data
      const updatedComplaint = await fetchComplaintDetails(complaintId);
      console.log('Updated complaint from server:', updatedComplaint);
      
      if (updatedComplaint) {
        // Update the selected complaint with fresh data from server
        setSelectedComplaint(updatedComplaint);
        console.log('Updated selectedComplaint state with:', updatedComplaint);
        
        // Update the complaint in the complaints list
        setComplaints(prevComplaints => 
          prevComplaints.map(complaint => 
            complaint._id === complaintId ? updatedComplaint : complaint
          )
        );
      } else {
        // Fallback to local update if server fetch fails
        console.warn('Failed to fetch updated complaint, using local update');
        if (selectedComplaint && selectedComplaint._id === complaintId) {
          const localUpdate = {
            ...selectedComplaint,
            status: newStatus,
            resolution: newStatus === 'resolved' 
              ? { action: 'other', details: resolutionDetails || 'Resolved', resolvedAt: new Date() }
              : selectedComplaint.resolution,
            adminNotes: adminNotes || selectedComplaint.adminNotes
          };
          setSelectedComplaint(localUpdate);
        }
        
        setComplaints(prevComplaints => 
          prevComplaints.map(complaint => 
            complaint._id === complaintId 
              ? { 
                  ...complaint, 
                  status: newStatus,
                  resolution: newStatus === 'resolved' 
                    ? { action: 'other', details: resolutionDetails || 'Resolved', resolvedAt: new Date() }
                    : complaint.resolution,
                  adminNotes: adminNotes || complaint.adminNotes
                }
              : complaint
          )
        );
      }
      
      // If current filter would hide the updated complaint, switch to 'all' to keep it visible
      if (filter !== 'all' && filter !== newStatus) {
        setFilter('all');
        toast.info(`Filter changed to "All" to show updated complaint`);
      }
      
      console.log('Complaint status update completed. Modal should remain open.');
      // Keep modal open so admin can see the updated status and continue viewing details
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error('Failed to update complaint status');
    }
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    try {
      const { postId, complaintId } = postToDelete;
      
      console.log('Deleting post:', postId);
      
      // Delete the post
      await postService.deletePost(postId);
      
      toast.success('Post deleted successfully');
      
      // Update the complaint status to resolved
      await handleUpdateComplaintStatus(
        complaintId, 
        'resolved', 
        '', 
        'Post deleted by admin'
      );
      
      // Refresh complaint details
      const updatedComplaint = await fetchComplaintDetails(complaintId);
      if (updatedComplaint) {
        setSelectedComplaint(updatedComplaint);
      }
      
      // Close modal and reset
      setShowDeleteModal(false);
      setPostToDelete(null);
      
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
      setShowDeleteModal(false);
      setPostToDelete(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'dismissed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under-review':
        return 'bg-blue-100 text-blue-800';
      case 'escalated':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
      case 'dismissed':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'under-review':
      case 'escalated':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (filter === 'all') return true;
    return complaint.status === filter;
  });

  const ComplaintDetailModal = () => {
    console.log('ComplaintDetailModal rendering with selectedComplaint:', selectedComplaint);
    console.log('showDetailModal state:', showDetailModal);
    
    // Log the reported content details for debugging
    if (selectedComplaint?.reportedContentDetails) {
      console.log('reportedContentDetails:', selectedComplaint.reportedContentDetails);
      console.log('reportedContent type:', selectedComplaint.reportedContent?.contentType);
      if (selectedComplaint.reportedContentDetails.media) {
        console.log('Media array:', selectedComplaint.reportedContentDetails.media);
      }
    }
    
    // Safety check - prevent rendering with invalid data
    if (!selectedComplaint) {
      console.warn('ComplaintDetailModal: No selectedComplaint data');
      return null;
    }
    
    return (
      <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Complaint Details</h3>
            <button
              onClick={() => setShowDetailModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          {selectedComplaint ? (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Complaint Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Reason:</span>
                    <p className="font-medium capitalize">{selectedComplaint.reason || 'No reason provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Category:</span>
                    <p className="capitalize">{selectedComplaint.category}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Priority:</span>
                    <p className={`capitalize font-medium ${getPriorityColor(selectedComplaint.priority)}`}>
                      {selectedComplaint.priority}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Timeline</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Reported:</span>
                    <p>{new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Last Updated:</span>
                    <p>{new Date(selectedComplaint.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* People Involved */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Reported By</h4>
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedComplaint.reporter?.profilePicture || 'https://via.placeholder.com/40x40?text=U'}
                    alt={`${selectedComplaint.reporter?.firstName || 'Unknown'} ${selectedComplaint.reporter?.lastName || 'User'}`}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">
                      {selectedComplaint.reporter?.firstName || 'Unknown'} {selectedComplaint.reporter?.lastName || 'User'}
                    </p>
                    <p className="text-sm text-gray-500">{selectedComplaint.reporter?.email || 'Email not available'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Reported Against</h4>
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedComplaint.reportedUser?.profilePicture || 'https://via.placeholder.com/40x40?text=U'}
                    alt={`${selectedComplaint.reportedUser?.firstName || 'Unknown'} ${selectedComplaint.reportedUser?.lastName || 'User'}`}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">
                      {selectedComplaint.reportedUser?.firstName || 'Unknown'} {selectedComplaint.reportedUser?.lastName || 'User'}
                    </p>
                    <p className="text-sm text-gray-500">{selectedComplaint.reportedUser?.email || 'Email not available'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Description</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {selectedComplaint.description}
              </p>
            </div>

            {/* Reported Post Content */}
            {selectedComplaint.reportedContentDetails && selectedComplaint.reportedContent?.contentType === 'post' && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Reported Post Content</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  {/* Post Description */}
                  {selectedComplaint.reportedContentDetails.content && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Post Description:</p>
                      <p className="text-gray-800 bg-white p-3 rounded border">
                        {selectedComplaint.reportedContentDetails.content}
                      </p>
                    </div>
                  )}
                  
                  {/* Post Media/Photos */}
                  {selectedComplaint.reportedContentDetails.media && selectedComplaint.reportedContentDetails.media.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Post Media ({selectedComplaint.reportedContentDetails.media.length}):</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedComplaint.reportedContentDetails.media.map((mediaItem, index) => {
                          console.log('Media item:', mediaItem);
                          const imageUrl = mediaItem.secureUrl || mediaItem.url;
                          console.log('Image URL:', imageUrl);
                          
                          return (
                            <div key={index} className="relative group bg-gray-100 rounded-lg overflow-hidden">
                              {mediaItem.fileType === 'image' ? (
                                <img
                                  src={imageUrl}
                                  alt={`Post media ${index + 1}`}
                                  className="w-full h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => window.open(imageUrl, '_blank')}
                                  onError={(e) => {
                                    console.error('Image failed to load:', imageUrl);
                                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                                  }}
                                />
                              ) : mediaItem.fileType === 'video' ? (
                                <video
                                  src={imageUrl}
                                  className="w-full h-32 object-cover cursor-pointer"
                                  controls
                                  onError={() => {
                                    console.error('Video failed to load:', imageUrl);
                                  }}
                                />
                              ) : (
                                <div className="w-full h-32 flex items-center justify-center bg-gray-200">
                                  <span className="text-gray-500 text-sm">Unknown media type</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Post Metadata */}
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Posted by {selectedComplaint.reportedContentDetails.userInfo?.firstName || 'Unknown'} {selectedComplaint.reportedContentDetails.userInfo?.lastName || ''} on {new Date(selectedComplaint.reportedContentDetails.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* Evidence */}
            {selectedComplaint.evidence && selectedComplaint.evidence.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Evidence</h4>
                <div className="space-y-2">
                  {selectedComplaint.evidence.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-blue-600">
                      <span>📎</span>
                      <span>{file}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Notes */}
            {selectedComplaint.adminNotes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Admin Notes</h4>
                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  {Array.isArray(selectedComplaint.adminNotes) ? (
                    selectedComplaint.adminNotes.length > 0 ? (
                      selectedComplaint.adminNotes.map((noteObj, index) => (
                        <div key={index} className="bg-white p-3 rounded border-l-4 border-blue-400">
                          <p className="text-gray-700 mb-1">
                            {typeof noteObj === 'string' ? noteObj : noteObj.note || 'No note content'}
                          </p>
                          {typeof noteObj === 'object' && (noteObj.admin || noteObj.timestamp) && (
                            <p className="text-xs text-gray-500">
                              {noteObj.admin && typeof noteObj.admin === 'object' && (
                                <span>
                                  By: {noteObj.admin.firstName || ''} {noteObj.admin.lastName || ''} {noteObj.admin.email || ''} 
                                  {noteObj.timestamp && ' • '}
                                </span>
                              )}
                              {noteObj.timestamp && new Date(noteObj.timestamp).toLocaleString()}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No admin notes available</p>
                    )
                  ) : (
                    <p className="text-gray-700">{String(selectedComplaint.adminNotes)}</p>
                  )}
                </div>
              </div>
            )}

            {/* Resolution */}
            {selectedComplaint.resolution && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Resolution</h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  {typeof selectedComplaint.resolution === 'object' ? (
                    <div className="space-y-2">
                      {selectedComplaint.resolution.action && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Action:</span>
                          <p className="text-gray-900 capitalize">{selectedComplaint.resolution.action}</p>
                        </div>
                      )}
                      {selectedComplaint.resolution.details && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Details:</span>
                          <p className="text-gray-900">{selectedComplaint.resolution.details}</p>
                        </div>
                      )}
                      {selectedComplaint.resolution.resolvedBy && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Resolved by:</span>
                          <p className="text-gray-900">
                            {typeof selectedComplaint.resolution.resolvedBy === 'object' 
                              ? `${selectedComplaint.resolution.resolvedBy.firstName || ''} ${selectedComplaint.resolution.resolvedBy.lastName || ''}`.trim() 
                                || selectedComplaint.resolution.resolvedBy.email 
                                || selectedComplaint.resolution.resolvedBy.fullName 
                                || 'Unknown Admin'
                              : String(selectedComplaint.resolution.resolvedBy)
                            }
                          </p>
                        </div>
                      )}
                      {selectedComplaint.resolution.resolvedAt && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Resolved at:</span>
                          <p className="text-gray-900">{new Date(selectedComplaint.resolution.resolvedAt).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-700">{String(selectedComplaint.resolution)}</p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex flex-wrap gap-3">
                {selectedComplaint.status === 'pending' && (
                  <>
                    <button
                      onClick={() => setShowDismissModal(true)}
                      className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                    >
                      Dismiss Complaint
                    </button>
                    <button
                      onClick={() => setShowResolveModal(true)}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                    >
                      Mark as Resolved
                    </button>
                    {selectedComplaint.reportedContent?.contentType === 'post' && selectedComplaint.reportedContent?.contentId && (
                      <button
                        onClick={() => {
                          setPostToDelete({
                            postId: selectedComplaint.reportedContent.contentId,
                            complaintId: selectedComplaint._id
                          });
                          setShowDeleteModal(true);
                        }}
                        className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Post</span>
                      </button>
                    )}
                  </>
                )}
                {selectedComplaint.status === 'resolved' && (
                  <>
                    <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                      ✓ Complaint Resolved
                    </span>
                    <button
                      onClick={() => handleUpdateComplaintStatus(selectedComplaint._id, 'pending', 'Complaint reopened for further review')}
                      className="px-3 py-1 text-sm font-medium text-orange-700 bg-orange-100 rounded-md hover:bg-orange-200"
                      title="Reopen this complaint for further review"
                    >
                      Reopen
                    </button>
                  </>
                )}
                {(selectedComplaint.status === 'rejected' || selectedComplaint.status === 'dismissed') && (
                  <span className="px-3 py-1 text-sm font-medium text-red-800 bg-red-100 rounded-full">
                    ✗ Complaint Dismissed
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No complaint selected or complaint data not available.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Dismiss Modal Component
  const DismissModal = () => {
    const textareaRef = useRef(null);

    useEffect(() => {
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        const length = textarea.value.length;
        textarea.focus();
        textarea.setSelectionRange(length, length);
      }
    }, []);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dismiss Complaint</h3>
          <p className="text-sm text-gray-600 mb-4">
            Please provide a reason for dismissing this complaint. This will be recorded in the complaint history.
          </p>
          <textarea
            ref={textareaRef}
            value={dismissReason}
            onChange={(e) => setDismissReason(e.target.value)}
            placeholder="Enter reason for dismissing (optional)..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            rows="4"
          />
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => {
                setShowDismissModal(false);
                setDismissReason('');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const reason = dismissReason.trim() || 'Complaint dismissed';
                handleUpdateComplaintStatus(selectedComplaint._id, 'dismissed', reason);
                setShowDismissModal(false);
                setDismissReason('');
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Dismiss Complaint
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Resolve Modal Component
  const ResolveModal = () => {
    const textareaRef = useRef(null);

    useEffect(() => {
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        const length = textarea.value.length;
        textarea.focus();
        textarea.setSelectionRange(length, length);
      }
    }, []);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mark as Resolved</h3>
          <p className="text-sm text-gray-600 mb-4">
            Please provide details about how this complaint was resolved. This will be recorded in the complaint history.
          </p>
          <textarea
            ref={textareaRef}
            value={resolutionDetails}
            onChange={(e) => setResolutionDetails(e.target.value)}
            placeholder="Enter resolution details (optional)..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            rows="4"
          />
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => {
                setShowResolveModal(false);
                setResolutionDetails('');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const details = resolutionDetails.trim() || 'Complaint resolved';
                handleUpdateComplaintStatus(selectedComplaint._id, 'resolved', '', details);
                setShowResolveModal(false);
                setResolutionDetails('');
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Mark as Resolved
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Delete Post Modal Component
  const DeletePostModal = () => {
    return (
      <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Post</h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to delete this post? This action cannot be undone and will permanently remove the post from the feed. The complaint will be automatically marked as resolved.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setPostToDelete(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDeletePost}
              className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Post</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Complaints Management
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Review and resolve user complaints
          </p>
        </div>
        
        {/* Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Complaints</option>
            <option value="pending">Pending</option>
            <option value="under-review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Complaints</dt>
                <dd className="text-lg font-medium text-gray-900">{complaints.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {complaints.filter(c => c.status === 'pending').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Resolved</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {complaints.filter(c => c.status === 'resolved').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Dismissed</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {complaints.filter(c => c.status === 'dismissed' || c.status === 'rejected').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredComplaints.length === 0 ? (
              <div className="p-12 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === 'all' ? 'No complaints have been submitted.' : `No ${filter} complaints found.`}
                </p>
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <div key={complaint._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(complaint.status)}
                          <h3 className="text-lg font-medium text-gray-900 capitalize">
                            {complaint.reason || 'Complaint Report'}
                          </h3>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                        <span className={`text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority} priority
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 max-w-3xl">
                        {complaint.description && complaint.description.length > 150 
                          ? `${complaint.description.substring(0, 150)}...`
                          : complaint.description || 'No description provided'
                        }
                      </p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <img
                            src={complaint.reporter?.profilePicture || 'https://via.placeholder.com/40x40?text=U'}
                            alt="Reporter"
                            className="w-6 h-6 rounded-full"
                          />
                          <span>
                            Reported by {complaint.reporter?.firstName || 'Unknown'} {complaint.reporter?.lastName || 'User'}
                          </span>
                        </div>
                        <div>
                          Category: <span className="capitalize">{complaint.category}</span>
                        </div>
                        <div>
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={async () => {
                          console.log('View Details clicked for complaint:', complaint);
                          
                          // Fetch fresh complaint details with all populated fields
                          const freshComplaint = await fetchComplaintDetails(complaint._id);
                          
                          if (freshComplaint) {
                            setSelectedComplaint(freshComplaint);
                          } else {
                            // Fallback to current complaint data if fetch fails
                            setSelectedComplaint(complaint);
                          }
                          
                          setShowDetailModal(true);
                          console.log('Modal opened');
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && <ComplaintDetailModal />}
      
      {/* Dismiss Modal */}
      {showDismissModal && <DismissModal />}
      
      {/* Resolve Modal */}
      {showResolveModal && <ResolveModal />}
      
      {/* Delete Post Modal */}
      {showDeleteModal && <DeletePostModal />}
    </div>
  );
};

export default AdminComplaints;
