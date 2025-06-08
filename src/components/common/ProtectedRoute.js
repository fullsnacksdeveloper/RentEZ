import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Method 1: Safe destructuring with fallbacks
  const authState = useSelector((state) => state.auth || {});
  const { isAuthenticated = false, loading = false } = authState;

  // Alternative Method 2: Direct access with optional chaining
  // const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated ?? false);
  // const loading = useSelector((state) => state.auth?.loading ?? false);

  // Alternative Method 3: Using a selector function with error handling
  // const isAuthenticated = useSelector((state) => {
  //   try {
  //     return state.auth?.isAuthenticated || false;
  //   } catch (error) {
  //     console.error('Error accessing auth state:', error);
  //     return false;
  //   }
  // });

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content if authenticated
  return children;
};

export default ProtectedRoute;