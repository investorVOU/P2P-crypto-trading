const express = require('express');
const router = express.Router();
const { query } = require('../db');

// Calculate USD value for a cryptocurrency amount
function calculateUsdValue(amount, currency) {
  // In a real application, this would fetch from a price API
  const rates = {
    'BTC': 25000,
    'ETH': 1800,
    'USDT': 1,
    'USDC': 1,
    'XRP': 0.5,
    'SOL': 50,
    'ADA': 0.3,
    'DOT': 5
  };
  
  const rate = rates[currency] || 0;
  return amount * rate;
}

// Get wallet balances for the authenticated user
router.get('/balances', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await query(
      'SELECT * FROM wallet_balances WHERE user_id = $1',
      [userId]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching wallet balances:', err);
    res.status(500).json({ message: 'Failed to fetch wallet balances' });
  }
});

// Get transaction history for the authenticated user
router.get('/transactions', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
      [userId]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

// Deposit funds to wallet
router.post('/deposit', async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, currency } = req.body;
    
    // Validate input
    if (!amount || !currency) {
      return res.status(400).json({ message: 'Amount and currency are required' });
    }
    
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    
    // Convert to numeric
    const numericAmount = parseFloat(amount);
    
    // Calculate USD value
    const usdValue = calculateUsdValue(numericAmount, currency);
    
    // Start a transaction
    await query('BEGIN');
    
    // Check if wallet balance exists for this currency
    const walletResult = await query(
      'SELECT * FROM wallet_balances WHERE user_id = $1 AND currency = $2',
      [userId, currency]
    );
    
    let balanceId;
    let newBalance;
    
    if (walletResult.rows.length > 0) {
      // Update existing balance
      const currentBalance = walletResult.rows[0];
      newBalance = parseFloat(currentBalance.amount) + numericAmount;
      const newUsdValue = calculateUsdValue(newBalance, currency);
      
      const updateResult = await query(
        'UPDATE wallet_balances SET amount = $1, usd_value = $2 WHERE id = $3 RETURNING *',
        [newBalance, newUsdValue, currentBalance.id]
      );
      
      balanceId = currentBalance.id;
    } else {
      // Create new balance
      const insertResult = await query(
        'INSERT INTO wallet_balances (user_id, currency, amount, usd_value) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, currency, numericAmount, usdValue]
      );
      
      balanceId = insertResult.rows[0].id;
      newBalance = numericAmount;
    }
    
    // Record transaction
    const transactionResult = await query(
      'INSERT INTO transactions (user_id, type, amount, currency, details) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, 'deposit', numericAmount, currency, 'Deposit to wallet']
    );
    
    // Commit transaction
    await query('COMMIT');
    
    res.status(201).json({
      balance: {
        currency,
        amount: newBalance,
        usd_value: calculateUsdValue(newBalance, currency)
      },
      transaction: transactionResult.rows[0]
    });
  } catch (err) {
    // Rollback in case of error
    await query('ROLLBACK');
    console.error('Error depositing funds:', err);
    res.status(500).json({ message: 'Failed to deposit funds' });
  }
});

// Withdraw funds from wallet
router.post('/withdraw', async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, currency, address } = req.body;
    
    // Validate input
    if (!amount || !currency) {
      return res.status(400).json({ message: 'Amount and currency are required' });
    }
    
    if (!address) {
      return res.status(400).json({ message: 'Withdrawal address is required' });
    }
    
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    
    // Convert to numeric
    const numericAmount = parseFloat(amount);
    
    // Start a transaction
    await query('BEGIN');
    
    // Check if wallet balance exists and has enough funds
    const walletResult = await query(
      'SELECT * FROM wallet_balances WHERE user_id = $1 AND currency = $2',
      [userId, currency]
    );
    
    if (walletResult.rows.length === 0) {
      await query('ROLLBACK');
      return res.status(400).json({ message: 'No balance for this currency' });
    }
    
    const currentBalance = walletResult.rows[0];
    if (parseFloat(currentBalance.amount) < numericAmount) {
      await query('ROLLBACK');
      return res.status(400).json({ message: 'Insufficient funds' });
    }
    
    // Update balance
    const newBalance = parseFloat(currentBalance.amount) - numericAmount;
    const newUsdValue = calculateUsdValue(newBalance, currency);
    
    await query(
      'UPDATE wallet_balances SET amount = $1, usd_value = $2 WHERE id = $3',
      [newBalance, newUsdValue, currentBalance.id]
    );
    
    // Record transaction
    const details = `Withdrawal to address: ${address}`;
    const transactionResult = await query(
      'INSERT INTO transactions (user_id, type, amount, currency, details) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, 'withdrawal', numericAmount, currency, details]
    );
    
    // Commit transaction
    await query('COMMIT');
    
    res.status(201).json({
      balance: {
        currency,
        amount: newBalance,
        usd_value: newUsdValue
      },
      transaction: transactionResult.rows[0]
    });
  } catch (err) {
    // Rollback in case of error
    await query('ROLLBACK');
    console.error('Error withdrawing funds:', err);
    res.status(500).json({ message: 'Failed to withdraw funds' });
  }
});

