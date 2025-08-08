import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Star, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Briefcase,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const WorkHistory = () => {
  const { isDarkMode } = useDarkMode();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const workHistory = [
 {
    id: 1,
    title: 'Carpenter',
    company: 'HomeFix Interior Solutions',
    location: 'Colombo, Sri Lanka',
    duration: 'Jan 2024 - Apr 2024',
    salary: 'LKR 9,500/day',
    status: 'completed',
    rating: 4,
    description: 'Installed custom-built wardrobes and kitchen cabinets for a modern apartment in Colombo.',
    skills: ['Furniture Assembly', 'Wood Finishing', 'Measurement Accuracy', 'Power Tools'],
    type: 'Freelance'
  },
  {
    id: 2,
    title: 'Carpenter',
    company: 'UrbanWood Designs',
    location: 'Negombo, Sri Lanka',
    duration: 'May 2024 - Jun 2024',
    salary: 'LKR 6,255/day',
    status: 'completed',
    rating: 4,
    description: 'Designed and built an outdoor wooden patio and decking for a residential project.',
    skills: ['Deck Building', 'Wood Treatment', 'Blueprint Reading', 'Outdoor Furniture'],
    type: 'Contract'
  },
  {
    id: 3,
    title: 'Carpenter',
    company: 'CraftLine Interiors',
    location: 'Kandy, Sri Lanka',
    duration: 'Jul 2024 - Present',
    salary: 'LKR 7,500/day',
    status: 'in-progress',
    rating: 3,
    description: 'Currently working on a restaurant interior project, focusing on wooden ceilings and wall panels.',
    skills: ['Interior Carpentry', 'Precision Cutting', 'On-Site Installation'],
    type: 'Full-time'
  }
  ];

  const filteredHistory = workHistory.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const totalEarnings = workHistory
    .filter(job => job.status === 'completed')
    .reduce((total, job) => {
      const salary = parseInt(job.salary.replace(/[^\d]/g, ''));
      return total + salary;
    }, 0);

  const averageRating = workHistory
    .filter(job => job.rating)
    .reduce((sum, job, _, arr) => sum + (job.rating || 0) / arr.length, 0);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-xl transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Work History</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Track your completed projects and earnings</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{workHistory.length}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Jobs</p>
              </div>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {workHistory.filter(job => job.status === 'completed').length}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</p>
              </div>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  LKR {(totalEarnings / 1).toFixed(0)}.00
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Earned</p>
              </div>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {averageRating.toFixed(1)}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search jobs or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 w-64 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className={`px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export History</span>
            </button>
          </div>
        </div>

        {/* Work History List */}
        <div className="space-y-4">
          {filteredHistory.map((job) => (
            <div key={job.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0 space-x-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                        {job.title}
                      </h3>
                      <p className={`text-lg ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}>
                        {job.company}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-2 ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        <span className="capitalize">{job.status.replace('-', ' ')}</span>
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                        {job.type}
                      </span>
                    </div>
                  </div>

                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>{job.salary}</span>
                    </div>
                  </div>
                </div>

                {job.rating && (
                  <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className={`font-semibold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                      {job.rating}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No work history found</p>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkHistory;