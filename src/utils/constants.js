// API Constants
export const API_BASE_URL = 'http://localhost:8000/api';

// Trade Status Constants
export const TRADE_STATUS = {
  OPEN: 'open',
  IN_ESCROW: 'in_escrow',
  COMPLETED: 'completed',
  DISPUTED: 'disputed',
  CANCELLED: 'cancelled'
};

// Trade Types
export const TRADE_TYPES = {
  BUY: 'buy',
  SELL: 'sell'
};

// Currencies
export const CURRENCIES = {
  BTC: 'BTC',
  ETH: 'ETH',
  USDT: 'USDT',
  USD: 'USD'
};

// Payment Methods
export const PAYMENT_METHODS = [
  'Bank Transfer',
  'Credit Card',
  'PayPal',
  'Venmo',
  'Cash App',
  'Western Union',
  'MoneyGram'
];

// Dispute Reasons
export const DISPUTE_REASONS = [
  { value: 'non_payment', label: 'Non-payment' },
  { value: 'payment_issues', label: 'Payment issues' },
  { value: 'seller_not_responding', label: 'Seller not responding' },
  { value: 'buyer_not_responding', label: 'Buyer not responding' },
  { value: 'terms_disagreement', label: 'Terms disagreement' },
  { value: 'fraud', label: 'Fraudulent activity' },
  { value: 'other', label: 'Other' }
];

// Transaction Types
export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  TRADE: 'trade'
};

// Authentication
export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user_data';

// App Routes
export const ROUTES = {
  HOME: 'Home',
  TRADE_DETAILS: 'TradeDetails',
  CHAT: 'Chat',
  WALLET: 'Wallet',
  PROFILE: 'Profile',
  DISPUTE: 'Dispute',
  ADMIN_DASHBOARD: 'AdminDashboard',
  TRADES_OVERVIEW: 'TradesOverview',
  DISPUTES_OVERVIEW: 'DisputesOverview'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  AUTHENTICATION_ERROR: 'Authentication failed. Please login again.',
  TRADE_CREATION_ERROR: 'Failed to create trade. Please try again.',
  TRADE_UPDATE_ERROR: 'Failed to update trade. Please try again.',
  DISPUTE_CREATION_ERROR: 'Failed to create dispute. Please try again.',
  WALLET_ERROR: 'Failed to fetch wallet data. Please try again.'
};

// Rating Labels
export const RATING_LABELS = [
  'Poor',
  'Fair',
  'Good',
  'Very Good',
  'Excellent'
];

// Admin Role
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};
