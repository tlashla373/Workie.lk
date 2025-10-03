import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { TrendingUp } from 'lucide-react';
import analyticsService from '../services/analyticsService';

const ProfileViews = () => {
  const { isDarkMode } = useDarkMode();
  const [viewData, setViewData] = useState({
    views: 150,
    percentage: 35,
    period: "last month"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileViews = async () => {
      try {
        setLoading(true);
        const response = await analyticsService.getProfileViews();
        
        if (response.success) {
          setViewData({
            views: response.data.thisMonth,
            percentage: Math.abs(response.data.percentageIncrease),
            period: response.data.period,
            totalViews: response.data.totalViews
          });
        }
      } catch (error) {
        console.error('Error fetching profile views:', error);
        setError('Failed to load view statistics');
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchProfileViews();
  }, []);
  
  
  if (loading) {
    return (
      <div className={`rounded-xl p-6 border shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#FFFF] border-gray-100'}`}>
        <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Profile Views</h3>
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 border shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]  ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#FFFF] border-gray-100'}`}>
      <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Profile Views</h3>
      <div className="text-center">        
        <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>+ {viewData.views}          
        </div>
        <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>viewers this month</div>
        <div className="flex items-center justify-center text-green-600 text-sm">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>{viewData.percentage}% {viewData.period}</span>
        </div>
        {viewData.totalViews && (
          <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Total: {viewData.totalViews} views
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileViews;