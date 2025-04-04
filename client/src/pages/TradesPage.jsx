import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import CreateTradeModal from '../components/modals/CreateTradeModal';

const API_URL = 'http://localhost:8000/api';

function TradesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [buyOffers, setBuyOffers] = useState([]);
  const [sellOffers, setSellOffers] = useState([]);
  const [activeTab, setActiveTab] = useState('buy');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const availableCurrencies = ['BTC', 'ETH', 'XRP', 'USDT', 'USDC', 'XBN'];
  const paymentMethods = [
    { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
    { id: 'mobile_money', name: 'Mobile Money', icon: '📱' },
    { id: 'cash', name: 'Cash', icon: '💵' },
    { id: 'paypal', name: 'PayPal', icon: '💳' },
  ];

  useEffect(() => {
    fetchTrades();
  }, [selectedAsset, activeTab]);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/trades`, {
        params: {
          type: activeTab,
          currency: selectedAsset
        }
      });
      
      if (activeTab === 'buy') {
        setBuyOffers(response.data);
      } else {
        setSellOffers(response.data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching trades:', err);
      setError('Failed to load trade offers. Please try again later.');
      setLoading(false);
      
      // For demo purposes, set sample data
      if (activeTab === 'buy') {
        setBuyOffers([
          {
            id: 1,
            userId: 101,
            username: 'aufait2022',
            completedTrades: 0,
            successRate: 0,
            responseTime: 15,
            price: 0.0001,
            currency: 'BTC',
            amount: 65,
            tokenSymbol: 'XBN',
            paymentMethod: 'bank_transfer',
            minLimit: 0,
            maxLimit: 0.01
          },
          {
            id: 2,
            userId: 102,
            username: 'raqib',
            completedTrades: 2,
            successRate: 50,
            responseTime: 45,
            price: 0.0001,
            currency: 'BTC',
            amount: 8630,
            tokenSymbol: 'XBN',
            paymentMethod: 'mobile_money',
            minLimit: 0,
            maxLimit: 0.86
          },
          {
            id: 3,
            userId: 103,
            username: 'bamall',
            completedTrades: 0,
            successRate: 0,
            responseTime: 70,
            price: 0.0001,
            currency: 'BTC',
            amount: 15000,
            tokenSymbol: 'XBN',
            paymentMethod: 'bank_transfer',
            minLimit: 0,
            maxLimit: 1.5
          }
        ]);
      } else {
        setSellOffers([
          {
            id: 4,
            userId: 104,
            username: 'hilenen',
            completedTrades: 111,
            successRate: 96.4,
            responseTime: 45,
            price: 19,
            currency: 'SLE',
            amount: 190000,
            tokenSymbol: 'XBN',
            paymentMethod: 'bank_transfer',
            minLimit: 290,
            maxLimit: 190000
          },
          {
            id: 5,
            userId: 105,
            username: 'epanty',
            completedTrades: 50,
            successRate: 72,
            responseTime: 45,
            price: 1.5,
            currency: 'XAF',
            amount: 29813,
            tokenSymbol: 'XBN',
            paymentMethod: 'mobile_money',
            minLimit: 1000,
            maxLimit: 29812
          },
          {
            id: 6,
            userId: 106,
            username: 'mrzuby',
            completedTrades: 54,
            successRate: 66.67,
            responseTime: 5,
            price: 2.2,
            currency: 'XAF',
            amount: 35000,
            tokenSymbol: 'XBN',
            paymentMethod: 'cash',
            minLimit: 500,
            maxLimit: 35000
          }
        ]);
      }
    }
  };

  const handleTradeAction = (tradeId, action) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    navigate(`/trades/${tradeId}?action=${action}`);
  };

  const handleCreateTrade = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsCreateModalOpen(true);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const renderTraderInfo = (trader) => (
    <div className="flex items-center space-x-2 mb-2">
      <span className="font-medium">{trader.username}</span>
      {trader.completedTrades > 0 && (
        <>
          <span className="text-gray-400">|</span>
          <span className="text-sm text-gray-600">
            Trades: {trader.completedTrades} | {trader.successRate}% Completion
          </span>
        </>
      )}
      <span className="text-gray-400">|</span>
      <span className="text-sm text-gray-600">
        Response Time: {trader.responseTime < 60 
          ? `${trader.responseTime} Mins` 
          : `${(trader.responseTime / 60).toFixed(1)} Hours`}
      </span>
    </div>
  );

  const renderTradeCard = (trade, action) => (
    <div key={trade.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
      {renderTraderInfo(trade)}
      
      <div className="mb-4">
        <div className="text-lg font-semibold">
          Price
          <p className="text-3xl font-bold">
            {trade.price} {trade.currency}
          </p>
        </div>
      </div>
      
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600">Available</p>
          <p className="font-medium">{formatNumber(trade.amount)} {trade.tokenSymbol}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Limit</p>
          <p className="font-medium">
            {formatNumber(trade.minLimit)} - {formatNumber(trade.maxLimit)} {action === 'buy' ? trade.tokenSymbol : trade.currency}
          </p>
        </div>
      </div>
      
      <button
        onClick={() => handleTradeAction(trade.id, action)}
        className={`w-full py-3 rounded-md font-medium ${
          action === 'buy' 
            ? 'bg-teal-500 text-white hover:bg-teal-600' 
            : 'bg-red-500 text-white hover:bg-red-600'
        }`}
      >
        {action === 'buy' ? `Buy ${trade.tokenSymbol}` : `Sell ${trade.tokenSymbol}`}
      </button>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 pb-10">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex space-x-6">
                <button
                  className={`py-3 font-medium border-b-2 ${
                    activeTab === 'buy'
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('buy')}
                >
                  Buy
                </button>
                <button
                  className={`py-3 font-medium border-b-2 ${
                    activeTab === 'sell'
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('sell')}
                >
                  Sell
                </button>
              </div>
              
              <button
                onClick={handleCreateTrade}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
              >
                + Create Offer
              </button>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select asset
                </label>
                <div className="relative">
                  <select
                    value={selectedAsset}
                    onChange={(e) => setSelectedAsset(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {availableCurrencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">💰</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select payment method
                </label>
                <div className="relative">
                  <select
                    value={selectedPaymentMethod || ''}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value || null)}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All payment methods</option>
                    {paymentMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.icon} {method.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">💳</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'buy' ? (
                buyOffers.length > 0 ? (
                  buyOffers.map((offer) => renderTradeCard(offer, 'buy'))
                ) : (
                  <div className="bg-white p-8 rounded-lg shadow text-center">
                    <p className="text-gray-500 mb-4">No buy offers available for this currency</p>
                    <button
                      onClick={handleCreateTrade}
                      className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                    >
                      Create Buy Offer
                    </button>
                  </div>
                )
              ) : sellOffers.length > 0 ? (
                sellOffers.map((offer) => renderTradeCard(offer, 'sell'))
              ) : (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                  <p className="text-gray-500 mb-4">No sell offers available for this currency</p>
                  <button
                    onClick={handleCreateTrade}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                  >
                    Create Sell Offer
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {isCreateModalOpen && (
        <CreateTradeModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          tradeType={activeTab}
          currencies={availableCurrencies}
          paymentMethods={paymentMethods}
          onCreateTrade={fetchTrades}
        />
      )}
    </Layout>
  );
}

export default TradesPage;