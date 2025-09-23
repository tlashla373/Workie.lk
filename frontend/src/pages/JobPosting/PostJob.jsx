import React, { useState } from 'react';
import { MapPin, DollarSign, Clock, Building, Save, Send, User, Star, Phone, Mail, Plus, X } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import Mason from '../../assets/mason.svg'
import Welder from '../../assets/welder.svg'
import Plumber from '../../assets/plumber.svg'
import Carpenter from '../../assets/carpenter.svg'
import Painter from '../../assets/painter.svg'

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: 'Individual',
    location: '',
    type: 'Full Time',
    salary: '',
    description: '',
    fullDescription: '',
    requirements: [''],
    benefits: '',
    deadline: '',
    category: '',
    tags: [''],
    // Client information
    clientName: '',
    clientType: 'Individual Client',
    // Contact information
    contactPhone: '',
    contactEmail: ''
  });
  const { isDarkMode } = useDarkMode();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (index, value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [errors, setErrors] = useState({});

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Short description is required';
    if (!formData.fullDescription.trim()) newErrors.fullDescription = 'Full description is required';
    if (!formData.clientName.trim()) newErrors.clientName = 'Your name is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Phone number is required';

    // Validate phone number format (Sri Lankan format)
    const phoneRegex = /^(\+94|0)[0-9]{9}$/;
    if (formData.contactPhone.trim() && !phoneRegex.test(formData.contactPhone.replace(/\s/g, ''))) {
      newErrors.contactPhone = 'Please enter a valid Sri Lankan phone number';
    }

    // Validate email if provided
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail.trim() && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    // Validate salary format if provided
    if (formData.salary.trim()) {
      const salaryRegex = /^Rs\s*\d{1,3}(,\d{3})*(\s*-\s*Rs\s*\d{1,3}(,\d{3})*)?$/i;
      if (!salaryRegex.test(formData.salary)) {
        newErrors.salary = 'Please use format: Rs 50,000 - Rs 70,000';
      }
    }

    // Validate tags and requirements
    const validTags = formData.tags.filter(tag => tag.trim() !== '');
    const validRequirements = formData.requirements.filter(req => req.trim() !== '');
    
    if (validTags.length === 0) newErrors.tags = 'At least one skill/tag is required';
    if (validRequirements.length === 0) newErrors.requirements = 'At least one requirement is required';

    // Validate deadline if provided (should be future date)
    if (formData.deadline) {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.deadline = 'Deadline must be a future date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generate unique job ID
  const generateJobId = () => {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  };

  // Format salary for consistency
  const formatSalary = (salary) => {
    if (!salary.trim()) return '';
    
    // If salary doesn't start with Rs, add it
    if (!salary.toLowerCase().includes('rs')) {
      return `Rs ${salary}`;
    }
    return salary;
  };

  // Get category logo
  const getCategoryLogo = (categoryName) => {
    const category = categories.find(cat => cat.value === categoryName);
    return category ? category.logo : null;
  };

  // Simulate API call
  const submitJobToAPI = async (jobData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random API success/failure for demo
        if (Math.random() > 0.1) { // 90% success rate
          resolve({
            success: true,
            jobId: jobData.id,
            message: 'Job posted successfully!'
          });
        } else {
          reject(new Error('Server error. Please try again.'));
        }
      }, 2000); // Simulate 2 second API call
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setErrors({});

    // Validate form
    if (!validateForm()) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean and prepare data
      const cleanedFormData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        salary: formatSalary(formData.salary)
      };

      // Create complete job object matching JobDetailsPage structure
      const jobData = {
        id: generateJobId(),
        title: cleanedFormData.title,
        company: cleanedFormData.company,
        location: cleanedFormData.location,
        type: cleanedFormData.type,
        salary: cleanedFormData.salary,
        posted: 'Just now',
        publishedOn: new Date().toISOString().split('T')[0],
        description: cleanedFormData.description,
        fullDescription: cleanedFormData.fullDescription,
        tags: cleanedFormData.tags,
        logo: getCategoryLogo(cleanedFormData.category),
        clientName: cleanedFormData.clientName,
        clientType: cleanedFormData.clientType,
        memberSince: 'Jan 2024', // Default for new members
        jobsPosted: '1', // First job
        clientRating: '5.0', // Default rating for new clients
        requirements: cleanedFormData.requirements,
        contactInfo: {
          phone: cleanedFormData.contactPhone,
          email: cleanedFormData.contactEmail || undefined
        },
        deadline: cleanedFormData.deadline ? new Date(cleanedFormData.deadline).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : undefined,
        benefits: cleanedFormData.benefits || undefined,
        category: cleanedFormData.category,
        status: 'active',
        createdAt: new Date().toISOString(),
        views: 0,
        applications: 0
      };

      console.log('Submitting job data:', jobData);

      // Submit to API
      const response = await submitJobToAPI(jobData);
      
      if (response.success) {
        setSubmitStatus('success');
        
        // Store in localStorage for demo purposes (in real app, this would be handled by backend)
        const existingJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
        existingJobs.push(jobData);
        localStorage.setItem('postedJobs', JSON.stringify(existingJobs));

        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            title: '',
            company: 'Individual',
            location: '',
            type: 'Full Time',
            salary: '',
            description: '',
            fullDescription: '',
            requirements: [''],
            benefits: '',
            deadline: '',
            category: '',
            tags: [''],
            clientName: '',
            clientType: 'Individual Client',
            contactPhone: '',
            contactEmail: ''
          });
          setSubmitStatus(null);
        }, 3000);
      }

    } catch (error) {
      console.error('Error submitting job:', error);
      setSubmitStatus('error');
      setErrors({ submit: error.message || 'Failed to post job. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const jobTypes = [
    { value: 'Full Time', label: 'Full Time' },
    { value: 'Part Time', label: 'Part Time' },
    { value: 'Contract', label: 'Contract' }
  ];

  const categories = [
    { value: '', label: 'Select Category', logo: null },
    { value: 'Mason', label: 'Mason', logo: Mason },
    { value: 'Carpenter', label: 'Carpenter', logo: Carpenter },
    { value: 'Welder', label: 'Welder', logo: Welder },
    { value: 'Painter', label: 'Painter', logo: Painter },
    { value: 'Plumber', label: 'Plumber', logo: Plumber }
  ];

  const clientTypes = [
    { value: 'Individual Client', label: 'Individual Client' },
    { value: 'Homeowner', label: 'Homeowner' },
    { value: 'Business Owner', label: 'Business Owner' },
    { value: 'Property Developer', label: 'Property Developer' },
    { value: 'Manufacturing Company', label: 'Manufacturing Company' }
  ];

  const inputClasses = `w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
    isDarkMode
      ? 'bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400'
      : 'bg-gray-200/50 border border-gray-300/50 text-black placeholder-gray-400'
  }`;
  
  const labelClasses = `block text-xs sm:text-sm font-medium mb-2 ${
    isDarkMode ? 'text-gray-300' : 'text-gray-700'
  }`;

  const optionClasses = isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';

  const sectionClasses = `p-4 sm:p-6 rounded-xl ${
    isDarkMode ? 'bg-gray-700/30 border border-gray-600/30' : 'bg-white border border-gray-200'
  }`;

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
      <div className="text-center">
        <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Post a New Job</h1>
        <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Find the perfect candidate for your work</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Basic Job Information */}
        <div className={sectionClasses}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Basic Job Information
          </h2>
          
          {/* Form Status Messages */}
          {submitStatus === 'success' && (
            <div className={`p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 ${isDarkMode ? 'bg-green-500/20 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className={`font-medium text-xs sm:text-sm ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
                  Job posted successfully! Candidates can now view and apply to your job.
                </p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className={`p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 ${isDarkMode ? 'bg-red-500/20 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">!</span>
                </div>
                <p className={`font-medium text-xs sm:text-sm ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                  {errors.submit || 'Please check the form for errors and try again.'}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Job Title */}
            <div className="lg:col-span-2">
              <label className={labelClasses}>
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Skilled Mason"
                className={`${inputClasses} ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                required
              />
              {errors.title && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Company */}
            <div>
              <label className={labelClasses}>
                <Building className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                Company *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Company name"
                className={`${inputClasses} ${errors.company ? 'border-red-500 focus:ring-red-500' : ''}`}
                required
              />
              {errors.company && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.company}</p>}
            </div>

            {/* Location */}
            <div>
              <label className={labelClasses}>
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. Colombo, Sri Lanka"
                className={`${inputClasses} ${errors.location ? 'border-red-500 focus:ring-red-500' : ''}`}
                required
              />
              {errors.location && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.location}</p>}
            </div>

            {/* Job Type */}
            <div>
              <label className={labelClasses}>
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
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
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                Salary Range
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="e.g. Rs 60,000 - Rs 80,000"
                className={`${inputClasses} ${errors.salary ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.salary && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.salary}</p>}
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
                className={`${inputClasses} appearance-none ${errors.category ? 'border-red-500 focus:ring-red-500' : ''}`}
                required
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value} className={optionClasses}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.category}</p>}
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
                className={`${inputClasses} appearance-none ${errors.deadline ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.deadline && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.deadline}</p>}
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className={sectionClasses}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Job Description
          </h2>
          
          {/* Short Description */}
          <div className="mb-4 sm:mb-6">
            <label className={labelClasses}>
              Short Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Brief description that will appear in job listings..."
              className={`${inputClasses} resize-none ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
              required
            />
            {errors.description && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Full Description */}
          <div>
            <label className={labelClasses}>
              Full Job Description *
            </label>
            <textarea
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleInputChange}
              rows={6}
              placeholder="Detailed description including responsibilities, project details, work environment, etc..."
              className={`${inputClasses} resize-none ${errors.fullDescription ? 'border-red-500 focus:ring-red-500' : ''}`}
              required
            />
            {errors.fullDescription && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.fullDescription}</p>}
          </div>
        </div>

        {/* Skills/Tags */}
        <div className={sectionClasses}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Skills & Tags
          </h2>
          
          <div>
            <label className={labelClasses}>
              Required Skills/Tags *
            </label>
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'tags')}
                  placeholder={`Skill ${index + 1} (e.g. Mason, Bricks, Tile work)`}
                  className={`flex-1 ${inputClasses} ${errors.tags && index === 0 ? 'border-red-500 focus:ring-red-500' : ''}`}
                  required={index === 0}
                />
                {formData.tags.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'tags')}
                    className={`p-2 rounded-lg transition-colors duration-200 flex-shrink-0 ${
                      isDarkMode
                        ? 'text-red-400 hover:bg-red-500/20'
                        : 'text-red-500 hover:bg-red-100'
                    }`}
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('tags')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 text-sm ${
                isDarkMode
                  ? 'text-blue-400 hover:bg-blue-500/20'
                  : 'text-blue-600 hover:bg-blue-100'
              }`}
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Add Skill/Tag</span>
            </button>
            {errors.tags && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.tags}</p>}
          </div>
        </div>

        {/* Requirements */}
        <div className={sectionClasses}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Job Requirements
          </h2>
          
          <div>
            <label className={labelClasses}>
              Requirements *
            </label>
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'requirements')}
                  placeholder={`Requirement ${index + 1} (e.g. Minimum 5 years of experience)`}
                  className={`flex-1 ${inputClasses} ${errors.requirements && index === 0 ? 'border-red-500 focus:ring-red-500' : ''}`}
                  required={index === 0}
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'requirements')}
                    className={`p-2 rounded-lg transition-colors duration-200 flex-shrink-0 ${
                      isDarkMode
                        ? 'text-red-400 hover:bg-red-500/20'
                        : 'text-red-500 hover:bg-red-100'
                    }`}
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('requirements')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 text-sm ${
                isDarkMode
                  ? 'text-blue-400 hover:bg-blue-500/20'
                  : 'text-blue-600 hover:bg-blue-100'
              }`}
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Add Requirement</span>
            </button>
            {errors.requirements && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.requirements}</p>}
          </div>
        </div>

        {/* Benefits */}
        <div className={sectionClasses}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Benefits & Perks
          </h2>
          
          <div>
            <label className={labelClasses}>
              Benefits & Perks
            </label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe any benefits, perks, or additional compensation..."
              className={`${inputClasses} resize-none`}
            />
          </div>
        </div>

        {/* Client Information */}
        <div className={sectionClasses}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Client Information
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Client Name */}
            <div>
              <label className={labelClasses}>
                <User className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                Your Name *
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                placeholder="e.g. Rajesh Perera"
                className={`${inputClasses} ${errors.clientName ? 'border-red-500 focus:ring-red-500' : ''}`}
                required
              />
              {errors.clientName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.clientName}</p>}
            </div>

            {/* Client Type */}
            <div>
              <label className={labelClasses}>
                Client Type *
              </label>
              <select
                name="clientType"
                value={formData.clientType}
                onChange={handleInputChange}
                className={`${inputClasses} appearance-none`}
              >
                {clientTypes.map(type => (
                  <option key={type.value} value={type.value} className={optionClasses}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className={sectionClasses}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Contact Information
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Phone */}
            <div>
              <label className={labelClasses}>
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="+94 77 123 4567"
                className={`${inputClasses} ${errors.contactPhone ? 'border-red-500 focus:ring-red-500' : ''}`}
                required
              />
              {errors.contactPhone && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.contactPhone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className={labelClasses}>
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className={`${inputClasses} ${errors.contactEmail ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.contactEmail && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.contactEmail}</p>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 text-sm sm:text-base ${
              isDarkMode
                ? 'bg-gray-600/50 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200/50 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Save as Draft</span>
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 text-sm sm:text-base ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            } text-white`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Posting Job...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Post Job</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;