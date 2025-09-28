import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole = null, fallbackPath = '/loginpage' }) => {
  const { user, authenticated, authLoading } = useAuth();
  const location = useLocation();

  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login with the current location
  if (!authenticated || !user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // If a specific role is required and user doesn't have it
  if (requiredRole && user.userType !== requiredRole) {
    // If user is trying to access admin routes without admin role
    if (requiredRole === 'admin') {
      return <Navigate to="/" replace />;
    }
    // For other role-based restrictions, redirect to appropriate page
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;