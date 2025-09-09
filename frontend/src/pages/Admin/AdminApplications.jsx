import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Check, X, Clock } from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from 'react-toastify';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [currentPage, filterStatus, searchTerm]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: filterStatus !== 'all' ? filterStatus : ''
      });

      const response = await apiService.request(`/applications?${queryParams}`);
      setApplications(response.data?.applications || []);
      setTotalPages(response.data?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAction = async (applicationId, action) => {
    try {
      let endpoint = '';
      let message = '';
      
      switch (action) {
        case 'accept':
          endpoint = `/applications/${applicationId}/accept`;
          message = 'Application accepted successfully';
          break;
        case 'reject':
          endpoint = `/applications/${applicationId}/reject`;
          message = 'Application rejected successfully';
          break;
        case 'withdraw':
          endpoint = `/applications/${applicationId}/withdraw`;
          message = 'Application withdrawn successfully';
          break;
        default:
          return;
      }

      await apiService.request(endpoint, { method: 'PATCH' });
      toast.success(message);
      fetchApplications();
    } catch (error) {
      console.error(`Error ${action} application:`, error);
      toast.error(`Failed to ${action} application`);
    }
  };

  const viewApplicationDetails = async (applicationId) => {
    try {
      const response = await apiService.request(`/applications/${applicationId}`);
      setSelectedApplication(response.data?.application);
      setShowApplicationModal(true);
    } catch (error) {
      console.error('Error fetching application details:', error);
      toast.error('Failed to fetch application details');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const ApplicationModal = () => {
    if (!selectedApplication) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Application Details</h3>
            <button
              onClick={() => setShowApplicationModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <p className="mt-1 text-sm text-gray-900">{selectedApplication.job?.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Applicant</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedApplication.worker?.firstName} {selectedApplication.worker?.lastName}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Worker Email</label>
                <p className="mt-1 text-sm text-gray-900">{selectedApplication.worker?.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Proposed Rate</label>
                <p className="mt-1 text-sm text-gray-900">${selectedApplication.proposedRate}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {selectedApplication.coverLetter || 'No cover letter provided'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedApplication.status)}`}>
                  {selectedApplication.status}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Applied Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedApplication.createdAt).toLocaleString()}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Budget</label>
                <p className="mt-1 text-sm text-gray-900">${selectedApplication.job?.budget}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Location</label>
                <p className="mt-1 text-sm text-gray-900">{selectedApplication.job?.location}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Client</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedApplication.job?.client?.firstName} {selectedApplication.job?.client?.lastName}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            {selectedApplication.status === 'pending' && (
              <>
                <button
                  onClick={() => {
                    handleApplicationAction(selectedApplication._id, 'accept');
                    setShowApplicationModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => {
                    handleApplicationAction(selectedApplication._id, 'reject');
                    setShowApplicationModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Reject
                </button>
              </>
            )}
            <button
              onClick={() => setShowApplicationModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Close
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
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Application Management
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage all job applications in the system
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
          
          <button
            onClick={fetchApplications}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job / Worker
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proposed Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.job?.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            by {application.worker?.firstName} {application.worker?.lastName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${application.proposedRate}
                        </div>
                        <div className="text-sm text-gray-500">
                          Budget: ${application.job?.budget}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => viewApplicationDetails(application._id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {application.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApplicationAction(application._id, 'accept')}
                                className="text-green-600 hover:text-green-900"
                                title="Accept Application"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleApplicationAction(application._id, 'reject')}
                                className="text-red-600 hover:text-red-900"
                                title="Reject Application"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Application Modal */}
      {showApplicationModal && <ApplicationModal />}
    </div>
  );
};

export default AdminApplications;
