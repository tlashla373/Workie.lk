import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Clock, Building, Heart, ExternalLink, Filter } from 'lucide-react';

const FindJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Solutions',
      location: 'Colombo, Sri Lanka',
      type: 'Full Time',
      salary: '$60,000 - $80,000',
      posted: '2 days ago',
      description: 'We are looking for an experienced Frontend Developer to join our dynamic team...',
      tags: ['React', 'TypeScript', 'Tailwind CSS'],
      logo: '🚀'
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      company: 'Creative Studio',
      location: 'Kandy, Sri Lanka',
      type: 'Part Time',
      salary: '$40,000 - $55,000',
      posted: '1 week ago',
      description: 'Join our creative team to design beautiful and intuitive user experiences...',
      tags: ['Figma', 'Adobe XD', 'Prototyping'],
      logo: '🎨'
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'StartupHub',
      location: 'Remote',
      type: 'Contract',
      salary: '$70,000 - $90,000',
      posted: '3 days ago',
      description: 'Looking for a versatile developer to work on exciting projects...',
      tags: ['Node.js', 'React', 'MongoDB'],
      logo: '💻'
    },
    {
      id: 4,
      title: 'Digital Marketing Specialist',
      company: 'Marketing Pro',
      location: 'Galle, Sri Lanka',
      type: 'Full Time',
      salary: '$35,000 - $50,000',
      posted: '5 days ago',
      description: 'Drive our digital marketing campaigns and grow our online presence...',
      tags: ['SEO', 'Social Media', 'Analytics'],
      logo: '📈'
    },
    {
      id: 5,
      title: 'Data Scientist',
      company: 'DataTech Inc',
      location: 'Colombo, Sri Lanka',
      type: 'Full Time',
      salary: '$80,000 - $100,000',
      posted: '1 day ago',
      description: 'Analyze complex data sets and provide actionable insights...',
      tags: ['Python', 'Machine Learning', 'SQL'],
      logo: '📊'
    }
  ];

  const jobTypes = ['Full Time', 'Part Time', 'Contract', 'Freelance', 'Internship'];

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
        <h1 className="text-3xl font-bold text-white mb-2">Find Your Dream Job</h1>
        <p className="text-gray-400">Discover opportunities that match your skills and interests</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-700/30 rounded-xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
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
              className="w-full lg:w-48 pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Job Type Filter */}
          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className="w-full lg:w-48 px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
          >
            <option value="" className="bg-gray-700">All Job Types</option>
            {jobTypes.map(type => (
              <option key={type} value={type} className="bg-gray-700">{type}</option>
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
        <div className="text-gray-400 text-sm">
          Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-gray-700/30 rounded-xl p-6 hover:bg-gray-700/40 transition-all duration-200 border border-gray-600/30">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{job.logo}</div>
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white hover:text-blue-400 cursor-pointer transition-colors duration-200">
                        {job.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-2 lg:mt-0">
                        <button className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
                          <Heart className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200">
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
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

                    <p className="text-gray-300 mb-3 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <span className="text-sm text-gray-500">Posted {job.posted}</span>
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-600 transition-all duration-200">
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
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
          <p className="text-gray-400">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};

export default FindJobs;