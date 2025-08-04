import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Clock, Building, Heart, ExternalLink, Filter } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import Mason from '../../assets/mason.svg'
import Welder from '../../assets/welder.svg'
import Plumber from '../../assets/plumber.svg'
import Carpenter from '../../assets/carpenter.svg'
import Painter from '../../assets/painter.svg'


const FindJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { isDarkMode } = useDarkMode();

  const jobs = [
    {
      id: 1,
      title: 'Skilled Masons',
      company: 'Individual',
      location: 'Colombo, Sri Lanka',
      type: 'Full Time',
      salary: 'Rs 60,000 - Rs 80,000',
      posted: '2 days ago',
      description: 'We are looking for an Skilled Mason Bass to join our project...',
      tags: ['Mason', 'Bricks', 'Tile work'],
      logo: Mason
    },
    {
      id: 2,
      title: 'Painter',
      company: 'Individual',
      location: 'Kandy, Sri Lanka',
      type: 'Part Time',
      salary: 'Rs 40,000 - Rs 55,000',
      posted: '1 week ago',
      description: 'We are looking for an Skilled Painters to join our project...',
      tags: ['Painter', 'Nipollac', 'Haris'],
      logo: Painter
    },
    {
      id: 3,
      title: 'Skilled Carpenter',
      company: 'Individual',
      location: 'Nugegoda, Sri Lanka',
      type: 'Contract',
      salary: 'Rs 70,000 - Rs 90,000',
      posted: '3 days ago',
      description: 'Looking for a versatile Carpenter to work on exciting projects...',
      tags: ['Furniture','Door','Window'],
      logo: Carpenter
    },
    {
      id: 4,
      title: 'Plumber',
      company: 'Individual',
      location: 'Galle, Sri Lanka',
      type: 'Full Time',
      salary: 'Rs 35,000 - Rs 50,000',
      posted: '5 days ago',
      description: 'We are looking for an Skilled Plumbers to join our project...',
      tags: ['Bathroom', 'Kitchen', 'Garden'],
      logo: Plumber
    },
    {
      id: 5,
      title: 'Skilled Welders',
      company: 'Individual',
      location: 'Colombo, Sri Lanka',
      type: 'Full Time',
      salary: 'Rs 80,000 - Rs 100,000',
      posted: '1 day ago',
      description: 'We are looking for an Skilled Welders to join our project...',
      tags: ['Aluminium', 'TIG Welding', 'Gas Welding'],
      logo: Welder
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Find Your Dream Job</h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Discover opportunities that match your skills and interests</p>
      </div>

      {/* Search and Filters */}
      <div className={`rounded-xl p-6 space-y-4 ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 ${isDarkMode ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
            />
          </div>

          {/* Location Filter */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className={`w-full lg:w-48 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 ${isDarkMode ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
            />
          </div>

          {/* Job Type Filter */}
          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className={`w-full lg:w-48 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 ${isDarkMode ? 'bg-gray-700/50 border-gray-600/50 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          >
            <option value="" className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>All Job Types</option>
            {jobTypes.map(type => (
              <option key={type} value={type} className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>{type}</option>
            ))}
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-600/30 transition-all duration-200 flex items-center space-x-2"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Results Count */}
        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
          Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map(job => (
          <div key={job.id} className={`rounded-xl p-6 hover:transition-all duration-200 border ${isDarkMode ? 'bg-gray-700/30 hover:bg-gray-700/40 border-gray-600/30' : 'bg-white hover:bg-gray-100 border-gray-300'}`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12">
                    {typeof job.logo === 'string' && job.logo.endsWith('.svg') ? (
                      <img src={job.logo} alt={job.title} className="w-full h-full object-contain rounded-md" />
                    ) : (
                      <span className="text-3xl">{job.logo}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
                      <h3 className={`text-xl font-semibold hover:text-blue-400 cursor-pointer transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {job.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-2 lg:mt-0">
                        <button className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-500 hover:text-red-600 hover:bg-red-100'}`}>
                          <Heart className="w-5 h-5" />
                        </button>
                        <button className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-100'}`}>
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className={`flex flex-wrap items-center gap-4 text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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

                    <p className={`mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.description}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Posted {job.posted}</span>
                      <div className="flex space-x-3">
                        <button className={`px-4 py-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'bg-gray-600/50 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                          Save for Later
                        </button>
                        <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
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
