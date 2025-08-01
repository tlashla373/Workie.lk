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
      title: 'Full Stack Developer',
      company: 'TechCorp Solutions',
      location: 'Colombo, Sri Lanka',
      duration: 'Jan 2024 - Present',
      salary: 'LKR 150,000/month',
      status: 'completed',
      rating: 4.8,
      description: 'Developed and maintained web applications using React, Node.js, and MongoDB.',
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      type: 'Full-time'
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      company: 'Creative Agency',
      location: 'Kandy, Sri Lanka',
      duration: 'Sep 2023 - Dec 2023',
      salary: 'LKR 80,000/month',
      status: 'completed',
      rating: 4.9,
      description: 'Designed user interfaces and experiences for mobile and web applications.',
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
      type: 'Contract'
    },
    {
      id: 3,
      title: 'Mobile App Developer',
      company: 'StartupLK',
      location: 'Galle, Sri Lanka',
      duration: 'Jun 2023 - Aug 2023',
      salary: 'LKR 120,000/month',
      status: 'in-progress',
      rating: null,
      description: 'Building cross-platform mobile applications using React Native.',
      skills: ['React Native', 'Firebase', 'Redux', 'JavaScript'],
      type: 'Part-time'
    },
    {
      id: 4,
      title: 'WordPress Developer',
      company: 'Digital Marketing Pro',
      location: 'Negombo, Sri Lanka',
      duration: 'Mar 2023 - May 2023',
      salary: 'LKR 60,000/month',
      status: 'cancelled',
      rating: 3.5,
      description: 'Developed custom WordPress themes and plugins for client websites.',
      skills: ['WordPress', 'PHP', 'MySQL', 'CSS'],
      type: 'Freelance'
    },
    {
      id: 5,
      title: 'Data Analyst',
      company: 'Analytics Hub',
      location: 'Matara, Sri Lanka',
      duration: 'Dec 2022 - Feb 2023',
      salary: 'LKR 90,000/month',
      status: 'completed',
      rating: 4.6,
      description: 'Analyzed business data and created insightful reports and dashboards.',
      skills: ['Python', 'SQL', 'Tableau', 'Excel'],
      type: 'Contract'
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
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Work History</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Track your completed projects and earnings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                  {(totalEarnings / 1000).toFixed(0)}K
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
                <Filter className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
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
        <div className="space-y-6">
          {filteredHistory.map((job) => (
            <div key={job.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
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
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(job.status)}`}>
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