import { CURRENCIES } from './constants';

/**
 * Format currency amount based on the currency type
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code
 * @returns {string} - Formatted amount with appropriate precision
 */
export const formatCurrencyAmount = (amount, currency) => {
  if (amount === undefined || amount === null) return '0';
  
  switch(currency) {
    case CURRENCIES.BTC:
      // Show BTC with up to 8 decimal places
      return Number(amount).toFixed(8).replace(/\.?0+$/, '');
    case CURRENCIES.ETH:
      // Show ETH with up to 6 decimal places
      return Number(amount).toFixed(6).replace(/\.?0+$/, '');
    case CURRENCIES.USDT:
    case CURRENCIES.USD:
      // Show USD/USDT with 2 decimal places
      return Number(amount).toFixed(2);
    default:
      return Number(amount).toString();
  }
};

/**
 * Format currency with its symbol
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code
 * @returns {string} - Formatted amount with currency symbol
 */
export const formatCurrencyWithSymbol = (amount, currency) => {
  const formattedAmount = formatCurrencyAmount(amount, currency);
  
  switch(currency) {
    case CURRENCIES.BTC:
      return `₿${formattedAmount}`;
    case CURRENCIES.ETH:
      return `Ξ${formattedAmount}`;
    case CURRENCIES.USDT:
      return `₮${formattedAmount}`;
    case CURRENCIES.USD:
      return `$${formattedAmount}`;
    default:
      return `${formattedAmount} ${currency}`;
  }
};

/**
 * Format date relative to current time (e.g., "2 hours ago")
 * @param {string|Date} date - The date to format
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const pastDate = new Date(date);
  const diffMs = now - pastDate;
  
  // Convert to seconds, minutes, hours, days
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDay < 30) {
    return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
  } else {
    // For older dates, just return the formatted date
    return pastDate.toLocaleDateString();
  }
};

/**
 * Validate an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Truncate text to a specified length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength) => {
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
  if (!name) return '?';
  
  const parts = name.split(' ').filter(part => part.length > 0);
  if (parts.length === 0) return '?';
  
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
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
 * Generate a unique ID (simplified version)
 * @returns {string} - A unique string ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Format price as a locale string
 * @param {number} price - The price to format
 * @returns {string} - Formatted price
 */
export const formatPrice = (price) => {
  if (!price && price !== 0) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};
