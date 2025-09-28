import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const PublicRoute = ({ children }) => {
  const { authenticated, authLoading } = useAuth();

  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is already authenticated, redirect to home
  if (authenticated) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, allow access to public route
  return children;
};

export default PublicRoute;