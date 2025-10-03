import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";
import Logo from '../../assets/Logo.png'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import InfiniteSlider from "../../components/ui/InfiniteSlider";
import authService from '../../services/authService';
import { toast } from 'react-toastify';

export default function ForgotPasswordPage() {
  // Handle OTP input backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.querySelector(`[aria-label='OTP digit ${index}']`);
      if (prevInput) prevInput.focus();
    }
  };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1); // 1: email + PIN, 2: password reset
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pinSent, setPinSent] = useState(false);
  const [sendingPin, setSendingPin] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  
  // Form data
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');

  // Get email from URL parameters when component mounts
  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      const decodedEmail = decodeURIComponent(emailFromUrl);
      setEmail(decodedEmail);
  // Do not automatically send PIN. User must request PIN explicitly.
    } else {
      // If no email is provided, redirect back to login page
      toast.error(error.message || 'Please enter your email on the login page first.');
      navigate('/loginpage');
    }
  }, [searchParams, navigate]);

  // Step 1: Send PIN to email
  const handleSendPin = async (emailToUse = email) => {
  if (otpRequested) return; // Prevent multiple sends
  setOtpRequested(true);
  setPin(''); // Clear previous OTP

    if (!emailToUse) {
      toast.error('Please enter your email address first.');
      return;
    }

    setSendingPin(true);
    
    try {
      const response = await authService.forgotPassword(emailToUse);
      
      if (response.success) {
        setPinSent(true);
        // Only show toast.error if not auto-sending from login page
        if (!searchParams.get('email')) {
          toast.success('A 5-digit PIN has been sent to your email address.');
        }
      } else {
        toast.error(response.message || 'Failed to send PIN. Please try again.');
      }
    } catch (error) {
      console.error('Error sending PIN:', error);
      toast.error(error.message || 'Network error. Please check your connection and try again.');
    } finally {
      setSendingPin(false);
    }
  };

  // Step 1: Verify PIN and proceed
  const handleVerifyPin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) {
      toast.error('Please enter your email address.');
      setIsLoading(false);
      return;
    }

    if (pin.length !== 5) {
      toast.warn('Please enter a valid 5-digit PIN.');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await authService.verifyResetPin(email, pin);
      
      if (response.success) {
        setResetToken(response.resetToken);
        setStep(2);
      } else {
        toast.error(response.message || 'Invalid PIN. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      toast.warn(error.message || 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.warn('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await authService.resetPassword(resetToken, password);
      
      if (response.success) {
        toast.success('Password reset successfully! You can now login with your new password.');
        navigate('/loginpage');
      } else {
        toast.error(response.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle PIN input formatting
  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 5) {
      setPin(value);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    let newPinArr = pin.split('');
    newPinArr[idx] = val;
    // If cleared, set to empty string
    if (!val) newPinArr[idx] = '';
    // Join and pad to 5 digits
    let newPin = newPinArr.join('').padEnd(5, '');
    setPin(newPin);
    // Move focus to next input if typing
    if (val && idx < 4) {
      const next = document.querySelector(`[aria-label='OTP digit ${idx+2}']`);
      if (next) next.focus();
    }
  };

  const renderStepContent = () => {
    const emailFromLogin = searchParams.get('email');
    
    // Only show content if email came from login page
    if (!emailFromLogin) {
      return (
        <div className="text-center">
          <div className="bg-red-50 p-4 rounded-lg mb-6">
            <p className="text-red-600 text-sm">
              ❌ Access denied. Please go back to login page and enter your email first.
            </p>
          </div>
          <Link 
            to="/loginpage" 
            className="w-full max-w-sm bg-blue-500 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium inline-block"
          >
            Go to Login Page
          </Link>
        </div>
      );
    }
    
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleVerifyPin} className="space-y-6">
            {/* Email confirmation message */}
            <div className="text-center mb-6">
              {sendingPin ? (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-600 text-sm">
                    📧 Sending PIN to <strong>{email}</strong>...
                  </p>
                </div>
              ) : pinSent ? (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-600 text-sm">
                    ✅ A 5-digit PIN has been sent to <strong>{email}</strong>
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Please check your email and enter the PIN below
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-600 text-sm">
                    🔄 Preparing to send PIN to <strong>{email}</strong>...
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSendPin(email)}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
                    disabled={sendingPin || pinSent || !email}
                  >
                    {sendingPin ? 'Sending...' : 'Send PIN'}
                  </button>
                </div>
              )}
            </div>

            {/* OTP Input - Show if PIN is sent or being sent */}
            {(pinSent || sendingPin) && (
              <div className="flex justify-center items-center">
                <label className="w-full max-w-sm flex flex-col items-center">
                  <div className="flex gap-2 w-full justify-center">
                    {[0,1,2,3,4].map((i) => (
                      <input
                        key={i}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={pin[i] || ''}
                        onChange={e => handleOtpChange(e, i)}
                        onKeyDown={e => handleKeyDown(i, e)}
                        onFocus={e => e.target.select()}
                        disabled={sendingPin}
                        className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition duration-200 disabled:bg-gray-100 bg-white shadow-sm"
                        autoFocus={i === 0}
                        aria-label={`OTP digit ${i+1}`}
                      />
                    ))}
                  </div>
                  <span className="mt-2 text-sm text-gray-600 tracking-wide">Enter 5-digit PIN</span>
                </label>
              </div>
            )}

            {/* Verify PIN Button - Only show if PIN is sent */}
            {pinSent && (
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  disabled={isLoading || pin.length !== 5}
                  className="w-full max-w-sm bg-blue-500 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying PIN...' : 'Verify PIN & Continue'}
                </button>
              </div>
            )}

            {/* Resend PIN - Only show if PIN was sent */}
            {pinSent && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setPinSent(false);
                    setPin('');
                    setOtpRequested(false); // Allow resend
                    setTimeout(() => handleSendPin(email), 0); // Actually send PIN after state resets
                  }}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                  disabled={sendingPin}
                >
                  Resend PIN
                </button>
              </div>
            )}
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-gray-600 text-sm">
                PIN verified for <strong>{email}</strong>. Enter your new password below.
              </p>
            </div>

            <div className="flex justify-center items-center">
              <label htmlFor="newPassword" className="relative w-full max-w-sm">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                  placeholder=" "
                />
                <span className="absolute left-0 top-2 sm:top-3 px-1 text-sm text-gray-600 tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5 bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-5">
                  New Password
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

            <div className="flex justify-center items-center">
              <label htmlFor="confirmNewPassword" className="relative w-full max-w-sm">
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmNewPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg border-opacity-50 outline-none focus:border-blue-500 focus:text-black transition duration-200 peer"
                  placeholder=" "
                />
                <span className="absolute left-0 top-2 sm:top-3 px-1 text-gray-600 text-sm tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5 bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-5">
                  Confirm New Password
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

            <div className="flex justify-center items-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full max-w-sm bg-blue-500 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                ← Back to PIN verification
              </button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    const emailFromLogin = searchParams.get('email');
    
    if (!emailFromLogin) {
      return 'Access Restricted';
    }
    
    switch (step) {
      case 1:
        return 'Enter PIN';
      case 2:
        return 'Reset Password';
      default:
        return 'Forgot Password';
    }
  };

  const getStepDescription = () => {
    const emailFromLogin = searchParams.get('email');
    
    if (!emailFromLogin) {
      return 'Please access this page from the login form.';
    }
    
    switch (step) {
      case 1:
        return 'Check your email for the 5-digit PIN';
      case 2:
        return 'Enter your new password';
      default:
        return 'Check your email for the 5-digit PIN';
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      {/* Left Side - Form */}
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

          {/* Progress Indicator
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <div className={`w-8 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
            </div>
          </div> 
          */}

          {/* Header */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center sm:text-left">{getStepTitle()}</h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-center sm:text-left text-sm sm:text-base">{getStepDescription()}</p>

          {/* Form Content */}
          {renderStepContent()}

          {/* Back to Login */}
          <div className="text-center mt-4 sm:mt-6">
            <Link to="/loginpage" className="text-blue-500 hover:text-blue-700 text-sm">
              ← Back to Login
            </Link>
          </div>
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
            <h3 className="text-2xl alatsi-regular mb-4">Secure Password Reset</h3>
            <p className="text-white leading-relaxed">
              {step === 1 ? 
                "Enter your email and we'll send you a secure PIN. Once received, enter it on the same page to continue." :
                "You're almost done! Enter your new password and you'll be back to finding great opportunities."
              }
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