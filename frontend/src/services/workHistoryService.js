import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Set up axios defaults
axios.defaults.baseURL = 'http://localhost:5000';

/**
 * Fetch work history for workers - shows their applications
 */
export const getWorkerApplications = async (userId = null) => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // If userId is provided, we might need a different endpoint
    // For now, this only gets current user's applications
    const response = await axios.get(API_ENDPOINTS.APPLICATIONS.BASE, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data && response.data.success) {
      return response.data.data.applications;
    } else {
      throw new Error(response.data?.message || 'Failed to fetch applications');
    }
  } catch (error) {
    console.error('Error fetching worker applications:', error);
    throw error;
  }
};

/**
 * Calculate worker statistics from applications
 */
export const calculateWorkerStats = (applications) => {
  if (!Array.isArray(applications)) {
    return {
      averageRating: 0,
      completedJobs: 0,
      totalRatings: 0
    };
  }

  // Filter completed jobs
  const completedJobs = applications.filter(app => 
    app.status === 'completed' || app.status === 'reviewed' || app.status === 'closed'
  );

  // Filter jobs with ratings
  const jobsWithRatings = completedJobs.filter(app => 
    app.review?.rating && app.review.rating > 0
  );

  // Calculate average rating
  const totalRatings = jobsWithRatings.length;
  const averageRating = totalRatings > 0 
    ? jobsWithRatings.reduce((sum, app) => sum + app.review.rating, 0) / totalRatings
    : 0;

  return {
    averageRating,
    completedJobs: completedJobs.length,
    totalRatings
  };
};

/**
 * Fetch work history for clients - shows applications received on their jobs
 */
export const getClientApplications = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Fetching client jobs...');
    
    // First get user's jobs
    const jobsResponse = await axios.get(API_ENDPOINTS.JOBS.MY_JOBS, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Jobs response:', jobsResponse.data);

    if (!jobsResponse.data?.success) {
      throw new Error('Failed to fetch jobs');
    }

    const jobs = jobsResponse.data.data.jobs || jobsResponse.data.data;
    console.log('Client jobs found:', jobs?.length || 0);
    
    if (!jobs || jobs.length === 0) {
      console.log('No jobs found for client');
      return [];
    }

    const allApplications = [];

    // Fetch applications for each job
    for (const job of jobs) {
      try {
        console.log(`Fetching applications for job ${job._id}...`);
        const applicationsResponse = await axios.get(API_ENDPOINTS.JOBS.APPLICATIONS(job._id), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log(`Applications response for job ${job._id}:`, applicationsResponse.data);

        if (applicationsResponse.data?.success) {
          const jobApplications = applicationsResponse.data.data.map(app => ({
            ...app,
            jobTitle: job.title,
            jobId: job._id,
            company: job.company || 'Your Job Post',
            jobBudget: job.budget,
            jobLocation: formatLocation(job.location)
          }));
          console.log(`Found ${jobApplications.length} applications for job ${job._id}`);
          allApplications.push(...jobApplications);
        }
      } catch (error) {
        console.warn(`Failed to fetch applications for job ${job._id}:`, error);
        console.warn('Error details:', error.response?.data);
      }
    }

    console.log('Total applications found for client:', allApplications.length);
    return allApplications;
  } catch (error) {
    console.error('Error fetching client applications:', error);
    throw error;
  }
};

/**
 * Format location data - handle both string and object formats
 */
const formatLocation = (location) => {
  if (!location) {
    return 'Location not specified';
  }
  
  if (typeof location === 'string') {
    return location;
  }
  
  if (typeof location === 'object') {
    const { address, city, state, country } = location;
    const parts = [];
    
    if (address) parts.push(address);
    if (city) parts.push(city);
    if (state) parts.push(state);
    if (country) parts.push(country);
    
    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
  }
  
  return 'Location not specified';
};

/**
 * Transform application data to match WorkHistory component expectations
 */
