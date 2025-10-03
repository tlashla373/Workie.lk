import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RoleBasedRoute = ({ children, allowedRoles = [], fallbackPath = '/' }) => {
  const { user, authenticated, authLoading } = useAuth();

  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!authenticated || !user) {
    return <Navigate to="/loginpage" replace />;
  }

  // Check if user's role is in allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.userType)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default RoleBasedRoute;