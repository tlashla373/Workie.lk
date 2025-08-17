// Main WorkHistory.jsx
import React, { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import WorkHistoryHeader from '../../components/WorkHistory/WorkHistoryHeader';
import WorkHistoryFilters from '../../components/WorkHistory/WorkHistoryFilters';
import WorkHistoryList from '../../components/WorkHistory/WorkHistoryList';
import WorkHistoryStats from '../../components/WorkHistory/WorkHistoryStatus';
import { workHistoryData } from '../../components/WorkHistory/WorkHistoryData';

const WorkHistory = ({ userRole = 'worker' }) => {
  const { isDarkMode } = useDarkMode();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewRole, setViewRole] = useState(userRole);

  const filteredHistory = workHistoryData.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-xl transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto p-4">
        <WorkHistoryHeader viewRole={viewRole} setViewRole={setViewRole} />
        
        <WorkHistoryStats viewRole={viewRole} workHistory={workHistoryData} />
        
        <WorkHistoryFilters 
          filter={filter}
          setFilter={setFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        
        <WorkHistoryList 
          filteredHistory={filteredHistory}
          viewRole={viewRole}
        />
      </div>
    </div>
  );
};

export default WorkHistory;