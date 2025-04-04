import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define API base URL
const API_URL = '/api';

// Async thunks for trades
export const fetchTrades = createAsyncThunk(
  'trades/fetchTrades',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.userId) queryParams.append('userId', params.userId);
      if (params.type) queryParams.append('type', params.type);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const response = await axios.get(`${API_URL}/trades?${queryParams.toString()}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch trades.'
      );
    }
  }
);

export const fetchTradeById = createAsyncThunk(
  'trades/fetchTradeById',
  async (tradeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/trades/${tradeId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch trade details.'
      );
    }
  }
);

export const createTrade = createAsyncThunk(
  'trades/createTrade',
  async (tradeData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/trades`, tradeData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create trade.'
      );
    }
  }
);

export const updateTradeStatus = createAsyncThunk(
  'trades/updateTradeStatus',
  async ({ tradeId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/trades/${tradeId}/status`, { status }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update trade status.'
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  'trades/sendMessage',
  async ({ tradeId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/trades/${tradeId}/messages`, { content }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send message.'
      );
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'trades/fetchMessages',
  async (tradeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/trades/${tradeId}/messages`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch messages.'
      );
    }
  }
);

export const createDispute = createAsyncThunk(
  'trades/createDispute',
  async ({ tradeId, reason, description }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/trades/${tradeId}/disputes`, {
        reason,
        description
      }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create dispute.'
      );
    }
  }
);

export const rateTrader = createAsyncThunk(
  'trades/rateTrader',
  async ({ tradeId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/trades/${tradeId}/ratings`, {
        rating,
        comment
      }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit rating.'
      );
    }
  }
);

// Initial state
const initialState = {
  trades: [],
  currentTrade: null,
  messages: [],
  isLoading: false,
  error: null,
  isMessagesLoading: false,
  messagesError: null
};

// Trades slice
const tradesSlice = createSlice({
  name: 'trades',
  initialState,
  reducers: {
    resetTradeErrors: (state) => {
      state.error = null;
      state.messagesError = null;
    },
    clearCurrentTrade: (state) => {
      state.currentTrade = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Trades cases
      .addCase(fetchTrades.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrades.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trades = action.payload;
      })
      .addCase(fetchTrades.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Trade By Id cases
      .addCase(fetchTradeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTradeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTrade = action.payload;
      })
      .addCase(fetchTradeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create Trade cases
      .addCase(createTrade.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTrade.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trades.push(action.payload);
        state.currentTrade = action.payload;
      })
      .addCase(createTrade.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Trade Status cases
      .addCase(updateTradeStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTradeStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update current trade if it's the one being updated
        if (state.currentTrade && state.currentTrade.id === action.payload.id) {
          state.currentTrade = action.payload;
        }
        // Update the trade in the trades array
        const index = state.trades.findIndex(trade => trade.id === action.payload.id);
        if (index !== -1) {
          state.trades[index] = action.payload;
        }
      })
      .addCase(updateTradeStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Send Message cases
      .addCase(sendMessage.pending, (state) => {
        state.isMessagesLoading = true;
        state.messagesError = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isMessagesLoading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isMessagesLoading = false;
        state.messagesError = action.payload;
      })
      
      // Fetch Messages cases
      .addCase(fetchMessages.pending, (state) => {
        state.isMessagesLoading = true;
        state.messagesError = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isMessagesLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isMessagesLoading = false;
        state.messagesError = action.payload;
      })
      
      // Create Dispute cases
      .addCase(createDispute.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDispute.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentTrade) {
          state.currentTrade = {
            ...state.currentTrade,
            disputes: [...(state.currentTrade.disputes || []), action.payload]
          };
        }
      })
      .addCase(createDispute.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Rate Trader cases
      .addCase(rateTrader.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rateTrader.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentTrade) {
          state.currentTrade = {
            ...state.currentTrade,
            ratings: [...(state.currentTrade.ratings || []), action.payload]
          };
        }
      })
      .addCase(rateTrader.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetTradeErrors, clearCurrentTrade } = tradesSlice.actions;

export default tradesSlice.reducer;
