// Main WorkHistory.jsx
import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../hooks/useAuth';
import WorkHistoryHeader from '../../components/WorkHistory/WorkHistoryHeader';
import WorkHistoryFilters from '../../components/WorkHistory/WorkHistoryFilters';
import WorkHistoryList from '../../components/WorkHistory/WorkHistoryList';
import WorkHistoryStats from '../../components/WorkHistory/WorkHistoryStatus';
import { getWorkHistory } from '../../services/workHistoryService';
import AuthChecker from '../../components/ProtectionPage/AuthChecker';

const WorkHistory = () => {
  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [workHistoryData, setWorkHistoryData] = useState([]);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('auth_token');
  
  // If not authenticated, show auth checker
  if (!isAuthenticated) {
    return <AuthChecker />;
  }

  useEffect(() => {
    const fetchWorkHistory = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        const userType = user.userType || 'worker';
        const history = await getWorkHistory(userType);
        setWorkHistoryData(history);
      } catch (err) {
        console.error('Error fetching work history:', err);
        setError(err.message || 'Failed to load work history');
        setWorkHistoryData([]); // Set empty array as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchWorkHistory();
  }, [user]);

  // Show loading state while user data is being fetched
  if (loading || !user) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading work history...
          </p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className={`text-center p-8 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg max-w-md`}>
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Error Loading Work History
          </h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const userType = user.userType || 'worker'; // Get user type from authenticated user

  const filteredHistory = workHistoryData.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-xl transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto p-2 md:p-4 lg:p-6">
        <div className="space-y-4 md:space-y-6 pb-20 lg:pb-6">
          <WorkHistoryHeader userType={userType} />
          
          <WorkHistoryStats userType={userType} workHistory={workHistoryData} />
          
          <WorkHistoryFilters 
            filter={filter}
            setFilter={setFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            userType={userType}
          />
          
          <WorkHistoryList 
            filteredHistory={filteredHistory}
            userType={userType}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkHistory;