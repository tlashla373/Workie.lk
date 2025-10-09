import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import useAuth from '../../hooks/useAuth';
import ProfileViews from '../../components/ProfileViews';
import TopRankingCard from './TopRankingCard';

const TopRatingWorker = () => {
  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();

  const handleContactWorker = (worker, contactType) => {
    if (contactType === 'call') {
      if (worker.phone) {
        if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
          window.open(`tel:${worker.phone}`);
        } else {
          navigator.clipboard.writeText(worker.phone).then(() => {
            alert(`Phone number ${worker.phone} copied to clipboard`);
          }).catch(() => {
            alert(`Call ${worker.name} at ${worker.phone}`);
          });
        }
      } else {
        alert('Phone number not available');
      }
    } else if (contactType === 'email') {
      if (worker.email) {
        const subject = encodeURIComponent(`Hello ${worker.name}`);
        const body = encodeURIComponent(`Hi ${worker.name},\n\nI'm interested in your ${worker.profession.toLowerCase()} services.\n\nBest regards`);
        window.open(`mailto:${worker.email}?subject=${subject}&body=${body}`);
      } else {
        alert('Email address not available');
      }
    }
  };

  const handleViewProfile = (worker) => {
    console.log('Viewing profile for worker:', worker.name);
    // Navigate to worker profile page
    // You can implement navigation logic here
  };

  // Check authentication
  if (!user) {
    return (
      <div className="w-full h-full space-y-4">
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6`}>
          <div className="text-center">
            <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Please log in to view top-rated workers
            </p>
          </div>
        </div>
        <ProfileViews />
      </div>
    );
  }

  return (
    <div className="w-full h-full space-y-2">
      {/* Top Ranking Workers Card */}
      <TopRankingCard 
        limit={3}
        onContactWorker={handleContactWorker}
        onViewProfile={handleViewProfile}
      />

      {/* Profile Views Section */}
      <ProfileViews />
    </div>
  );
};

export default TopRatingWorker;
