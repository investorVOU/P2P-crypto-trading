// API URL
export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : 'http://localhost:8000/api';

// Trade statuses
export const TRADE_STATUS = {
  OPEN: 'open',
  IN_ESCROW: 'in_escrow',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed',
};

// Trade types
export const TRADE_TYPES = {
  BUY: 'buy',
  SELL: 'sell',
};

// Supported currencies
export const CURRENCIES = {
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    precision: 8,
    icon: '₿',
  },
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    precision: 6,
    icon: 'Ξ',
  },
  XRP: {
    name: 'Ripple',
    symbol: 'XRP',
    precision: 4,
    icon: 'XRP',
  },
  LTC: {
    name: 'Litecoin',
    symbol: 'LTC',
    precision: 8,
    icon: 'Ł',
  },
  BCH: {
    name: 'Bitcoin Cash',
    symbol: 'BCH',
    precision: 8,
    icon: '₿',
  },
  USDT: {
    name: 'Tether',
    symbol: 'USDT',
    precision: 2,
    icon: '₮',
  },
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
    precision: 2,
    icon: '$',
  },
};

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'venmo', label: 'Venmo' },
  { value: 'cash_app', label: 'Cash App' },
  { value: 'zelle', label: 'Zelle' },
  { value: 'wise', label: 'Wise (formerly TransferWise)' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'cash_in_person', label: 'Cash (in person)' },
];

// Dispute reasons
export const DISPUTE_REASONS = [
  { value: 'payment_not_received', label: 'Payment not received' },
  { value: 'incorrect_payment_amount', label: 'Incorrect payment amount' },
  { value: 'crypto_not_released', label: 'Cryptocurrency not released from escrow' },
  { value: 'seller_unresponsive', label: 'Seller unresponsive' },
  { value: 'buyer_unresponsive', label: 'Buyer unresponsive' },
  { value: 'scam_attempt', label: 'Scam attempt' },
  { value: 'other', label: 'Other (please specify)' },
];

// Transaction types
export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  ESCROW_LOCK: 'escrow_lock',
  ESCROW_RELEASE: 'escrow_release',
  ESCROW_RETURN: 'escrow_return',
  FEE: 'fee',
};

// Routes
export const ROUTES = {
  HOME: '/',
  TRADES: '/trades',
  TRADE_DETAILS: (id) => `/trades/${id}`,
  CREATE_TRADE: '/create-trade',
  DASHBOARD: '/dashboard',
  WALLET: '/dashboard/wallet',
  ADMIN: '/admin',
  ADMIN_DISPUTES: '/admin/disputes',
};

// Error messages
export const ERROR_MESSAGES = {
  DEFAULT: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You need to be logged in to perform this action.',
  FORBIDDEN: 'You don\'t have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER: 'Server error. Our team has been notified.',
  VALIDATION: 'Please check your input and try again.',
};

// Rating labels
export const RATING_LABELS = [
  'Poor',
  'Fair',
  'Good',
  'Very Good',
  'Excellent'
];

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};