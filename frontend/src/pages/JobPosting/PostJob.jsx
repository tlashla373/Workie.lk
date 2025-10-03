import React, { useState } from 'react';
import { MapPin, DollarSign, Clock, Building, Save, Send, User, Star, Phone, Mail, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../contexts/DarkModeContext';
import Mason from '../../assets/mason.svg'
import Welder from '../../assets/welder.svg'
import Plumber from '../../assets/plumber.svg'
import Carpenter from '../../assets/carpenter.svg'
import Painter from '../../assets/painter.svg'
import axios from 'axios';

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    // replace salary with explicit payment fields
    salary: '', // kept for backward-compat, not shown in UI now
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
    contactEmail: '',
    // New fields per design
    startDate: '',
    endDate: '',
    paymentType: 'fixed', // fixed | hourly | negotiable
    amount: '', // numeric string for UI
    whatsappNumber: '', // optional
    materialsProvidedByClient: false,
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
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.fullDescription.trim()) newErrors.fullDescription = 'Full description is required';

    // Payment details (required in the design)
    if (!formData.paymentType) newErrors.paymentType = 'Payment type is required';
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount (e.g. 3500)';
    }

    // Dates: start/end optional; closing date required
    if (!formData.deadline) newErrors.deadline = 'Application closing date is required';
    if (formData.startDate && formData.endDate) {
      const s = new Date(formData.startDate);
      const e = new Date(formData.endDate);
      if (e < s) newErrors.endDate = 'End date cannot be earlier than start date';
    }

    // Contact info
    if (!formData.clientName.trim()) newErrors.clientName = 'Your name is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Phone number is required';

    // Validate phone number format (Sri Lankan format)
    const phoneRegex = /^(\+94||0)[0-9]{9}$/;
    if (formData.contactPhone.trim() && !phoneRegex.test(formData.contactPhone.replace(/\s/g, ''))) {
      newErrors.contactPhone = 'Enter a valid Sri Lankan phone (e.g., +94771234567 or 0771234567)';
    }
    if (formData.whatsappNumber.trim() && !phoneRegex.test(formData.whatsappNumber.replace(/\s/g, ''))) {
      newErrors.whatsappNumber = 'Enter a valid Sri Lankan WhatsApp number';
    }

    // Validate email if provided
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail.trim() && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Enter a valid email address';
    }

    // Validate tags and requirements
    const validTags = formData.tags.filter(tag => tag.trim() !== '');
    const validRequirements = formData.requirements.filter(req => req.trim() !== '');
    if (validRequirements.length === 0) newErrors.requirements = 'At least one requirement is required';

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
      // Map frontend categories to backend enum values
      const categoryMap = {
        'Mason': 'other',
        'Carpenter': 'carpentry',
        'Welder': 'repair-services',
        'Painter': 'painting',
        'Plumber': 'plumbing'
      };

      // Prepare backend payload
      const jobPayload = {
        title: formData.title,
        description: formData.fullDescription,
        category: categoryMap[formData.category] || 'other',
        budget: {
          amount: Number(formData.amount),
          currency: 'LKR',
          type: formData.paymentType
        },
        location: {
          address: formData.location,
          city: formData.location.split(',')[0]?.trim() || formData.location, // Extract city from location
        },
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        skills: formData.tags.filter(tag => tag.trim() !== ''),
        duration: {
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
          isFlexible: false
        },
        urgency: 'medium',
        benefits: formData.benefits,
        maxApplicants: 50,
        isRemote: false,
        experienceLevel: 'any',
        // Custom fields for contact
        contact: {
          clientName: formData.clientName,
          clientType: formData.clientType,
          phone: formData.contactPhone,
          whatsapp: formData.whatsappNumber,
          email: formData.contactEmail
        },
        materialsProvidedByClient: formData.materialsProvidedByClient,
        deadline: formData.deadline
      };

      // Auth: get token from localStorage using the correct key
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setSubmitStatus('error');
        setErrors({ submit: 'Please log in to post a job. You need to be authenticated as a client.' });
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      // POST to backend
      const response = await axios.post('/api/jobs', jobPayload, config);
      if (response.data && response.data.success) {
        setSubmitStatus('success');
        // Keep the success message visible longer to allow user interaction
        // Don't auto-clear the form - let user decide to reset or navigate
      } else {
        setSubmitStatus('error');
        setErrors({ submit: response.data.message || 'Failed to post job. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrors({ submit: error.response?.data?.message || error.message || 'Failed to post job. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: '', label: 'Select Category', logo: null },
    { value: 'Mason', label: 'Mason', logo: Mason },
    { value: 'Carpenter', label: 'Carpenter', logo: Carpenter },
    { value: 'Welder', label: 'Welder', logo: Welder },
    { value: 'Painter', label: 'Painter', logo: Painter },
    { value: 'Plumber', label: 'Plumber', logo: Plumber }
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
        {/* Error summary at top if there are any errors */}
        {submitStatus === 'error' && Object.keys(errors).length > 0 && (
          <div className={`p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 ${isDarkMode ? 'bg-red-500/20 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">!</span>
              </div>
              <p className={`font-medium text-xs sm:text-sm ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                Please fix the following errors:
              </p>
            </div>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-red-600">
              {Object.entries(errors).map(([field, msg]) => (
                <li key={field}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Basic Job Information */}
        <div className={sectionClasses}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Basic Job Information
          </h2>
          
          {/* Form Status Messages */}
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

          </div>
        </div>

        {/* Job Description */}
        <div className={sectionClasses}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Job Description
          </h2>
          
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

        {/* Schedule (Start/End Dates) */}
        <div className={sectionClasses}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className={labelClasses}>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`${inputClasses} appearance-none`}
              />
            </div>
            <div>
              <label className={labelClasses}>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`${inputClasses} appearance-none ${errors.endDate ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.endDate && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.endDate}</p>}
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className={sectionClasses}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Payment Details *
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className={labelClasses}>Payment Type *</label>
              <select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleInputChange}
                className={`${inputClasses} appearance-none ${errors.paymentType ? 'border-red-500 focus:ring-red-500' : ''}`}
                required
              >
                <option value="fixed" className={optionClasses}>Fixed</option>
                <option value="hourly" className={optionClasses}>Hourly</option>
                <option value="negotiable" className={optionClasses}>Negotiable</option>
              </select>
              {errors.paymentType && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.paymentType}</p>}
            </div>
            <div>
              <label className={labelClasses}>Amount (Rs) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="3500"
                className={`${inputClasses} ${errors.amount ? 'border-red-500 focus:ring-red-500' : ''}`}
                min="0"
                step="1"
                required
              />
              {errors.amount && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.amount}</p>}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className={sectionClasses}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Contact Information *
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className={labelClasses}>Your Name *</label>
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
            <div>
              <label className={labelClasses}>Phone Number *</label>
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
            <div>
              <label className={labelClasses}>WhatsApp Number (Optional)</label>
              <input
                type="tel"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleInputChange}
                placeholder="+94 77 123 4567"
                className={`${inputClasses} ${errors.whatsappNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.whatsappNumber && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.whatsappNumber}</p>}
            </div>
            <div>
              <label className={labelClasses}>Email (Optional)</label>
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

        {/* Materials Provided? */}
        <div className={sectionClasses}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Materials Provided?
          </h2>
          <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-dashed">
            <div>
              <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-sm sm:text-base font-medium`}>Materials Provided by Client</p>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs sm:text-sm`}>
                {formData.materialsProvidedByClient ? 'Yes, material provided' : 'No, material provided'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, materialsProvidedByClient: !prev.materialsProvidedByClient }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${formData.materialsProvidedByClient ? 'bg-blue-600' : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')}`}
              aria-pressed={formData.materialsProvidedByClient}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${formData.materialsProvidedByClient ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Application Closing Date */}
        <div className={sectionClasses}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Application Closing Date *
          </h2>
          <div>
            <label className={labelClasses}>Application Closing Date *</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className={`${inputClasses} appearance-none ${errors.deadline ? 'border-red-500 focus:ring-red-500' : ''}`}
              required
            />
            {errors.deadline && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.deadline}</p>}
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

      {/* Success Message at Bottom */}
      {submitStatus === 'success' && (
        <div className={`mt-6 p-4 sm:p-6 rounded-xl ${isDarkMode ? 'bg-green-500/20 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold text-sm sm:text-base mb-2 ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
                Job Posted Successfully!
              </h3>
              <p className={`text-xs sm:text-sm mb-4 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                Your job has been published and candidates can now view and apply to it. You can manage your posted jobs from your profile.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => navigate('/clientprofile?tab=posted-jobs')}
                  className={`px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors ${
                    isDarkMode 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  View Posted Jobs
                </button>
                <button
                  onClick={() => {
                    setSubmitStatus(null);
                    setFormData({
                      title: '',
                      location: '',
                      salary: '',
                      fullDescription: '',
                      requirements: [''],
                      benefits: '',
                      deadline: '',
                      category: '',
                      tags: [''],
                      clientName: '',
                      clientType: 'Individual Client',
                      contactPhone: '',
                      contactEmail: '',
                      startDate: '',
                      endDate: '',
                      paymentType: 'fixed',
                      amount: '',
                      whatsappNumber: '',
                      materialsProvidedByClient: false,
                    });
                  }}
                  className={`px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors border ${
                    isDarkMode 
                      ? 'border-green-500 text-green-300 hover:bg-green-500/10' 
                      : 'border-green-600 text-green-600 hover:bg-green-50'
                  }`}
                >
                  Post Another Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostJob;