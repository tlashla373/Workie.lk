import { useState } from "react";
import useAuth from '../../hooks/useAuth.js';
import authService from '../../services/authService.js';
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
    
    try {
      const result = await login(email, password);
      
      // Check if user has a role already set
      const user = result?.data?.user;
      if (user && user.userType) {
        // Redirect based on existing user type
        if (user.userType === 'admin') {
          navigate('/admin');
        } else if (user.userType === 'client') {
          navigate('/clientprofile');
        } else if (user.userType === 'worker') {
          navigate('/workerprofile');
        } else {
          navigate('/roleselection');
        }
      } else {
        // User needs to select a role
        navigate('/roleselection');
      }
      
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    }
  };

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    try {
      // Use Google Identity Services (GIS) for client-side sign-in
      /* global google */
      if (!window.google) {
        toast.error('Google Sign-In SDK not loaded.');
        return;
      }
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: async (response) => {
          if (response && response.access_token) {
            try {
              // Send token to backend for verification
              const result = await authService.googleSignIn(response.access_token);
              if (result.success && result.data) {
                toast.success('Signed in with Google!');
                
                // Check user type and redirect appropriately
                const user = result.data.user;
                if (user && user.userType) {
                  if (user.userType === 'admin') {
                    navigate('/admin');
                  } else if (user.userType === 'client') {
                    navigate('/clientprofile');
                  } else if (user.userType === 'worker') {
                    navigate('/workerprofile');
                  } else {
                    navigate('/roleselection');
                  }
                } else {
                  navigate('/roleselection');
                }
              } else {
                toast.error(result.message || 'Google Sign-In failed');
              }
            } catch (err) {
              console.error('Google Sign-In error:', err);
              toast.error('Google Sign-In error: ' + (err.message || 'Unknown error'));
            }
          } else {
            toast.error('Google Sign-In failed to get token.');
          }
        }
      });
      client.requestAccessToken();
    } catch (error) {
      toast.error('Google Sign-In error: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-8 lg:py-0">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3">
              <Link to='/' className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex drop-shadow-sm items-center justify-center cursor-pointer transition-transform hover:scale-105">
                <img className="w-6 h-6 sm:w-8 sm:h-8" src={Logo} alt="Workie.LK Logo" />
              </Link>
              <span className="text-lg sm:text-xl lg:text-2xl audiowide-regular font-bold text-gray-800">Workie.LK</span>
            </div>
          </div>

          {/* Sign In Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 text-center lg:text-left">Sign in</h1>
            <p className="text-gray-600 text-center lg:text-left text-sm sm:text-base">
              Don't have an account?{' '}
              <Link to="/signuppage" className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors">Create now</Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            
            {/* Email Field */}
            <div className="w-full">
              <label htmlFor="email" className="relative w-full block">
                <input 
                  required 
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full px-3 py-3 sm:py-4 text-sm sm:text-base border border-gray-300 rounded-lg border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                />
                <span className="absolute left-0 top-3 sm:top-4 px-1 text-sm text-gray-600 tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-7 bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-7">
                  email address
                </span>
              </label>
            </div>

            {/* Password Field */}
            <div className="w-full">
              <label className="relative w-full block">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-3 sm:py-4 text-sm sm:text-base border border-gray-300 rounded-lg border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                />
                <span className="absolute left-0 top-3 sm:top-4 px-1 text-gray-600 text-sm tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-7 bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-7">
                  password
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </label>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 pt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={authLoading}
                className={`w-full bg-blue-600 text-white py-3 sm:py-4 px-4 rounded-lg transition duration-200 font-medium text-base ${authLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-lg'}`}
              >
                {authLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6 sm:my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 sm:space-y-4">
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-3 sm:py-4 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition duration-200 text-sm sm:text-base font-medium"
                onClick={handleGoogleSignIn}
              >
                <img className="h-5 w-5 sm:h-6 sm:w-6 mr-3" src={Google} alt="Google"/>
                Continue with Google
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-3 sm:py-4 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition duration-200 text-sm sm:text-base font-medium"
              >
                <img className="h-5 w-5 sm:h-6 sm:w-6 mr-3" src={Facebook} alt="Facebook"/>
                Continue with Facebook
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Feature Card */}
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
    </div>
  );
}