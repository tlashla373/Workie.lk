import { useState } from "react";
import Logo from '../../assets/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import InfiniteSlider from "../../components/ui/InfiniteSlider";

export default function OTPPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

    const handleNext = () => {
    // To check nonly 
    navigate('/forgotpasswordpage'); // Go nre password page
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      {/* Left Side - OTP Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 lg:px-16">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center space-x-2">
              <Link
                to="/"
                className="w-10 h-10 bg-blue-50 rounded flex drop-shadow-sm items-center justify-center cursor-pointer"
              >
                <img className="w-8 h-8" src={Logo} alt="Workie.LK Logo" />
              </Link>
              <span className="text-xl audiowide-regular font-bold text-gray-800">
                Workie.LK
              </span>
            </div>
          </div>

          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enter OTP</h1>
          <p className="text-gray-600 mb-8">
            Didn’t receive an OTP?  
            <Link
              to="/resend-otp"
              className="text-blue-600 hover:underline ml-1"
            >
              Resend OTP
            </Link>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* OTP Field */}
            <div className="flex justify-center items-center">
              <label htmlFor="otp" className="relative">
                <input
                  required
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-80 px-2 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                />
                <span className="absolute left-0 top-2 px-1 text-sm text-gray-600 tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:-translate-y-5 bg-white ml-2 peer-valid:-translate-y-5">
                  Input OTP
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center items-center">
              <button
                onClick={handleNext}
                type="submit"
                className="w-80 bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
              >
                Verify OTP
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Feature Card */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-r from-blue-700 to-blue-300 items-center justify-center p-8 relative overflow-hidden">
        <div className="max-w-md w-full relative z-0">
          <div className="rounded-2xl shadow-xl relative z-10">
            <InfiniteSlider />
          </div>

          <div className="mt-12 text-white relative z-10">
            <h3 className="text-2xl alatsi-regular mb-4">Welcome to our community</h3>
            <p className="leading-relaxed">
              Whether you're looking for work or hiring talent, we match you
              with the right opportunities and professionals in seconds.
            </p>
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
