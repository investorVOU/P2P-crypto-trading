import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import WalletAuthContext from '../contexts/WalletAuthContext';

const ProtectedRoute = ({ children, adminRequired = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useContext(WalletAuthContext);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Not authenticated - redirect to home
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Admin route but user is not admin
  if (adminRequired && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authenticated and authorized
  return children;
};

export default ProtectedRoute;