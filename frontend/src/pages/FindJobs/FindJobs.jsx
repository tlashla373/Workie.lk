import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Clock, Building, Heart, ExternalLink, Filter, X, User, Calendar, Phone, Mail, Star, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
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
  const { isDarkMode } = useDarkMode();

  // Pagination settings
  const jobsPerPage = 5;

  // Enhanced job data with client information
  const jobs = [
    {
      id: 1,
      title: 'Skilled Masons',
      company: 'Individual',
      location: 'Colombo, Sri Lanka',
      type: 'Full Time',
      salary: 'Rs 60,000 - Rs 80,000',
      posted: '2 days ago',
      publishedOn: '2025-01-06',
      description: 'We are looking for skilled Mason specialists to join our construction project...',
      fullDescription: 'We are seeking experienced and skilled masons to work on a large-scale residential construction project in Colombo. The ideal candidate will have extensive experience in brickwork, stone masonry, and tile installation. This is a full-time position offering competitive compensation and the opportunity to work on high-quality construction projects. The successful candidate will be responsible for laying bricks, stones, and other masonry materials according to architectural plans and specifications. Attention to detail and quality craftsmanship are essential.',
      tags: ['Mason', 'Bricks', 'Tile work'],
      logo: Mason ,
      clientName: 'Rajesh Perera',
      clientType: 'Individual Client',
      memberSince: 'Jan 2023',
      jobsPosted: '5',
      clientRating: '4.8',
      requirements: [
        'Minimum 5 years of experience in masonry work',
        'Expertise in brick laying and stone work',
        'Knowledge of tile installation techniques',
        'Ability to read construction blueprints',
        'Own transportation preferred'
      ],
      contactInfo: {
        phone: '+94 77 123 4567',
        email: 'rajesh.perera@email.com'
      },
      deadline: 'January 20, 2025'
    },
    {
      id: 2,
      title: 'Painter',
      company: 'Individual',
      location: 'Kandy, Sri Lanka',
      type: 'Part Time',
      salary: 'Rs 40,000 - Rs 55,000',
      posted: '1 week ago',
      publishedOn: '2025-01-01',
      description: 'We are looking for skilled Painters to join our renovation project...',
      fullDescription: 'Looking for experienced painters to handle interior and exterior painting work for residential properties in Kandy. Must be familiar with various paint brands and application techniques. The work involves preparation of surfaces, selection of appropriate materials, and application of paint to achieve a high-quality finish.',
      tags: ['Painter', 'Nipollac', 'Haris'],
      logo: Painter,
      clientName: 'Kumari Silva',
      clientType: 'Homeowner',
      memberSince: 'Mar 2023',
      jobsPosted: '3',
      clientRating: '4.5',
      requirements: [
        'Experience with interior and exterior painting',
        'Knowledge of different paint types and brands',
        'Attention to detail and quality finish',
        'Own painting equipment preferred'
      ],
      contactInfo: {
        phone: '+94 81 234 5678'
      },
      deadline: 'January 15, 2025'
    },
    {
      id: 3,
      title: 'Skilled Carpenter',
      company: 'Individual',
      location: 'Nugegoda, Sri Lanka',
      type: 'Contract',
      salary: 'Rs 70,000 - Rs 90,000',
      posted: '3 days ago',
      publishedOn: '2025-01-05',
      description: 'Looking for a versatile Carpenter to work on exciting furniture projects...',
      fullDescription: 'We need an experienced carpenter for custom furniture making, door and window installation, and general woodworking projects. This is a contract position with potential for long-term collaboration. The ideal candidate should have excellent craftsmanship skills and experience working with various types of wood.',
      tags: ['Furniture','Door','Window'],
      logo: Carpenter,
      clientName: 'Nimal Fernando',
      clientType: 'Business Owner',
      memberSince: 'Jun 2022',
      jobsPosted: '12',
      clientRating: '4.9',
      requirements: [
        'Expertise in furniture making and woodworking',
        'Experience with door and window installation',
        'Proficiency with carpentry tools',
        'Ability to work with various wood types',
        'Custom design experience preferred'
      ],
      contactInfo: {
        phone: '+94 11 345 6789',
        email: 'nimal.furniture@email.com'
      }
    },
    {
      id: 4,
      title: 'Plumber',
      company: 'Individual',
      location: 'Galle, Sri Lanka',
      type: 'Full Time',
      salary: 'Rs 35,000 - Rs 50,000',
      posted: '5 days ago',
      publishedOn: '2025-01-03',
      description: 'We are looking for skilled Plumbers to join our renovation project...',
      fullDescription: 'Seeking qualified plumbers for residential plumbing work including bathroom and kitchen installations, pipe repairs, and general plumbing maintenance. The successful candidate will work on various residential projects requiring expertise in modern plumbing systems.',
      tags: ['Bathroom', 'Kitchen', 'Garden'],
      logo: Plumber,
      clientName: 'Chaminda Jayawardena',
      clientType: 'Property Developer',
      memberSince: 'Sep 2022',
      jobsPosted: '8',
      clientRating: '4.6',
      requirements: [
        'Licensed plumber with 3+ years experience',
        'Experience with bathroom and kitchen plumbing',
        'Knowledge of modern plumbing systems',
        'Problem-solving skills for repairs'
      ],
      contactInfo: {
        phone: '+94 91 456 7890'
      },
      deadline: 'January 25, 2025'
    },
    {
      id: 5,
      title: 'Skilled Welders',
      company: 'Individual',
      location: 'Colombo, Sri Lanka',
      type: 'Full Time',
      salary: 'Rs 80,000 - Rs 100,000',
      posted: '1 day ago',
      publishedOn: '2025-01-07',
      description: 'We are looking for skilled Welders to join our metalwork project...',
      fullDescription: 'Professional welders needed for metal fabrication work including aluminum welding, TIG welding, and gas welding for various construction and manufacturing projects. This position offers excellent compensation for skilled professionals.',
      tags: ['Aluminium', 'TIG Welding', 'Gas Welding'],
      logo: Welder,
      clientName: 'Pradeep Industries',
      clientType: 'Manufacturing Company',
      memberSince: 'Dec 2021',
      jobsPosted: '15',
      clientRating: '4.7',
      requirements: [
        'Certified welder with 5+ years experience',
        'Expertise in TIG and gas welding',
        'Experience with aluminum welding',
        'Ability to read welding blueprints',
        'Safety certification required'
      ],
      contactInfo: {
        phone: '+94 11 567 8901',
        email: 'jobs@pradeepindustries.lk'
      }
    }
  ];

  const jobTypes = ['Full Time', 'Part Time', 'Contract'];

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
    setSelectedJob(job);
    setCurrentView('details');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedJob(null);
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
                        onClick={(e) => e.stopPropagation()}
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