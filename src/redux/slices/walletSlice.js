import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Async thunks
export const fetchWallet = createAsyncThunk(
  'wallet/fetchWallet',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wallet/balances');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wallet/transactions');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deposit = createAsyncThunk(
  'wallet/deposit',
  async (depositData, { rejectWithValue }) => {
    try {
      const response = await api.post('/wallet/deposit', depositData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const withdraw = createAsyncThunk(
  'wallet/withdraw',
  async (withdrawData, { rejectWithValue }) => {
    try {
      const response = await api.post('/wallet/withdraw', withdrawData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  balances: [],
  transactions: [],
  status: 'idle',
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearWalletError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wallet balances
      .addCase(fetchWallet.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.balances = action.payload;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch wallet balances';
      })
      
      // Fetch transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch transactions';
      })
      
      // Deposit
      .addCase(deposit.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deposit.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // Update balance for the deposited currency
        const index = state.balances.findIndex(b => b.currency === action.payload.currency);
        if (index !== -1) {
          state.balances[index].amount += action.payload.amount;
          state.balances[index].usdValue += action.payload.usdValue;
        } else {
          state.balances.push({
            currency: action.payload.currency,
            amount: action.payload.amount,
            usdValue: action.payload.usdValue
          });
        }
        
        // Add transaction to history
        state.transactions.unshift(action.payload.transaction);
      })
      .addCase(deposit.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to deposit funds';
      })
      
      // Withdraw
      .addCase(withdraw.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(withdraw.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // Update balance for the withdrawn currency
        const index = state.balances.findIndex(b => b.currency === action.payload.currency);
        if (index !== -1) {
          state.balances[index].amount -= action.payload.amount;
          state.balances[index].usdValue -= action.payload.usdValue;
        }
        
        // Add transaction to history
        state.transactions.unshift(action.payload.transaction);
      })
      .addCase(withdraw.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to withdraw funds';
      });
  },
});

export const { clearWalletError } = walletSlice.actions;

export default walletSlice.reducer;
