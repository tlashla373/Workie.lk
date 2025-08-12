// src/components/auth/RoleSelection.jsx
import React, { useState } from 'react';
import { User, Briefcase, ArrowRight, CheckCircle, Users, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/Logo.png';
import InfiniteSlider from '../../components/ui/InfiniteSlider';
import { useUserRole } from '../../components/hooks/UserRole'; // Import the hook

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const { setUserRole } = useUserRole(); // Use the hook
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      // Save role using the hook
      setUserRole(selectedRole);
      
      // Navigate based on selected role
      if (selectedRole === 'worker') {
        navigate('/workerverification'); // Worker Profile Navigation
      } else if (selectedRole === 'client') {
        navigate('/clientsetup'); // Client Profile navigation
      }
    }
  };

  const handleSkip = () => {
    // Navigate to a Home 
    navigate('/'); // Go to home
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      {/* Left Side - Design */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-r from-blue-700 to-blue-300 items-center justify-center p-8 relative overflow-hidden">
        <div className="max-w-md w-full relative z-10">
          {/* Feature Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 shadow-xl relative z-10">
            <div className="flex items-center justify-center mb-6">
              <InfiniteSlider/>
            </div>
            <p className="text-white/90 text-center leading-relaxed">
              Select your role to customize your experience and connect with the right opportunities.
            </p>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 text-white relative z-10">
            <h3 className="text-2xl alatsi-regular mb-4">Almost there!</h3>
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
              <Link to='/' className="w-10 h-10 bg-blue-50 rounded flex drop-shadow-sm items-center justify-center cursor-pointer">
                <img className="w-8 h-8" src={Logo} alt="Workie.LK Logo" />
              </Link>
              <span className="text-xl audiowide-regular font-bold text-gray-800">Workie.LK</span>
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
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">I'm looking for work</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Find opportunities that match your skills. Get hired by clients who need your expertise.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Find Jobs</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Build Profile</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Earn Money</span>
                  </div>
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
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">I'm looking to hire</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Post jobs and find qualified workers. Connect with professionals who can help grow your business.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Post Jobs</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Find Talent</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Manage Projects</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleContinue}
              disabled={!selectedRole}
              className={`w-full flex items-center justify-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                selectedRole
                  ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>

            <button
              onClick={handleSkip}
              className="w-full px-6 py-3 border border-gray-300 rounded-md font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-200"
            >
              Skip for now
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't worry, you can change this later in your profile settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;