export const transformApplicationToWorkHistory = (application, userType) => {
  const baseData = {
    id: application._id,
    applicationId: application._id,
    status: application.status,
    appliedDate: application.createdAt,
    coverLetter: application.coverLetter,
    proposedPrice: application.proposedPrice,
    estimatedDuration: application.estimatedDuration,
    availability: application.availability
  };

  if (userType === 'worker') {
    // Worker perspective: job they applied to
    return {
      ...baseData,
      title: application.job?.title || 'Unknown Job',
      company: application.job?.client?.firstName && application.job?.client?.lastName 
        ? `${application.job.client.firstName} ${application.job.client.lastName}`
        : 'Unknown Client',
      location: formatLocation(application.job?.location),
      salary: application.proposedPrice?.amount 
        ? `LKR ${application.proposedPrice.amount}${application.proposedPrice.per ? `/${application.proposedPrice.per}` : ''}`
        : 'Not specified',
      description: application.coverLetter || 'No description provided',
      skills: [], // Can be derived from job requirements if needed
      type: 'Application',
      duration: application.estimatedDuration || 'Not specified',
      stage: getStageFromStatus(application.status),
      review: application.review || null, // Include the full review object
      rating: application.review?.rating || null // Keep backward compatibility
    };
  } else {
    // Client perspective: applications received on their jobs
    return {
      ...baseData,
      title: application.jobTitle || 'Unknown Job',
      company: application.worker?.firstName && application.worker?.lastName
        ? `${application.worker.firstName} ${application.worker.lastName}`
        : 'Unknown Worker',
      location: formatLocation(application.jobLocation),
      salary: application.proposedPrice?.amount 
        ? `LKR ${application.proposedPrice.amount}${application.proposedPrice.per ? `/${application.proposedPrice.per}` : ''}`
        : 'Not specified',
      description: application.coverLetter || 'No cover letter provided',
      skills: [], // Can be derived from worker profile if needed
      type: 'Application Received',
      duration: application.estimatedDuration || 'Not specified',
      stage: getStageFromStatus(application.status),
      review: application.review || null, // Include the full review object
      rating: application.review?.rating || null // Keep backward compatibility
    };
  }
};

/**
 * Convert application status to stage number for UI (updated with new statuses)
 */
const getStageFromStatus = (status) => {
  const statusMap = {
    'pending': 1,
    'accepted': 2,
    'rejected': 0,
    'withdrawn': 0,
    'in-progress': 3,
    'completed': 4,
    'payment-released': 5,
    'payment-confirmed': 6,
    'reviewed': 7,
    'closed': 8
  };
  return statusMap[status] || 1;
};

/**
 * Fetch work history based on user type
 */
export const getWorkHistory = async (userType) => {
  try {
    console.log('Fetching work history for user type:', userType);
    let applications;
    
    if (userType === 'worker') {
      applications = await getWorkerApplications();
    } else if (userType === 'client') {
      applications = await getClientApplications();
    } else {
      throw new Error('Invalid user type');
    }

    console.log('Raw applications fetched:', applications);

    // Transform applications to work history format
    const transformedHistory = applications.map(app => transformApplicationToWorkHistory(app, userType));
    console.log('Transformed work history:', transformedHistory);
    
    return transformedHistory;
  } catch (error) {
    console.error('Error fetching work history:', error);
    throw error;
  }
};

/**
 * Fetch worker statistics for a specific worker by their ID
 * This can be used to get ratings for other users' profiles
 */
export const getWorkerStatsById = async (workerId) => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log(`Fetching worker stats for worker ID: ${workerId}`);

    // Use the new endpoint to get applications for a specific worker
    const response = await axios.get(API_ENDPOINTS.APPLICATIONS.BY_WORKER(workerId), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Worker stats response:', response.data);

    if (response.data && response.data.success) {
      const applications = response.data.data.applications || response.data.data;
      console.log('Applications for worker:', applications);
      
      return calculateWorkerStats(applications);
    } else {
      // If the API call fails, return default stats
      console.warn('Unable to fetch worker applications, returning default stats');
      return {
        averageRating: 0,
        completedJobs: 0,
        totalRatings: 0
      };
    }
  } catch (error) {
    console.error('Error fetching worker stats by ID:', error);
    // Return default stats on error instead of throwing
    return {
      averageRating: 0,
      completedJobs: 0,
      totalRatings: 0
    };
  }
};