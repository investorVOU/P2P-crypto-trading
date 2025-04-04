import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define API base URL
const API_URL = '/api';

// Async thunks for wallet
export const fetchWalletBalances = createAsyncThunk(
  'wallet/fetchWalletBalances',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/wallet/balances`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch wallet balances.'
      );
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/wallet/transactions`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch transactions.'
      );
    }
  }
);

export const depositFunds = createAsyncThunk(
  'wallet/depositFunds',
  async ({ currency, amount }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/wallet/deposit`, {
        currency,
        amount: parseFloat(amount)
      }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to deposit funds.'
      );
    }
  }
);

export const withdrawFunds = createAsyncThunk(
  'wallet/withdrawFunds',
  async ({ currency, amount, address }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/wallet/withdraw`, {
        currency,
        amount: parseFloat(amount),
        address
      }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to withdraw funds.'
      );
    }
  }
);

// Initial state
const initialState = {
  balances: [],
  transactions: [],
  isLoading: false,
  error: null,
  transactionInProgress: false
};

// Wallet slice
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    resetWalletError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wallet Balances cases
      .addCase(fetchWalletBalances.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWalletBalances.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balances = action.payload;
      })
      .addCase(fetchWalletBalances.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Transactions cases
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Deposit Funds cases
      .addCase(depositFunds.pending, (state) => {
        state.transactionInProgress = true;
        state.error = null;
      })
      .addCase(depositFunds.fulfilled, (state, action) => {
        state.transactionInProgress = false;
        
        // Update balances if returned in the response
        if (action.payload.balance) {
          const index = state.balances.findIndex(
            b => b.currency === action.payload.balance.currency
          );
          
          if (index !== -1) {
            state.balances[index] = action.payload.balance;
          } else {
            state.balances.push(action.payload.balance);
          }
        }
        
        // Add transaction to history if returned
        if (action.payload.transaction) {
          state.transactions.unshift(action.payload.transaction);
        }
      })
      .addCase(depositFunds.rejected, (state, action) => {
        state.transactionInProgress = false;
        state.error = action.payload;
      })
      
      // Withdraw Funds cases
      .addCase(withdrawFunds.pending, (state) => {
        state.transactionInProgress = true;
        state.error = null;
      })
      .addCase(withdrawFunds.fulfilled, (state, action) => {
        state.transactionInProgress = false;
        
        // Update balances if returned in the response
        if (action.payload.balance) {
          const index = state.balances.findIndex(
            b => b.currency === action.payload.balance.currency
          );
          
          if (index !== -1) {
            state.balances[index] = action.payload.balance;
          }
        }
        
        // Add transaction to history if returned
        if (action.payload.transaction) {
          state.transactions.unshift(action.payload.transaction);
        }
      })
      .addCase(withdrawFunds.rejected, (state, action) => {
        state.transactionInProgress = false;
        state.error = action.payload;
      });
  },
});

export const { resetWalletError } = walletSlice.actions;

export default walletSlice.reducer;
