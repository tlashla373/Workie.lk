import React, { useState } from 'react';
import { MapPin, DollarSign, Clock, Building, Save, Send } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    salary: '',
    description: '',
    requirements: '',
    benefits: '',
    deadline: '',
    category: 'technology'
  });
  const { isDarkMode } = useDarkMode();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Job posted:', formData);
    // Handle job posting logic here
  };

  const jobTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' }
  ];

  const categories = [
    { value: 'category', label: 'Category' },
    { value: 'Mason', label: 'Mason' },
    { value: 'Carpenter', label: 'Carpenter' },
    { value: 'welder', label: 'Welder' },
    { value: 'painter', label: 'Painter' },
    { value: 'plumber', label: 'Plumber' }
  ];

  const inputClasses = `w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 ${
    isDarkMode
      ? 'bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400'
      : 'bg-gray-200/50 border border-gray-300/50 text-black placeholder-gray-400'
  }`;
  
  const labelClasses = `block text-sm font-medium mb-2 ${
    isDarkMode ? 'text-gray-300' : 'text-gray-700'
  }`;

  const optionClasses = isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Post a New Job</h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Find the perfect candidate for your work</p>
      </div>

      <form onSubmit={handleSubmit} className={`space-y-6 p-8 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Title */}
          <div className="md:col-span-2">
            <label className={labelClasses}>
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Experienced Mason"
              className={inputClasses}
              required
            />
          </div>

          {/* Company */}
          <div>
            <label className={labelClasses}>
              <Building className="w-4 h-4 inline mr-1" />
              Company *
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Company name"
              className={inputClasses}
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className={labelClasses}>
              <MapPin className="w-4 h-4 inline mr-1" />
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g. Colombo, Sri Lanka"
              className={inputClasses}
              required
            />
          </div>

          {/* Job Type */}
          <div>
            <label className={labelClasses}>
              <Clock className="w-4 h-4 inline mr-1" />
              Job Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className={`${inputClasses} appearance-none`}
            >
              {jobTypes.map(type => (
                <option key={type.value} value={type.value} className={optionClasses}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Salary */}
          <div>
            <label className={labelClasses}>
              <DollarSign className="w-4 h-4 inline mr-1" />
              Salary Range
            </label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="e.g. Rs 50,000 - Rs 70,000"
              className={inputClasses}
            />
          </div>

          {/* Category */}
          <div>
            <label className={labelClasses}>
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`${inputClasses} appearance-none`}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value} className={optionClasses}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Application Deadline */}
          <div>
            <label className={labelClasses}>
              Application Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className={`${inputClasses} appearance-none`}
            />
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label className={labelClasses}>
            Job Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={6}
            placeholder="Describe the role, responsibilities, and what you're looking for..."
            className={`${inputClasses} resize-none`}
            required
          />
        </div>

        {/* Requirements 
        <div>
          <label className={labelClasses}>
            Requirements
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            rows={4}
            placeholder="List the required skills, experience, and qualifications..."
            className={`${inputClasses} resize-none`}
          />
        </div>
        */}

        {/* Benefits 
        <div>
          <label className={labelClasses}>
            Benefits & Perks
          </label>
          <textarea
            name="benefits"
            value={formData.benefits}
            onChange={handleInputChange}
            rows={3}
            placeholder="Health insurance, flexible hours, remote work options..."
            className={`${inputClasses} resize-none`}
          />
        </div>
        */}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-600/50 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200/50 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Save className="w-5 h-5" />
            <span>Save as Draft</span>
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            <Send className="w-5 h-5" />
            <span>Post Job</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
