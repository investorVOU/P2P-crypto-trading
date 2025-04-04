import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WalletAuthContext from '../contexts/WalletAuthContext';

const CreateTradePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(WalletAuthContext);
  
  const [formData, setFormData] = useState({
    type: 'buy',
    currency: 'BTC',
    amount: '',
    price: '',
    paymentMethods: [],
    description: '',
    terms: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Available options for dropdowns
  const currencies = [
    { value: 'BTC', label: 'Bitcoin (BTC)' },
    { value: 'ETH', label: 'Ethereum (ETH)' },
    { value: 'SOL', label: 'Solana (SOL)' }
  ];
  
  const paymentMethodOptions = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'revolut', label: 'Revolut' },
    { value: 'wise', label: 'Wise (TransferWise)' },
    { value: 'venmo', label: 'Venmo' },
    { value: 'zelle', label: 'Zelle' },
    { value: 'cash_app', label: 'Cash App' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for the field when user makes a change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePaymentMethodChange = (e) => {
    const { value, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      paymentMethods: checked
        ? [...prev.paymentMethods, value]
        : prev.paymentMethods.filter(method => method !== value)
    }));
    
    // Clear error when user makes a selection
    if (errors.paymentMethods) {
      setErrors(prev => ({ ...prev, paymentMethods: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price greater than 0';
    }
    
    if (formData.paymentMethods.length === 0) {
      newErrors.paymentMethods = 'Please select at least one payment method';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a description';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }
    
    if (!formData.terms.trim()) {
      newErrors.terms = 'Please provide your terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Format the data for the API
      const tradeData = {
        ...formData,
        amount: parseFloat(formData.amount),
        price: parseFloat(formData.price),
        total: parseFloat(formData.amount) * parseFloat(formData.price)
      };
      
      // In a real implementation, this would be sent to the API
      console.log('Submitting trade:', tradeData);
      
      // API call would happen here
      // const response = await fetch('/api/trades', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(tradeData),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to create trade');
      // }
      
      // const data = await response.json();
      
      // For now, simulate a successful response
      setTimeout(() => {
        alert('Trade created successfully! In a real implementation, this would redirect to the trade page.');
        navigate('/trades');
      }, 1000);
      
    } catch (err) {
      console.error('Error creating trade:', err);
      setSubmitError(err.message || 'An error occurred while creating the trade');
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    if (formData.amount && formData.price) {
      const amount = parseFloat(formData.amount);
      const price = parseFloat(formData.price);
      
      if (!isNaN(amount) && !isNaN(price)) {
        return (amount * price).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }
    }
    
    return '0.00';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link to="/trades" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          &larr; Back to trades
        </Link>
      </div>
      
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Create a New Trade</h3>
            <p className="mt-1 text-sm text-gray-600">
              Post a new trade offer to buy or sell cryptocurrency.
            </p>
            
            <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">Tips for a successful trade:</h4>
              <ul className="mt-2 text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Be specific about your payment methods and requirements.
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Clearly state your terms and time limits for payment.
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Set a competitive price to attract more traders.
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                {/* Trade Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Trade Type
                  </label>
                  <div className="mt-2">
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <input
                          id="type-buy"
                          name="type"
                          type="radio"
                          value="buy"
                          checked={formData.type === 'buy'}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                        <label htmlFor="type-buy" className="ml-2 block text-sm text-gray-700">
                          I want to buy
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="type-sell"
                          name="type"
                          type="radio"
                          value="sell"
                          checked={formData.type === 'sell'}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                        <label htmlFor="type-sell" className="ml-2 block text-sm text-gray-700">
                          I want to sell
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Currency */}
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                    Cryptocurrency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    {currencies.map(currency => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount and Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Amount
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="amount"
                        id="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md ${
                          errors.amount ? 'border-red-300' : ''
                        }`}
                        placeholder="0.00"
                        aria-describedby="amount-currency"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm" id="amount-currency">
                          {formData.currency}
                        </span>
                      </div>
                    </div>
                    {errors.amount && (
                      <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price per {formData.currency}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="text"
                        name="price"
                        id="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md ${
                          errors.price ? 'border-red-300' : ''
                        }`}
                        placeholder="0.00"
                        aria-describedby="price-currency"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm" id="price-currency">
                          USD
                        </span>
                      </div>
                    </div>
                    {errors.price && (
                      <p className="mt-2 text-sm text-red-600">{errors.price}</p>
                    )}
                  </div>
                </div>

                {/* Total (calculated) */}
                <div className="bg-gray-50 px-4 py-3 sm:rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-indigo-600">${calculateTotal()}</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Methods
                  </label>
                  <div className="mt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {paymentMethodOptions.map(option => (
                        <div key={option.value} className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id={`payment-${option.value}`}
                              name="paymentMethods"
                              type="checkbox"
                              value={option.value}
                              checked={formData.paymentMethods.includes(option.value)}
                              onChange={handlePaymentMethodChange}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor={`payment-${option.value}`} className="font-medium text-gray-700">
                              {option.label}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {errors.paymentMethods && (
                    <p className="mt-2 text-sm text-red-600">{errors.paymentMethods}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.description ? 'border-red-300' : ''
                      }`}
                      placeholder="Describe your trade requirements, preferred payment details, etc."
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Brief description of your trade requirements.
                  </p>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div>
                  <label htmlFor="terms" className="block text-sm font-medium text-gray-700">
                    Terms and Conditions
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="terms"
                      name="terms"
                      rows={3}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.terms ? 'border-red-300' : ''
                      }`}
                      placeholder="Specify your terms, time limits for payment, etc."
                      value={formData.terms}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Specify your terms for this transaction.
                  </p>
                  {errors.terms && (
                    <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
                  )}
                </div>
              </div>

              {/* Submit Error Message */}
              {submitError && (
                <div className="px-4 py-3 bg-red-50 sm:px-6">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-red-800">{submitError}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Trade...
                    </>
                  ) : (
                    'Create Trade'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTradePage;