import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from './features/auth/authSlice';
import { WalletAuthProvider, useWalletAuth } from './contexts/WalletAuthContext';
import MainLayout from './components/layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NewLoginPage from './pages/auth/NewLoginPage';
import NewRegisterPage from './pages/auth/NewRegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  // Define ProtectedRoute inside App function so it can use the context provided by WalletAuthProvider
  const ProtectedRoute = ({ children, requireAdmin = false }) => {
    // Check Redux auth state
    const { isAuthenticated, loading, user } = useSelector((state) => state.auth) || {};
    const { isWalletConnected, loading: walletLoading } = useWalletAuth();
    
    // Check if any auth method is loading
    if (loading || walletLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      );
    }
    
    // Allow access if authenticated with standard login OR wallet connected
    if (!isAuthenticated && !isWalletConnected) {
      return <Navigate to="/login" />;
    }
    
    // For admin routes, still require standard authentication with admin role
    if (requireAdmin && !user?.is_admin) {
      return <Navigate to="/dashboard" />;
    }
    
    return children;
  };
  const dispatch = useDispatch();
  
  // Check if user is authenticated on initial load
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <WalletAuthProvider>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<NewLoginPage />} />
          <Route path="/register" element={<NewRegisterPage />} />
          <Route path="/old-login" element={<LoginPage />} />
          <Route path="/old-register" element={<RegisterPage />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </WalletAuthProvider>
  );
}

export default App;