import React from 'react'
import { useState } from "react";
import useAuth from '../../hooks/useAuth.js';
import { Eye, EyeOff } from "lucide-react";
import Logo from '../../assets/Logo.png'
import Facebook from '../../assets/facebook.svg'
import Google from '../../assets/google.svg'

import { Link, useNavigate } from 'react-router-dom'
import InfiniteSlider from '../../components/ui/InfiniteSlider';
import { toast } from 'react-toastify';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(''); // Added missing state
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState(''); // Added missing state
  const [confirmPassword, setConfirmPassword] = useState(''); // Added missing state
  const { register, authLoading } = useAuth();

  // Validation regex patterns
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
  // Fixed phone validation - accepts +94771234567 (12), 0771234567 (10), 771234567 (9)
  const phoneRegex = /^(\+94[0-9]{9}|0[0-9]{9}|[0-9]{9})$/;

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    // Basic validation
    if (!firstName.trim() || firstName.length < 2) {
      toast.error('First name must be at least 2 characters long');
      return;
    }

    if (!lastName.trim() || lastName.length < 2) {
      toast.error('Last name must be at least 2 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return;
    }

    // Check password complexity (backend requirement)
    if (!passwordRegex.test(password)) {
      toast.error('Password must contain at least one lowercase letter, one uppercase letter, and one number');
      return;
    }

    // Validate phone number format if provided
    if (mobile && mobile.trim()) {
      if (!phoneRegex.test(mobile.replace(/\s+/g, ''))) {
        toast.error('Please provide a valid phone number (e.g., +94771234567, 0771234567, or 771234567)');
        return;
      }
    }

    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        phone: mobile.trim() || undefined // Send undefined if empty to make it truly optional
      });
      
      // Navigate to email verification page with email
      navigate('/email-verification', { state: { email: email.trim() } });
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      {/* Left Side - design */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-400 items-center justify-center p-6 lg:p-8 xl:p-12 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 lg:w-72 lg:h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 lg:w-96 lg:h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
              </div>
              
              <div className="max-w-md lg:max-w-lg xl:max-w-xl w-full relative z-10">
                {/* Feature Card */}
                <div className="rounded-2xl shadow-2xl relative z-10 mb-8 lg:mb-12">
                  <InfiniteSlider/>           
                </div>
      
                {/* Bottom Section */}
                <div className="text-white relative z-10">
                  <h3 className="text-xl lg:text-2xl xl:text-3xl alatsi-regular mb-4 lg:mb-6 leading-tight">
                    Welcome to our community
                  </h3>
                  <p className="text-white/90 leading-relaxed text-sm lg:text-base xl:text-lg">
                    Whether you're looking for work or hiring talent, we match you with the right opportunities and professionals in seconds.
                  </p>
      
                  {/* Navigation Dots */}
                  <div className="flex space-x-2 mt-6 lg:mt-8">
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-white rounded-full shadow-lg"></div>
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-white/50 rounded-full"></div>
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-white/50 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

      {/* Right Side - Create account form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 lg:px-16 lg:py-0">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <Link to='/' className="w-10 h-10 bg-blue-50 rounded flex drop-shadow-sm items-center justify-center cursor-pointer">
                <img className="w-8 h-8" src={Logo} alt="Workie.LK Logo" />
              </Link>
              <span className="text-lg sm:text-xl audiowide-regular font-bold text-gray-800">Workie.LK</span>
            </div>
          </div>

          {/* Sign Up Header */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center sm:text-left">Create new account</h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-center sm:text-left text-sm sm:text-base">
            have an account?
            <Link to="/loginpage" className="text-blue-600 hover:underline ml-1">Sign in</Link>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex justify-center items-center">
                <label htmlFor="firstname" className="relative w-full">
                  <input
                    required 
                    type="text"
                    id="firstname"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                  />
                  <span className="absolute left-0 top-2 sm:top-3 px-1 text-sm text-gray-600 tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5 bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-5">
                    First Name
                  </span>
                </label>
              </div>

              <div className="flex justify-center items-center">
                <label htmlFor="lastname" className="relative w-full">
                  <input
                    required
                    type="text"
                    id="lastname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                  />
                  <span className="absolute left-0 top-2 sm:top-3 px-1 text-sm text-gray-600 tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5 bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-5">
                    Last Name
                  </span>
                </label>
              </div>
            </div>

            {/* Email and Mobile */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className="flex justify-center items-center">
                <label htmlFor="email" className="relative w-full">
                  <input
                    required
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                  />
                  <span className="absolute left-0 top-2 sm:top-3 px-1 text-sm text-gray-600 tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5 bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-5">
                    E-mail
                  </span>
                </label>
              </div>

              {/* Mobile Number Field */}
              <div className="flex justify-center items-center">
                <label htmlFor="mobile" className="relative w-full"> 
                  <input
                    required
                    type="tel"
                    id="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-3 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                  />
                  <span className="absolute left-0 top-2 sm:top-3 px-1 text-sm text-gray-600 tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5 bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-5">
                    Mobile
                  </span>
                </label>
              </div>
            </div>

            {/* Password Field */}
            <div className="flex justify-center items-center">
              <label className="relative w-full max-w-md">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                />
                <span className="absolute left-0 top-2 sm:top-3 px-1 text-gray-600 text-sm tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5 bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-5">
                  Password
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </label>
            </div>

            {/* Confirm password */}
            <div className="flex justify-center items-center">
              <label className="relative w-full max-w-md">
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmpassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                />
                <span className="absolute left-0 top-2 sm:top-3 px-1 text-gray-600 text-sm tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5 bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-5">
                  Confirm Password
                </span>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </label>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-start space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
            </div>

            {/* Sign Up Button */}
            <div className="flex justify-center items-center">
              <button
                type="submit"
                disabled={authLoading}
                className={`w-full max-w-md bg-blue-500 text-white py-2 sm:py-3 px-4 rounded-md font-medium transition duration-200 ${authLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {authLoading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-4 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 sm:py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200 text-sm sm:text-base"
              >
                <div className="w-5 h-5 mr-3">
                  <img className="h-5 w-5 sm:h-6 sm:w-6" src={Google} alt="Google"/>
                </div>
                Continue with Google
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 sm:py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200 text-sm sm:text-base"
              >
                <div className="w-5 h-5 mr-3">
                  <img className="h-5 w-5 sm:h-6 sm:w-6" src={Facebook} alt="Facebook"/>
                </div>
                Continue with Facebook
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage;