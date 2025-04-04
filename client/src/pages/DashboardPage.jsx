import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrades } from '../features/trades/tradesSlice';
import { fetchWalletBalances } from '../features/wallet/walletSlice';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { trades, isLoading: isTradesLoading } = useSelector((state) => state.trades);
  const { balances, isLoading: isWalletLoading } = useSelector((state) => state.wallet);
  
  useEffect(() => {
    // Fetch user's active trades and wallet balances
    dispatch(fetchTrades({ status: 'active', limit: 5 }));
    dispatch(fetchWalletBalances());
  }, [dispatch]);

  // Calculate wallet summary
  const totalUsdValue = balances.reduce((total, balance) => total + balance.usdValue, 0);
  const activeTrades = trades.filter(trade => ['pending', 'in_progress'].includes(trade.status));
  const completedTrades = trades.filter(trade => trade.status === 'completed');
  
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">Welcome back, {user?.username || 'Trader'}!</h2>
        <p className="mb-4">Here's an overview of your trading activity and wallet balances.</p>
        <div className="flex flex-wrap gap-4 mt-4">
          <Link to="/trades/new" className="btn bg-white text-primary-600 hover:bg-secondary-100">
            Create New Trade
          </Link>
          <Link to="/wallet" className="btn bg-transparent border border-white text-white hover:bg-white hover:bg-opacity-10">
            Manage Wallet
          </Link>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Trading Summary */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Trading Summary</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-secondary-100 dark:bg-secondary-700 p-4 rounded-md">
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Active Trades</p>
              <p className="text-2xl font-bold">{activeTrades.length}</p>
            </div>
            <div className="bg-secondary-100 dark:bg-secondary-700 p-4 rounded-md">
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Completed Trades</p>
              <p className="text-2xl font-bold">{completedTrades.length}</p>
            </div>
          </div>
          
          <h3 className="font-medium mb-3">Recent Trades</h3>
          {isTradesLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : trades.length > 0 ? (
            <div className="space-y-3">
              {trades.slice(0, 3).map((trade) => (
                <div key={trade.id} className="border border-secondary-200 dark:border-secondary-700 rounded-md p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{trade.type === 'buy' ? 'Buy' : 'Sell'} {trade.amount} {trade.currency}</p>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        {new Date(trade.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className={`badge ${
                        trade.status === 'completed' ? 'badge-success' : 
                        trade.status === 'cancelled' ? 'badge-danger' : 
                        'badge-primary'
                      }`}>
                        {trade.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center mt-4">
                <Link to="/trades" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
                  View all trades →
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-secondary-600 dark:text-secondary-400">
              <p>No trades found</p>
              <Link to="/trades/new" className="text-primary-600 dark:text-primary-400 mt-2 inline-block hover:underline">
                Create your first trade
              </Link>
            </div>
          )}
        </div>
        
        {/* Wallet Summary */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Wallet Summary</h2>
          
          <div className="bg-secondary-100 dark:bg-secondary-700 p-4 rounded-md mb-6">
            <p className="text-sm text-secondary-600 dark:text-secondary-400">Total Balance (USD)</p>
            <p className="text-2xl font-bold">${totalUsdValue.toFixed(2)}</p>
          </div>
          
          <h3 className="font-medium mb-3">Your Balances</h3>
          {isWalletLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : balances.length > 0 ? (
            <div className="space-y-3">
              {balances.map((balance) => (
                <div key={balance.id} className="flex justify-between items-center border border-secondary-200 dark:border-secondary-700 rounded-md p-3">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full mr-3 ${
                      balance.currency === 'BTC' ? 'bg-yellow-500' : 
                      balance.currency === 'ETH' ? 'bg-blue-500' : 
                      balance.currency === 'LTC' ? 'bg-gray-500' : 
                      'bg-primary-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">{balance.currency}</p>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        ${balance.usdValue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">{balance.amount}</p>
                  </div>
                </div>
              ))}
              <div className="text-center mt-4">
                <Link to="/wallet" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
                  Manage wallet →
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-secondary-600 dark:text-secondary-400">
              <p>No balances found</p>
              <Link to="/wallet" className="text-primary-600 dark:text-primary-400 mt-2 inline-block hover:underline">
                Deposit funds
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8 bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/trades/new" className="flex flex-col items-center justify-center p-4 bg-secondary-100 dark:bg-secondary-700 rounded-md hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors">
            <svg className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span className="text-sm font-medium">New Trade</span>
          </Link>
          
          <Link to="/wallet" className="flex flex-col items-center justify-center p-4 bg-secondary-100 dark:bg-secondary-700 rounded-md hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors">
            <svg className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
            <span className="text-sm font-medium">Deposit</span>
          </Link>
          
          <Link to="/wallet" className="flex flex-col items-center justify-center p-4 bg-secondary-100 dark:bg-secondary-700 rounded-md hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors">
            <svg className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            <span className="text-sm font-medium">Withdraw</span>
          </Link>
          
          <Link to="/profile" className="flex flex-col items-center justify-center p-4 bg-secondary-100 dark:bg-secondary-700 rounded-md hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors">
            <svg className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span className="text-sm font-medium">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
