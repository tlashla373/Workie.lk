import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import JobDetailsPage from '../FindJobs/JobDetailsPage';
import { useDarkMode } from '../../contexts/DarkModeContext';

const JobDetailsContainer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`/api/jobs/${id}`);
        
        // Transform the backend job data to match the expected format
        const jobData = response.data.data;
        const transformedJob = {
          id: jobData._id,
          title: jobData.title,
          company: jobData.client?.firstName ? `${jobData.client.firstName} ${jobData.client.lastName}` : 'Unknown Client',
          location: `${jobData.location?.city || ''}, ${jobData.location?.state || ''}`.trim(),
          type: jobData.category || 'Not specified',
          salary: jobData.budget?.amount ? `Rs. ${jobData.budget.amount} (${jobData.budget.type || 'fixed'})` : 'Negotiable',
          posted: new Date(jobData.createdAt).toLocaleDateString(),
          publishedOn: new Date(jobData.createdAt).toLocaleDateString(),
          description: jobData.description,
          fullDescription: jobData.description,
          tags: jobData.skills || [],
          requirements: jobData.requirements || [],
          benefits: jobData.benefits,
          logo: '🏢', // Default logo, could be enhanced later
          clientName: jobData.client?.firstName ? `${jobData.client.firstName} ${jobData.client.lastName}` : 'Unknown Client',
          clientType: 'Client',
          memberSince: jobData.client?.createdAt ? new Date(jobData.client.createdAt).getFullYear().toString() : 'Unknown',
          jobsPosted: 0, // This would need a separate API call to get client's job count
          clientRating: 0, // This would need to be calculated from reviews
          contactInfo: {
            phone: jobData.client?.phone,
            email: jobData.client?.email
          },
          deadline: jobData.applicationClosingDate ? new Date(jobData.applicationClosingDate).toLocaleDateString() : null
        };
        
        setJob(transformedJob);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError(err.response?.data?.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Error Loading Job
          </h2>
          <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {error}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">📝</div>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Job Not Found
          </h2>
          <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            The job you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <JobDetailsPage job={job} onBack={handleBack} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default JobDetailsContainer;