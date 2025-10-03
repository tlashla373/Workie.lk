// components/WorkHistoryList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import WorkHistoryItem from './WorkHistoryItem';

const WorkHistoryList = ({ filteredHistory, userType = 'worker' }) => {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const handleJobClick = (application) => {
    navigate(`/job-progress/${application.id}`, { 
      state: { 
        userType,
        application: application,
        applicationData: application
      } 
    });
  };

  if (filteredHistory.length === 0) {
    return (
      <div className={`text-center py-8 md:py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <Briefcase className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 opacity-50" />
        <p className="text-base md:text-lg font-medium mb-1 md:mb-2">
          {userType === 'client' ? 'No applications received yet' : 'No applications found'}
        </p>
        <p className="text-sm md:text-base">
          {userType === 'client' 
            ? 'Applications received on your job posts will appear here' 
            : 'Your job applications will appear here when you apply for jobs'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {filteredHistory.map((job) => (
        <WorkHistoryItem
          key={job.id}
          job={job}
          userType={userType}
          onClick={() => handleJobClick(job)}
        />
      ))}
    </div>
  );
};

export default WorkHistoryList;