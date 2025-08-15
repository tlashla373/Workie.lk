import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Logo from '../../assets/Logo.png'
import { Link, useNavigate } from 'react-router-dom'
import InfiniteSlider from "../../components/ui/InfiniteSlider";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(''); // Added missing state
  const [password, setPassword] = useState(''); // Added missing state
  const [confirmPassword, setConfirmPassword] = useState(''); // Added missing state
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Your login API call here
      const loginData = {
        email,
        password
      };

      // Example API call (replace with your actual endpoint)
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(loginData)
      // });

      // if (response.ok) {
      //   const userData = await response.json();
      //   // Check if user has selected a role
      //   if (userData.role) {
      //     // Navigate to appropriate dashboard
      //     if (userData.role === 'worker') {
      //       navigate('/worker-dashboard');
      //     } else if (userData.role === 'client') {
      //       navigate('/client-dashboard');
      //     }
      //   } else {
      //     // User hasn't selected a role yet
      //     navigate('/select-role');
      //   }
      // } else {
      //   throw new Error('Login failed');
      // }

      // For demo purposes, navigate to role selection
        navigate('/clientprofile');
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      {/* Left Side - Login Form */}
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

          {/* Sign In Header */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset password</h1>
          <p className="text-gray-600 mb-8">
            Enter your new passord
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 items-center">
            {/* Email Field */}
            <div className="flex justify-center items-center">
              <label htmlFor="email" className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-80 px-2 py-2 text-sm border border-gray-300 rounded-lg border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                />
                <span className="absolute left-0 top-2 px-1 text-sm text-gray-600 tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5 bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-5">
                  New password
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
              <label className="relative">
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmpassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-80 px-2 py-2 text-sm border border-gray-300 rounded-lg border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                />
                <span className="absolute left-0 top-2 px-1 text-gray-600 text-sm tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5 bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-5">
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

            
            {/* Sign In Button */}
            <div className="flex justify-center items-center"> 
              <button
                type="submit"
                className="w-80 bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
              >
                Reset Password
              </button>
            </div>
            
          </form>
        </div>
      </div>

      {/* Right Side - Feature Card */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-r from-blue-700 to-blue-300 items-center justify-center p-8 relative overflow-hidden">
        <div className="max-w-md w-full relative z-0">
          {/* Feature Card */}
          <div className="rounded-2xl shadow-xl relative z-10">
            <InfiniteSlider/>           
          </div>

          {/* Bottom Section */}
          <div className="mt-12 text-white relative z-10">
            <h3 className="text-2xl alatsi-regular mb-4">Welcome to our community</h3>
            <p className="text-white leading-relaxed">
               Whether you're looking for work or hiring talent, we match you with the right opportunities and professionals in seconds.
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