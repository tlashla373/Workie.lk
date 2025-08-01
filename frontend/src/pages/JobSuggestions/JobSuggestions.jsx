import { ArrowRight } from "lucide-react";
import pic_1 from '../../assets/pic_1.jpg';
import pic_2 from '../../assets/pic_2.jpg';
import pic_3 from '../../assets/pic_3.jpg';
import ProfileViews from "../../components/ProfileViews";

const JobSuggestion = ({ suggestions = [] }) => {
  const defaultSuggestions = [
    { name: "Nicole Smith", role: "Find Carpenter ..", avatar: pic_1 },
    { name: "John Doe", role: "Find Carpenter ..", avatar: pic_2},
    { name: "Jane Smith", role: "Find Carpenter ..", avatar: pic_3 }
  ];

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
    <div className="w-90 p-6 space-y-6 bg-white ">
      <div className="bg-blue-50 backdrop-blur-xl rounded-2xl border border-gray-100 p-6 shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]">
        <div className="flex items-center justify-between mb-4 ">
          <h3 className="text-lg font-bold text-gray-800">Job Suggestions</h3>
          <button 
            onClick={handleSeeAll}
            className="text-blue-400 text-sm font-medium hover:underline flex items-center space-x-1 transition-colors"
          >
            <span>See All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-6 ">
          {jobSuggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center justify-between border-b-2 border-gray-400">
              <div className="flex items-center space-x-3">
                <img
                  src={suggestion.avatar}
                  alt={suggestion.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-black">{suggestion.name}</h4>
                  <p className="text-gray-500 text-sm">{suggestion.role}</p>
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
                  className="text-blue-400 hover:text-blue-300 transition-colors"
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