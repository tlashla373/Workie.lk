import { useState } from "react";
import useAuth from '../../hooks/useAuth.js';
import { Eye, EyeOff } from "lucide-react";
import Logo from '../../assets/Logo.png'
import Facebook from '../../assets/facebook.svg'
import Google from '../../assets/google.svg'
import { Link, useNavigate } from 'react-router-dom'
import InfiniteSlider from "../../components/ui/InfiniteSlider";
import { toast } from 'react-toastify';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState(''); // Added missing state
  const [password, setPassword] = useState(''); // Added missing state
  const { login, authLoading } = useAuth();
  

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    toast.error(null);
    try {
      await login(email, password);
      // After successful login, decide where to go (role not stored yet)
      navigate('/roleselection');
    } catch (error) {
      toast.error(error.message || 'Login failed');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h1>
          <p className="text-gray-600 mb-8">
            Don't have an account?
            <Link to="/signuppage" className="text-blue-600 hover:underline ml-1">Create now</Link>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 items-center">
            
            {/* Email Field */}
            <div className="flex justify-center items-center">
              <label htmlFor="email" className="relative">
                <input 
                  required 
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-80 px-2 py-2 text-sm border border-gray-300 rounded-lg border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                />
                <span className="absolute left-0 top-2 px-1 text-sm text-gray-600 tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5 bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-5">
                  email address
                </span>
              </label>
            </div>

            {/* Password Field */}
            <div className="flex justify-center items-center">
              <label className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-80 px-2 py-2 text-sm border border-gray-300 rounded-lg border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                />
                <span className="absolute left-0 top-2 px-1 text-gray-600 text-sm tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5 bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-5">
                  password
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
              <button
                type="button"
                onClick={() => {
                  if (!email.trim()) {
                    toast.error('Please enter your email address first before requesting password reset.');
                    return;
                  }
                  navigate(`/forgotpasswordpage?email=${encodeURIComponent(email)}`);
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <div className="flex justify-center items-center"> 
              <button
                type="submit"
                disabled={authLoading}
                className={`w-80 bg-blue-500 text-white py-3 px-4 rounded-md transition duration-200 font-medium ${authLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {authLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

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
                <div className="w-5 h-5 mr-3">
                  <img className="h-6 w-6" src={Google} alt="Google"/>
                </div>
                Continue with Google
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200"
              >
                <div className="w-5 h-5 mr-3">
                  <img className="h-6 w-6" src={Facebook} alt="Facebook"/>
                </div>
                Continue with Facebook
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