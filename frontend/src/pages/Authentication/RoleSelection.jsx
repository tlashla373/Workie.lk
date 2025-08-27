// src/components/auth/RoleSelection.jsx
import React, { useState } from 'react';
import { User, Briefcase, ArrowRight, CheckCircle, Users, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/Logo.png';
import FindWorkImage from '../../assets/FindWork.svg';
import FindJobImage from '../../assets/find-job.svg';
import { useUserRole } from '../../components/hooks/UserRole.jsx'; // Import the hook
import authService from '../../services/authService'; // Import auth service

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUserRole } = useUserRole(); // Use the hook
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError(null); // Clear any previous errors
  };

  const handleContinue = async () => {
    if (selectedRole && !loading) {
      setLoading(true);
      setError(null);
      
      try {
        // Update role in database
        console.log('Updating user role to:', selectedRole);
        const response = await authService.updateUserRole(selectedRole);
        
        if (response.success) {
          // Save role locally using the hook
          setUserRole(selectedRole);
          
          console.log('Role updated successfully:', response.data);
          
          // Navigate based on selected role
          if (selectedRole === 'worker') {
            navigate('/workerverification'); // Worker Profile Navigation
          } else if (selectedRole === 'client') {
            navigate('/clientsetup'); // Client Profile navigation
          }
        } else {
          throw new Error(response.message || 'Failed to update role');
        }
      } catch (err) {
        console.error('Role update error:', err);
        setError(err.message || 'Failed to update role. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSkip = () => {
    // Navigate to a Home 
    navigate('/'); // Go to home
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <Link to='/' className="w-12 h-12 bg-blue-50 rounded-lg flex drop-shadow-sm items-center justify-center cursor-pointer transition-transform hover:scale-105">
              <img className="w-8 h-8" src={Logo} alt="Workie.LK Logo" />
            </Link>
            <span className="text-2xl audiowide-regular font-bold text-gray-800">Workie.LK</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Choose your role</h1>
          <p className="text-lg text-gray-600 mb-12">
            Select how you want to use Workie.LK to get started
          </p>
        </div>

        {/* Role Selection Cards - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* Worker Role */}
          <div 
            onClick={() => handleRoleSelect('worker')}
            className={`relative p-8 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              selectedRole === 'worker' 
                ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            {selectedRole === 'worker' && (
              <CheckCircle className="absolute top-4 right-4 w-8 h-8 text-blue-500" />
            )}
            <div className="text-center">
              {/* Image */}
              <div className="mb-6">
                <img 
                  src={FindWorkImage} 
                  alt="Find Work" 
                  className="w-24 h-24 sm:w-32 sm:h-32 mx-auto object-contain"
                />
              </div>
              
              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">I'm looking for work</h3>
                
              </div>
            </div>
          </div>

          {/* Client Role */}
          <div 
            onClick={() => handleRoleSelect('client')}
            className={`relative p-8 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              selectedRole === 'client' 
                ? 'border-green-500 bg-green-50 shadow-lg scale-105' 
                : 'border-gray-200 bg-white hover:border-green-300'
            }`}
          >
            {selectedRole === 'client' && (
              <CheckCircle className="absolute top-4 right-4 w-8 h-8 text-green-500" />
            )}
            <div className="text-center">
              {/* Image */}
              <div className="mb-6">
                <img 
                  src={FindJobImage} 
                  alt="Post Jobs" 
                  className="w-24 h-24 sm:w-32 sm:h-32 mx-auto object-contain"
                />
              </div>
              
              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">I'm looking to hire</h3>
                
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-md mx-auto space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <button
            onClick={handleContinue}
            disabled={!selectedRole || loading}
            className={`w-full flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
              selectedRole && !loading
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-6 h-6 ml-2" />
              </>
            )}
          </button>

          <button
            onClick={handleSkip}
            className="w-full px-8 py-4 border-2 border-gray-300 rounded-xl font-semibold text-lg text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            Skip for now
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Don't worry, you can change this later in your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;