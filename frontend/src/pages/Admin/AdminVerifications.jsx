import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Star, 
  Briefcase, 
  Eye, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  X,
  Loader,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award
} from 'lucide-react';

const AdminVerifications = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [verificationDetails, setVerificationDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchPendingVerifications = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        return;
      }
      
      const response = await fetch(
        `http://localhost:5000/api/admin/workers/pending-verification?page=${currentPage}&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const result = await response.json();

      console.log('API Response:', result);
      console.log('Workers received:', result.data?.workers?.length || 0);

      if (result.success) {
        setWorkers(result.data.workers);
        setTotalPages(result.data.totalPages);
        setTotal(result.data.total);
      } else {
        toast.error(result.message || 'Failed to fetch pending verifications');
      }
    } catch (error) {
      console.error('Fetch pending verifications error:', error);
      toast.error(`Failed to fetch pending verifications: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchPendingVerifications();
  }, [fetchPendingVerifications]);

  const fetchVerificationDetails = async (workerId) => {
    try {
      setLoadingDetails(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `http://localhost:5000/api/admin/workers/${workerId}/verification-details`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const result = await response.json();

      if (result.success) {
        setVerificationDetails(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Fetch verification details error:', error);
      toast.error('Failed to fetch verification details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewDetails = async (worker) => {
    setSelectedWorker(worker);
    setShowDetailsModal(true);
    await fetchVerificationDetails(worker._id);
  };

  const handleApprove = async (workerId, notes = '') => {
    if (window.confirm('Are you sure you want to verify this worker? This will allow them to display the verified badge.')) {
      try {
        setActionLoading(true);
        const token = localStorage.getItem('auth_token');
        const response = await fetch(
          `http://localhost:5000/api/admin/workers/${workerId}/verify`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ notes })
          }
        );

        const result = await response.json();

        if (result.success) {
          toast.success('Worker verified successfully!');
          setShowDetailsModal(false);
          fetchPendingVerifications();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Approve verification error:', error);
        toast.error('Failed to approve verification');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `http://localhost:5000/api/admin/workers/${selectedWorker._id}/reject-verification`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reason: rejectReason })
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success('Verification request rejected');
        setShowRejectModal(false);
        setShowDetailsModal(false);
        setRejectReason('');
        fetchPendingVerifications();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Reject verification error:', error);
      toast.error('Failed to reject verification');
    } finally {
      setActionLoading(false);
    }
  };

  const openImageModal = (imageUrl, title) => {
    setSelectedImage({ url: imageUrl, title });
    setShowImageModal(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingColor = (rating) => {
    if (rating > 4) return 'text-green-600';
    if (rating > 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const canVerify = (worker) => {
    const rating = parseFloat(worker.avgRating);
    // Only allow verification if worker has reviews AND rating > 3
    return worker.reviewCount > 0 && rating > 3;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Worker Verification</h1>
              <p className="text-gray-600 mt-1">Review and verify worker identity documents (Rating must be &gt; 3.0)</p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Eligible Workers for Verification</p>
                <p className="text-3xl font-bold text-gray-900">{total}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Workers with rating &gt; 3.0 or no reviews yet
              </p>
            </div>
          </div>
        </div>

        {/* Workers List */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : workers.length === 0 ? (
            <div className="text-center py-20">
              <ShieldCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No eligible workers for verification</p>
              <p className="text-gray-400 text-sm mt-2">
                Workers must have both ID documents and either rating &gt; 3.0 or no reviews yet
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Worker</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Rating</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Jobs</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Submitted</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Eligibility</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {workers.map((worker) => (
                      <tr key={worker._id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {worker.profilePicture ? (
                              <img 
                                src={worker.profilePicture} 
                                alt={`${worker.firstName} ${worker.lastName}`}
                                className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
                                {worker.firstName?.[0]}{worker.lastName?.[0]}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">
                                {worker.firstName} {worker.lastName}
                              </p>
                              <p className="text-sm text-gray-500">{worker.profession || 'No profession'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {worker.email}
                            </p>
                            {worker.phoneNumber && (
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {worker.phoneNumber}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1">
                              <Star className={`w-5 h-5 fill-current ${getRatingColor(worker.avgRating)}`} />
                              <span className={`font-bold ${getRatingColor(worker.avgRating)}`}>
                                {worker.avgRating}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">
                              {worker.reviewCount} {worker.reviewCount === 1 ? 'review' : 'reviews'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <Briefcase className="w-5 h-5 text-gray-400 mb-1" />
                            <span className="text-sm font-medium text-gray-900">-</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm text-gray-600">
                            {formatDate(worker.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            {worker.reviewCount > 0 && worker.avgRating > 3 ? (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                ✓ Eligible (Rating {worker.avgRating})
                              </span>
                            ) : worker.reviewCount > 0 ? (
                              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                <XCircle className="w-4 h-4" />
                                ✗ Low Rating ({worker.avgRating})
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                No Reviews Yet
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleViewDetails(worker)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                            >
                              <Eye className="w-4 h-4" />
                              Review
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedWorker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Verification Review</h2>
                  <p className="text-blue-100 text-sm">
                    {selectedWorker.firstName} {selectedWorker.lastName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setVerificationDetails(null);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto no-scrollbar max-h-[calc(90vh-180px)]">
              {loadingDetails ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              ) : verificationDetails ? (
                <div className="space-y-6">
                  {/* Worker Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Personal Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium text-gray-900">
                            {verificationDetails.worker.firstName} {verificationDetails.worker.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            Email
                          </p>
                          <p className="font-medium text-gray-900">{verificationDetails.worker.email}</p>
                        </div>
                        {verificationDetails.worker.phoneNumber && (
                          <div>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              Phone
                            </p>
                            <p className="font-medium text-gray-900">{verificationDetails.worker.phoneNumber}</p>
                          </div>
                        )}
                        {verificationDetails.worker.location && (
                          <div>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              Location
                            </p>
                            <p className="font-medium text-gray-900">{verificationDetails.worker.location}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-600" />
                        Performance Metrics
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Average Rating</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className={`w-6 h-6 fill-current ${getRatingColor(verificationDetails.avgRating)}`} />
                            <span className={`text-2xl font-bold ${getRatingColor(verificationDetails.avgRating)}`}>
                              {verificationDetails.avgRating}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({verificationDetails.reviewCount} {verificationDetails.reviewCount === 1 ? 'review' : 'reviews'})
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Completed Jobs</p>
                          <p className="text-2xl font-bold text-gray-900">{verificationDetails.completedJobs}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Member Since</p>
                          <p className="font-medium text-gray-900 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(verificationDetails.worker.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ID Documents */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-purple-600" />
                      Identity Documents
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {verificationDetails.verificationDocuments.idPhotoFront && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2 font-medium">ID Card - Front</p>
                          <div 
                            className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-purple-300 hover:border-purple-500 transition-all"
                            onClick={() => openImageModal(verificationDetails.verificationDocuments.idPhotoFront, 'ID Card - Front')}
                          >
                            <img 
                              src={verificationDetails.verificationDocuments.idPhotoFront}
                              alt="ID Front"
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Eye className="w-8 h-8 text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                      {verificationDetails.verificationDocuments.idPhotoBack && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2 font-medium">ID Card - Back</p>
                          <div 
                            className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-purple-300 hover:border-purple-500 transition-all"
                            onClick={() => openImageModal(verificationDetails.verificationDocuments.idPhotoBack, 'ID Card - Back')}
                          >
                            <img 
                              src={verificationDetails.verificationDocuments.idPhotoBack}
                              alt="ID Back"
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Eye className="w-8 h-8 text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verification Eligibility */}
                  <div className={`rounded-xl p-5 border-2 ${
                    canVerify(selectedWorker)
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                      : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'
                  }`}>
                    <div className="flex items-start gap-3">
                      {canVerify(selectedWorker) ? (
                        <>
                          <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                          <div>
                            <h4 className="font-semibold text-green-900 text-lg">Eligible for Verification</h4>
                            <p className="text-green-700 mt-1">
                              This worker meets all requirements for verification:
                            </p>
                            <ul className="list-disc list-inside mt-2 text-green-700 space-y-1">
                              <li>Both ID documents uploaded ✓</li>
                              <li>Has customer reviews ({verificationDetails.reviewCount} reviews) ✓</li>
                              <li>Average rating {verificationDetails.avgRating} &gt; 3.0 ✓</li>
                            </ul>
                          </div>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6 text-red-600 mt-1" />
                          <div>
                            <h4 className="font-semibold text-red-900 text-lg">Not Eligible for Verification</h4>
                            <p className="text-red-700 mt-1">
                              This worker does not meet the requirements:
                            </p>
                            <ul className="list-disc list-inside mt-2 text-red-700 space-y-1">
                              {verificationDetails.reviewCount === 0 ? (
                                <li>No customer reviews yet ✗ (Must have at least one completed job with rating &gt; 3.0)</li>
                              ) : (
                                <li>Average rating {verificationDetails.avgRating} ≤ 3.0 ✗ (Must be greater than 3.0)</li>
                              )}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Recent Reviews */}
                  {verificationDetails.reviews && verificationDetails.reviews.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4">Recent Reviews</h3>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {verificationDetails.reviews.map((review, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  {review.reviewer?.firstName} {review.reviewer?.lastName}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-current text-yellow-500" />
                                  <span className="font-semibold text-gray-900">{review.rating}</span>
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                            </div>
                            {review.comment && (
                              <p className="text-gray-600 text-sm">{review.comment}</p>
                            )}
                            {review.job && (
                              <p className="text-xs text-gray-500 mt-2">Job: {review.job.title}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Modal Footer - Action Buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={actionLoading}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
              >
                <XCircle className="w-5 h-5" />
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedWorker._id)}
                disabled={actionLoading || !canVerify(selectedWorker)}
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
              >
                {actionLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                Verify Worker
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="relative max-w-6xl w-full">
            <button
              onClick={() => {
                setShowImageModal(false);
                setSelectedImage(null);
              }}
              className="absolute top-4 right-4 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="text-center">
              <h3 className="text-white text-2xl font-bold mb-4">{selectedImage.title}</h3>
              <img 
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] mx-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-bold text-white">Reject Verification</h3>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting this worker's verification request. This will be sent to the worker.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., ID photos are unclear, documents expired, etc."
                className="w-full border border-gray-300 rounded-lg p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading || !rejectReason.trim()}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {actionLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerifications;
