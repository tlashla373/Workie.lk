import apiService from './apiService.js';
import { API_ENDPOINTS } from '../config/api.js';

export class JobService {
  // Fetch all jobs with optional filters
  async getAllJobs(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.budgetMin) queryParams.append('budgetMin', filters.budgetMin);
      if (filters.budgetMax) queryParams.append('budgetMax', filters.budgetMax);
      if (filters.limit) queryParams.append('limit', filters.limit);
      
      const queryString = queryParams.toString();
      const url = queryString ? `${API_ENDPOINTS.JOBS.BASE}?${queryString}` : API_ENDPOINTS.JOBS.BASE;
      
      console.log('Fetching jobs from URL:', url);
      const response = await apiService.get(url);
      console.log('Jobs API response:', response);
      
      return response;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }

  // Fetch jobs by categories (useful for worker job suggestions)
  async getJobsByCategories(categories, limit = 100) {
    try {
      const response = await this.getAllJobs({
        status: 'open',
        limit: limit
      });

      console.log('All jobs response:', response);

      // Handle different response structures
      let jobs = [];
      if (response.success && response.data) {
        if (response.data.jobs) {
          jobs = response.data.jobs;
        } else if (Array.isArray(response.data)) {
          jobs = response.data;
        } else if (response.data.data && response.data.data.jobs) {
          jobs = response.data.data.jobs;
        }
      }

      console.log(`Total jobs found: ${jobs.length}`);

      if (jobs.length > 0) {
        // Create category mapping for flexible matching
        const categoryMap = {
          'Mason': 'other',
          'Carpenter': 'carpentry',
          'Welder': 'repair-services',
          'Painter': 'painting',
          'Plumber': 'plumbing',
          'Cleaner': 'cleaning',
          'Gardener': 'gardening',
          'Electrician': 'electrical',
          'Delivery': 'delivery',
          'Tutor': 'tutoring',
          'Pet Care': 'pet-care',
          'Elderly Care': 'elderly-care',
          'Cook': 'cooking',
          'Photography': 'photography',
          'Event Planning': 'event-planning',
          'Moving': 'moving'
        };

        // Convert worker categories to backend job categories
        const backendCategories = categories.map(cat => 
          categoryMap[cat] || cat.toLowerCase().replace(/\s+/g, '-')
        );

        // Also include original categories for direct match
        const allCategories = [...new Set([...categories, ...backendCategories])];

        console.log('Worker categories:', categories);
        console.log('Mapped backend categories:', backendCategories);
        console.log('All categories to match:', allCategories);

        // Filter jobs that match any of the worker's categories
        const matchingJobs = jobs.filter(job => {
          const jobCategory = job.category?.toLowerCase();
          return allCategories.some(cat => 
            cat.toLowerCase() === jobCategory || 
            cat.toLowerCase().includes(jobCategory) ||
            jobCategory.includes(cat.toLowerCase())
          );
        });
        
        console.log(`Found ${matchingJobs.length} matching jobs from ${jobs.length} total jobs`);
        
        return {
          success: true,
          data: {
            jobs: matchingJobs,
            total: matchingJobs.length
          }
        };
      } else {
        console.log('No jobs found in API response');
        return {
          success: true,
          data: {
            jobs: [],
            total: 0
          }
        };
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching jobs by categories:', error);
      throw error;
    }
  }

  // Get a single job by ID
  async getJobById(jobId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.JOBS.BY_ID(jobId));
      return response;
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      throw error;
    }
  }

  // Get user's posted jobs
  async getMyJobs() {
    try {
      const response = await apiService.get(API_ENDPOINTS.JOBS.MY_JOBS);
      return response;
    } catch (error) {
      console.error('Error fetching user jobs:', error);
      throw error;
    }
  }

  // Transform job data for UI display
  transformJobForDisplay(job) {
    const categoryIcons = {
      'carpentry': '🔨',
      'painting': '🎨', 
      'plumbing': '🔧',
      'electrical': '⚡',
      'cleaning': '🧹',
      'gardening': '🌱',
      'delivery': '📦',
      'tutoring': '📚',
      'pet-care': '🐕',
      'elderly-care': '👴',
      'cooking': '👨‍🍳',
      'photography': '📸',
      'event-planning': '🎉',
      'repair-services': '🛠️',
      'moving': '📋',
      'other': '💼'
    };

    return {
      id: job._id,
      title: job.title,
      company: job.client?.firstName ? `${job.client.firstName} ${job.client.lastName}` : 'Client',
      location: job.location?.city ? `${job.location.city}, ${job.location.state || ''}` : 'Location not specified',
      type: job.category || 'Not specified',
      category: job.category,
      salary: job.budget?.amount ? `Rs. ${job.budget.amount} (${job.budget.type || 'fixed'})` : 'Negotiable',
      budget: job.budget,
      posted: new Date(job.createdAt).toLocaleDateString(),
      description: job.description,
      requirements: job.requirements || [],
      skills: job.skills || [],
      urgency: job.urgency || 'medium',
      deadline: job.applicationClosingDate ? new Date(job.applicationClosingDate).toLocaleDateString() : null,
      icon: categoryIcons[job.category] || '💼',
      status: job.status,
      clientId: job.client?._id,
      clientName: job.client?.firstName ? `${job.client.firstName} ${job.client.lastName}` : 'Client',
      clientProfilePhoto: job.client?.profilePicture || job.client?.avatar || null, // Add client profile photo
      avatar: job.client?.profilePicture || job.client?.avatar || null // Also set avatar for backward compatibility
    };
  }
}

// Create and export a singleton instance
const jobService = new JobService();
export default jobService;