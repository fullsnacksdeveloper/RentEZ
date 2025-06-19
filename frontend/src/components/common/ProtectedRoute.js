// src/components/common/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';



/*import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';



const ProtectedRoute = ({ children, userType}) => {
  // Method 1: Safe destructuring with fallbacks
  const authState = useSelector((state) => state.auth || {});
  const { isAuthenticated = false, loading = false, user = null} = authState;


  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  console.log("User in Redux: 1", user);

  // ⛔ Logged in but not the correct role
  if (userType && user.userType !== userType) {
    return <Navigate to="/" replace />;
  }

  console.log("User in Redux: 2", user);
  console.log("🧠 Authenticated:", isAuthenticated);
  console.log("👤 User:", user);


  // Render protected content if authenticated
  return children;
}; 

export default ProtectedRoute; */





const ProtectedRoute = ({ children, userType }) => {
  const { isAuthenticated, loading, user } = useAuth();

  console.log("🛡️ ProtectedRoute invoked");
  console.log("🔄 loading:", loading);
  console.log("🔐 isAuthenticated:", isAuthenticated);
  console.log("👤 user:", user);
  console.log("🧑‍🎓 expected userType:", userType);


  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (userType && user.userType !== userType) return <Navigate to="/" replace />;

  
  console.log("✅ Access granted. Rendering protected component.");
  return children;
};

export default ProtectedRoute;
