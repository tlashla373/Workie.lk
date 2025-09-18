import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, DollarSign, Users, Eye, Clock, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostedJobs = ({ isDarkMode, isOwnProfile, userId }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPostedJobs();
  }, []);

  const fetchPostedJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const response = await axios.get('/api/jobs/user/my-jobs', config);
      
      if (response.data && response.data.success) {
        setJobs(response.data.data.jobs);
      } else {
        throw new Error(response.data.message || 'Failed to fetch posted jobs');
      }
    } catch (error) {
      console.error('Error fetching posted jobs:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load posted jobs');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatBudget = (budget) => {
    if (!budget) return 'Not specified';
    return `${budget.currency || 'LKR'} ${budget.amount} (${budget.type || 'fixed'})`;
  };

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
          onClick={fetchPostedJobs}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} text-center`}>
        <div className="mb-4">
          <div className={`w-16 h-16 mx-auto rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
            <Users className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
        </div>
        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          No Jobs Posted Yet
        </h3>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
          You haven't posted any jobs yet. Start by creating your first job posting!
        </p>
        <button 
          onClick={() => navigate('/post-job')}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Post Your First Job
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Posted Jobs ({jobs.length})
        </h2>
        {isOwnProfile && (
          <button 
            onClick={() => navigate('/post-job')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Post New Job
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <div 
            key={job._id} 
            className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-lg transition-shadow`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {job.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3 line-clamp-2`}>
                  {job.description}
                </p>
              </div>
              {isOwnProfile && (
                <div className="flex gap-2 ml-4">
                  <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                    <Edit className="w-4 h-4 text-blue-500" />
                  </button>
                  <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {job.location?.city || job.location?.address || 'Location not specified'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {formatBudget(job.budget)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Posted {formatDate(job.createdAt)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {job.applicationsCount || 0} Applications
                </span>
              </div>
            </div>

            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.slice(0, 5).map((skill, index) => (
                  <span 
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 5 && (
                  <span className={`px-2 py-1 rounded-full text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    +{job.skills.length - 5} more
                  </span>
                )}
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 text-sm">
                <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Eye className="w-4 h-4" />
                  {job.views || 0} views
                </span>
                <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Clock className="w-4 h-4" />
                  {job.urgency || 'medium'} priority
                </span>
              </div>
              
              <button 
                onClick={() => navigate(`/jobs/${job._id}`)}
                className="px-4 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-sm font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostedJobs;