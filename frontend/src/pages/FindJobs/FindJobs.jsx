import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Clock, Building, Heart, ExternalLink, Filter, X, User, Calendar, Phone, Mail, Star, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../contexts/DarkModeContext';
import axios from 'axios';
import Mason from '../../assets/mason.svg'
import Welder from '../../assets/welder.svg'
import Plumber from '../../assets/plumber.svg'
import Carpenter from '../../assets/carpenter.svg'
import Painter from '../../assets/painter.svg'
import JobDetailsPage from './JobDetailsPage';


// Main FindJobs Component
const FindJobs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'details'
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useDarkMode();

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
    'welding': Welder,
    'cleaning': Mason,
    'gardening': Mason,
    'electrical': Welder,
    'delivery': Mason,
    'tutoring': Mason,
    'pet-care': Mason,
    'elderly-care': Mason,
    'cooking': Mason,
    'photography': Mason,
    'event-planning': Mason,
    'moving': Mason
  };

  // Fetch jobs from API
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      // Fetch all available jobs with status=open
      const response = await axios.get('/api/jobs?status=open', config);
      
      if (response.data && response.data.success) {
        const jobsData = response.data.data.jobs.map(job => ({
          id: job._id,
          title: job.title,
          company: job.client?.firstName ? `${job.client.firstName} ${job.client.lastName}` : 'Unknown Client',
          location: `${job.location?.city || ''}, ${job.location?.state || ''}`.trim() || 'Location not specified',
          type: job.category || 'Not specified',
          salary: job.budget?.amount ? `Rs. ${job.budget.amount} (${job.budget.type || 'fixed'})` : 'Negotiable',
          posted: new Date(job.createdAt).toLocaleDateString(),
          publishedOn: new Date(job.createdAt).toLocaleDateString(),
          description: job.description,
          fullDescription: job.description,
          tags: job.skills || [],
          logo: categoryIcons[job.category] || Mason,
          clientName: job.client?.firstName ? `${job.client.firstName} ${job.client.lastName}` : 'Unknown Client',
          clientType: 'Client',
          memberSince: job.client?.createdAt ? new Date(job.client.createdAt).getFullYear().toString() : 'Unknown',
          jobsPosted: '0', // This would need a separate API call to get client's job count
          clientRating: '0', // This would need to be calculated from reviews
          requirements: job.requirements || [],
          benefits: job.benefits,
          contactInfo: {
            phone: job.client?.phone,
            email: job.client?.email
          },
          deadline: job.applicationClosingDate ? new Date(job.applicationClosingDate).toLocaleDateString() : null,
          urgency: job.urgency || 'medium'
        }));
        setJobs(jobsData);
      } else {
        throw new Error(response.data.message || 'Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const jobTypes = ['carpentry', 'painting', 'plumbing', 'repair-services', 'other'];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !jobTypeFilter || 
                       job.type.toLowerCase() === jobTypeFilter.toLowerCase() ||
                       job.type.toLowerCase().includes(jobTypeFilter.toLowerCase());
    
    return matchesSearch && matchesLocation && matchesType;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setCurrentView('details');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedJob(null);
  };

  const handleApply = async (jobId, e) => {
    e.stopPropagation();
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('Please login to apply for jobs');
        navigate('/login');
        return;
      }

      const response = await axios.post(`/api/applications`, {
        jobId: jobId,
        coverLetter: '', // Could be enhanced to include a cover letter modal
        proposedRate: null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('Application submitted successfully!');
        // Optionally refresh jobs to update application status
        fetchJobs();
      } else {
        throw new Error(response.data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      if (error.response?.status === 401) {
        alert('Please login to apply for jobs');
        navigate('/login');
      } else if (error.response?.status === 400) {
        alert(error.response.data.message || 'You have already applied for this job');
      } else {
        alert(error.response?.data?.message || 'Failed to submit application. Please try again.');
      }
    }
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, locationFilter, jobTypeFilter]);

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

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading jobs...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Error Loading Jobs</h2>
          <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
          <button
            onClick={fetchJobs}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show jobs list
  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-3">
      
      {/* Search and Filters */}
      <div className={`rounded-xl p-2 sm:p-2 space-y-3 sm:space-y-4 ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute  left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 rounded-xl border border-gray-50 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 ${isDarkMode ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
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
                className={`w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 rounded-xl border border-gray-50 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 ${isDarkMode ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
              />
            </div>

            {/* Job Type Filter */}
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className={`flex-1 sm:flex-none sm:w-48 px-3 py-2 sm:py-3 rounded-xl border border-gray-50 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 ${isDarkMode ? 'bg-gray-700/50 border-gray-600/50 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
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
                        onClick={(e) => handleApply(job.id, e)}
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

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 gap-3 sm:gap-0">
        <div className={`text-sm order-2 sm:order-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Showing {((currentPage - 1) * jobsPerPage) + 1} to {Math.min(currentPage * jobsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 order-1 sm:order-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
              currentPage === 1
                ? `${isDarkMode ? 'bg-gray-700/50 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {/* Page Numbers */}
          <div className="flex items-center space-x-1 px-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-sm transition-all duration-200 ${
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
            className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
              currentPage === totalPages
                ? `${isDarkMode ? 'bg-gray-700/50 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

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