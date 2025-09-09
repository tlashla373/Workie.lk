import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

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

      const queryParams = new URLSearchParams({
        page: filters.page || 1,
        limit: filters.limit || 20,
        userType: 'both', // Include both workers and clients
        ...filters
      });

      const data = await apiService.get(`/profiles/search?${queryParams}`).catch(err => {
        console.warn('Profiles search API not available:', err.message);
        // Return mock data structure for fallback
        return {
          success: true,
          data: {
            profiles: [
              {
                userInfo: {
                  _id: 'demo-1',
                  firstName: 'Demo',
                  lastName: 'Worker',
                  userType: 'worker',
                  profilePicture: '',
                  isVerified: false
                },
                skills: [{ name: 'General Work' }],
                bio: 'Demo worker profile'
              },
              {
                userInfo: {
                  _id: 'demo-2',
                  firstName: 'Demo',
                  lastName: 'Client',
                  userType: 'client',
                  profilePicture: '',
                  isVerified: false
                },
                skills: [],
                bio: 'Demo client profile'
              }
            ]
          }
        };
      });

      if (data.success && data.data.profiles) {
        // Transform profile data to match frontend expectations
        const transformedPeople = data.data.profiles.map(profile => {
          // Try to get user ID from multiple possible locations
          const userId = profile.userInfo?._id || 
                        profile.userInfo?.id || 
                        profile.user || 
                        profile._id || 
                        profile.id;

          return {
            id: userId,
            name: `${profile.userInfo?.firstName || ''} ${profile.userInfo?.lastName || ''}`.trim() || 'Unknown User',
            profession: profile.userInfo?.userType === 'worker' 
              ? (profile.skills && profile.skills.length > 0 
                  ? profile.skills.map(skill => skill.name).join(', ')
                  : 'Skilled Worker')
              : 'Client',
            avatar: profile.userInfo?.profilePicture || 
              `https://ui-avatars.com/api/?name=${profile.userInfo?.firstName || 'User'}+${profile.userInfo?.lastName || ''}&background=random`,
            role: profile.userInfo?.userType === 'worker' ? 'Worker' : 'Client',
            email: `${(profile.userInfo?.firstName || 'user').toLowerCase()}.${(profile.userInfo?.lastName || 'unknown').toLowerCase()}@example.com`,
            phone: '+1 (555) 000-0000',
            category: profile.userInfo?.userType === 'worker' 
              ? (profile.skills && profile.skills.length > 0 
                  ? profile.skills[0].name.toLowerCase()
                  : 'general')
              : 'client',
            userType: profile.userInfo?.userType || 'worker',
            location: profile.userInfo?.city || 'Sri Lanka',
            rating: profile.rating || 0,
            totalReviews: profile.totalReviews || 0,
            availability: profile.availability?.status || 'available',
            skills: profile.skills || [],
            bio: profile.bio || '',
            verified: profile.userInfo?.isVerified || false
          };
        });

        setPeople(transformedPeople);
      } else {
        throw new Error(data.message || 'Failed to fetch people');
      }
    } catch (err) {
      console.error('Error fetching people:', err);
      setError(err.message || 'Failed to load people');
      // Set empty array on error
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
