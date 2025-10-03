import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';
import { toast } from 'react-toastify';

const AuthGuard = ({ children }) => {
  const { user, authenticated, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (token && !authLoading && !authenticated) {
        // Token exists but user is not authenticated, likely expired
        try {
          // Try to verify the token with the backend
          const response = await authService.getCurrentUser();
          if (!response.success) {
            // Token is invalid/expired
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            toast.error('Your session has expired. Please log in again.');
            navigate('/loginpage');
          }
        } catch (error) {
          // Token verification failed
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          toast.error('Your session has expired. Please log in again.');
          navigate('/loginpage');
        }
      }
    };

    checkTokenValidity();
  }, [authenticated, authLoading, navigate]);

  // Check for token expiration periodically
  useEffect(() => {
    let tokenCheckInterval;

    if (authenticated) {
      tokenCheckInterval = setInterval(async () => {
        try {
          const response = await authService.getCurrentUser();
          if (!response.success) {
            throw new Error('Token expired');
          }
        } catch (error) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          toast.error('Your session has expired. Please log in again.');
          navigate('/loginpage');
        }
      }, 30 * 60 * 1000); // Check every 30 minutes
    }

    return () => {
      if (tokenCheckInterval) {
        clearInterval(tokenCheckInterval);
      }
    };
  }, [authenticated, navigate]);

  return children;
};

export default AuthGuard;