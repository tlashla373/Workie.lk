import React, { useState, useEffect, useRef } from 'react';
import { 
  Search as SearchIcon, 
  User, 
  FileText, 
  Briefcase, 
  X, 
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../contexts/DarkModeContext';
import searchService from '../../services/searchService';

const Search = ({ placeholder = "Search for people, posts, or topics...", className = "" }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({
    users: [],
    posts: [],
    jobs: []
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [totalResults, setTotalResults] = useState(0);
  
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length > 0) {
        performSearch(query);
      } else {
        setResults({ users: [], posts: [], jobs: [] });
        setTotalResults(0);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, selectedCategory]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (searchQuery) => {
    setIsLoading(true);
    try {
      let response;

      if (selectedCategory === 'all') {
        response = await searchService.searchAll(searchQuery, 1, 20);
      } else {
        response = await searchService.searchByCategory(searchQuery, selectedCategory, 1, 10);
      }

      if (response.success) {
        let results = response.data.results || { users: [], posts: [], jobs: [] };
        
        setResults(results);
        setTotalResults(
          results.users.length + 
          results.posts.length + 
          results.jobs.length
        );
      } else {
        setResults({ users: [], posts: [], jobs: [] });
        setTotalResults(0);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults({ users: [], posts: [], jobs: [] });
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Save to recent searches
      try {
        await searchService.saveRecentSearch(query, selectedCategory);
      } catch (error) {
        console.log('Could not save recent search:', error);
      }
      
      // For now, navigate to appropriate page based on category
      // Since there's no dedicated search results page, go to relevant sections
      switch (selectedCategory) {
        case 'users':
          navigate('/friends'); // Navigate to friends/connections page
          break;
        case 'jobs':
          navigate('/findjobs'); // Navigate to find jobs page
          break;
        case 'posts':
          navigate('/'); // Navigate to home page where posts are shown
          break;
        default:
          navigate('/'); // Default to home page
          break;
      }
      setIsOpen(false);
    }
  };

  const handleResultClick = (result, type) => {
    setIsOpen(false);
    setQuery('');
    
    // Navigate based on result type to existing routes
    switch (type) {
      case 'user':
        // Navigate to profile page - use the existing profile route
        navigate(`/profile/${result.id}`);
        break;
      case 'post':
        // Since there's no individual post page, navigate to home where posts are shown
        navigate('/');
        break;
      case 'job':
        // Navigate to job application page or find jobs page
        navigate('/findjobs');
        break;
      default:
        // Default to home page
        navigate('/');
        break;
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults({ users: [], posts: [], jobs: [] });
    setTotalResults(0);
    setIsOpen(false);
  };

  const categories = [
    { id: 'all', label: 'All', icon: SearchIcon },
    { id: 'users', label: 'People', icon: User },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'jobs', label: 'Jobs', icon: Briefcase }
  ];

  const renderUserResult = (user) => (
    <div
      key={user.id}
      onClick={() => handleResultClick(user, 'user')}
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
      }`}
    >
      <img
        src={user.profileImage}
        alt={`${user.firstName} ${user.lastName}`}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {user.firstName} {user.lastName}
          </span>
          {user.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            {user.title}
          </span>
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              {user.location}
            </span>
          </div>
        </div>
      </div>
      <User className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
    </div>
  );

  const renderPostResult = (post) => (
    <div
      key={post.id}
      onClick={() => handleResultClick(post, 'post')}
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className={`font-medium line-clamp-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {post.title}
          </h4>
          <p className={`text-sm mt-1 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {post.content}
          </p>
          <div className="flex items-center space-x-4 mt-2 text-xs">
            <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
              by {post.author}
            </span>
            <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <FileText className={`w-4 h-4 ml-3 flex-shrink-0 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
      </div>
    </div>
  );

  const renderJobResult = (job) => (
    <div
      key={job.id}
      onClick={() => handleResultClick(job, 'job')}
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className={`font-medium line-clamp-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {job.title}
            </h4>
            {job.urgent && (
              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                Urgent
              </span>
            )}
          </div>
          <p className={`text-sm mt-1 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {job.description}
          </p>
          <div className="flex items-center space-x-4 mt-2 text-xs">
            <span className={`px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              {job.category}
            </span>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
                {job.location}
              </span>
            </div>
            <span className={`font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              {job.budget}
            </span>
          </div>
        </div>
        <Briefcase className={`w-4 h-4 ml-3 flex-shrink-0 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
      </div>
    </div>
  );

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <SearchIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-400'
        }`} />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={`w-full pl-10 pr-16 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-[#F0F3FF] border-gray-400/50 text-gray-900 placeholder-gray-400'
          }`}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className={`p-1 rounded-lg transition-colors ${
                isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Search Dropdown */}
      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl border z-50 max-h-96 overflow-hidden ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {/* Category Tabs */}
          <div className={`flex border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? (isDarkMode ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700/50' : 'text-blue-600 border-b-2 border-blue-600 bg-blue-50')
                      : (isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50')
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {/* Loading State */}
            {isLoading && (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Searching...
                </p>
              </div>
            )}

            {/* Search Results */}
            {!isLoading && query && (
              <div className="p-2">
                {totalResults > 0 ? (
                  <>
                    {/* Results Summary */}
                    <div className={`px-3 py-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
                    </div>

                    {/* Users */}
                    {results.users && results.users.length > 0 && (
                      <div className="mb-4">
                        <h3 className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          People
                        </h3>
                        {results.users.slice(0, 3).map(renderUserResult)}
                      </div>
                    )}

                    {/* Posts */}
                    {results.posts && results.posts.length > 0 && (
                      <div className="mb-4">
                        <h3 className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          Posts
                        </h3>
                        {results.posts.slice(0, 3).map(renderPostResult)}
                      </div>
                    )}

                    {/* Jobs */}
                    {results.jobs && results.jobs.length > 0 && (
                      <div className="mb-4">
                        <h3 className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          Jobs
                        </h3>
                        {results.jobs.slice(0, 3).map(renderJobResult)}
                      </div>
                    )}

                    {/* See All Results */}
                    <div className={`border-t p-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <button
                        onClick={handleSearchSubmit}
                        className={`w-full text-center py-2 rounded-lg font-medium transition-colors ${
                          isDarkMode 
                            ? 'text-blue-400 hover:bg-gray-700 hover:text-blue-300' 
                            : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                      >
                        View in {selectedCategory === 'users' ? 'Connections' : selectedCategory === 'jobs' ? 'Find Jobs' : 'Home'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center">
                    <SearchIcon className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      No results found for "{query}"
                    </p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Try different keywords or check your spelling
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!query && (
              <div className="p-4 text-center">
                <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Start typing to search for people, posts, or jobs
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
