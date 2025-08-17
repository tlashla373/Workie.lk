// pages/JobProgressPage.jsx
import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, DollarSign } from 'lucide-react';
import JobProgress from './JobProgress';
import { getJobById } from '../../components/WorkHistory/WorkHistoryData';
import { useDarkMode } from '../../contexts/DarkModeContext';

const JobProgressPage = () => {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  
  const viewRole = location.state?.viewRole || 'worker';
  const job = getJobById(parseInt(jobId));
  
  const handleGoBack = () => {
    navigate('/workhistory');
  };

  if (!job) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className={`text-center p-8 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Job Not Found
          </h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
            The requested job could not be found.
          </p>
          <button
            onClick={handleGoBack}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Work History
          </button>
        </div>
      </div>
    );
  }

  const getClientJobData = (job) => {
    if (viewRole === 'client') {
      return {
        ...job,
        title: `Hired ${job.title}`,
        company: `Worker: ${job.company}`,
        description: `You hired a ${job.title.toLowerCase()} for: ${job.description}`,
      };
    }
    return job;
  };

  const displayJob = getClientJobData(job);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          {/* Back Button */}
          <button
            onClick={handleGoBack}
            className={`flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Work History</span>
          </button>

          {/* Job Header Card */}
          <div className={`${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-2xl p-6 shadow-sm border ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                <h1 className={`text-3xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                } mb-2`}>
                  {displayJob.title}
                </h1>
                <p className={`text-xl ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                } font-medium mb-4`}>
                  {displayJob.company}
                </p>
                
                <p className={`${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                } mb-4 leading-relaxed`}>
                  {displayJob.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        isDarkMode 
                          ? 'bg-blue-900/30 text-blue-300' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Job Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className={`w-5 h-5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <div>
                      <p className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } uppercase tracking-wide`}>
                        Duration
                      </p>
                      <p className={`${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      } font-medium`}>
                        {job.duration}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className={`w-5 h-5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <div>
                      <p className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } uppercase tracking-wide`}>
                        Location
                      </p>
                      <p className={`${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      } font-medium`}>
                        {job.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className={`w-5 h-5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <div>
                      <p className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } uppercase tracking-wide`}>
                        {viewRole === 'client' ? 'Payment' : 'Rate'}
                      </p>
                      <p className={`${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      } font-medium`}>
                        {job.salary}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}>
                  {job.type}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Progress Component */}
        <JobProgress
          role={viewRole}
          initialStage={job.stage}
          jobData={job}
        />
      </div>
    </div>
  );
};

export default JobProgressPage;