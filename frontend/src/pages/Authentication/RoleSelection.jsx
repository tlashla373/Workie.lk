import React, { useState } from 'react';
import { User, Briefcase, ArrowRight, CheckCircle } from 'lucide-react';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      // Handle navigation based on selected role
      console.log(`Selected role: ${selectedRole}`);
      // You can add navigation logic here
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      {/* Left Side - Design */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-r from-blue-700 to-blue-300 items-center justify-center p-8 relative overflow-hidden">
        <div className="max-w-md w-full relative z-10">
          {/* Feature Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl relative z-10">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-4">
              Choose Your Path
            </h2>
            <p className="text-white/90 text-center leading-relaxed">
              Select your role to customize your experience and connect with the right opportunities.
            </p>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 text-white relative z-10">
            <h3 className="text-2xl font-bold mb-4">Almost there!</h3>
            <p className="text-white/90 leading-relaxed">
              Just one more step to personalize your Workie.LK experience and unlock the right features for you.
            </p>

            {/* Navigation Dots */}
            <div className="flex space-x-2 mt-6">
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Role Selection */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 lg:px-16 lg:py-0">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-50 rounded flex drop-shadow-sm items-center justify-center">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
              </div>
              <span className="text-xl font-bold text-gray-800">Workie.LK</span>
            </div>
          </div>

          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose your role</h1>
          <p className="text-gray-600 mb-8">
            Select how you want to use Workie.LK
          </p>

          {/* Role Selection Cards */}
          <div className="space-y-4 mb-8">
            {/* Worker Role */}
            <div 
              onClick={() => handleRoleSelect('worker')}
              className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedRole === 'worker' 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {selectedRole === 'worker' && (
                <CheckCircle className="absolute top-4 right-4 w-6 h-6 text-blue-500" />
              )}
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedRole === 'worker' ? 'bg-blue-500' : 'bg-gray-100'
                }`}>
                  <User className={`w-6 h-6 ${
                    selectedRole === 'worker' ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Worker</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Find work opportunities, showcase your skills, and connect with potential clients. Perfect for freelancers and job seekers.
                  </p>
                  <ul className="mt-3 space-y-1">
                    <li className="text-xs text-gray-500 flex items-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                      Create professional profile
                    </li>
                    <li className="text-xs text-gray-500 flex items-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                      Browse and apply for jobs
                    </li>
                    <li className="text-xs text-gray-500 flex items-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                      Get hired by clients
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Client Role */}
            <div 
              onClick={() => handleRoleSelect('client')}
              className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedRole === 'client' 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {selectedRole === 'client' && (
                <CheckCircle className="absolute top-4 right-4 w-6 h-6 text-blue-500" />
              )}
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedRole === 'client' ? 'bg-blue-500' : 'bg-gray-100'
                }`}>
                  <Briefcase className={`w-6 h-6 ${
                    selectedRole === 'client' ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Client</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Post jobs, find talented workers, and manage your projects. Ideal for businesses and individuals looking to hire.
                  </p>
                  <ul className="mt-3 space-y-1">
                    <li className="text-xs text-gray-500 flex items-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                      Post job opportunities
                    </li>
                    <li className="text-xs text-gray-500 flex items-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                      Browse worker profiles
                    </li>
                    <li className="text-xs text-gray-500 flex items-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                      Manage your projects
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`w-full py-3 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              selectedRole 
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Skip Option */}
          <div className="mt-4 text-center">
            <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
              I'll choose later
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center leading-relaxed">
              Don't worry, you can always switch roles or create additional accounts later from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;