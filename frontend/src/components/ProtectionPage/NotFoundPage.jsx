import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const NotFoundPage = () => {
  const { authenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.87 0-5.43 1.58-6.75 3.98M6.228 6.228A10.45 10.45 0 0112 3c4.97 0 9.228 3.478 10.228 8.228A10.45 10.45 0 0112 21a10.45 10.45 0 01-10.228-8.228" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h3 className="text-xl font-medium text-gray-800 mb-4">
          Page Not Found
        </h3>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or you don't have permission to access it.
        </p>
        <div className="space-x-4">
          {authenticated ? (
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go to Home
            </Link>
          ) : (
            <Link
              to="/loginpage"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go to Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;