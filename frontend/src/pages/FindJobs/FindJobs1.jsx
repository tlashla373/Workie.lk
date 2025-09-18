import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Clock, Building, Heart, ExternalLink, User, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Mason from '../../assets/mason.svg';
import Welder from '../../assets/welder.svg';
import Plumber from '../../assets/plumber.svg';
import Carpenter from '../../assets/carpenter.svg';
import Painter from '../../assets/painter.svg';

const AvailableJobs = ({ isDarkMode, isOwnProfile, userId }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination settings
  const jobsPerPage = 5;

  // Category icons mapping
  const categoryIcons = {
    'carpentry': Carpenter,
    'painting': Painter,
    'plumbing': Plumber,
    'other': Mason,
    'repair-services': Welder,
    'masonry': Mason,
    'welding': Welder
  };

  useEffect(() => {
    fetchAvailableJobs();
  }, []);

  const fetchAvailableJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      // Fetch all available jobs
      const response = await axios.get('/api/jobs?status=open', config);
      
      if (response.data && response.data.success) {
        const jobsData = response.data.data.jobs.map(job => ({
          id: job._id,
          title: job.title,
          company: job.client?.firstName ? `${job.client.firstName} ${job.client.lastName}` : 'Unknown Client',
          location: `${job.location?.city || ''}, ${job.location?.state || ''}`.trim(),
          type: job.category || 'Not specified',
          salary: job.budget?.amount ? `Rs. ${job.budget.amount} (${job.budget.type || 'fixed'})` : 'Negotiable',
          posted: new Date(job.createdAt).toLocaleDateString(),
          publishedOn: new Date(job.createdAt).toLocaleDateString(),
          description: job.description,
          tags: job.skills || [],
          logo: categoryIcons[job.category] || Mason,
          clientName: job.client?.firstName ? `${job.client.firstName} ${job.client.lastName}` : 'Unknown Client',
          clientType: 'Client',
          requirements: job.requirements || [],
          contactInfo: {
            phone: job.client?.phone,
            email: job.client?.email
          },
          deadline: job.applicationClosingDate ? new Date(job.applicationClosingDate).toLocaleDateString() : null,
          urgency: job.urgency || 'medium',
          originalJob: job // Keep original job data for applications
        }));
        setJobs(jobsData);
      } else {
        throw new Error(response.data.message || 'Failed to fetch available jobs');
      }
    } catch (error) {
      console.error('Error fetching available jobs:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load available jobs');
    } finally {
      setLoading(false);
    }
  };

  const jobTypes = ['carpentry', 'painting', 'plumbing', 'repair-services', 'other'];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !jobTypeFilter || job.type === jobTypeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handleJobClick = (job) => {
    navigate(`/jobs/${job.id}`);
  };

  const handleApplyNow = async (job, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('Please login to apply for jobs');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(`/api/applications`, {
        jobId: job.id,
        coverLetter: 'Interested in this position'
      }, config);

      if (response.data && response.data.success) {
        alert('Application submitted successfully!');
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      alert(error.response?.data?.message || 'Failed to submit application');
    }
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, locationFilter, jobTypeFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} text-center`}>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchAvailableJobs}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Available Jobs ({filteredJobs.length})
        </h2>
      </div>

      {/* Search and Filters */}
      <div className={`rounded-xl p-4 space-y-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="flex flex-col gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Location Filter */}
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
              />
            </div>

            {/* Job Type Filter */}
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className={`flex-1 sm:flex-none sm:w-48 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            >
              <option value="" className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>All Categories</option>
              {jobTypes.map(type => (
                <option key={type} value={type} className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
          Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {currentJobs.map(job => (
          <div 
            key={job.id} 
            className={`rounded-xl p-4 hover:transition-all duration-200 border cursor-pointer ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700/50 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
            onClick={() => handleJobClick(job)}
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                {typeof job.logo === 'string' && job.logo.endsWith('.svg') ? (
                  <img src={job.logo} alt={job.title} className="w-full h-full bg-[#F0F3FF] p-1 object-contain rounded-md" />
                ) : (
                  <span className="text-2xl">{job.logo}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-lg font-semibold hover:text-blue-400 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {job.title}
                  </h3>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button 
                      className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-500 hover:text-red-600 hover:bg-red-100'}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Publisher Info */}
                <div className={`flex items-center space-x-4 mb-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>Posted by {job.clientName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{job.posted}</span>
                  </div>
                </div>
                
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center space-x-1">
                    <Building className="w-4 h-4" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salary}</span>
                  </div>
                </div>

                <p className={`mb-3 line-clamp-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {job.description}
                </p>

                {job.tags && job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.tags.slice(0, 5).map((tag, index) => (
                      <span 
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {tag}
                      </span>
                    ))}
                    {job.tags.length > 5 && (
                      <span className={`px-2 py-1 rounded-full text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        +{job.tags.length - 5} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {job.urgency} priority
                    </span>
                    {job.deadline && (
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Deadline: {job.deadline}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${isDarkMode ? 'bg-gray-600/50 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Save for Later
                    </button>
                    <button 
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm"
                      onClick={(e) => handleApplyNow(job, e)}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {((currentPage - 1) * jobsPerPage) + 1} to {Math.min(currentPage * jobsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 1
                  ? `${isDarkMode ? 'bg-gray-700/50 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                  : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg text-sm transition-all duration-200 ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : `${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === totalPages
                  ? `${isDarkMode ? 'bg-gray-700/50 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                  : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <div className={`text-6xl mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>🔍</div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No jobs found</h3>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Try adjusting your search criteria or check back later for new opportunities</p>
        </div>
      )}
    </div>
  );
};

export default AvailableJobs;