import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Async thunks
export const fetchTrades = createAsyncThunk(
  'trade/fetchTrades',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/trades');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTradeById = createAsyncThunk(
  'trade/fetchTradeById',
  async (tradeId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/trades/${tradeId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTrade = createAsyncThunk(
  'trade/createTrade',
  async (tradeData, { rejectWithValue }) => {
    try {
      const response = await api.post('/trades', tradeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTradeStatus = createAsyncThunk(
  'trade/updateTradeStatus',
  async ({ tradeId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/trades/${tradeId}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'trade/fetchMessages',
  async (tradeId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/trades/${tradeId}/messages`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'trade/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/trades/${messageData.tradeId}/messages`, messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createDispute = createAsyncThunk(
  'trade/createDispute',
  async (disputeData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/trades/${disputeData.tradeId}/disputes`, disputeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllTrades = createAsyncThunk(
  'trade/fetchAllTrades',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/trades');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchDisputes = createAsyncThunk(
  'trade/fetchDisputes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/disputes');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resolveDispute = createAsyncThunk(
  'trade/resolveDispute',
  async ({ disputeId, resolution }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/disputes/${disputeId}/resolve`, { resolution });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  trades: [],
  currentTrade: null,
  messages: [],
  disputes: [],
  status: 'idle',
  error: null,
};

const tradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    clearTradeError: (state) => {
      state.error = null;
    },
    clearCurrentTrade: (state) => {
      state.currentTrade = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch trades
      .addCase(fetchTrades.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTrades.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trades = action.payload;
      })
      .addCase(fetchTrades.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch trades';
      })
      
      // Fetch trade by ID
      .addCase(fetchTradeById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTradeById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentTrade = action.payload;
      })
      .addCase(fetchTradeById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch trade';
      })
      
      // Create trade
      .addCase(createTrade.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createTrade.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trades.push(action.payload);
        state.currentTrade = action.payload;
      })
      .addCase(createTrade.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to create trade';
      })
      
      // Update trade status
      .addCase(updateTradeStatus.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateTradeStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentTrade = action.payload;
        
        // Also update in the trades list
        const index = state.trades.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.trades[index] = action.payload;
        }
      })
      .addCase(updateTradeStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to update trade status';
      })
      
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch messages';
      })
      
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to send message';
      })
      
      // Create dispute
      .addCase(createDispute.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createDispute.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update current trade status if it's the trade being disputed
        if (state.currentTrade && state.currentTrade.id === action.payload.tradeId) {
          state.currentTrade.status = 'disputed';
        }
        
        // Also update in the trades list
        const index = state.trades.findIndex(t => t.id === action.payload.tradeId);
        if (index !== -1) {
          state.trades[index].status = 'disputed';
        }
      })
      .addCase(createDispute.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to create dispute';
      })
      
      // Fetch all trades (admin)
      .addCase(fetchAllTrades.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllTrades.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trades = action.payload;
      })
      .addCase(fetchAllTrades.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch all trades';
      })
      
      // Fetch disputes (admin)
      .addCase(fetchDisputes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDisputes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.disputes = action.payload;
      })
      .addCase(fetchDisputes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch disputes';
      })
      
      // Resolve dispute (admin)
      .addCase(resolveDispute.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(resolveDispute.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update dispute in the list
        const index = state.disputes.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.disputes[index] = action.payload;
        }
      })
      .addCase(resolveDispute.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to resolve dispute';
      });
  },
});

export const { clearTradeError, clearCurrentTrade } = tradeSlice.actions;

export default tradeSlice.reducer;
