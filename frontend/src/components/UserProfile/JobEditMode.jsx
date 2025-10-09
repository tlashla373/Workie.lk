import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Upload, 
  CreditCard, 
  HandCoins,
  Check,
  AlertCircle,
  Calendar,
  DollarSign,
  Send,
  Edit,
  Trash2,
  MapPin,
  Clock,
  Building,
  Users,
  Eye,
  Star
} from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthChecker from '../../components/ProtectionPage/AuthChecker';
import axios from 'axios';

const JobDetailsPage = ({ onBack }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();
  
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('auth_token');
  
  // If not authenticated, show auth checker
  if (!isAuthenticated) {
    return <AuthChecker />;
  }
  
  // State for job details
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // Fetch job details when component mounts
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        
        const response = await axios.get(`/api/jobs/${id}`, config);
        
        if (response.data && response.data.success) {
          const jobData = response.data.data;
          setJob(jobData);
          
          // Check if current user is the job owner
          const currentUserId = localStorage.getItem('user_id');
          const jobOwnerId = jobData.client?._id || jobData.clientId;
          setIsOwner(currentUserId && jobOwnerId && currentUserId === jobOwnerId);
        } else {
          throw new Error(response.data.message || 'Failed to fetch job details');
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError(error.response?.data?.message || error.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  // Helper functions
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

  const handleEdit = () => {
    // Navigate to edit job page
    navigate(`/edit-job/${id}`, { state: { job: job } });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('auth_token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        
        await axios.delete(`/api/jobs/${id}`, config);
        
        alert('Job deleted successfully!');
        navigate('/clientprofile?tab=posted-jobs'); // Navigate back to client profile posted jobs tab
      } catch (error) {
        console.error('Error deleting job:', error);
        alert(error.response?.data?.message || 'Failed to delete job. Please try again.');
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Error Loading Job
          </h2>
          <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {error}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Job not found state
  if (!job) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">📝</div>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Job Not Found
          </h2>
          <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            The job you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/clientprofile?tab=posted-jobs')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Jobs</span>
          </button>
          
          {isOwner && (
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-medium">
                Your Job
              </span>
            </div>
          )}
        </div>

        {/* Job Header Card */}
        <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} shadow-lg`}>
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Job Icon */}
            <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-xl flex-shrink-0">
              <Building className="w-8 h-8 text-blue-600" />
            </div>
            
            {/* Job Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {job.title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(job.status)}`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              </div>
              
              <div className={`flex items-center space-x-2 mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <Building className="w-5 h-5" />
                <span className="text-lg">
                  {job.client?.firstName ? `${job.client.firstName} ${job.client.lastName}` : 'Unknown Client'}
                </span>
              </div>

              {/* Job Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Location</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {job.location?.city || job.location?.address || 'Not specified'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Budget</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatBudget(job.budget)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Posted</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatDate(job.createdAt)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Applications</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {job.applicationsCount || 0} received
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              {isOwner && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleEdit}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit Job</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete Job</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Job Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} shadow-lg`}>
              <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Job Description
              </h2>
              <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {job.description || 'No description provided.'}
              </p>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} shadow-lg`}>
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className={`flex items-start space-x-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} shadow-lg`}>
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Benefits
                </h2>
                <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {job.benefits}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Stats */}
            <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} shadow-lg`}>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Job Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Views</span>
                  </div>
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {job.views || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Applications</span>
                  </div>
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {job.applicationsCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Priority</span>
                  </div>
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {job.urgency || 'Medium'}
                  </span>
                </div>
              </div>
            </div>

            {/* Client Information */}
            {job.client && (
              <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} shadow-lg`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Client Information
                </h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {job.client.firstName} {job.client.lastName}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Client
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {job.client.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {job.client.email}
                      </span>
                    </div>
                  )}
                  {job.client.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {job.client.phone}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Member since {job.client.createdAt ? new Date(job.client.createdAt).getFullYear() : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;