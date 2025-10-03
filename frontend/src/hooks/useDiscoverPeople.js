import { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { getWorkerStatsById } from '../services/workHistoryService';

const useDiscoverPeople = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPeople = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is logged in
      const token = localStorage.getItem('auth_token');
      if (!token) {
        // If no token, show empty state with message
        setPeople([]);
        setError('Please log in to discover people');
        setLoading(false);
        return;
      }

      console.log('Fetching people with filters:', filters);

      // Try multiple approaches to get users
      let allPeople = [];

      // Approach 1: Try to get profiles with full data
      try {
        const queryParams = new URLSearchParams({
          page: filters.page || 1,
          limit: filters.limit || 30,
          userType: 'both',
          ...filters
        });

        console.log('Trying profiles search with params:', queryParams.toString());
        
        const profilesData = await apiService.get(`/profiles/search?${queryParams}`);
        console.log('Profiles API response:', profilesData);

        if (profilesData.success && profilesData.data.profiles) {
          const baseProfileUsers = profilesData.data.profiles.map(profile => ({
            id: profile.userInfo._id,
            name: `${profile.userInfo.firstName} ${profile.userInfo.lastName}`,
            title: profile.title || (profile.userInfo.userType === 'worker' ? 'Skilled Worker' : 'Client'),
            profession: profile.userInfo.userType === 'worker' 
              ? (profile.skills && profile.skills.length > 0 
                  ? profile.skills.map(skill => skill.name).join(', ')
                  : 'Skilled Worker')
              : 'Client',
            avatar: profile.userInfo.profilePicture || 
              `https://ui-avatars.com/api/?name=${profile.userInfo.firstName}+${profile.userInfo.lastName}&background=random`,
            role: profile.userInfo.userType === 'worker' ? 'Worker' : 'Client',
            email: `${profile.userInfo.firstName.toLowerCase()}.${profile.userInfo.lastName.toLowerCase()}@example.com`,
            phone: '+1 (555) 000-0000',
            category: profile.userInfo.userType === 'worker' 
              ? (profile.skills && profile.skills.length > 0 
                  ? profile.skills[0].name.toLowerCase()
                  : 'general')
              : 'client',
            userType: profile.userInfo.userType,
            location: profile.userInfo.city || 'Sri Lanka',
            rating: 0, // Initialize with default
            totalReviews: 0, // Initialize with default
            availability: profile.availability?.status || 'available',
            skills: profile.skills || [],
            bio: profile.bio || '',
            verified: profile.userInfo.isVerified || false,
            hasProfile: true
          }));

          // Fetch real ratings for worker profiles
          const profileUsersWithRatings = await Promise.all(
            baseProfileUsers.map(async (user) => {
              if (user.userType === 'worker') {
                try {
                  const workerStats = await getWorkerStatsById(user.id);
                  return {
                    ...user,
                    rating: workerStats.averageRating,
                    totalReviews: workerStats.totalRatings
                  };
                } catch (error) {
                  console.warn(`Failed to fetch ratings for worker ${user.id}:`, error);
                  return user; // Return with default rating values
                }
              }
              return user; // Non-workers don't need rating data
            })
          );
          
          allPeople = [...allPeople, ...profileUsersWithRatings];
          console.log('Added profile users with ratings:', profileUsersWithRatings.length);
        }
      } catch (profileError) {
        console.warn('Profiles search failed:', profileError);
      }

      // Approach 2: Get users directly (especially new users without profiles)
      try {
        console.log('Trying direct user search...');
        
        // Create a simple endpoint call that should work
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users?page=1&limit=50&isActive=true`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const usersData = await response.json();
          console.log('Direct users API response:', usersData);

          if (usersData.success && usersData.data) {
            const directUsers = usersData.data
              .filter(user => user.userType && user.isActive) // Only active users with userType
              .filter(user => !allPeople.some(p => p.id === user._id)) // Don't duplicate
              .map(user => ({
                id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                title: user.userType === 'worker' ? 'New Worker' : 'Client',
                profession: user.userType === 'worker' ? 'Skilled Worker' : 'Client',
                avatar: user.profilePicture || 
                  `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`,
                role: user.userType === 'worker' ? 'Worker' : 'Client',
                email: user.email || `${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}@example.com`,
                phone: user.phone || '+1 (555) 000-0000',
                category: user.userType === 'worker' ? 'general' : 'client',
                userType: user.userType,
                location: user.address?.city || 'Sri Lanka',
                rating: 0,
                totalReviews: 0,
                availability: 'available',
                skills: [],
                bio: 'Setting up profile...',
                verified: user.isVerified || false,
                hasProfile: false
              }));
            
            allPeople = [...allPeople, ...directUsers];
            console.log('Added direct users:', directUsers.length);
          }
        }
      } catch (userError) {
        console.warn('Direct users search failed:', userError);
      }

      console.log('Total people found:', allPeople.length);
      setPeople(allPeople);

      if (allPeople.length === 0) {
        setError('No users found. Try refreshing or check your connection.');
      }

    } catch (err) {
      console.error('Error fetching people:', err);
      setError(err.message || 'Failed to load people');
      setPeople([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  return {
    people,
    loading,
    error,
    refetch: fetchPeople
  };
};

export default useDiscoverPeople;
