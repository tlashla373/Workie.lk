import React from 'react'
import { useState } from "react";
import { Eye, EyeOff ,Facebook } from "lucide-react";
import CreateAccount from '../../assets/create account.svg'
import Logo from '../../assets/Logo.png'

import { Link } from 'react-router-dom'

const  SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
 

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
          {/* Left Side -  design  */}
          <div className="hidden lg:flex w-1/2 bg-gradient-to-r from-blue-700 to-blue-300  items-center justify-center p-8 relative overflow-hidden">
            {/* Support Button */}
            <div className="absolute top-8 left-8 z-10">
              <button className="flex items-center space-x-2 bg-white bg-opacity-20 text-black px-2 py-2 rounded hover:bg-opacity-30 transition duration-200">
                <div className="rounded bg-white bg-opacity-30 flex items-center justify-center">
                  {/*<span className="text-xs text-blue-400">Workie.LK</span>*/}
                  <img className="w-15 h-15" src={Logo} alt="" />
                </div>
              </button>
            </div>
    
            <div className="max-w-md w-full relative z-0">
              {/* Feature Card */}
              <div className="bg-white rounded-2xl p-6 shadow-xl relative z-10">
                <div>
                  <img
                    src={CreateAccount}
                  />
                </div>
                <button className="w-full bg-green-700 text-white py-3 px-4 rounded-lg hover:bg-green-800 transition duration-200 font-medium mt-4">
                  Learn more
                </button>
              </div>
    
              {/* Bottom Section */}
              <div className="mt-12 text-white relative z-10">
                <h3 className="text-2xl font-bold mb-4">Introducing new features</h3>
                <p className="text-green-100 leading-relaxed">
                  Analyzing previous trends ensures that businesses always make the right decision. And as the scale of the decision and it's impact magnifies...
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
            <div className="max-w-md w-full mx-auto">
              {/* Logo */}
              <div className="mb-8">
                <div className="flex items-center space-x-2">
                  <a className="w-12 h-12 bg-blue-50 rounded flex drop-shadow-sm items-center justify-center cursor-pointer">
                    <Link to='/'>
                      <img className="w-10 h-10" src={Logo} alt="" href='/' />
                    </Link>
                  </a>
                  <span className="text-xl font-bold text-gray-800">Workie.LK</span>
                </div>
              </div>
    
              {/* Sign Up Header */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create new account</h1>
              <p className="text-gray-600 mb-8">
                have an account?
                <a href="./authform" className="text-blue-600 hover:underline ml-1">Sign in</a>
              </p>
    
              {/* Form */}
            <div className="space-y-2">
                {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input 
                    type="text"
                    id="firstname"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Avishka"
                  />
                </div>

                <div>
                  <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name 
                  </label>
                  <input 
                    type="text"
                    id="lastname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Madhushan"
                  />
                </div>
                </div>

                {/* Email Field */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"  
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="example@email.com"
                  />
                </div>

                {/* Mobile Number Field */}
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="+94 77 123 4567"
                  />
                </div>
                </div>
    
                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
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
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
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
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>
    
                  <button
                    type="button"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200"
                  >
                    <div className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                      <Facebook className="text-blue-400"/>
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

export default SignUp