import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // Or return a loader component while checking auth
    return <div>Loading...</div>;
  }

  if (!user) {
    // Not logged in — redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User role is not allowed — redirect to unauthorized page or homepage
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authorized — render child routes
  return <Outlet />;
};

export default ProtectedRoute;
