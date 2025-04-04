import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function CreateTradeModal({ isOpen, onClose, tradeType, currencies, paymentMethods, onCreateTrade }) {
  const { user } = useSelector((state) => state.auth);
  
  const [formState, setFormState] = useState({
    type: tradeType, // 'buy' or 'sell'
    currency: currencies[0],
    tokenSymbol: 'XBN',
    price: '',
    amount: '',
    minLimit: '',
    maxLimit: '',
    paymentMethod: paymentMethods[0]?.id || '',
    terms: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        ...formState,
        userId: user.id,
        status: 'open'
      };
      
      const response = await axios.post(`${API_URL}/trades`, payload);
      
      setSuccess(true);
      setLoading(false);
      
      // Refresh trade list after creation
      if (onCreateTrade) {
        setTimeout(() => {
          onCreateTrade();
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating trade:', err);
      setError(err.response?.data?.message || 'Failed to create trade offer');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Create {tradeType === 'buy' ? 'Buy' : 'Sell'} Offer
                </h3>
                
                {success ? (
                  <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          Trade offer created successfully! Redirecting...
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-4">
                    {error && (
                      <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                        <div className="text-sm text-red-700">{error}</div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                          Currency
                        </label>
                        <select
                          id="currency"
                          name="currency"
                          value={formState.currency}
                          onChange={handleChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                          required
                        >
                          {currencies.map(currency => (
                            <option key={currency} value={currency}>
                              {currency}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="tokenSymbol" className="block text-sm font-medium text-gray-700 mb-1">
                          Token
                        </label>
                        <input
                          type="text"
                          id="tokenSymbol"
                          name="tokenSymbol"
                          value={formState.tokenSymbol}
                          onChange={handleChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price per {formState.tokenSymbol} (in {formState.currency})
                      </label>
                      <input
                        type="number"
                        step="0.00000001"
                        id="price"
                        name="price"
                        value={formState.price}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Total Amount ({formState.tokenSymbol})
                      </label>
                      <input
                        type="number"
                        step="0.00000001"
                        id="amount"
                        name="amount"
                        value={formState.amount}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="minLimit" className="block text-sm font-medium text-gray-700 mb-1">
                          Min Limit ({tradeType === 'buy' ? formState.tokenSymbol : formState.currency})
                        </label>
                        <input
                          type="number"
                          step="0.00000001"
                          id="minLimit"
                          name="minLimit"
                          value={formState.minLimit}
                          onChange={handleChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="maxLimit" className="block text-sm font-medium text-gray-700 mb-1">
                          Max Limit ({tradeType === 'buy' ? formState.tokenSymbol : formState.currency})
                        </label>
                        <input
                          type="number"
                          step="0.00000001"
                          id="maxLimit"
                          name="maxLimit"
                          value={formState.maxLimit}
                          onChange={handleChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method
                      </label>
                      <select
                        id="paymentMethod"
                        name="paymentMethod"
                        value={formState.paymentMethod}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                        required
                      >
                        {paymentMethods.map(method => (
                          <option key={method.id} value={method.id}>
                            {method.icon} {method.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-1">
                        Trade Terms
                      </label>
                      <textarea
                        id="terms"
                        name="terms"
                        rows="3"
                        value={formState.terms}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Describe your payment details and any specific instructions..."
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end mt-6 space-x-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      
                      <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                          loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Creating...
                          </div>
                        ) : (
                          'Create Offer'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTradeModal;