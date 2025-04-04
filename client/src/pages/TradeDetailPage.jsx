import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import WalletAuthContext from '../contexts/WalletAuthContext';

const TradeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(WalletAuthContext);
  
  const [trade, setTrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Fetch trade details and messages
  useEffect(() => {
    const fetchTradeData = async () => {
      try {
        setLoading(true);
        
        // Fetch trade details
        const tradeResponse = await fetch(`/api/trades/${id}`);
        
        if (!tradeResponse.ok) {
          if (tradeResponse.status === 404) {
            throw new Error('Trade not found');
          }
          throw new Error('Failed to fetch trade details');
        }
        
        const tradeData = await tradeResponse.json();
        setTrade(tradeData);
        
        // Fetch messages if authenticated
        if (isAuthenticated) {
          const messagesResponse = await fetch(`/api/trades/${id}/messages`);
          
          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json();
            setMessages(messagesData);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trade data:', err);
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchTradeData();
  }, [id, isAuthenticated]);

  // For demonstration purposes - using a dummy trade object
  useEffect(() => {
    // This is temporary and would be removed once the backend is connected
    const dummyTrade = {
      id: parseInt(id),
      type: 'buy',
      currency: 'BTC',
      amount: 0.125,
      price: 48950,
      total: 6118.75,
      paymentMethods: ['Bank Transfer', 'PayPal'],
      description: 'Looking to buy Bitcoin. I can pay via bank transfer or PayPal. Please have verified account with good reputation. Will release funds promptly after confirmation.',
      terms: 'Please send payment within 30 minutes of trade initiation. I will release the Bitcoin once payment is confirmed.',
      seller: {
        id: 1,
        username: 'cryptotrader99',
        rating: 4.8,
        trades: 124,
        joinedAt: '2023-01-15'
      },
      status: 'open',
      createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    };
    
    // Dummy messages
    const dummyMessages = [
      {
        id: 1,
        tradeId: parseInt(id),
        senderId: 1,
        sender: {
          id: 1,
          username: 'cryptotrader99'
        },
        content: 'Hi, I\'m interested in this trade. Would you be able to do a bank transfer?',
        createdAt: new Date(Date.now() - 3000000).toISOString(),
        isRead: true
      },
      {
        id: 2,
        tradeId: parseInt(id),
        senderId: 2,
        sender: {
          id: 2,
          username: 'btcbuyer42'
        },
        content: 'Yes, I can do a bank transfer. What are your bank details?',
        createdAt: new Date(Date.now() - 2700000).toISOString(),
        isRead: true
      },
      {
        id: 3,
        tradeId: parseInt(id),
        senderId: 1,
        sender: {
          id: 1,
          username: 'cryptotrader99'
        },
        content: 'Great! I\'ll send you the details once you initiate the trade.',
        createdAt: new Date(Date.now() - 2400000).toISOString(),
        isRead: false
      }
    ];
    
    setTrade(dummyTrade);
    setMessages(dummyMessages);
    setLoading(false);
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    try {
      // In a real implementation, this would send to the API
      // For now, just add to the local state
      const newMessage = {
        id: messages.length + 1,
        tradeId: parseInt(id),
        senderId: user?.id || 2, // Default to 2 for demo
        sender: {
          id: user?.id || 2,
          username: user?.username || 'You'
        },
        content: message,
        createdAt: new Date().toISOString(),
        isRead: false
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Scroll chat to bottom
      setTimeout(() => {
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleStartTrade = async () => {
    try {
      // In a real implementation, this would call the API
      alert('Trade initiated! In a real implementation, this would call the API to start the trade.');
      // Redirect to the trade page with updated status
      // navigate(`/trades/${id}`);
    } catch (err) {
      console.error('Error starting trade:', err);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Link to="/trades" className="text-sm font-medium text-red-600 hover:text-red-500">
                  Back to trades
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!trade) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link to="/trades" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          &larr; Back to trades
        </Link>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {/* Trade header */}
        <div className="px-4 py-5 sm:px-6 bg-gray-50 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <span className={`mr-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                trade.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {trade.type === 'buy' ? 'Buy' : 'Sell'}
              </span>
              {trade.amount} {trade.currency} - ${trade.price.toLocaleString()} per {trade.currency}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Posted by {trade.seller.username} on {formatDate(trade.createdAt)}
            </p>
          </div>
          <div>
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
            </span>
          </div>
        </div>
        
        {/* Trade details */}
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Description</h3>
                  <p className="mt-1 text-gray-600">{trade.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Terms and Conditions</h3>
                  <p className="mt-1 text-gray-600">{trade.terms}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {trade.paymentMethods.map((method, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {trade.seller.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{trade.seller.username}</h3>
                    <div className="text-sm text-gray-500 flex items-center">
                      <svg className="h-4 w-4 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1">{trade.seller.rating} ({trade.seller.trades} trades)</span>
                    </div>
                    <p className="text-sm text-gray-500">Member since {new Date(trade.seller.joinedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Price per {trade.currency}:</dt>
                      <dd className="text-sm font-medium text-gray-900">${trade.price.toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Amount:</dt>
                      <dd className="text-sm font-medium text-gray-900">{trade.amount} {trade.currency}</dd>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-gray-200">
                      <dt className="text-base font-medium text-gray-900">Total:</dt>
                      <dd className="text-base font-bold text-indigo-600">${trade.total.toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>
                
                <div className="mt-6">
                  {isAuthenticated ? (
                    <button
                      onClick={handleStartTrade}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Start Trade
                    </button>
                  ) : (
                    <p className="text-center text-sm text-gray-500">
                      You need to <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">connect your wallet</Link> to start this trade.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat section - only visible if authenticated */}
        {isAuthenticated && (
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Messages</h3>
            
            <div id="chat-container" className="bg-gray-50 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No messages yet. Start the conversation!</p>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender.id === (user?.id || 2) ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md rounded-lg px-4 py-2 ${
                        msg.sender.id === (user?.id || 2) 
                          ? 'bg-indigo-100 text-indigo-800' 
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        <div className="text-xs text-gray-500 mb-1">
                          {msg.sender.username} • {formatDate(msg.createdAt)}
                        </div>
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <form onSubmit={handleSendMessage} className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeDetailPage;