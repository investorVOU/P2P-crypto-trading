import { CURRENCIES } from './constants';

/**
 * Format currency amount based on the currency type
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code
 * @returns {string} - Formatted amount with appropriate precision
 */
export const formatCurrencyAmount = (amount, currency) => {
  if (amount === undefined || amount === null) return '0';
  
  const precision = CURRENCIES[currency]?.precision || 2;
  return Number(amount).toFixed(precision);
};

/**
 * Format currency with its symbol
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code
 * @returns {string} - Formatted amount with currency symbol
 */
export const formatCurrencyWithSymbol = (amount, currency) => {
  if (amount === undefined || amount === null) return '0';
  
  const formatted = formatCurrencyAmount(amount, currency);
  const currencyInfo = CURRENCIES[currency] || { symbol: currency };
  
  return `${formatted} ${currencyInfo.symbol}`;
};

/**
 * Format fiat currency amount
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (e.g., 'USD')
 * @returns {string} - Formatted amount as a locale string
 */
export const formatFiatAmount = (amount, currency = 'USD') => {
  if (amount === undefined || amount === null) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date relative to current time (e.g., "2 hours ago")
 * @param {string|Date} date - The date to format
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const dateObj = new Date(date);
  const diffMs = now - dateObj;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return `${diffSec} second${diffSec !== 1 ? 's' : ''} ago`;
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
  } else if (diffDay < 30) {
    return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
  } else {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
};

/**
 * Format a timestamp to standard date/time format
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} - Formatted date/time
 */
export const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Truncate text to a specified length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 30) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get initials from a name
 * @param {string} name - The name to get initials from
 * @returns {string} - The initials (up to 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return '';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
};

/**
 * Calculate total USD value of all balances
 * @param {Array} balances - Array of balance objects
 * @returns {number} - Total USD value
 */
export const calculateTotalUsdValue = (balances) => {
  if (!balances || !Array.isArray(balances)) return 0;
  
  return balances.reduce((total, balance) => {
    return total + (balance.usdValue || 0);
  }, 0);
};

/**
 * Get appropriate color class based on transaction type
 * @param {string} type - Transaction type
 * @returns {string} - Tailwind CSS color class
 */
export const getTransactionTypeColor = (type) => {
  const colorMap = {
    deposit: 'text-green-600',
    withdrawal: 'text-red-600',
    escrow_lock: 'text-yellow-600',
    escrow_release: 'text-green-600',
    escrow_return: 'text-blue-600',
    fee: 'text-gray-600',
  };
  
  return colorMap[type] || 'text-gray-700';
};

/**
 * Format wallet address for display (truncated)
 * @param {string} address - Ethereum/wallet address
 * @returns {string} - Truncated address
 */
export const formatWalletAddress = (address) => {
  if (!address) return '';
  if (address.length <= 12) return address;
  
  const start = address.substring(0, 6);
  const end = address.substring(address.length - 4);
  return `${start}...${end}`;
};