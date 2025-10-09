import { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { getWorkerStatsById } from '../services/workHistoryService';

const useTopRatedWorkers = (limit = 5) => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopWorkers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is logged in
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setWorkers([]);
        setError('Please log in to view top-rated workers');
        setLoading(false);
        return;
      }

      console.log('Fetching top-rated workers with comprehensive approach...');

      let allWorkers = [];

      // Approach 1: Get workers from profiles API (users with complete profiles)
      try {
        const queryParams = new URLSearchParams({
          page: 1,
          limit: 50,
          userType: 'worker'
        });

        console.log('Fetching workers from profiles API...');
        const profilesData = await apiService.get(`/profiles/search?${queryParams}`);
        console.log('Profiles API response:', profilesData);

        if (profilesData.success && profilesData.data.profiles) {
          const profileWorkers = profilesData.data.profiles.map(profile => ({
            id: profile.userInfo._id,
            name: `${profile.userInfo.firstName} ${profile.userInfo.lastName}`,
            title: profile.title || (profile.skills && profile.skills.length > 0 
              ? `${profile.skills[0].name} Specialist` 
              : 'Skilled Worker'),
            profession: profile.title || (profile.skills && profile.skills.length > 0 
              ? `${profile.skills[0].name} Specialist` 
              : 'Skilled Worker'),
            avatar: profile.userInfo.profilePicture || 
              `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.userInfo.firstName)}+${encodeURIComponent(profile.userInfo.lastName)}&background=random`,
            role: 'Worker',
            email: profile.userInfo.email || `${profile.userInfo.firstName.toLowerCase()}.${profile.userInfo.lastName.toLowerCase()}@example.com`,
            phone: profile.userInfo.phone || '+94 77 000 0000',
            category: profile.skills && profile.skills.length > 0 
              ? profile.skills[0].name.toLowerCase().replace(/\s+/g, '-')
              : 'general',
            userType: 'worker',
            location: profile.userInfo.address?.city || profile.userInfo.city || 'Sri Lanka',
            rating: profile.ratings?.average || 0,
            reviews: profile.ratings?.count || 0,
            totalReviews: profile.ratings?.count || 0,
            availability: profile.availability?.status || 'Available',
            skills: profile.skills || [],
            bio: profile.bio || '',
            verified: profile.userInfo.isVerified || false,
            hasProfile: true,
            completedJobs: profile.completedJobs || 0,
            experience: calculateExperience(profile.userInfo?.createdAt),
            // Worker-specific data
            workerData: {
              ranking: 0, // Will be set after sorting
              completedJobs: profile.completedJobs || 0,
              successRate: calculateSuccessRate(profile),
              responseTime: profile.responseTime || 'Within 2 hours',
              languages: profile.languages || ['English', 'Sinhala'],
              certifications: profile.certifications || [],
              portfolioItems: profile.portfolioItems || []
            },
            _ratingData: {
              original: profile.ratings,
              hasRating: !!(profile.ratings?.average && profile.ratings?.count),
              source: 'profiles'
            }
          }));

          allWorkers = [...allWorkers, ...profileWorkers];
          console.log(`Added ${profileWorkers.length} workers from profiles API`);
        }
      } catch (profileError) {
        console.warn('Profiles API failed:', profileError);
      }

      // Approach 2: Get workers directly from users API (including those without profiles)
      try {
        console.log('Fetching workers from direct users API...');
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users?page=1&limit=50&isActive=true&userType=worker`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const usersData = await response.json();
          console.log('Direct users API response:', usersData);

          if (usersData.success && usersData.data) {
            const directWorkers = usersData.data
              .filter(user => user.userType === 'worker' && user.isActive)
              .filter(user => !allWorkers.some(w => w.id === user._id)) // Avoid duplicates
              .map(user => ({
                id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                title: 'Skilled Worker',
                profession: 'Skilled Worker',
                avatar: user.profilePicture || 
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName)}+${encodeURIComponent(user.lastName)}&background=random`,
                role: 'Worker',
                email: user.email || `${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}@example.com`,
                phone: user.phone || '+94 77 000 0000',
                category: 'general',
                userType: 'worker',
                location: user.address?.city || 'Sri Lanka',
                rating: 0, // Will be updated with real data
                reviews: 0,
                totalReviews: 0,
                availability: 'Available',
                skills: [],
                bio: 'Setting up profile...',
                verified: user.isVerified || false,
                hasProfile: false,
                completedJobs: 0,
                experience: calculateExperience(user.createdAt),
                workerData: {
                  ranking: 0,
                  completedJobs: 0,
                  successRate: 95, // Default for new workers
                  responseTime: 'Within 2 hours',
                  languages: ['English', 'Sinhala'],
                  certifications: [],
                  portfolioItems: []
                },
                _ratingData: {
                  original: null,
                  hasRating: false,
                  source: 'users'
                }
              }));

            allWorkers = [...allWorkers, ...directWorkers];
            console.log(`Added ${directWorkers.length} workers from direct users API`);
          }
        }
      } catch (userError) {
        console.warn('Direct users API failed:', userError);
      }

      // Approach 3: Fetch real ratings for all workers
      try {
        console.log('Fetching real ratings for workers...');
        
        const workersWithRealRatings = await Promise.all(
          allWorkers.map(async (worker) => {
            try {
              const workerStats = await getWorkerStatsById(worker.id);
              return {
                ...worker,
                rating: Math.round((workerStats.averageRating || 0) * 10) / 10,
                reviews: workerStats.totalRatings || 0,
                totalReviews: workerStats.totalRatings || 0,
                _ratingData: {
                  ...worker._ratingData,
                  realData: workerStats,
                  hasRealRating: !!(workerStats.averageRating && workerStats.totalRatings)
                }
              };
            } catch (error) {
              console.warn(`Failed to fetch real ratings for worker ${worker.id}:`, error);
              return worker; // Return with existing rating data
            }
          })
        );

        allWorkers = workersWithRealRatings;
        console.log('Updated workers with real rating data');
      } catch (ratingError) {
        console.warn('Failed to fetch real ratings:', ratingError);
      }

      // Filter and sort workers to get top-rated ones
      const topWorkers = allWorkers
        .filter(worker => worker.name !== 'Unknown Worker' && worker.name.trim() !== '')
        .sort((a, b) => {
          // Prioritize workers with actual ratings
          const aHasRating = a.rating > 0 && a.reviews > 0;
          const bHasRating = b.rating > 0 && b.reviews > 0;
          
          if (aHasRating && !bHasRating) return -1;
          if (!aHasRating && bHasRating) return 1;
          
          // If both have ratings or both don't, sort by rating then by review count
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          return b.reviews - a.reviews;
        })
        .slice(0, limit)
        .map((worker, index) => ({
          ...worker,
          workerData: {
            ...worker.workerData,
            ranking: index + 1
          }
        }));

      console.log(`Successfully processed ${allWorkers.length} total workers, returning top ${topWorkers.length}:`, 
        topWorkers.map(w => ({ 
          name: w.name, 
          rating: w.rating, 
          reviews: w.reviews, 
          hasProfile: w.hasProfile,
          source: w._ratingData.source 
        }))
      );

      setWorkers(topWorkers);

      if (topWorkers.length === 0) {
        setError('No top-rated workers found at the moment.');
      }

    } catch (err) {
      console.error('Error fetching top-rated workers:', err);
      setError(err.message || 'Failed to load top-rated workers');
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopWorkers();
  }, [limit]);

  return {
    workers,
    loading,
    error,
    refetch: fetchTopWorkers
  };
};

// Helper functions
const calculateExperience = (createdAt) => {
  if (!createdAt) return '1+ years';
  
  const joinDate = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - joinDate);
  const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
  
  if (diffYears < 1) return '1+ years';
  return `${diffYears}+ years`;
};

const calculateSuccessRate = (profile) => {
  const completedJobs = profile.completedJobs || 0;
  const totalJobs = profile.totalJobs || completedJobs || 1;
  
  if (totalJobs === 0) return 95; // Default success rate for new workers
  
  const rate = Math.round((completedJobs / totalJobs) * 100);
  return Math.min(rate, 100); // Cap at 100%
};

export default useTopRatedWorkers;