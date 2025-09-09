import {MapPin, DollarSign, Clock, Building, Heart, ArrowLeft, User, Calendar, Phone, Mail, Star, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Mock dark mode context
const useDarkMode = () => ({ isDarkMode: false });


// Job Details Page Component
const JobDetailsPage = ({ job, onBack, isDarkMode }) => {

  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      {/* Back Button */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onBack}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Jobs</span>
        </button>
      </div>

      {/* Job Header */}
      <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
          <div className="w-20 h-20 flex items-center justify-center">
            <div>
              {typeof job.logo === 'string' && job.logo.endsWith('.svg') ? (
                <img src={job.logo} alt={job.title} className="w-full h-full bg-[#F0F3FF] object-contain border shadow-sm p-2 border-gray-200 rounded-md" />
              ) : (
                <span className="text-3xl">{job.logo}</span>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{job.title}</h1>
            <div className={`flex items-center space-x-2 mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Building className="w-5 h-5" />
              <span className="text-lg">{job.company}</span>
            </div>

            {/* Job Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-6 h-6 text-blue-500" />
                <div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Location</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{job.location}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-6 h-6 text-green-500" />
                <div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Type</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{job.type}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-6 h-6 text-yellow-500" />
                <div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Salary</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{job.salary}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-purple-500" />
                <div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Posted</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{job.posted}</div>
                </div>
              </div>
            </div>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {job.tags.map(tag => (
                <span key={tag} className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
              onClick={() => navigate('/job-application-page', { state: { jobId: job.id } })} 
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium">
                Apply Now
              </button>
              <button className={`flex-1 py-3 px-6 rounded-lg transition-all duration-200 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                Save for Later
              </button>
              <button className={`p-3 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-500 hover:text-red-600 hover:bg-red-100'}`}>
                <Heart className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Job Description</h2>
            <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
              <p className={`leading-relaxed text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {job.fullDescription || job.description}
              </p>
            </div>
          </div>

          {/* Requirements */}
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Requirements</h2>
            <ul className={`space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {job.requirements?.map((req, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-blue-500 mt-2 text-sm">●</span>
                  <span className="text-base">{req}</span>
                </li>
              )) || (
                <>
                  <li className="flex items-start space-x-3">
                    <span className="text-blue-500 mt-2 text-sm">●</span>
                    <span className="text-base">Minimum 5 years of experience in {job.title.toLowerCase()}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-blue-500 mt-2 text-sm">●</span>
                    <span className="text-base">Ability to work independently and in a team environment</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-blue-500 mt-2 text-sm">●</span>
                    <span className="text-base">Strong attention to detail and quality workmanship</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Benefits (if any) */}
          {job.benefits && (
            <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Benefits & Perks</h2>
              <p className={`leading-relaxed text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {job.benefits}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Profile */}
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Posted By</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <User className="w-8 h-8 text-gray-500" />
              </div>
              <div>
                <div className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{job.clientName}</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{job.clientType}</div>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Member since</span>
                <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.memberSince}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Jobs posted</span>
                <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.jobsPosted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Rating</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.clientRating}/5</span>
                </div>
              </div>
            </div>

            <button className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
              <MessageCircle className="w-5 h-5" />
              <span>Message Client</span>
            </button>
          </div>

          {/* Contact Info */}
          {job.contactInfo && (
            <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
              <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Contact Information</h3>
              <div className="space-y-3">
                {job.contactInfo.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-green-500" />
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.contactInfo.phone}</span>
                  </div>
                )}
                {job.contactInfo.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.contactInfo.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Application Deadline */}
          {job.deadline && (
            <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
              <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-red-400' : 'text-red-800'}`}>Application Deadline</h3>
              <p className={`${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                Applications must be submitted by <strong>{job.deadline}</strong>
              </p>
            </div>
          )}

          {/* Published Info */}
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50 border border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Job Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Published on</span>
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.publishedOn}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Posted</span>
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.posted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;