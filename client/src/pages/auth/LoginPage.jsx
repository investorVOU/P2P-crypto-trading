import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../features/auth/authSlice';
import Layout from '../../components/Layout';
import axios from 'axios';
import { ethers } from 'ethers';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth) || {};
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const { user } = useSelector((state) => state.auth) || {};
      if (user?.is_admin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };
  
  const connectWallet = async () => {
    if (!window.ethereum) {
      setWalletError('No Ethereum wallet detected. Please install MetaMask or another Web3 wallet.');
      return;
    }
    
    setWalletLoading(true);
    setWalletError(null);
    
    try {
      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];
      
      if (!address) {
        throw new Error('No account selected');
      }
      
      // Get nonce from server
      const nonceResponse = await axios.get(`/api/wallet/nonce/${address}`);
      const { nonce } = nonceResponse.data;
      
      // Sign the nonce with the wallet
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(nonce);
      
      // Authenticate with the server
      const authResponse = await axios.post('/api/wallet/auth', {
        address,
        signature
      });
      
      // Handle successful authentication
      if (authResponse.status === 200) {
        dispatch({ 
          type: 'auth/login/fulfilled', 
          payload: authResponse.data 
        });
        
        // Redirect based on user role
        if (authResponse.data.is_admin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setWalletError(err.response?.data || err.message || 'Error connecting wallet');
    } finally {
      setWalletLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Form Column */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
          <div className="mx-auto w-full max-w-sm">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Or{' '}
                <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500">
                  create a new account
                </Link>
              </p>
            </div>
            
            {/* Admin login info */}
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Admin users will automatically be redirected to the admin dashboard after login.
                  </p>
                  <p className="text-xs mt-1 text-blue-700">
                    <strong>Demo Admin:</strong> username: <code className="bg-blue-100 px-1 rounded">admin</code>, password: <code className="bg-blue-100 px-1 rounded">password</code>
                  </p>
                </div>
              </div>
            </div>

            {(error || walletError) && (
              <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error || walletError}</p>
                  </div>
                </div>
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                    loading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  onClick={connectWallet}
                  disabled={walletLoading}
                  className={`w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                    walletLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {walletLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting wallet...
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4C2.89543 4 2 4.89543 2 6V7H18V6C18 4.89543 17.1046 4 16 4H4Z" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M18 9H2V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V9ZM4 13C4 12.4477 4.44772 12 5 12H6C6.55228 12 7 12.4477 7 13C7 13.5523 6.55228 14 6 14H5C4.44772 14 4 13.5523 4 13ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H10C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12H9Z" />
                      </svg>
                      Connect Wallet
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Column */}
        <div className="hidden lg:block lg:flex-1 bg-orange-600 relative">
          <div className="absolute inset-0 flex flex-col justify-center p-12 text-white">
            <div>
              <img 
                src="/assets/logo-white.svg"
                alt="Timbuktu Logo"
                className="h-10 mb-8" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
              
              <h2 className="text-3xl font-bold mb-6">
                Buy & Sell Blockchain Tokens in minutes
              </h2>
              
              <p className="text-lg mb-8 opacity-90">
                The trusted P2P platform for trading cryptocurrencies with local payment methods. 
                Trade safely with our secure escrow system.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-full p-2 mr-3">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Non-Custodial Platform</span>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-full p-2 mr-3">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Fast & Secure Transactions</span>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-full p-2 mr-3">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Fully Peer to Peer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default LoginPage;