// Transfer funds from wallet to escrow for a trade
router.post('/transfer-to-escrow/:tradeId', async (req, res) => {
  try {
    const userId = req.user.id;
    const tradeId = req.params.tradeId;
    
    // Get trade details
    const tradeResult = await query(
      'SELECT * FROM trades WHERE id = $1',
      [tradeId]
    );
    
    if (tradeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    
    const trade = tradeResult.rows[0];
    
    // Verify user is involved in this trade
    if (trade.user_id !== userId && trade.counterparty_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to access this trade' });
    }
    
    // Check if trade is in appropriate status
    if (trade.status !== 'pending') {
      return res.status(400).json({ message: 'Trade must be in pending status to transfer to escrow' });
    }
    
    const amount = parseFloat(trade.amount);
    const currency = trade.currency;
    
    // Start a transaction
    await query('BEGIN');
    
    // Check if wallet balance exists and has enough funds
    const walletResult = await query(
      'SELECT * FROM wallet_balances WHERE user_id = $1 AND currency = $2',
      [userId, currency]
    );
    
    if (walletResult.rows.length === 0) {
      await query('ROLLBACK');
      return res.status(400).json({ message: 'No balance for this currency' });
    }
    
    const currentBalance = walletResult.rows[0];
    if (parseFloat(currentBalance.amount) < amount) {
      await query('ROLLBACK');
      return res.status(400).json({ message: 'Insufficient funds' });
    }
    
    // Update wallet balance
    const newBalance = parseFloat(currentBalance.amount) - amount;
    const newUsdValue = calculateUsdValue(newBalance, currency);
    
    await query(
      'UPDATE wallet_balances SET amount = $1, usd_value = $2 WHERE id = $3',
      [newBalance, newUsdValue, currentBalance.id]
    );
    
    // Update trade status to 'active'
    await query(
      'UPDATE trades SET status = $1 WHERE id = $2',
      ['active', tradeId]
    );
    
    // Record transaction
    const details = `Transfer to escrow for trade #${tradeId}`;
    const transactionResult = await query(
      'INSERT INTO transactions (user_id, type, amount, currency, details) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, 'escrow', amount, currency, details]
    );
    
    // Commit transaction
    await query('COMMIT');
    
    res.status(201).json({
      balance: {
        currency,
        amount: newBalance,
        usd_value: newUsdValue
      },
      trade: {
        id: tradeId,
        status: 'active'
      },
      transaction: transactionResult.rows[0]
    });
  } catch (err) {
    // Rollback in case of error
    await query('ROLLBACK');
    console.error('Error transferring to escrow:', err);
    res.status(500).json({ message: 'Failed to transfer funds to escrow' });
  }
});

// Get total wallet USD value
router.get('/total-balance', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await query(
      'SELECT SUM(usd_value) as total_usd_value FROM wallet_balances WHERE user_id = $1',
      [userId]
    );
    
    const totalUsdValue = result.rows[0]?.total_usd_value || 0;
    
    res.json({ total_usd_value: totalUsdValue });
  } catch (err) {
    console.error('Error fetching total balance:', err);
    res.status(500).json({ message: 'Failed to fetch total balance' });
  }
});

// Get wallet summary with distribution
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all balances
    const balancesResult = await query(
      'SELECT currency, amount, usd_value FROM wallet_balances WHERE user_id = $1',
      [userId]
    );
    
    const balances = balancesResult.rows;
    
    // Calculate total USD value
    const totalUsdValue = balances.reduce((sum, balance) => sum + parseFloat(balance.usd_value), 0);
    
    // Calculate percentage distribution
    const distribution = balances.map(balance => {
      const percentage = totalUsdValue > 0 
        ? (parseFloat(balance.usd_value) / totalUsdValue) * 100 
        : 0;
      
      return {
        currency: balance.currency,
        amount: parseFloat(balance.amount),
        usd_value: parseFloat(balance.usd_value),
        percentage: parseFloat(percentage.toFixed(2))
      };
    });
    
    // Get recent transactions
    const transactionsResult = await query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC LIMIT 5',
      [userId]
    );
    
    const summary = {
      total_usd_value: totalUsdValue,
      distribution,
      recent_transactions: transactionsResult.rows
    };
    
    res.json(summary);
  } catch (err) {
    console.error('Error fetching wallet summary:', err);
    res.status(500).json({ message: 'Failed to fetch wallet summary' });
  }
});

module.exports = router;