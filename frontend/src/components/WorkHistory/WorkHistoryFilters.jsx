// components/WorkHistoryFilters.jsx
import React from 'react';
import { Search, Download } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const WorkHistoryFilters = ({ filter, setFilter, searchTerm, setSearchTerm }) => {
  const { isDarkMode } = useDarkMode();

  const handleExport = () => {
    // Export functionality can be implemented here
    console.log('Exporting work history...');
  };

  return (
    <div className={`${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    } rounded-2xl p-6 shadow-sm border ${
      isDarkMode ? 'border-gray-700' : 'border-gray-200'
    } mb-6`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 w-64 rounded-lg border ${
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
              className={`px-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="accepted">Accepted</option>
              <option value="pending-payment">Pending Payment</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export History</span>
        </button>
      </div>
    </div>
  );
};

export default WorkHistoryFilters;