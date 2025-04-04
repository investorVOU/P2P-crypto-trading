import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './features/auth/authSlice';

// Layout components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import ModalContainer from './components/ModalContainer';
import NotificationContainer from './components/NotificationContainer';

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import TradesPage from './pages/trades/TradesPage';
import TradeDetailPage from './pages/trades/TradeDetailPage';
import CreateTradePage from './pages/trades/CreateTradePage';
import WalletPage from './pages/wallet/WalletPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import TradesOverview from './pages/admin/TradesOverview';
import DisputesOverview from './pages/admin/DisputesOverview';
import UsersOverview from './pages/admin/UsersOverview';

// Protected route component
const ProtectedRoute = ({ element, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, user, isLoading } = useSelector((state) => state.auth);
  
  // If authentication is still loading, render a loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If adminOnly and user is not admin, redirect to dashboard
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  // Otherwise, render the protected component
  return element;
};

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isDarkMode } = useSelector((state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isDarkMode: state.ui.isDarkMode
  }));
  
  // Check authentication status on app load
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  // Apply dark mode class based on state
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-secondary-900 text-secondary-900 dark:text-white">
        <Navbar />
        
        <div className="flex flex-1">
          {isAuthenticated && <Sidebar />}
          
          <main className={`flex-1 ${isAuthenticated ? 'pl-0 md:pl-64' : ''} pt-16 pb-8 px-4 md:px-8`}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
              <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
              <Route path="/trades" element={<ProtectedRoute element={<TradesPage />} />} />
              <Route path="/trades/new" element={<ProtectedRoute element={<CreateTradePage />} />} />
              <Route path="/trades/:id" element={<ProtectedRoute element={<TradeDetailPage />} />} />
              <Route path="/wallet" element={<ProtectedRoute element={<WalletPage />} />} />
              <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} adminOnly={true} />} />
              <Route path="/admin/trades" element={<ProtectedRoute element={<TradesOverview />} adminOnly={true} />} />
              <Route path="/admin/disputes" element={<ProtectedRoute element={<DisputesOverview />} adminOnly={true} />} />
              <Route path="/admin/users" element={<ProtectedRoute element={<UsersOverview />} adminOnly={true} />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
        
        <Footer />
        
        {/* Modal and Notification containers */}
        <ModalContainer />
        <NotificationContainer />
      </div>
    </Router>
  );
};

export default App;
