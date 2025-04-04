import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletAuthProvider } from './contexts/WalletAuthContext';
import WalletStatusBar from './components/WalletStatusBar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import TradesPage from './pages/TradesPage';
import TradeDetailPage from './pages/TradeDetailPage';
import CreateTradePage from './pages/CreateTradePage';

const App = () => {
  return (
    <WalletAuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <WalletStatusBar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/trades" element={<TradesPage />} />
              <Route path="/trades/:id" element={<TradeDetailPage />} />
              
              {/* Protected routes */}
              <Route 
                path="/create-trade" 
                element={
                  <ProtectedRoute>
                    <CreateTradePage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin routes */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute adminRequired={true}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                      <p className="mt-2">Admin interface coming soon...</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route for 404 */}
              <Route 
                path="*" 
                element={
                  <div className="flex justify-center items-center min-h-screen flex-col">
                    <h1 className="text-4xl font-bold text-gray-900">404</h1>
                    <p className="mt-2 text-lg text-gray-600">Page not found</p>
                  </div>
                } 
              />
            </Routes>
          </main>
          
          <footer className="bg-white border-t border-gray-200 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  &copy; {new Date().getFullYear()} P2P Trading Platform. All rights reserved.
                </div>
                <div className="flex space-x-6">
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Terms of Service
                  </a>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </WalletAuthProvider>
  );
};

export default App;