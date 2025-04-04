import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth) || { user: null };
  
  const [walletBalances, setWalletBalances] = useState([]);
  const [recentTrades, setRecentTrades] = useState([]);
  const [walletSummary, setWalletSummary] = useState(null);
  const [loading, setLoading] = useState({
    wallet: true,
    trades: true
  });
  const [error, setError] = useState({
    wallet: null,
    trades: null
  });

  // Fetch wallet balances
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await axios.get(`${API_URL}/wallet/summary`);
        setWalletSummary(response.data);
        setWalletBalances(response.data.distribution || []);
        setLoading(prev => ({ ...prev, wallet: false }));
      } catch (err) {
        console.error('Error fetching wallet data:', err);
        setError(prev => ({ ...prev, wallet: 'Failed to load wallet data' }));
        setLoading(prev => ({ ...prev, wallet: false }));
        
        // Demo data
        setWalletBalances([
          { currency: 'BTC', amount: 0.05, usd_value: 1250, percentage: 50 },
          { currency: 'ETH', amount: 0.75, usd_value: 1000, percentage: 40 },
          { currency: 'USDT', amount: 250, usd_value: 250, percentage: 10 }
        ]);
        
        setWalletSummary({
          total_usd_value: 2500,
          recent_transactions: [
            { id: 1, type: 'deposit', amount: 0.05, currency: 'BTC', date: new Date().toISOString() },
            { id: 2, type: 'withdrawal', amount: 0.1, currency: 'ETH', date: new Date(Date.now() - 86400000).toISOString() }
          ]
        });
      }
    };

    fetchWalletData();
  }, []);

  // Fetch recent trades
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await axios.get(`${API_URL}/trades`);
        setRecentTrades(response.data.slice(0, 5)); // Get 5 most recent trades
        setLoading(prev => ({ ...prev, trades: false }));
      } catch (err) {
        console.error('Error fetching trades:', err);
        setError(prev => ({ ...prev, trades: 'Failed to load trade data' }));
        setLoading(prev => ({ ...prev, trades: false }));
        
        // Demo data
        setRecentTrades([
          {
            id: 1,
            type: 'buy',
            amount: 0.25,
            currency: 'BTC',
            price: 25000,
            status: 'completed',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString()
          },
          {
            id: 2,
            type: 'sell',
            amount: 2.5,
            currency: 'ETH',
            price: 1800,
            status: 'active',
            created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ]);
      }
    };

    fetchTrades();
  }, []);

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : currency,
      minimumFractionDigits: currency === 'USD' ? 2 : 8,
      maximumFractionDigits: currency === 'USD' ? 2 : 8
    }).format(amount).replace('USD', '$');
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get transaction type color
  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'deposit':
        return 'bg-green-100 text-green-800';
      case 'withdrawal':
        return 'bg-red-100 text-red-800';
      case 'trade':
        return 'bg-blue-100 text-blue-800';
      case 'escrow':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="py-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          
          {/* Welcome Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg mt-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Welcome, {user?.username || 'Trader'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Here's a summary of your trading activity and wallet balances
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link
                  to="/trades"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Create New Trade
                </Link>
              </div>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Wallet Balance */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-orange-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Wallet Balance
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {loading.wallet ? (
                            <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
                          ) : (
                            formatCurrency(walletSummary?.total_usd_value || 0)
                          )}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link to="/wallet" className="font-medium text-orange-600 hover:text-orange-500">
                    View wallet details
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Active Trades */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Trades
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {loading.trades ? (
                            <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
                          ) : (
                            recentTrades.filter(trade => trade.status === 'active').length
                          )}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link to="/trades" className="font-medium text-orange-600 hover:text-orange-500">
                    View all trades
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Completed Trades */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Completed Trades
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {loading.trades ? (
                            <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
                          ) : (
                            user?.completedTrades || 0
                          )}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link to="/profile" className="font-medium text-orange-600 hover:text-orange-500">
                    View profile details
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Trades and Wallet Summary */}
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Recent Trades */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Trades</h3>
              </div>
              <div className="border-t border-gray-200">
                {loading.trades ? (
                  <div className="px-4 py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading trades...</p>
                  </div>
                ) : error.trades ? (
                  <div className="px-4 py-5 sm:p-6 text-center">
                    <p className="text-sm text-red-500">{error.trades}</p>
                  </div>
                ) : recentTrades.length === 0 ? (
                  <div className="px-4 py-5 sm:p-6 text-center">
                    <p className="text-sm text-gray-500">No trades found. Start trading today!</p>
                    <Link
                      to="/trades"
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Browse Trades
                    </Link>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="divide-y divide-gray-200">
                      {recentTrades.map((trade) => (
                        <li key={trade.id} className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                                trade.type === 'buy' ? 'bg-green-100' : 'bg-blue-100'
                              }`}>
                                <svg className={`h-5 w-5 ${
                                  trade.type === 'buy' ? 'text-green-600' : 'text-blue-600'
                                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  {trade.type === 'buy' ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  )}
                                </svg>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {trade.type === 'buy' ? 'Bought' : 'Sold'} {trade.amount} {trade.currency}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {formatDate(trade.created_at)}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(trade.price * trade.amount)}
                              </div>
                              <div className="text-sm text-gray-500">
                                @ {formatCurrency(trade.price)} per {trade.currency}
                              </div>
                              <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trade.status)}`}>
                                {trade.status}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link to="/trades" className="font-medium text-orange-600 hover:text-orange-500">
                    View all trades <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Wallet Summary */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Wallet Summary</h3>
              </div>
              <div className="border-t border-gray-200">
                {loading.wallet ? (
                  <div className="px-4 py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading wallet details...</p>
                  </div>
                ) : error.wallet ? (
                  <div className="px-4 py-5 sm:p-6 text-center">
                    <p className="text-sm text-red-500">{error.wallet}</p>
                  </div>
                ) : walletBalances.length === 0 ? (
                  <div className="px-4 py-5 sm:p-6 text-center">
                    <p className="text-sm text-gray-500">No currencies in your wallet. Deposit funds to start trading!</p>
                    <Link
                      to="/wallet"
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Manage Wallet
                    </Link>
                  </div>
                ) : (
                  <div className="px-4 py-5 sm:p-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Currency Distribution</h4>
                    <div className="space-y-4">
                      {walletBalances.map((balance) => (
                        <div key={balance.currency} className="relative pt-1">
                          <div className="flex justify-between items-center mb-1">
                            <div>
                              <span className="text-sm font-medium text-gray-900">{balance.currency}</span>
                              <span className="ml-1 text-xs text-gray-500">
                                ({formatCurrency(balance.amount, balance.currency)})
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatCurrency(balance.usd_value)} ({balance.percentage}%)
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                            <div
                              style={{ width: `${balance.percentage}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500"
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {walletSummary?.recent_transactions && walletSummary.recent_transactions.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-4">Recent Transactions</h4>
                        <div className="flow-root">
                          <ul className="divide-y divide-gray-200">
                            {walletSummary.recent_transactions.map((transaction) => (
                              <li key={transaction.id} className="py-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}>
                                      {transaction.type}
                                    </span>
                                    <div className="ml-3">
                                      <p className="text-sm font-medium text-gray-900">
                                        {transaction.amount} {transaction.currency}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {formatDate(transaction.date)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link to="/wallet" className="font-medium text-orange-600 hover:text-orange-500">
                    Manage wallet <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DashboardPage;