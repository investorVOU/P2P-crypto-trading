import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ModalContainer from './ModalContainer';
import NotificationContainer from './NotificationContainer';

const Layout = () => {
  const { sidebarOpen, darkMode } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <Navbar />
      
      <div className="flex flex-grow">
        {isAuthenticated && (
          <Sidebar open={sidebarOpen} />
        )}
        
        <main className={`flex-grow p-4 transition-all ${isAuthenticated && sidebarOpen ? 'ml-64' : ''}`}>
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
      <NotificationContainer />
      <ModalContainer />
    </div>
  );
};

export default Layout;
