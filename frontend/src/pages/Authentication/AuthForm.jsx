import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Login from '../../assets/login.svg'
import Logo from '../../assets/Logo.png'
import Facebook from '../../assets/facebook.svg'
import Google from '../../assets/google.svg'
import { Link } from 'react-router-dom'
import InfiniteSlider from "../../components/ui/InfiniteSlider";

export default function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
 

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      {/* Left Side - Login Form */}
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

          {/* Sign In Header */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h1>
          <p className="text-gray-600 mb-8">
            Don't have an account?
            <a href="./signup" className="text-blue-600 hover:underline ml-1">Create now</a>
          </p>

          {/* Form */}
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"  
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="example@email.com"
              />
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
            <div className="flex items-center justify-between">
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
              Sign in
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

      {/* Right Side - Feature Card */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-r from-blue-700 to-blue-300  items-center justify-center p-8 relative overflow-hidden">
        <div className="max-w-md w-full relative z-0">
          {/* Feature Card */}
          <div className="rounded-2xl shadow-xl relative z-10">
            <InfiniteSlider/>           
          </div>

          {/* Bottom Section */}
          <div className="mt-12 text-white relative z-10">
            <h3 className="text-2xl alatsi-regular mb-4">Welcome to our community</h3>
            <p className="text-green-100 leading-relaxed">
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
    </div>
  );
}
