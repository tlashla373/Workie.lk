// components/WorkHistoryFilters.jsx
import React from 'react';
import { Search, Download } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const WorkHistoryFilters = ({ filter, setFilter, searchTerm, setSearchTerm, userType = 'worker' }) => {
  const { isDarkMode } = useDarkMode();

  const handleExport = () => {
    // Export functionality can be implemented here
    console.log('Exporting work history...');
  };

  return (
    <div className={`${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    } rounded-2xl p-3 md:p-4 lg:p-6 shadow-sm border ${
      isDarkMode ? 'border-gray-700' : 'border-gray-200'
    } mb-4 md:mb-6`}>
      <div className="flex flex-col space-y-3 md:space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
        <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder={userType === 'client' ? "Search applications or workers..." : "Search jobs or companies..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full md:w-64 text-sm md:text-base rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`px-2 md:px-3 py-2 text-sm md:text-base rounded-lg border w-full md:w-auto ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleExport}
          className="flex items-center justify-center space-x-2 px-3 md:px-4 py-2 text-sm md:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full md:w-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export History</span>
        </button>
      </div>
    </div>
  );
};

export default WorkHistoryFilters;