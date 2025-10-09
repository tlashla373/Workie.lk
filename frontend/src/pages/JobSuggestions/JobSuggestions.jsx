import { ArrowRight , MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileViews from "../../components/ProfileViews";
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../hooks/useAuth';
import profileService from '../../services/profileService';
import jobService from '../../services/jobService';

const JobSuggestion = ({ suggestions = [] }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [workerCategories, setWorkerCategories] = useState([]);
  const [matchingJobs, setMatchingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Default avatar images for job suggestions
  const avatarImages = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b332b120?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpath d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"%3E%3C/path%3E%3Ccircle cx="12" cy="7" r="4"%3E%3C/circle%3E%3C/svg%3E'
  ];

  const { isDarkMode } = useDarkMode();
  const { user, authenticated } = useAuth();
  const navigate = useNavigate();

  // Check if user is a worker and fetch profile data
  useEffect(() => {
    const fetchUserProfileAndJobs = async () => {
      if (!authenticated || !user) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      if (user.userType !== 'worker') {
        setError("This page is only available for worker accounts");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch user profile first
        const profileResponse = await profileService.getCurrentUserProfile();
        
        if (profileResponse.success && profileResponse.data) {
          setUserProfile(profileResponse.data.user);
          
          // Get worker categories from profile data
          const categories = profileResponse.data.profile?.workerCategories || [];
          setWorkerCategories(categories);
          
          console.log('Worker profile loaded:', profileResponse.data.user);
          console.log('Worker categories found:', categories);
          
          // If worker has categories, fetch matching jobs
          if (categories.length > 0) {
            try {
              console.log('Fetching jobs for categories:', categories);
              const jobsResponse = await jobService.getJobsByCategories(categories, 100); // Fetch up to 100 jobs
              
              console.log('Jobs API response:', jobsResponse);
              
              if (jobsResponse.success && jobsResponse.data.jobs) {
                console.log(`Found ${jobsResponse.data.jobs.length} matching jobs`);
                
                // Transform ALL jobs for display (no additional filtering)
                const transformedJobs = jobsResponse.data.jobs.map((job, index) => {
                  const transformed = jobService.transformJobForDisplay(job);
                  
                  // Use client's profile photo from transformed data, or fallback to default
                  const clientAvatar = transformed.clientProfilePhoto || 
                                     transformed.avatar || 
                                     avatarImages[index % avatarImages.length];
                  
                  return {
                    id: transformed.id,
                    name: transformed.clientName,
                    role: transformed.title,
                    avatar: clientAvatar, // Use client's actual photo
                    category: transformed.category,
                    salary: transformed.salary,
                    location: transformed.location,
                    description: transformed.description,
                    posted: transformed.posted,
                    deadline: transformed.deadline,
                    jobData: transformed // Store full job data for navigation
                  };
                });
                
                setMatchingJobs(transformedJobs);
                console.log('Transformed jobs for display:', transformedJobs);
                console.log(`Successfully loaded ${transformedJobs.length} job suggestions for display`);
              } else {
                console.log("No matching jobs found for worker categories - API returned empty data");
                setMatchingJobs([]);
              }
            } catch (jobError) {
              console.error("Error fetching matching jobs:", jobError);
              // Don't set error state for job fetching failure, just use empty array
              setMatchingJobs([]);
            }
          } else {
            console.log("Worker has no categories defined");
            setMatchingJobs([]);
          }
        } else {
          setError("Failed to fetch profile data");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileAndJobs();
  }, [authenticated, user]);

  // Show loading state
  if (loading) {
    return (
      <div className={`w-full max-w-sm mx-auto space-y-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`rounded-2xl border p-4 shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-center py-8">
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading job suggestions...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error for non-workers or authentication issues
  if (error) {
    return (
      <div className={`w-full max-w-sm mx-auto space-y-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`rounded-2xl border p-4 shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-center py-8">
            <div className={`text-sm text-center ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use matching jobs if available, otherwise show empty state
  const jobSuggestions = suggestions.length > 0 ? suggestions : matchingJobs;

  const handleApply = (suggestion) => {
    // Navigate to Find Jobs page with the job category as query parameter
    if (suggestion.category) {
      navigate(`/findjobs?categories=${encodeURIComponent(suggestion.category)}`);
    } else {
      // Fallback to general jobs page
      navigate('/findjobs');
    }
    console.log(`Applying for job: ${suggestion.role}`, suggestion);
  };

  const handleViewDetails = (suggestion) => {
    // Navigate to job details page
    if (suggestion.jobData && suggestion.jobData.id) {
      navigate(`/jobs/${suggestion.jobData.id}`);
    } else {
      // Fallback to general jobs page
      navigate('/findjobs');
    }
    console.log(`Viewing job details for: ${suggestion.role}`, suggestion.jobData);
  };

  const handleSeeAll = () => {
    // Navigate to Find Jobs page
    if (workerCategories.length > 0) {
      // Navigate to jobs page with worker categories as URL parameters
      const categoriesParam = workerCategories.join(',');
      navigate(`/findjobs?categories=${encodeURIComponent(categoriesParam)}`);
      console.log("Navigate to jobs filtered by categories:", workerCategories);
    } else {
      // Navigate to general jobs page
      navigate('/findjobs');
      console.log("Navigate to all jobs page");
    }
  };

  return (
    <div className={`w-full h-160 flex flex-col space-y-2 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`flex-1 rounded-2xl border shadow-sm overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-400 flex-shrink-0">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Job Suggestions
          </h3>
          <button 
            onClick={handleSeeAll}
            className={`text-sm font-medium hover:underline flex items-center space-x-1 transition-colors ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'}`}
          >
            <span>See All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4" style={{ maxHeight: '405px' }}>
          {/* Job count indicator */}
          {jobSuggestions.length > 0 && (
            <div className={`text-xs mb-3 px-2 py-1 rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-600'}`}>
              Showing {jobSuggestions.length} job{jobSuggestions.length !== 1 ? 's' : ''} matching your profile
            </div>
          )}
          
          <div className="space-y-3">
            {jobSuggestions.length > 0 ? (
              jobSuggestions.map((suggestion, index) => (
                <div key={suggestion.id || index} className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${isDarkMode ? 'bg-gray-750 border-gray-600 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 hover:bg-white'}`}>
                  <div className="flex items-start space-x-3">
                    <img
                      src={suggestion.avatar}
                      alt={suggestion.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600"
                      onError={(e) => {
                        // Fallback to default avatar if client photo fails to load
                        e.target.src = avatarImages[3]; // Use the SVG fallback
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-sm mb-1 truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {suggestion.role}
                      </h4>
                      <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {suggestion.name}
                      </p>
                      
                      {/* Salary/Budget */}
                      {suggestion.salary && (
                        <p className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {suggestion.salary}
                        </p>
                      )}
                      
                      {/* Location */}
                      {suggestion.location && (
                        <div className="flex items-center space-x-1 mb-2">
                          <MapPin className="w-3 h-3 text-red-500" />
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {suggestion.location}
                          </p>
                        </div>
                      )}
                      
                      {/* Posted date */}
                      {suggestion.posted && (
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          Posted: {suggestion.posted}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Apply button - Full width below content */}
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => handleApply(suggestion)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-xs font-medium transition-colors shadow-sm hover:shadow-md"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {workerCategories.length === 0 ? (
                  <div>
                    <p className="text-lg mb-2">🔧 No Worker Categories Set</p>
                    <p className="text-sm">
                      Add your worker categories in your profile to see personalized job suggestions!
                    </p>
                    <p className="text-xs mt-2 opacity-75">
                      Go to Profile → Worker Categories to get started
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg mb-2">📋 No Jobs Available</p>
                    <p className="text-sm">
                      No job posts found for your categories: <span className="font-medium">{workerCategories.join(', ')}</span>
                    </p>
                    <p className="text-xs mt-2 opacity-75">
                      Check back later for new opportunities!
                    </p>
                    {/* Debug info - remove in production */}
                    <details className="mt-4 text-left">
                      <summary className="cursor-pointer text-xs opacity-50">Debug Info</summary>
                      <div className="mt-2 text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        <p><strong>Worker Categories:</strong> {JSON.stringify(workerCategories)}</p>
                        <p><strong>Profile Data:</strong> {userProfile ? 'Loaded' : 'Not loaded'}</p>
                        <p><strong>Jobs Fetched:</strong> {matchingJobs.length} jobs</p>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Views - Fixed at bottom */}
      <div className="flex-shrink-0">
        <ProfileViews />
      </div>
    </div>
  );
};

export default JobSuggestion;