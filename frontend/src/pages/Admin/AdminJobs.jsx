import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Eye, Edit, Trash2, MapPin, DollarSign, Clock } from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from 'react-toastify';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);



  // Define fetchJobs function first
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 5,
        search: debouncedSearchTerm,
        status: filterStatus
      });

      let response;
      try {
        // Try admin endpoint first
        response = await apiService.request(`/admin/jobs?${queryParams}`);
      } catch {
        // Fallback to regular jobs endpoint if admin fails
        const fallbackParams = new URLSearchParams({
          page: currentPage,
          limit: 5,
          search: debouncedSearchTerm,
          ...(filterStatus !== 'all' && { status: filterStatus })
        });
        
        response = await apiService.request(`/jobs?${fallbackParams}`);
      }
      
      // Handle different response structures
      const jobs = response.data?.jobs || [];
      const totalPages = response.data?.totalPages || response.data?.pagination?.pages || 1;
      
      setJobs(jobs);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('❌ Error fetching jobs:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterStatus, debouncedSearchTerm]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when search term or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, debouncedSearchTerm]);

  // Fetch jobs when dependencies change
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleJobAction = async (jobId, action) => {
    try {
      // Show confirmation dialog for delete action
      if (action === 'delete') {
        const confirmDelete = window.confirm(
          'Are you sure you want to delete this job? This action cannot be undone.'
        );
        if (!confirmDelete) {
          return;
        }
      }

      let endpoint = '';
      let message = '';
      
      switch (action) {
        case 'delete':
          // Try admin endpoint first, fallback to regular endpoint
          endpoint = `/admin/jobs/${jobId}`;
          message = 'Job deleted permanently';
          break;
        default:
          return;
      }

      if (action === 'delete') {
        try {
          // Try admin delete endpoint first
          await apiService.request(endpoint, { method: 'DELETE' });
        } catch {
          // Fallback to regular delete endpoint
          await apiService.request(`/jobs/${jobId}`, { method: 'DELETE' });
        }
      }
      
      toast.success(message);
      fetchJobs(); // Refresh the jobs list
    } catch (error) {
      console.error(`Error ${action} job:`, error);
      toast.error(`Failed to ${action} job: ${error.response?.data?.message || error.message}`);
    }
  };

  const viewJobDetails = async (jobId) => {
    try {
      const response = await apiService.request(`/jobs/${jobId}`);
      setSelectedJob(response.data || response.data?.job);
      setShowJobModal(true);
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to fetch job details');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLocation = (location) => {
    if (!location) return 'Location not specified';
    if (typeof location === 'string') return location;
    
    const parts = [];
    if (location.address) parts.push(location.address);
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    
    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
  };

  const formatBudget = (budget) => {
    if (!budget) return 'Not specified';
    if (typeof budget === 'number') return `$${budget}`;
    if (typeof budget === 'string') return budget;
    
    const amount = budget.amount || 0;
    const currency = budget.currency || 'LKR';
    const type = budget.type || 'fixed';
    
    return `${currency} ${amount} (${type})`;
  };

  const JobModal = () => {
    if (!selectedJob) return null;

    const formatDate = (date) => {
      if (!date) return 'Not specified';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const getStatusBadge = (status) => {
      const statusColors = {
        open: 'bg-green-100 text-green-800 border-green-300',
        in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
        completed: 'bg-gray-100 text-gray-800 border-gray-300',
        cancelled: 'bg-red-100 text-red-800 border-red-300'
      };
      return statusColors[status] || statusColors.open;
    };

    return (
      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Job Details</h2>
                <p className="text-blue-100 text-sm mt-1">Complete job information</p>
              </div>
              <button
                onClick={() => setShowJobModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto no-scrollbar max-h-[calc(90vh-180px)] px-8 py-6">
            {/* Status and Basic Info */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-6 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadge(selectedJob.status)}`}>
                    {selectedJob.status?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Job ID</p>
                  <p className="text-sm font-mono text-gray-900">{selectedJob._id?.slice(-8)}</p>
                </div>
                
              </div>
            </div>

            {/* Job Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                Job Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                  <p className="text-base text-gray-900 font-medium">{selectedJob.title || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                  <p className="text-base text-gray-900">{selectedJob.category || 'Not specified'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                  <p className="text-base text-gray-700 leading-relaxed">{selectedJob.description || 'No description provided'}</p>
                </div>
              </div>
            </div>

            {/* Skills Required */}
            {(selectedJob.skillsRequired || selectedJob.skills || []).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                  Skills Required
                </h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex flex-wrap gap-2">
                    {(selectedJob.skillsRequired || selectedJob.skills || []).map((skill, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        {typeof skill === 'string' ? skill : skill?.name || 'Unknown skill'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Budget & Location */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                Budget & Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Budget</label>
                  <p className="text-lg text-gray-900 font-semibold">{formatBudget(selectedJob.budget)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                  <p className="text-base text-gray-900">{formatLocation(selectedJob.location)}</p>
                </div>
              </div>
            </div>

            {/* Client Information */}
            {selectedJob.client && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                  Client Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Client Name</label>
                    <p className="text-base text-gray-900 font-medium">
                      {selectedJob.client.firstName || ''} {selectedJob.client.lastName || ''}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <p className="text-base text-gray-900">{selectedJob.client.email || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                Timeline
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Created Date</label>
                  <p className="text-base text-gray-900">{formatDate(selectedJob.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Last Updated</label>
                  <p className="text-base text-gray-900">{formatDate(selectedJob.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => setShowJobModal(false)}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Job Management
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage all jobs in the system
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
              placeholder="Search jobs..."
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
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <button
            onClick={fetchJobs}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-500 text-lg">No jobs found</p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search criteria or filters
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Current filters: Search="{debouncedSearchTerm}", Status="{filterStatus}"
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {job.title || 'Untitled Job'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {formatLocation(job.location)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {job.client?.firstName || job.client?.name || 'Unknown'} {job.client?.lastName || ''}
                        </div>
                        <div className="text-sm text-gray-500">{job.client?.email || 'No email'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          {formatBudget(job.budget)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => viewJobDetails(job._id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-5 h-6" />
                          </button>

                          {/* Admin can delete any job */}
                          <button
                            onClick={() => handleJobAction(job._id, 'delete')}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Job Permanently"
                          >
                            <Trash2 className="w-5 h-6" />
                          </button>
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
                  disabled={currentPage <= 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage >= totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      disabled={currentPage <= 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage >= totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Job Modal */}
      {showJobModal && <JobModal />}
    </div>
  );
};

export default AdminJobs;
