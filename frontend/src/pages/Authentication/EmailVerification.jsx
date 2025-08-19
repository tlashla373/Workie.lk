import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logo from '../../assets/Logo.png';
import { Mail, ArrowLeft } from 'lucide-react';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const email = location.state?.email || '';

  // Timer for OTP expiration
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 4) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (/^\d{5}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 5) {
      toast.error('Please enter a valid 5-digit OTP');
      return;
    }

    try {
      setLoading(true);
      console.log('Verifying OTP:', { email, otp: otpString }); // Debug log
      
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString }),
      });

      console.log('Response status:', response.status); // Debug log

      // Check if response has content before parsing JSON
      let data = {};
      const textResponse = await response.text();
      console.log('Response text:', textResponse); // Debug log
      
      if (textResponse) {
        try {
          data = JSON.parse(textResponse);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          console.error('Response text was:', textResponse);
          throw new Error('Invalid response from server');
        }
      }

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      toast.success('Email verified successfully!');
      navigate('/roleselection');
    } catch (error) {
      console.error('OTP Verification Error:', error);
      toast.error(error.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // Check if response has content before parsing JSON
      let data = {};
      const textResponse = await response.text();
      
      if (textResponse) {
        try {
          data = JSON.parse(textResponse);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          throw new Error('Invalid response from server');
        }
      }

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      toast.success('OTP resent successfully!');
      setTimeLeft(300); // Reset timer
      setOtp(['', '', '', '', '']); // Clear current OTP
    } catch (error) {
      console.error('Resend OTP Error:', error);
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center">
              <img className="w-8 h-8" src={Logo} alt="Workie.LK Logo" />
            </div>
            <span className="text-xl font-bold text-gray-800">Workie.LK</span>
          </div>

          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
          <p className="text-gray-600 text-sm">
            We've sent a 5-digit verification code to
          </p>
          <p className="text-blue-600 font-medium">{email}</p>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Enter verification code
          </label>
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={1}
              />
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            Code expires in: <span className="font-semibold text-red-500">{formatTime(timeLeft)}</span>
          </p>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerifyOtp}
          disabled={loading || otp.join('').length !== 5}
          className={`w-full py-3 px-4 rounded-lg font-medium transition duration-200 ${
            loading || otp.join('').length !== 5
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>

        {/* Resend OTP */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResendOtp}
            disabled={resendLoading || timeLeft > 0}
            className={`text-sm font-medium transition duration-200 ${
              resendLoading || timeLeft > 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            {resendLoading ? 'Sending...' : 'Resend Code'}
          </button>
        </div>

        {/* Back to Signup */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => navigate('/signup')}
            className="flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-800 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign Up</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
