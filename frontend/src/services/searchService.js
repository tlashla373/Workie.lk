import apiService from './apiService';

const searchService = {
  // Search for users/profiles
  searchUsers: async (query, page = 1, limit = 10) => {
    try {
      const response = await apiService.get(`/profiles/search`, {
        params: {
          search: query,
          page,
          limit
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  // Search for posts
  searchPosts: async (query, page = 1, limit = 10) => {
    try {
      const response = await apiService.get(`/posts`, {
        params: {
          search: query,
          page,
          limit
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  },

  // Search for jobs
  searchJobs: async (query, page = 1, limit = 10) => {
    try {
      const response = await apiService.get(`/jobs`, {
        params: {
          search: query,
          page,
          limit
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  },

  // Combined search (all types)
  searchAll: async (query, page = 1, limit = 20) => {
    try {
      // Run all searches in parallel
      const [usersResponse, postsResponse, jobsResponse] = await Promise.allSettled([
        searchService.searchUsers(query, 1, 5),
        searchService.searchPosts(query, 1, 5),
        searchService.searchJobs(query, 1, 5)
      ]);

      const results = {
        users: usersResponse.status === 'fulfilled' && usersResponse.value.success ? 
          (usersResponse.value.data.profiles || usersResponse.value.data.users || []) : [],
        posts: postsResponse.status === 'fulfilled' && postsResponse.value.success ? 
          (postsResponse.value.data.posts || []) : [],
        jobs: jobsResponse.status === 'fulfilled' && jobsResponse.value.success ? 
          (jobsResponse.value.data.jobs || []) : []
      };

      const totalCount = results.users.length + results.posts.length + results.jobs.length;

      return {
        success: true,
        data: {
          results,
          totalCount,
          query: query
        }
      };
    } catch (error) {
      console.error('Error performing combined search:', error);
      throw error;
    }
  },

  // Search by category
  searchByCategory: async (query, category, page = 1, limit = 10) => {
    try {
      let response;
      let results = { users: [], posts: [], jobs: [] };

      switch (category) {
        case 'users':
          response = await searchService.searchUsers(query, page, limit);
          if (response.success) {
            results.users = response.data.profiles || response.data.users || [];
          }
          break;
        case 'posts':
          response = await searchService.searchPosts(query, page, limit);
          if (response.success) {
            results.posts = response.data.posts || [];
          }
          break;
        case 'jobs':
          response = await searchService.searchJobs(query, page, limit);
          if (response.success) {
            results.jobs = response.data.jobs || [];
          }
          break;
        default:
          return await searchService.searchAll(query, page, limit);
      }

      const totalCount = results.users.length + results.posts.length + results.jobs.length;

      return {
        success: true,
        data: {
          results,
          totalCount,
          query: query
        }
      };
    } catch (error) {
      console.error(`Error searching ${category}:`, error);
      throw error;
    }
  },

  // Get recent searches (localStorage fallback since no backend endpoint)
  getRecentSearches: async () => {
    try {
      // Use localStorage for recent searches since no backend endpoint exists
      const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      return {
        success: true,
        data: {
          searches: recentSearches.slice(0, 10) // Return last 10 searches
        }
      };
    } catch (error) {
      console.error('Error getting recent searches:', error);
      return { success: true, data: { searches: [] } };
    }
  },

  // Save search to recent (localStorage since no backend endpoint)
  saveRecentSearch: async (query, type = 'general') => {
    try {
      const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      
      // Remove if already exists to avoid duplicates
      const filteredSearches = recentSearches.filter(search => search.query !== query);
      
      // Add to beginning
      filteredSearches.unshift({
        query,
        type,
        timestamp: new Date().toISOString()
      });

      // Keep only last 20 searches
      const limitedSearches = filteredSearches.slice(0, 20);
      
      localStorage.setItem('recentSearches', JSON.stringify(limitedSearches));
      
      return {
        success: true,
        data: { message: 'Search saved to recent searches' }
      };
    } catch (error) {
      console.error('Error saving recent search:', error);
      throw error;
    }
  }
};

export default searchService;