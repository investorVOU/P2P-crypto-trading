import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import WalletConnectButton from '../components/WalletConnectButton';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function HomePage() {
  const [featuredTrades, setFeaturedTrades] = useState([]);
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalTrades: 0,
    completedTrades: 0,
    tradeVolume: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch featured trades and statistics
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // In a real application, you would fetch real data from your API
        // const response = await axios.get(`${API_URL}/home-data`);
        // setFeaturedTrades(response.data.featuredTrades);
        // setStatistics(response.data.statistics);
        
        // For demo purposes, using mock data
        setTimeout(() => {
          setFeaturedTrades([
            {
              id: 1,
              type: 'buy',
              currency: 'BTC',
              price: 25000,
              amount: 0.5,
              paymentMethod: 'Bank Transfer',
              username: 'bitcoin_trader',
              status: 'active',
              rating: 4.8
            },
            {
              id: 2,
              type: 'sell',
              currency: 'ETH',
              price: 1800,
              amount: 3.2,
              paymentMethod: 'PayPal',
              username: 'crypto_king',
              status: 'active',
              rating: 4.6
            },
            {
              id: 3,
              type: 'buy',
              currency: 'BTC',
              price: 24900,
              amount: 0.25,
              paymentMethod: 'Bank Transfer',
              username: 'hodler123',
              status: 'active',
              rating: 4.9
            }
          ]);
          
          setStatistics({
            totalUsers: 10234,
            totalTrades: 54321,
            completedTrades: 49876,
            tradeVolume: 153000000
          });
          
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Peer-to-Peer Cryptocurrency Trading
              </h1>
              <p className="mt-6 text-xl max-w-3xl">
                Buy and sell cryptocurrencies directly with other users. Fast, secure, and commission-free trading with our escrow service.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <WalletConnectButton 
                  buttonText="Connect Wallet"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-orange-700 bg-white hover:bg-gray-50"
                />
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-orange-800"
                >
                  Get Started
                </Link>
                <Link
                  to="/trades"
                  className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-orange-800"
                >
                  Browse Trades
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <div className="pl-4 -mb-16 sm:pl-6 md:-mb-20 lg:mb-0 lg:pl-0">
                <img
                  className="w-full max-w-md mx-auto"
                  src="/assets/hero-image.svg"
                  alt="Trading Platform"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/600x400?text=Trading+Platform';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white pt-12 sm:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Trusted by traders worldwide
            </h2>
            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
              Our P2P platform connects cryptocurrency buyers and sellers in a secure environment
            </p>
          </div>
        </div>
        <div className="mt-10 pb-12 bg-white sm:pb-16">
          <div className="relative">
            <div className="absolute inset-0 h-1/2 bg-gray-50"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-4">
                  <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Users</dt>
                    <dd className="order-1 text-3xl font-extrabold text-orange-600">
                      {loading ? (
                        <div className="animate-pulse bg-gray-200 h-8 w-24 mx-auto rounded"></div>
                      ) : (
                        `${(statistics.totalUsers / 1000).toFixed(1)}k+`
                      )}
                    </dd>
                  </div>
                  <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Total Trades</dt>
                    <dd className="order-1 text-3xl font-extrabold text-orange-600">
                      {loading ? (
                        <div className="animate-pulse bg-gray-200 h-8 w-24 mx-auto rounded"></div>
                      ) : (
                        `${(statistics.totalTrades / 1000).toFixed(1)}k+`
                      )}
                    </dd>
                  </div>
                  <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Success Rate</dt>
                    <dd className="order-1 text-3xl font-extrabold text-orange-600">
                      {loading ? (
                        <div className="animate-pulse bg-gray-200 h-8 w-24 mx-auto rounded"></div>
                      ) : (
                        `${((statistics.completedTrades / statistics.totalTrades) * 100).toFixed(1)}%`
                      )}
                    </dd>
                  </div>
                  <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Volume</dt>
                    <dd className="order-1 text-3xl font-extrabold text-orange-600">
                      {loading ? (
                        <div className="animate-pulse bg-gray-200 h-8 w-24 mx-auto rounded"></div>
                      ) : (
                        `$${(statistics.tradeVolume / 1000000).toFixed(1)}M+`
                      )}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Trades Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <h2 className="text-2xl font-extrabold text-gray-900">Featured Trades</h2>
            <Link
              to="/trades"
              className="hidden text-sm font-semibold text-orange-600 hover:text-orange-500 sm:block"
            >
              Browse all trades<span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>

          {loading ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
                  <div className="p-5">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="bg-gray-100 px-5 py-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6 text-center">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredTrades.map((trade) => (
                <div key={trade.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {trade.type === 'buy' ? 'Buy' : 'Sell'} {trade.currency}
                      </div>
                      <div className="flex items-center">
                        <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm text-gray-500">{trade.rating}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-lg font-medium text-gray-900">{trade.amount} {trade.currency}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Price: ${trade.price.toLocaleString()} / {trade.currency}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Payment: {trade.paymentMethod}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Trader: {trade.username}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="text-sm">
                      <Link
                        to={`/trades/${trade.id}`}
                        className="font-medium text-orange-600 hover:text-orange-500"
                      >
                        View details<span aria-hidden="true"> &rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/trades"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:hidden"
            >
              Browse all trades
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Safe and secure cryptocurrency trading in just a few simple steps
            </p>
          </div>

          <div className="mt-16">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              <div>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    1. Find a Trade
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Browse through available buy or sell offers for various cryptocurrencies and
                    choose the one that meets your requirements.
                  </p>
                </div>
              </div>

              <div className="mt-10 lg:mt-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    2. Start Trading
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Initiate the trade and communicate with your trading partner. Cryptocurrencies
                    are held in our secure escrow system during the transaction.
                  </p>
                </div>
              </div>

              <div className="mt-10 lg:mt-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    3. Complete the Exchange
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Once payment is confirmed, cryptocurrencies are released from escrow to the
                    buyer. Leave feedback for your trading partner.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-orange-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start trading?</span>
            <span className="block text-orange-300">Create an account and get started today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-orange-600 bg-white hover:bg-gray-50"
              >
                Sign up
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/trades"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500"
              >
                Browse Trades
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;