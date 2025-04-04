const express = require('express');
const router = express.Router();
const { db } = require('../data/inMemoryDb');

// Get wallet balances
router.get('/balances', (req, res) => {
  // In a real app, this would get balances for the authenticated user
  const userId = 1; // Mock authenticated user
  
  // Get user's wallet balances
  const balances = db.walletBalances.filter(b => b.userId === userId);
  
  // Format response
  const formattedBalances = balances.map(({ userId, ...balance }) => balance);
  
  res.json(formattedBalances);
});

// Get transaction history
router.get('/transactions', (req, res) => {
  // In a real app, this would get transactions for the authenticated user
  const userId = 1; // Mock authenticated user
  
  // Get user's transactions
  const transactions = db.transactions.filter(t => t.userId === userId);
  
  // Format response
  const formattedTransactions = transactions.map(({ userId, ...transaction }) => transaction);
  
  // Sort by date, newest first
  formattedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  res.json(formattedTransactions);
});

// Deposit funds to wallet
router.post('/deposit', (req, res) => {
  const { amount, currency } = req.body;
  
  // Validate required fields
  if (!amount || !currency) {
    return res.status(400).json({ message: 'Amount and currency are required' });
  }
  
  // Validate amount is positive
  if (parseFloat(amount) <= 0) {
    return res.status(400).json({ message: 'Amount must be greater than zero' });
  }
  
  // In a real app, this would get the authenticated user
  const userId = 1; // Mock authenticated user
  
  // Check if user already has a balance for this currency
  const balanceIndex = db.walletBalances.findIndex(b => 
    b.userId === userId && b.currency === currency
  );
  
  // Calculate USD value based on currency
  const usdValue = calculateUsdValue(parseFloat(amount), currency);
  
  // If balance exists, update it
  if (balanceIndex !== -1) {
    db.walletBalances[balanceIndex].amount += parseFloat(amount);
    db.walletBalances[balanceIndex].usdValue += usdValue;
  } else {
    // Otherwise create a new balance
    db.walletBalances.push({
      userId,
      currency,
      amount: parseFloat(amount),
      usdValue
    });
  }
  
  // Create transaction record
  const newTransaction = {
    id: db.transactions.length + 1,
    userId,
    type: 'deposit',
    amount: parseFloat(amount),
    currency,
    date: new Date().toISOString(),
    details: 'Deposit'
  };
  
  db.transactions.push(newTransaction);
  
  // Get updated balance
  const updatedBalance = db.walletBalances.find(b => 
    b.userId === userId && b.currency === currency
  );
  
  res.status(201).json({
    message: 'Deposit successful',
    currency,
    amount: parseFloat(amount),
    usdValue,
    balance: updatedBalance.amount,
    transaction: {
      id: newTransaction.id,
      type: newTransaction.type,
      amount: newTransaction.amount,
      currency: newTransaction.currency,
      date: newTransaction.date
    }
  });
});

// Withdraw funds from wallet
router.post('/withdraw', (req, res) => {
  const { amount, currency } = req.body;
  
  // Validate required fields
  if (!amount || !currency) {
    return res.status(400).json({ message: 'Amount and currency are required' });
  }
  
  // Validate amount is positive
  if (parseFloat(amount) <= 0) {
    return res.status(400).json({ message: 'Amount must be greater than zero' });
  }
  
  // In a real app, this would get the authenticated user
  const userId = 1; // Mock authenticated user
  
  // Check if user has sufficient balance
  const balance = db.walletBalances.find(b => 
    b.userId === userId && b.currency === currency
  );
  
  if (!balance || balance.amount < parseFloat(amount)) {
    return res.status(400).json({ message: 'Insufficient balance' });
  }
  
  // Calculate USD value based on currency
  const usdValue = calculateUsdValue(parseFloat(amount), currency);
  
  // Update balance
  const balanceIndex = db.walletBalances.findIndex(b => 
    b.userId === userId && b.currency === currency
  );
  
  db.walletBalances[balanceIndex].amount -= parseFloat(amount);
  db.walletBalances[balanceIndex].usdValue -= usdValue;
  
  // Create transaction record
  const newTransaction = {
    id: db.transactions.length + 1,
    userId,
    type: 'withdraw',
    amount: -parseFloat(amount), // Negative amount for withdrawals
    currency,
    date: new Date().toISOString(),
    details: 'Withdrawal'
  };
  
  db.transactions.push(newTransaction);
  
  // Get updated balance
  const updatedBalance = db.walletBalances[balanceIndex];
  
  res.status(201).json({
    message: 'Withdrawal successful',
    currency,
    amount: parseFloat(amount),
    usdValue,
    balance: updatedBalance.amount,
    transaction: {
      id: newTransaction.id,
      type: newTransaction.type,
      amount: newTransaction.amount,
      currency: newTransaction.currency,
      date: newTransaction.date
    }
  });
});

// Helper function to calculate USD value based on currency
function calculateUsdValue(amount, currency) {
  switch(currency) {
    case 'BTC':
      return amount * 40000; // Example BTC price
    case 'ETH':
      return amount * 2800; // Example ETH price
    case 'USDT':
      return amount; // USDT is pegged to USD
    case 'USD':
      return amount;
    default:
      return amount;
  }
}

module.exports = router;
