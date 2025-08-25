// src/hooks/useUserRole.js
import { useState, useEffect } from 'react';

export const useUserRole = (defaultRole = 'client') => {
  const [userRole, setUserRole] = useState(defaultRole);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole && ['worker', 'client'].includes(storedRole)) {
      setUserRole(storedRole);
    }
    setIsLoading(false);
  }, []);

  const updateUserRole = (newRole) => {
    if (['worker', 'client'].includes(newRole)) {
      setUserRole(newRole);
      localStorage.setItem('userRole', newRole);
    }
  };

  const clearUserRole = () => {
    setUserRole(defaultRole);
    localStorage.removeItem('userRole');
  };

  return {
    userRole,
    setUserRole: updateUserRole,
    clearUserRole,
    isLoading
  };
};