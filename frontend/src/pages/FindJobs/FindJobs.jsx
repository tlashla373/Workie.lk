import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, DollarSign, Clock, Building, Heart, ExternalLink, Filter, X, User, Calendar, Phone, Mail, Star, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../contexts/DarkModeContext';
import apiService from '../../services/apiService';
import Mason from '../../assets/mason.svg'
import Welder from '../../assets/welder.svg'
import Plumber from '../../assets/plumber.svg'
import Carpenter from '../../assets/carpenter.svg'
import Painter from '../../assets/painter.svg'
import JobDetailsPage from './JobDetailsPage';

// Main FindJobs Component
const FindJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'details'
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchDebounceTimer, setSearchDebounceTimer] = useState(null);
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  // Pagination settings
  const jobsPerPage = 15;

  // Category to logo mapping
  const categoryLogos = {
    'carpentry': Carpenter,
    'plumbing': Plumber,
    'painting': Painter,
    'electrical': Welder,
    'masonry': Mason,
    'cleaning': Mason, // fallback
    'gardening': Mason, // fallback
    'delivery': Mason, // fallback
    'tutoring': Mason, // fallback
    'pet-care': Mason, // fallback
    'elderly-care': Mason, // fallback
    'cooking': Mason, // fallback
    'photography': Mason, // fallback
    'event-planning': Mason, // fallback
    'repair-services': Mason, // fallback
    'moving': Mason, // fallback
    'other': Mason // fallback
  };

  // Debounced fetch jobs function to prevent excessive API calls
  const debouncedFetchJobs = useCallback(() => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    
    const timer = setTimeout(() => {
      fetchJobs();
    }, 300); // 300ms delay for search
    
    setSearchDebounceTimer(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, locationFilter, jobTypeFilter, searchDebounceTimer]);

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: jobsPerPage,
        status: 'open'
      });
      
      if (searchTerm) queryParams.append('search', searchTerm);
      if (locationFilter) queryParams.append('city', locationFilter);
      if (jobTypeFilter && jobTypeFilter !== 'All') {
        // Map frontend job types to backend categories
        const categoryMap = {
          'Full Time': '',
          'Part Time': '',
          'Contract': '',
          'cleaning': 'cleaning',
          'gardening': 'gardening',
          'plumbing': 'plumbing',
          'electrical': 'electrical',
          'carpentry': 'carpentry',
          'painting': 'painting'
        };
        if (categoryMap[jobTypeFilter]) {
          queryParams.append('category', categoryMap[jobTypeFilter]);
        }
      }
      
      const response = await apiService.get(`jobs?${queryParams}`, { includeAuth: false });
      
      if (response.success) {
        const transformedJobs = response.data.jobs.map(job => ({
          id: job._id,
          title: job.title,
          company: job.client?.firstName && job.client?.lastName 
            ? `${job.client.firstName} ${job.client.lastName}` 
            : 'Unknown Client',
          location: `${job.location?.city || ''}, ${job.location?.state || 'Sri Lanka'}`.replace(/^,\s*/, ''),
          type: job.category ? job.category.charAt(0).toUpperCase() + job.category.slice(1) : 'Not specified',
          salary: job.budget?.amount 
            ? `Rs ${job.budget.amount.toLocaleString()} (${job.budget.type || 'fixed'})` 
            : 'Negotiable',
          posted: new Date(job.createdAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          publishedOn: job.createdAt,
          description: job.description.length > 100 
            ? job.description.substring(0, 100) + '...' 
            : job.description,
          fullDescription: job.description,
          tags: job.skills || [job.category || 'General'],
          logo: categoryLogos[job.category] || Mason,
          clientName: job.client?.firstName && job.client?.lastName 
            ? `${job.client.firstName} ${job.client.lastName}` 
            : 'Unknown Client',
          clientType: 'Individual Client', // Default since backend doesn't have this field
          memberSince: job.client?.createdAt 
            ? new Date(job.client.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            : 'Unknown',
          jobsPosted: '1', // Would need separate API call to get this
          clientRating: '4.5', // Would need to calculate from reviews
          requirements: job.requirements || [],
          contactInfo: {
            phone: job.client?.phone || '',
            email: job.client?.email || ''
          },
          deadline: job.duration?.endDate 
            ? new Date(job.duration.endDate).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })
            : null,
          urgency: job.urgency,
          budget: job.budget,
          originalJob: job // Keep original job data for details view
        }));
        
        setJobs(transformedJobs);
        setTotalJobs(response.data.pagination?.total || transformedJobs.length);
      } else {
        setError('Failed to fetch jobs');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs on component mount and when pagination changes (immediate)
  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Debounced fetch when search/filter terms change (prevents excessive API calls)
  useEffect(() => {
    if (currentPage === 1) {
      debouncedFetchJobs();
    }
    return () => {
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, locationFilter, jobTypeFilter]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, locationFilter, jobTypeFilter]);

  const jobTypes = ['All', 'cleaning', 'gardening', 'plumbing', 'electrical', 'carpentry', 'painting', 'delivery', 'tutoring', 'pet-care', 'elderly-care', 'cooking', 'photography', 'event-planning', 'repair-services', 'moving', 'other'];

  // Since filtering is now done on the backend, we use jobs directly
  const filteredJobs = jobs;
  const currentJobs = jobs;

  // Pagination calculations based on API response
  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setCurrentView('details');
  };

  const handleBackToList = () => {
    setSelectedJob(null);
    setCurrentView('list');
  };

  const handleApplyJob = (jobId) => {
    navigate(`/job-application/${jobId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Loading jobs...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
        <div className={`text-lg ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
          Error: {error}
        </div>
        <button
          onClick={fetchJobs}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Show job details page if a job is selected
  if (currentView === 'details' && selectedJob) {
    return (
      <div className="p-4 sm:p-6">
        <JobDetailsPage 
          job={selectedJob} 
          onBack={handleBackToList}
          isDarkMode={isDarkMode} 
        />
      </div>
    );
  }

  // Show jobs list
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="text-center">
        <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Find Your Dream Job</h1>
        <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Discover opportunities that match your skills and interests</p>
      </div>

      {/* Search and Filters */}
      <div className={`rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 ${isDarkMode ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Location Filter */}
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className={`w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 ${isDarkMode ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
              />
            </div>

            {/* Job Type Filter */}
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className={`flex-1 sm:flex-none sm:w-48 px-3 py-2 sm:py-3 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 ${isDarkMode ? 'bg-gray-700/50 border-gray-600/50 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            >
              <option value="" className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>All Job Types</option>
              {jobTypes.map(type => (
                <option key={type} value={type} className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs sm:text-sm`}>
          Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-3 sm:space-y-4">
        {currentJobs.map(job => (
          <div 
            key={job.id} 
            className={`rounded-xl p-4 sm:p-6 hover:transition-all duration-200 border cursor-pointer ${isDarkMode ? 'bg-gray-700/30 hover:bg-gray-700/40 border-gray-600/30' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
            onClick={() => handleJobClick(job)}
          >
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0">
                  <div>
                    {typeof job.logo === 'string' && job.logo.endsWith('.svg') ? (
                      <img src={job.logo} alt={job.title} className="w-full h-full bg-[#F0F3FF] p-1 object-contain rounded-md" />
                    ) : (
                      <span className="text-2xl sm:text-3xl">{job.logo}</span>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                    <h3 className={`text-lg sm:text-xl font-semibold hover:text-blue-400 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                      {job.title}
                    </h3>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button 
                        className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-500 hover:text-red-600 hover:bg-red-100'}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button 
                        className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-100'}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Publisher Info */}
                  <div className={`flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 sm:mb-3 text-xs sm:text-sm space-y-1 sm:space-y-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Posted by {job.clientName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Published on {job.publishedOn}</span>
                    </div>
                  </div>
                  
                  <div className={`flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm mb-2 sm:mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="flex items-center space-x-1">
                      <Building className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{job.salary}</span>
                    </div>
                  </div>

                  <p className={`mb-2 sm:mb-3 line-clamp-2 text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.description}</p>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                    {job.tags.map(tag => (
                      <span key={tag} className="px-2 sm:px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                    <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Posted {job.posted}</span>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <button 
                        className={`px-3 sm:px-4 py-2 rounded-lg text-sm transition-all duration-200 ${isDarkMode ? 'bg-gray-600/50 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Save for Later
                      </button>
                      <button 
                        className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyJob(job.id);
                        }}
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center mt-6 sm:mt-8 space-y-4">
          {/* Job count info */}
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {((currentPage - 1) * jobsPerPage) + 1} to {Math.min(currentPage * jobsPerPage, totalJobs)} of {totalJobs} jobs
          </div>
          
          {/* Pagination controls */}
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                currentPage === 1
                  ? `${isDarkMode ? 'bg-gray-700/50 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                  : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`
              }`}
            >
              Previous
            </button>
            
            {/* Page Numbers with smart pagination */}
            <div className="flex items-center space-x-1">
              {(() => {
                const pages = [];
                const maxVisiblePages = 5;
                
                if (totalPages <= maxVisiblePages) {
                  // Show all pages if total pages is small
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  // Smart pagination logic
                  if (currentPage <= 3) {
                    // Show first 4 pages + ... + last page
                    pages.push(1, 2, 3, 4);
                    if (totalPages > 4) {
                      pages.push('...');
                      pages.push(totalPages);
                    }
                  } else if (currentPage >= totalPages - 2) {
                    // Show first page + ... + last 4 pages
                    pages.push(1);
                    if (totalPages > 4) {
                      pages.push('...');
                    }
                    for (let i = totalPages - 3; i <= totalPages; i++) {
                      if (i > 1) pages.push(i);
                    }
                  } else {
                    // Show first + ... + current-1, current, current+1 + ... + last
                    pages.push(1);
                    pages.push('...');
                    pages.push(currentPage - 1, currentPage, currentPage + 1);
                    pages.push('...');
                    pages.push(totalPages);
                  }
                }
                
                return pages.map((pageNum, index) => {
                  if (pageNum === '...') {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className={`px-3 py-2 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                      >
                        ...
                      </span>
                    );
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 text-sm font-medium rounded-lg transition-all duration-200 ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : `${isDarkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100'} border ${isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'}`
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                });
              })()}
            </div>
            
            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                currentPage === totalPages
                  ? `${isDarkMode ? 'bg-gray-700/50 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                  : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* No jobs message */}
      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <div className={`text-6xl mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>🔍</div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No jobs found</h3>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};

export default FindJobs;