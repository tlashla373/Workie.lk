import React from 'react'
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Logo from '../../assets/Logo.png'
import Facebook from '../../assets/facebook.svg'
import Google from '../../assets/google.svg'

import { Link } from 'react-router-dom'
import InfiniteSlider from '../../components/ui/InfiniteSlider';

const  SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
 

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
          {/* Left Side -  design  */}
          <div className="hidden lg:flex w-1/2 bg-gradient-to-r from-blue-700 to-blue-300  items-center justify-center p-8 relative overflow-hidden">
            
    
            <div className="max-w-md w-full relative z-0">
              {/* Feature Card */}
              <div className="rounded-2xl shadow-xl relative z-10">
                <InfiniteSlider />
              </div>
    
              {/* Bottom Section */}
              <div className="mt-12 text-white relative z-10">
                <h3 className="text-2xl alatsi-regular mb-4">Welcome to our community</h3>
                <p className="text-white leading-relaxed">
                  Whether you're looking for work or hiring talent, we match you with the right opportunities and professionals in seconds.
                </p>
    
                {/* Navigation Dots */}
                <div className="flex space-x-2 mt-6">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
                  <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
    
          {/* Right Side - Create account form */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 lg:px-16 lg:py-0">
            <div className="max-w-md mx-auto">
              {/* Logo */}
              <div className="mb-8">
                <div className="flex items-center space-x-2">
                  <a className="w-10 h-10 bg-blue-50 rounded flex drop-shadow-sm items-center justify-center cursor-pointer">
                    <Link to='/'>
                      <img className="w-8 h-8" src={Logo} alt="" href='/' />
                    </Link>
                  </a>
                  <span className="text-xl audiowide-regular font-bold text-gray-800">Workie.LK</span>
                </div>
              </div>
    
              {/* Sign Up Header */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create new account</h1>
              <p className="text-gray-600 mb-8">
                have an account?
                <a href="./authform" className="text-blue-600 hover:underline ml-1">Sign in</a>
              </p>
    
              {/* Form */}
            <div className="space-y-4">
                {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="flex justify-center items-center">
                  <label htmlFor="firstname" className="relative">
                  <input
                    required 
                    type="text"
                    id="firstname"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-50 px-2 py-2 text-sm border border-gray-300 rounded-lg  border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                  />
                  <span className="absolute left-0 top-2 px-1 text-sm text-gray-600 tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5
                 bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-5">
                  First Name
                </span>
                  </label>
                </div>

                <div className="flex justify-center items-center">
                  <label htmlFor="lastname" className="relative">
                  <input
                    required
                    type="text"
                    id="lastname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-50 px-2 py-2 text-sm border border-gray-300 rounded-lg  border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                    
                  />
                    <span className="absolute left-0 top-2 px-1 text-sm text-gray-600 tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5
                    bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-5">
                    Last Name
                    </span>
                  </label>
                </div>
                </div>

                {/* Email Field */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

                <div className="flex justify-center items-center">
                  <label htmlFor="email" className="relative">
                  <input
                    required
                    type="email"
                    id="email"  
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-50 px-2 py-2 text-sm border border-gray-300 rounded-lg  border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                  />
                    <span className="absolute left-0 top-2 px-1 text-sm text-gray-600 tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5
                    bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-5">
                    E-mail
                    </span>
                  </label>
                </div>

                {/* Mobile Number Field */}
                <div className="flex justify-center items-center">
                  <label htmlFor="mobile" className="relative"> 
                  <input
                    required
                    type="tel"
                    id="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-50 px-2 py-2 text-sm border border-gray-300 rounded-lg  border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                    
                  />
                    <span className="absolute left-0 top-2 px-1 text-sm text-gray-600 tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5
                    bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-5">
                    Mobile
                    </span>
                  </label>
                </div>
                </div>
    
                {/* Password Field */}
              <div className="flex justify-center items-center">
                <label className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-105 px-2 py-2 text-sm  border border-gray-300 rounded-lg  border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                  />
                  <span className="absolute left-0 top-2 px-1 text-gray-600 text-sm tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5
                  bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-5">
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
            {/*Confirm password*/}
              <div className="flex justify-center items-center">
                <label className="relative">
                  <input
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmpassword"
                    onChange={(e) => setShowConfirmPassword(e.target.value)}
                    className="w-105 px-2 py-2 text-sm  border border-gray-300 rounded-lg  border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                  />
                  <span className="absolute left-0 top-2 px-1 text-gray-600 text-sm tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5
                  bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-5">
                    Confirm Password
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </label>
              </div>
    
                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between space-y-3">
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
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Forgot Password?
                  </a>
                </div>
    
                {/* Sign In Button */}
                <button
                  type="submit"
                  className="w-105 bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
                >
                  Sign up
                </button>
    
                {/* Divider */}
                <div className="relative my-6">
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
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200"
                  >
                    <div className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                      <img className="h-6 w-6" viewBox="0 0 24 24" src={Google} alt=""/>
                    </div>
                    Continue with Google
                  </button>
    
                  <button
                    type="button"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200"
                  >
                    <div className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                      <img className="h-6 w-6" viewBox="0 0 24 24" src={Facebook} alt=""/>
                    </div>
                    Continue with Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>
          
    </div>
  )
}

export default SignUpPage;