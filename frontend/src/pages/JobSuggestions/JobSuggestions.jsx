import { ArrowRight } from "lucide-react";
import pic_1 from '../../assets/pic_1.jpg';
import pic_2 from '../../assets/pic_2.jpg';
import pic_3 from '../../assets/pic_3.jpg';
import ProfileViews from "../../components/ProfileViews";
import { useDarkMode } from '../../contexts/DarkModeContext';

const JobSuggestion = ({ suggestions = [] }) => {
  const defaultSuggestions = [
    { name: "Nicole Smith", role: "Find Carpenter ..", avatar: pic_1 },
    { name: "John Doe", role: "Find Carpenter ..", avatar: pic_2 },
    { name: "Jane Smith", role: "Find Carpenter ..", avatar: pic_3 }
  ];

  const { isDarkMode } = useDarkMode();

  const jobSuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions;

  const handleApply = (suggestion) => {
    console.log(`Applying for ${suggestion.role} position with ${suggestion.name}`);
  };

  const handleViewDetails = (suggestion) => {
    console.log(`Viewing details for ${suggestion.name}`);
  };

  const handleSeeAll = () => {
    console.log("See all job suggestions");
  };

  return (
    <div className={`w-90 p-6 space-y-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`backdrop-blur-xl rounded-2xl border p-6 shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#FFFF] border-gray-100'}`}>
        <div className="flex items-center justify-between mb-4 ">
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Job Suggestions</h3>
          <button 
            onClick={handleSeeAll}
            className={`text-sm font-medium hover:underline flex items-center space-x-1 transition-colors ${isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-400 hover:text-blue-500'}`}
          >
            <span>See All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-6 ">
          {jobSuggestions.map((suggestion, index) => (
            <div key={index} className={`flex items-center justify-between pb-4 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} ${index < jobSuggestions.length - 1 ? 'border-b' : ''}`}>
              <div className="flex items-center space-x-3">
                <img
                  src={suggestion.avatar}
                  alt={suggestion.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>{suggestion.name}</h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{suggestion.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleApply(suggestion)}
                  className="bg-blue-600 text-white flex px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
                <button 
                  onClick={() => handleViewDetails(suggestion)}
                  className={`transition-colors ${isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-400 hover:text-blue-500'}`}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ProfileViews/>
    </div>
  );
};

export default JobSuggestion;