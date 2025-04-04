import React from 'react';
import WalletStatusBar from '../WalletStatusBar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <WalletStatusBar />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;