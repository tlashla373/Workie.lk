import { useState, useEffect } from 'react';
import connectionService from '../services/connectionService';
import { getWorkerStatsById } from '../services/workHistoryService';

export const useConnections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is logged in
      const token = localStorage.getItem('auth_token');
      if (!token) {
        // If no token, set empty connections and stats
        setConnections([]);
        setStats({ totalConnections: 0, pendingRequests: 0, sentRequests: 0 });
        setLoading(false);
        return;
      }

      const [connectionsResponse, statsResponse] = await Promise.all([
        connectionService.getMyConnections().catch(err => {
          console.warn('Connections API not available:', err.message);
          // If it's an authentication error, throw it up
          if (err.message?.includes('401') || err.message?.includes('Authentication') || err.message?.includes('token')) {
            throw err;
          }
          return { success: false, data: { connections: [] } };
        }),
        connectionService.getConnectionStats().catch(err => {
          console.warn('Stats API not available:', err.message);
          // If it's an authentication error, throw it up
          if (err.message?.includes('401') || err.message?.includes('Authentication') || err.message?.includes('token')) {
            throw err;
          }
          return { success: false, data: { totalConnections: 0, pendingRequests: 0, sentRequests: 0 } };
        })
      ]);

      if (connectionsResponse.success && connectionsResponse.data.connections) {
        // Transform backend data to match frontend expectations
        const baseTransformedConnections = connectionsResponse.data.connections.map(connection => ({
          id: connection._id,
          name: `${connection.firstName} ${connection.lastName}`,
          // Prioritize custom worker title over generic profession
          title: connection.title || // Custom title from worker verification
                (connection.userType === 'worker' 
                  ? 'Skilled Worker' // Default for workers without custom title
                  : 'Client'), // Default for clients
          profession: connection.userType === 'worker' ? 'Skilled Worker' : 'Client',
          avatar: connection.profilePicture || `https://ui-avatars.com/api/?name=${connection.firstName}+${connection.lastName}&background=random`,
          role: connection.userType === 'worker' ? 'Worker' : 'Client',
          email: `${connection.firstName.toLowerCase()}.${connection.lastName.toLowerCase()}@example.com`,
          phone: '+1 (555) 000-0000',
          category: connection.userType === 'worker' ? 'general' : 'client',
          userType: connection.userType,
          connectionDate: connection.connectionDate,
          status: connection.status,
          // Initialize with default rating data
          rating: 0,
          totalReviews: 0
        }));

        // Fetch real ratings for worker connections
        const connectionsWithRatings = await Promise.all(
          baseTransformedConnections.map(async (connection) => {
            if (connection.userType === 'worker') {
              try {
                const workerStats = await getWorkerStatsById(connection.id);
                return {
                  ...connection,
                  rating: workerStats.averageRating,
                  totalReviews: workerStats.totalRatings
                };
              } catch (error) {
                console.warn(`Failed to fetch ratings for worker ${connection.id}:`, error);
                return connection; // Return with default rating values
              }
            }
            return connection; // Non-workers don't need rating data
          })
        );

        setConnections(connectionsWithRatings);
      } else {
        // Set empty connections if API fails
        setConnections([]);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      } else {
        // Set default stats if API fails
        setStats({ totalConnections: 0, pendingRequests: 0, sentRequests: 0 });
      }

    } catch (err) {
      console.error('Error fetching connections:', err);
      setError(err.message || 'Failed to load connections');
      // Set empty array on error instead of keeping loading state
      setConnections([]);
      setStats({ totalConnections: 0, pendingRequests: 0, sentRequests: 0 });
    } finally {
      setLoading(false);
    }
  };

  const sendConnectionRequest = async (userId) => {
    try {
      const response = await connectionService.sendConnectionRequest(userId);
      if (response.success) {
        // Refresh connections after sending request
        await fetchConnections();
        return response;
      }
      throw new Error(response.message || 'Failed to send connection request');
    } catch (err) {
      console.error('Error sending connection request:', err);
      throw err;
    }
  };

  const removeConnection = async (connectionId) => {
    try {
      const response = await connectionService.removeConnection(connectionId);
      if (response.success) {
        // Remove from local state
        setConnections(prev => prev.filter(conn => conn.id !== connectionId));
        return response;
      }
      throw new Error(response.message || 'Failed to remove connection');
    } catch (err) {
      console.error('Error removing connection:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return {
    connections,
    loading,
    error,
    stats,
    refetch: fetchConnections,
    sendConnectionRequest,
    removeConnection
  };
};

export default useConnections;
