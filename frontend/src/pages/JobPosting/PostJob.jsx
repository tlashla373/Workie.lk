import React, { useState } from 'react';
import { MapPin, DollarSign, Clock, Users, Building, Save, Send } from 'lucide-react';

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
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' }
  ];

  const categories = [
    { value: 'technology', label: 'Technology' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'design', label: 'Design' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-black mb-2">Post a New Job</h1>
        <p className="text-gray-700">Find the perfect candidate for your team</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Senior Frontend Developer"
              className="w-full px-4 py-3 bg-gray-200/50 border border-gray-300/50 rounded-xl text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4 inline mr-1" />
              Company *
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Company name"
              className="w-full px-4 py-3 bg-gray-200/50 border border-gray-300/50 rounded-xl text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g. Colombo, Sri Lanka"
              className="w-full px-4 py-3 bg-gray-200/50 border border-gray-300/50 rounded-xl text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Job Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-200/50 border border-gray-300/50 rounded-xl text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            >
              {jobTypes.map(type => (
                <option key={type.value} value={type.value} className="bg-gray-700">
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Salary Range
            </label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="e.g. $50,000 - $70,000"
              className="w-full px-4 py-3 bg-gray-200/50 border border-gray-300/50 rounded-xl text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-200/50 border border-gray-300/50 rounded-xl text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value} className="bg-gray-700">
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Application Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-200/50 border border-gray-300/50 rounded-xl text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={6}
            placeholder="Describe the role, responsibilities, and what you're looking for..."
            className="w-full px-4 py-3 bg-gray-200/50 border border-gray-300/50 rounded-xl text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 resize-none"
            required
          />
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requirements
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            rows={4}
            placeholder="List the required skills, experience, and qualifications..."
            className="w-full px-4 py-3 bg-gray-200/50 border border-gray-300/50 rounded-xl text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>

        {/* Benefits */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Benefits & Perks
          </label>
          <textarea
            name="benefits"
            value={formData.benefits}
            onChange={handleInputChange}
            rows={3}
            placeholder="Health insurance, flexible hours, remote work options..."
            className="w-full px-4 py-3 bg-gray-200/50 border border-gray-300/50 rounded-xl text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="button"
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-700/50 text-gray-100 rounded-xl hover:bg-gray-700 transition-all duration-200"
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